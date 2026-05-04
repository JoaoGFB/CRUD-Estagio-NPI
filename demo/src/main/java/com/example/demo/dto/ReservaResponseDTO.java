package com.example.demo.dto;

import com.example.demo.model.StatusReserva;
import java.time.LocalDate;
import java.time.LocalTime;

public class ReservaResponseDTO {
    private Long id;
    private String nomeSala;
    private String nomeDisciplina;
    private String nomeCoordenador;
    private LocalDate data;
    private LocalTime horarioInicio;
    private LocalTime horarioFim;
    private StatusReserva status;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomeSala() { return nomeSala; }
    public void setNomeSala(String nomeSala) { this.nomeSala = nomeSala; }
    public String getNomeDisciplina() { return nomeDisciplina; }
    public void setNomeDisciplina(String nomeDisciplina) { this.nomeDisciplina = nomeDisciplina; }
    public String getNomeCoordenador() { return nomeCoordenador; }
    public void setNomeCoordenador(String nomeCoordenador) { this.nomeCoordenador = nomeCoordenador; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public LocalTime getHorarioInicio() { return horarioInicio; }
    public void setHorarioInicio(LocalTime horarioInicio) { this.horarioInicio = horarioInicio; }
    public LocalTime getHorarioFim() { return horarioFim; }
    public void setHorarioFim(LocalTime horarioFim) { this.horarioFim = horarioFim; }
    public StatusReserva getStatus() { return status; }
    public void setStatus(StatusReserva status) { this.status = status; }
}