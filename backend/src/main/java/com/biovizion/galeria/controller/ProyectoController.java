package com.biovizion.galeria.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.biovizion.galeria.DTOs.GlobalDTOs.ApiResponse;
import com.biovizion.galeria.DTOs.Proyecto.ProyectoDTOs;
import com.biovizion.galeria.DTOs.Proyecto.ProyectoDTOs.ProyectoCalendarDTO;
import com.biovizion.galeria.DTOs.Proyecto.ProyectoDTOs.ProyectoDTO;
import com.biovizion.galeria.entities.ProyectoEntity;
import com.biovizion.galeria.service.ProyectoService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/projects")
public class ProyectoController {

    @Autowired
    private ProyectoService proyectoService;

    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<ProyectoCalendarDTO>>> getProyectos() {
        try {
            List<ProyectoEntity> proyectos = proyectoService.findAll();
            List<ProyectoCalendarDTO> proyectoCalendarDTOs = ProyectoDTOs.mapearAProyectoCalendarDTOs(proyectos);

            ApiResponse<List<ProyectoCalendarDTO>> response = 
                new ApiResponse<List<ProyectoCalendarDTO>>("FETCH Eventos obtenidos correctamente", proyectoCalendarDTOs);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();

            ApiResponse<List<ProyectoCalendarDTO>> response = 
                new ApiResponse<List<ProyectoCalendarDTO>>("Error al obtener los eventos: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProyectoDTO>> getProyectoById(@PathVariable Long id) {
        try {
            Optional<ProyectoEntity> proyecto = proyectoService.findById(id);
            if (proyecto.isEmpty()) {
                ApiResponse<ProyectoDTO> response = 
                    new ApiResponse<ProyectoDTO>("Proyecto no encontrado");
                return ResponseEntity.status(404).body(response);
            }

            ProyectoDTO proyectoDTO = ProyectoDTOs.mapearAProyectoDTO(proyecto.get());

            ApiResponse<ProyectoDTO> response = 
                new ApiResponse<ProyectoDTO>("FETCH Proyecto obtenido correctamente", proyectoDTO);

            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            e.printStackTrace();
            
            ApiResponse<ProyectoDTO> response = 
                new ApiResponse<ProyectoDTO>("Error al obtener el proyecto: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
