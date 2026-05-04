package com.example.demo.controller;

import com.example.demo.dto.DisciplinaRequestDTO;
import com.example.demo.dto.DisciplinaResponseDTO;
import com.example.demo.service.DisciplinaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disciplinas")
@CrossOrigin(origins = "http://localhost:5173")
public class DisciplinaController {

    private final DisciplinaService disciplinaService;

    public DisciplinaController(DisciplinaService disciplinaService) {
        this.disciplinaService = disciplinaService;
    }

    @PostMapping
    public ResponseEntity<DisciplinaResponseDTO> create(@RequestBody DisciplinaRequestDTO dto) {
        DisciplinaResponseDTO created = disciplinaService.createDisciplina(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<DisciplinaResponseDTO>> getAll() {
        return ResponseEntity.ok(disciplinaService.getAllDisciplinas());
    }

    // Rota para o Coordenador ver apenas o próprio território
    @GetMapping("/coordenador/{id}")
    public ResponseEntity<List<DisciplinaResponseDTO>> getByCoordenador(@PathVariable Long id) {
        return ResponseEntity.ok(disciplinaService.getDisciplinasByCoordenador(id));
    }
}