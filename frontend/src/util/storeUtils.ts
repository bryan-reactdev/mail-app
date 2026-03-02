import { toast } from "sonner";
import type { AxiosError } from "axios";

/**
 * Checks if an error should be retried
 * Retries on: network errors, 5xx server errors, timeout errors
 * Doesn't retry on: 4xx client errors (bad request, unauthorized, etc.)
 */
const shouldRetry = (err: unknown, attempt: number): boolean => {
  // Don't retry if we've exceeded max attempts
  if (attempt <= 0) return false;

  // Type guard for AxiosError
  if (!(err && typeof err === 'object' && 'response' in err)) {
    // Retry on network errors (no response)
    return true;
  }

  const axiosError = err as AxiosError;
  const status = axiosError.response?.status;
  
  if (!status) return true;
  
  // Retry on 5xx server errors
  if (status >= 500 && status < 600) return true;
  
  // Retry on 408 Request Timeout
  if (status === 408) return true;

  // Don't retry on 4xx client errors (bad request, unauthorized, etc.)
  return false;
};

/**
 * Sleep helper for retry delays
 */
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

type ZustandSet<T> = (partial: T | Partial<T> | ((state: T) => T | Partial<T>)) => void;

interface WithErrorHandlingOptions<TResult = unknown> {
  errorMessage?: string;
  successMessage?: string;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  retries?: number;
  retryDelay?: number;
  onError?: (error: unknown) => void;
  onSuccess?: (result: TResult) => void;
}

/**
 * Wrapper for async store methods that handles loading states and errors
 * @param set - Zustand set function
 * @param loadingKey - Key for loading state (e.g., 'isFetchingTransactions')
 * @param asyncFn - The async function to execute
 * @param options - Optional configuration
 * @returns A function with the same signature as asyncFn that handles errors and loading states
 */
export const withErrorHandling = <
  TState,
  TArgs extends unknown[],
  TResult
>(
  set: ZustandSet<TState>,
  loadingKey: keyof TState,
  asyncFn: (...args: TArgs) => Promise<TResult>,
  options: WithErrorHandlingOptions<TResult> = {}
): ((...args: TArgs) => Promise<TResult>) => {
  const {
    errorMessage,
    successMessage,
    showErrorToast = true,
    showSuccessToast = false,
    retries = 0,
    retryDelay = 1000,
    onError,
    onSuccess,
  } = options;

  return async (...args: TArgs): Promise<TResult> => {
    try {
      set({ [loadingKey]: true } as Partial<TState>);

      let lastError: unknown;
      let attemptsRemaining = retries;
      let hasRetried = false;

      while (attemptsRemaining >= 0) {
        try {
          const result = await asyncFn(...args);

          // Dismiss any retry toast on success
          toast.dismiss(`retry-${String(loadingKey)}`);

          // Show success toast if we retried and succeeded, or if showSuccessToast is explicitly true
          if (successMessage && (hasRetried || showSuccessToast)) {
            toast.success(successMessage);
          }

          if (onSuccess) {
            onSuccess(result);
          }

          return result;
        } catch (err: unknown) {
          lastError = err;
          const currentAttempt = retries - attemptsRemaining + 1;
          const totalAttempts = retries + 1;

          // Check if we should retry
          const canRetry = shouldRetry(err, attemptsRemaining);
          
          if (canRetry && attemptsRemaining > 0) {
            attemptsRemaining--;
            hasRetried = true;

            // Show retry notification
            toast.loading(`Ocurrió un error. Reintentando ${currentAttempt}/${totalAttempts}...`, {
              id: `retry-${String(loadingKey)}`,
            });

            // Wait before retrying (exponential backoff)
            const delay = retryDelay * Math.pow(2, retries - attemptsRemaining - 1);
            await sleep(delay);
            continue; // Retry
          }

          // No more retries or shouldn't retry - handle error
          // Try multiple locations for error message
          const axiosError = err as AxiosError<{ message?: string; error?: string; errorMessage?: string }>;
          const responseData = axiosError?.response?.data;
          let serverMessage: string | undefined;
          
          if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
            // Try to get message from response data object
            serverMessage = 
              (responseData as any)?.message || 
              (responseData as any)?.error || 
              (responseData as any)?.errorMessage;
          }
          
          // Fallback to error message if no server message found
          if (!serverMessage && err instanceof Error) {
            serverMessage = err.message;
          }

          let message: string;

          if (errorMessage && serverMessage) {
            // Show both custom message and server error
            message = `${errorMessage}. ${serverMessage}`;
          } else {
            // Fallback to whichever is available
            message = errorMessage || serverMessage || "Algo salió mal";
          }

          // Dismiss retry toast if it exists
          toast.dismiss(`retry-${String(loadingKey)}`);

          if (showErrorToast) {
            toast.error(message);
          }

          if (onError) {
            onError(err);
          }

          throw err;
        }
      }

      // This shouldn't be reached, but just in case
      throw lastError;
    } finally {
      set({ [loadingKey]: false } as Partial<TState>);
    }
  };
};

