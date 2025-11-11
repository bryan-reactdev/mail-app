package com.biovizion.galeria.DTOs.Usuario;

import java.util.List;
import java.util.stream.Collectors;

import com.biovizion.galeria.entities.UsuarioEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class UsuarioDTOs {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsuarioDTO {
        private Long id;
        private String username;
        private String email;
    }

    public static UsuarioDTO mapearAUsuarioDTO(UsuarioEntity usuario){
        return new UsuarioDTO(
            usuario.getId(),
            usuario.getUsername(),
            usuario.getEmail()
        );
    }

    public static List<UsuarioDTO> mapearAUsuarioDTOs(List<UsuarioEntity> usuarios){
        return usuarios.stream().map(usuario -> {
            return mapearAUsuarioDTO(usuario);
        }).collect(Collectors.toList());
    }
}