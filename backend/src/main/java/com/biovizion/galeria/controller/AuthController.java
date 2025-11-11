package com.biovizion.galeria.controller;

import static com.biovizion.galeria.DTOs.Usuario.UsuarioDTOs.mapearAUsuarioDTO;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.biovizion.galeria.DTOs.GlobalDTOs.ApiResponse;
import com.biovizion.galeria.DTOs.Usuario.UsuarioDTOs.UsuarioDTO;
import com.biovizion.galeria.entities.UsuarioEntity;
import com.biovizion.galeria.service.UsuarioService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.Data;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    UsuarioService usuarioService;

    @Autowired 
    PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    // Only inject AuthenticationManager, not UserDetailsService
    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }
    
    @PostMapping("/check")
    public ResponseEntity<ApiResponse> checkSession() {
        try {
            // Get current authentication from SecurityContext
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated() || 
                authentication instanceof AnonymousAuthenticationToken) {
                
                ApiResponse<String> response = new ApiResponse<>("AUTH FAIL");
                return ResponseEntity.status(401).body(response);
            }
            
            // Get current user
            String username = authentication.getName();
            UsuarioDTO usuario = mapearAUsuarioDTO(usuarioService.findByUsername(username).get());

            ApiResponse<UsuarioDTO> response = new ApiResponse<>("AUTH SUCCESS", usuario);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            ApiResponse<String> response = new ApiResponse<>("AUTH ERROR: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        try {
            // usernameOrEmail can be either username or email
            String identifier = loginRequest.getUsernameOrEmail();
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(identifier, loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            HttpSession session = request.getSession();
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            // After authentication, getName() returns the username (stored in UserDetails)
            // even if the user logged in with email
            String authenticatedUsername = authentication.getName();
            UsuarioDTO usuario = mapearAUsuarioDTO(usuarioService.findByUsername(authenticatedUsername).get());
            return ResponseEntity.ok(new ApiResponse<>("Exitosamente autenticado", usuario));

        } catch (DisabledException e) {
            ApiResponse<String> response = new ApiResponse<>("No tienes permiso para iniciar sesión.");
            return ResponseEntity.status(403).body(response);
        } catch (AuthenticationException e) {
            ApiResponse<String> response = new ApiResponse<>("Estas credenciales son erroneas.");
            return ResponseEntity.status(401).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            ApiResponse<String> response = new ApiResponse<>("Error al iniciar sesión: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse> register(@ModelAttribute RegisterRequest registerRequest, HttpServletRequest request) {
        try {
            Optional<UsuarioEntity> existing = usuarioService.findByUsername(registerRequest.getUsername());
            if (existing.isPresent()) {
                ApiResponse<String> response = new ApiResponse<>("Un usuario con este DUI ya existe.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }

            UsuarioEntity usuario = new UsuarioEntity();
            usuario.setUsername(registerRequest.getUsername());
            usuario.setEmail(registerRequest.getEmail());
            usuario.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

            usuarioService.save(usuario);

            UsuarioDTO usuarioDTO = mapearAUsuarioDTO(usuario);

            ApiResponse<UsuarioDTO> response = new ApiResponse<>("Exitosamente registrado", usuarioDTO) ;

            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            e.printStackTrace();

            ApiResponse<String> response = new ApiResponse<>("Error al registrar: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @Data
    public static class LoginRequest {
        private String usernameOrEmail;
        private String password;
        
        // Backward compatibility: if usernameOrEmail is not set, use username
        @Deprecated
        private String username;
        
        // Getter that prefers usernameOrEmail but falls back to username for backward compatibility
        public String getUsernameOrEmail() {
            return usernameOrEmail != null && !usernameOrEmail.isEmpty() ? usernameOrEmail : username;
        }
    }

    @Data
    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
    }
}
