package com.biovizion.galeria.DTOs.Proyecto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import com.biovizion.galeria.DTOs.Usuario.UsuarioDTOs;
import com.biovizion.galeria.DTOs.Usuario.UsuarioDTOs.UsuarioDTO;
import com.biovizion.galeria.entities.ProyectoEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class ProyectoDTOs {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProyectoDTO {
        private Long id;
        private String title;
        private String description;
        private String status;

        private LocalDate startDate;
        private LocalDate endDate;
        private LocalTime startHour;
        private LocalTime endHour;

        private String location;
        private String contact;
        private String alarmCode;
        private String notes;
        private String additionalInformation;

        private Integer hoursPerProject;
        private BigDecimal hourWage;

        private UsuarioDTO usuario;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProyectoCalendarDTO {
        private Long id;
        private String text;
        private String status;

        private LocalDate start;
        private LocalDate end;
    }

    public static ProyectoCalendarDTO mapearAProyectoCalendarDTO(ProyectoEntity proyecto) {
        return new ProyectoCalendarDTO(
            proyecto.getId(),
            proyecto.getTitle(),
            proyecto.getStatus(),
            proyecto.getStartDate(),
            proyecto.getEndDate()
        );
    }

    public static ProyectoDTO mapearAProyectoDTO(ProyectoEntity proyecto) {
        return new ProyectoDTO(
            proyecto.getId(),
            proyecto.getTitle(),
            proyecto.getDescription(),
            proyecto.getStatus(),
            proyecto.getStartDate(),
            proyecto.getEndDate(),
            proyecto.getStartHour(),
            proyecto.getEndHour(),
            proyecto.getLocation(),
            proyecto.getContact(),
            proyecto.getAlarmCode(),
            proyecto.getNotes(),
            proyecto.getAdditionalInformation(),
            proyecto.getHoursPerProject(),
            proyecto.getHourWage(),
            UsuarioDTOs.mapearAUsuarioDTO(proyecto.getUsuario())
        );
    }

    public static List<ProyectoDTO> mapearAProyectoDTOs(List<ProyectoEntity> proyectos) {
        return proyectos.stream().map(proyecto -> {
            return mapearAProyectoDTO(proyecto);
        }).collect(Collectors.toList());
    }

    public static List<ProyectoCalendarDTO> mapearAProyectoCalendarDTOs(List<ProyectoEntity> proyectos) {
        return proyectos.stream().map(proyecto -> {
            return mapearAProyectoCalendarDTO(proyecto);
        }).collect(Collectors.toList());
    }
}
