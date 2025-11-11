package com.biovizion.galeria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GaleriaApp {
	public static void main(String[] args) {
		SpringApplication.run(GaleriaApp.class, args);
	}
}