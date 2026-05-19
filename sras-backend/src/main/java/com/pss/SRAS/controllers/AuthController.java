package com.pss.SRAS.controllers;

import com.pss.SRAS.dto.AuthResponse;
import com.pss.SRAS.dto.LoginRequest;
import com.pss.SRAS.dto.SignupRequest;
import com.pss.SRAS.services.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/validate")
    public ResponseEntity<AuthResponse> validate(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String authHeader = request.getHeader("Authorization");
        String token = (authHeader != null && authHeader.startsWith("Bearer "))
                ? authHeader.substring(7) : null;
        AuthResponse response = authService.validateAndGetUser(auth.getName(), token);
        log.info("[Auth] validate success for email='{}'", auth.getName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        log.info("[Auth] signup attempt for email='{}' role='{}'", request.getEmail(), request.getRole());
        AuthResponse response = authService.signup(request);
        log.info("[Auth] signup success for email='{}'", request.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("[Auth] login attempt for email='{}'", request.getEmail());
        AuthResponse response = authService.login(request);
        log.info("[Auth] login success for email='{}'", request.getEmail());
        return ResponseEntity.ok(response);
    }
}
