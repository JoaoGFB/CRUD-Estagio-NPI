package com.example.demo.controller;

import com.example.demo.dto.ReservaRequestDTO;
import com.example.demo.dto.ReservaResponseDTO;
import com.example.demo.service.ReservaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    //o coordenador solicita a reserva (criada como PENDENTE)
    @PostMapping
    public ResponseEntity<ReservaResponseDTO> solicitar(@RequestBody ReservaRequestDTO dto) {
        ReservaResponseDTO solicitada = reservaService.solicitarReserva(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitada);
    }

    //o gestor aprova a reserva
    @PutMapping("/{id}/aprovar")
    public ResponseEntity<ReservaResponseDTO> aprovar(@PathVariable Long id) {
        ReservaResponseDTO aprovada = reservaService.aprovarReserva(id);
        return ResponseEntity.ok(aprovada);
    }

    @GetMapping
    public ResponseEntity<List<ReservaResponseDTO>> listarTodas() {
        return ResponseEntity.ok(reservaService.listarTodasReservas());
    }

    //em caso de qeubra de regra de negócio, manda o erro 400 para o React
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleRegrasDeNegocio(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        reservaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/campus/{campus}")
    public ResponseEntity<List<ReservaResponseDTO>> listarPorCampus(@PathVariable String campus) {
        return ResponseEntity.ok(reservaService.listarReservasPorCampus(campus));
    }
}