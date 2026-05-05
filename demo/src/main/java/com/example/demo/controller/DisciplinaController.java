package com.example.demo.controller;

import com.example.demo.dto.DisciplinaRequestDTO;
import com.example.demo.dto.DisciplinaResponseDTO;
import com.example.demo.service.DisciplinaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;

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

    @PutMapping("/{id}")
    public ResponseEntity<DisciplinaResponseDTO> update(@PathVariable Long id, @RequestBody DisciplinaRequestDTO dto) {
        return ResponseEntity.ok(disciplinaService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        disciplinaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrity(DataIntegrityViolationException ex) {
        return ResponseEntity.badRequest().body("Ação bloqueada: Não é possível excluir esta disciplina pois ela já possui vínculos (ex: reservas agendadas).");
    }
}