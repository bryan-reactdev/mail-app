package com.biovizion.galeria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.biovizion.galeria.entities.ProyectoEntity;

@Repository
public interface ProyectoRepository extends JpaRepository<ProyectoEntity, Long> {
}
