package com.example.demo.controller;

import com.example.demo.model.PeriodoLetivo;
import com.example.demo.model.Usuario;
import com.example.demo.repository.PeriodoLetivoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/periodos-letivos")
@CrossOrigin(origins = "http://localhost:5173")
public class PeriodoLetivoController {

    private final PeriodoLetivoRepository periodoLetivoRepository;

    public PeriodoLetivoController(PeriodoLetivoRepository periodoLetivoRepository) {
        this.periodoLetivoRepository = periodoLetivoRepository;
    }

    @GetMapping
    public ResponseEntity<List<PeriodoLetivo>> listarTodos() {
        return ResponseEntity.ok(periodoLetivoRepository.findAll());
    }

    //criar um novo período (somente gestor da sede)
    @PostMapping
    public ResponseEntity<?> criar(@RequestBody PeriodoLetivo periodoLetivo, Authentication auth) {
        Usuario usuarioLogado = (Usuario) auth.getPrincipal();
        if (!"GESTOR".equals(usuarioLogado.getRole()) || !"SEDE".equals(usuarioLogado.getCampus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Ação bloqueada: Apenas o Gestor do campus SEDE possui autoridade para criar períodos letivos.");
        }

        PeriodoLetivo salvo = periodoLetivoRepository.save(periodoLetivo);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    //ativar ou desativar um período (somente o gestor da sede)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> alterarStatus(@PathVariable Long id, @RequestParam Boolean ativo, Authentication auth) {
        Usuario usuarioLogado = (Usuario) auth.getPrincipal();
        if (!"GESTOR".equals(usuarioLogado.getRole()) || !"SEDE".equals(usuarioLogado.getCampus())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Ação bloqueada: Apenas o Gestor do campus SEDE possui autoridade para alterar o status de um período letivo.");
        }

        PeriodoLetivo periodo = periodoLetivoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Período letivo não encontrado"));

        periodo.setAtivo(ativo);
        PeriodoLetivo atualizado = periodoLetivoRepository.save(periodo);
        return ResponseEntity.ok(atualizado);
    }
}