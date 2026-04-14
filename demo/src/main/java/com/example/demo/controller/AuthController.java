package com.example.demo.controller;

import com.example.demo.dto.AuthDTO;
import com.example.demo.model.Usuario;
import com.example.demo.security.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AuthController(AuthenticationManager authenticationManager, TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody AuthDTO data) {
        //junta o login e senha recebidos
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.getLogin(), data.getSenha());
        //o spring pegaa a senha criptografada e compara
        var auth = this.authenticationManager.authenticate(usernamePassword);
        //se for igual, gera o token
        var token = tokenService.gerarToken((Usuario) auth.getPrincipal());

        //devolve o token em formato JSON
        return ResponseEntity.ok(Map.of("token", token));
    }
}