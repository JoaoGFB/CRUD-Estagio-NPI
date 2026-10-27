
package com.example.demo.controller;

import com.example.demo.dto.TurmaRequestDTO;
import com.example.demo.model.Usuario;
import com.example.demo.service.TurmaService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/turmas")
@CrossOrigin(origins = "http://localhost:5173")
public class TurmaController {

    private final TurmaService turmaService;

    public TurmaController(TurmaService turmaService) {
        this.turmaService = turmaService;
    }

    @GetMapping
    public ResponseEntity<?> listar(Authentication auth) {
        Usuario usuario = obterCoordenador(auth);

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(
                turmaService.listarPorCurso(usuario.getCurso()));
    }

    @PostMapping
    public ResponseEntity<?> criar(
            @RequestBody TurmaRequestDTO dto,
            Authentication auth) {

        Usuario usuario = obterCoordenador(auth);

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(turmaService.criar(dto, usuario.getCurso()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestBody TurmaRequestDTO dto,
            Authentication auth) {

        Usuario usuario = obterCoordenador(auth);

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            return ResponseEntity.ok(
                    turmaService.atualizar(id, dto, usuario.getCurso()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(
            @PathVariable Long id,
            Authentication auth) {

        Usuario usuario = obterCoordenador(auth);

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            turmaService.excluir(id, usuario.getCurso());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private Usuario obterCoordenador(Authentication auth) {
        if (auth == null
                || !(auth.getPrincipal() instanceof Usuario usuario)) {
            return null;
        }

        if (!"COORDENADOR".equalsIgnoreCase(usuario.getRole())) {
            return null;
        }

        if (usuario.getCurso() == null
                || usuario.getCurso().isBlank()) {
            return null;
        }

        return usuario;
    }
}
