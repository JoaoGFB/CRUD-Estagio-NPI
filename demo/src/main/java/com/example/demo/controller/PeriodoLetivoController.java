
package com.example.demo.controller;

import com.example.demo.model.PeriodoLetivo;
import com.example.demo.model.Usuario;
import com.example.demo.service.PeriodoLetivoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/periodos-letivos")
@CrossOrigin(origins = "http://localhost:5173")
public class PeriodoLetivoController {

    private final PeriodoLetivoService periodoLetivoService;

    public PeriodoLetivoController(PeriodoLetivoService periodoLetivoService) {
        this.periodoLetivoService = periodoLetivoService;
    }

    @GetMapping
    public ResponseEntity<List<PeriodoLetivo>> listarTodos() {
        return ResponseEntity.ok(periodoLetivoService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<?> criar(
            @RequestBody PeriodoLetivo periodo,
            Authentication auth) {

        if (!gestorDaSede(auth))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas o gestor da SEDE pode criar períodos.");

        try {
            PeriodoLetivo salvo = periodoLetivoService.criar(periodo);
            return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(
            @PathVariable Long id,
            @RequestBody PeriodoLetivo dados,
            Authentication auth) {

        if (!gestorDaSede(auth))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas o gestor da SEDE pode editar períodos.");

        try {
            return ResponseEntity.ok(periodoLetivoService.editar(id, dados));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/encerrar")
    public ResponseEntity<?> encerrar(
            @PathVariable Long id,
            Authentication auth) {

        if (!gestorDaSede(auth))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas o gestor da SEDE pode encerrar períodos.");

        try {
            return ResponseEntity.ok(periodoLetivoService.encerrar(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private boolean gestorDaSede(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof Usuario usuario))
            return false;
        return "GESTOR".equals(usuario.getRole()) && "SEDE".equalsIgnoreCase(usuario.getCampus());
    }
}
