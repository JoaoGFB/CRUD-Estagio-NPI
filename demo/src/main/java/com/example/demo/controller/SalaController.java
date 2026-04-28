package com.example.demo.controller;

import com.example.demo.dto.SalaRequestDTO;
import com.example.demo.dto.SalaResponseDTO;
import com.example.demo.service.SalaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salas")
@CrossOrigin(origins = "http://localhost:5173")//aceitar requisições front-end React
public class SalaController {
    private final SalaService salaService;

    public SalaController(SalaService salaService) {
        this.salaService = salaService;
    }

    @PostMapping
    public ResponseEntity<SalaResponseDTO> create(@RequestBody SalaRequestDTO dto) {
        SalaResponseDTO created = salaService.createSala(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<SalaResponseDTO>> getAll() {
        return ResponseEntity.ok(salaService.getAllSalas());
    }
    @GetMapping("/{id}")
    public ResponseEntity<SalaResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(salaService.getSalaById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalaResponseDTO> atualizar(@PathVariable Long id, @RequestBody SalaRequestDTO dto) {
        return ResponseEntity.ok(salaService.atualizar(id, dto));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        salaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
