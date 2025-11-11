package com.biovizion.galeria.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "proyecto")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProyectoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String status;

    @Column(name = "start_date")
    private LocalDate startDate;
    @Column(name = "end_date")
    private LocalDate endDate;
    @Column(name = "start_hour")
    private LocalTime startHour;
    @Column(name = "end_hour")
    private LocalTime endHour;

    private String location;
    private String contact;
    @Column(name = "alarm_code")
    private String alarmCode;
    private String notes;
    @Column(name = "additional_information")
    private String additionalInformation;

    @Column(name = "hours_per_project")
    private Integer hoursPerProject;
    @Column(name = "hour_wage")
    private BigDecimal hourWage;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private UsuarioEntity usuario;
}
