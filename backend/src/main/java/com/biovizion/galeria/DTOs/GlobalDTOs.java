package com.biovizion.galeria.DTOs;


import lombok.AllArgsConstructor;
import lombok.Getter;

public class GlobalDTOs{
    @Getter
    @AllArgsConstructor
    public static class ApiResponse<T> {
        private String message;
        private T data;
    
        // Constructor para solo-mensajes
        public ApiResponse(String message) {
            this.message = message;
            this.data = null;
        }
    }
}
