package com.example.demo.controller;

import com.example.demo.dto.SalaRequestDTO;
import com.example.demo.dto.SalaResponseDTO;
import com.example.demo.model.Usuario;
import com.example.demo.service.SalaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dto.SalaOpcaoDTO;
import java.util.List;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/salas")
@CrossOrigin(origins = "http://localhost:5173")//aceitar requisições front-end React
public class SalaController {
    private final SalaService salaService;
    public SalaController(SalaService salaService) {
        this.salaService = salaService;
    }

    @PostMapping
    public ResponseEntity<SalaResponseDTO> create(
            @RequestBody SalaRequestDTO dto,
            Authentication authentication
    ) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        SalaResponseDTO created =
                salaService.createSala(dto, usuario);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }


    @GetMapping
    public ResponseEntity<List<SalaResponseDTO>> getAll(
            Authentication authentication
    ) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return ResponseEntity.ok(
                salaService.getAllSalas(usuario)
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<SalaResponseDTO> getById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return ResponseEntity.ok(
                salaService.getSalaById(id, usuario)
        );
    }

    @GetMapping("/opcoes")
    public ResponseEntity<List<SalaOpcaoDTO>> getOpcoes(
            Authentication authentication
    ) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return ResponseEntity.ok(
                salaService.getOpcoesSalas(usuario)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalaResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody SalaRequestDTO dto,
            Authentication authentication
    ) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        return ResponseEntity.ok(
                salaService.atualizar(id, dto, usuario)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @PathVariable Long id,
            Authentication authentication
    ) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        salaService.deletar(id, usuario);
        return ResponseEntity.noContent().build();
    }
}
