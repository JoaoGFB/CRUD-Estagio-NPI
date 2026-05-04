package com.example.demo.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReservaRequestDTO {
    private Long salaId;
    private Long disciplinaId;
    private LocalDate data; //YYYY-MM-DD
    private LocalTime horarioInicio; //HH:mm
    private LocalTime horarioFim;

    public Long getSalaId() { return salaId; }
    public void setSalaId(Long salaId) { this.salaId = salaId; }
    public Long getDisciplinaId() { return disciplinaId; }
    public void setDisciplinaId(Long disciplinaId) { this.disciplinaId = disciplinaId; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public LocalTime getHorarioInicio() { return horarioInicio; }
    public void setHorarioInicio(LocalTime horarioInicio) { this.horarioInicio = horarioInicio; }
    public LocalTime getHorarioFim() { return horarioFim; }
    public void setHorarioFim(LocalTime horarioFim) { this.horarioFim = horarioFim; }
}