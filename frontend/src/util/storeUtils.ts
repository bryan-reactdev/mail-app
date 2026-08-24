import { toast } from "@/components/providers/ToastProvider";
import type { AxiosError } from "axios";

const shouldRetry = (err: unknown, attempt: number): boolean => {
  if (attempt <= 0) return false;

  if (!(err && typeof err === "object" && "response" in err)) {
    return true;
  }

  const axiosError = err as AxiosError;
  const status = axiosError.response?.status;

  if (!status) return true;
  if (status >= 500 && status < 600) return true;
  if (status === 408) return true;
  return false;
};

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

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

export const withErrorHandling = <TState, TArgs extends unknown[], TResult>(
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

          toast.dismiss(`retry-${String(loadingKey)}`);

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

          const canRetry = shouldRetry(err, attemptsRemaining);

          if (canRetry && attemptsRemaining > 0) {
            attemptsRemaining--;
            hasRetried = true;

            toast.loading(`Ocurrió un error. Reintentando ${currentAttempt}/${totalAttempts}...`, {
              id: `retry-${String(loadingKey)}`,
            });

            const delay = retryDelay * Math.pow(2, retries - attemptsRemaining - 1);
            await sleep(delay);
            continue;
          }

          const axiosError = err as AxiosError<{
            message?: string;
            error?: string;
            errorMessage?: string;
          }>;
          const responseData = axiosError?.response?.data;
          let serverMessage: string | undefined;

          if (
            responseData &&
            typeof responseData === "object" &&
            !Array.isArray(responseData)
          ) {
            const data = responseData as Record<string, unknown>;
            serverMessage =
              (data?.message as string) ??
              (data?.error as string) ??
              (data?.errorMessage as string);
          }

          if (!serverMessage && err instanceof Error) {
            serverMessage = err.message;
          }

          const message =
            errorMessage && serverMessage
              ? `${errorMessage}. ${serverMessage}`
              : errorMessage || serverMessage || "Algo salió mal";

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

      throw lastError;
    } finally {
      set({ [loadingKey]: false } as Partial<TState>);
    }
  };
};
