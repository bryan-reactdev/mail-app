package com.biovizion.galeria.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.biovizion.galeria.entities.ProyectoEntity;
import com.biovizion.galeria.repository.ProyectoRepository;

@Service
public class ProyectoService {

    @Autowired
    private ProyectoRepository proyectoRepository;

    public List<ProyectoEntity> findAll() {
        return proyectoRepository.findAll();
    }

    public ProyectoEntity save(ProyectoEntity proyecto) {
        return proyectoRepository.save(proyecto);
    }

    public void update(ProyectoEntity proyecto) {
        proyectoRepository.save(proyecto);
    }

    public void delete(Long id) {
        proyectoRepository.deleteById(id);
    }

    public Optional<ProyectoEntity> findById(Long id) {
        return proyectoRepository.findById(id);
    }
}

