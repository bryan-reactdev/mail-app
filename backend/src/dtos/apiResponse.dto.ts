export interface ApiResponse<T> {
  message: string;
  data: T | null;
}

class ApiResponseClass {
  static success<T>(data: T, message: string = 'Operación exitosa'): ApiResponse<T> {
    return {
      message,
      data,
    };
  }

  static error(message: string = 'Error en la operación'): ApiResponse<null> {
    return {
      message,
      data: null,
    };
  }
}

export default ApiResponseClass;