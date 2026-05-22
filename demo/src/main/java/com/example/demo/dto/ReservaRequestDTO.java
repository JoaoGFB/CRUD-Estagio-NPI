package com.example.demo.dto;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

public class ReservaRequestDTO {
    private Long salaId;
    private Long disciplinaId;
    private Long periodoLetivoId;
    private DayOfWeek diaDaSemana;
    private LocalTime horarioInicio; //HH:mm
    private LocalTime horarioFim;

    public Long getSalaId() { return salaId; }
    public void setSalaId(Long salaId) { this.salaId = salaId; }
    public Long getDisciplinaId() { return disciplinaId; }
    public void setDisciplinaId(Long disciplinaId) { this.disciplinaId = disciplinaId; }
    public LocalTime getHorarioInicio() { return horarioInicio; }
    public void setHorarioInicio(LocalTime horarioInicio) { this.horarioInicio = horarioInicio; }
    public LocalTime getHorarioFim() { return horarioFim; }
    public void setHorarioFim(LocalTime horarioFim) { this.horarioFim = horarioFim; }
    public Long getPeriodoLetivoId() {
        return periodoLetivoId;
    }
    public void setPeriodoLetivoId(Long periodoLetivoId) {
        this.periodoLetivoId = periodoLetivoId;
    }
    public DayOfWeek getDiaDaSemana() {
        return diaDaSemana;
    }
    public void setDiaDaSemana(DayOfWeek diaDaSemana) {
        this.diaDaSemana = diaDaSemana;
    }
}