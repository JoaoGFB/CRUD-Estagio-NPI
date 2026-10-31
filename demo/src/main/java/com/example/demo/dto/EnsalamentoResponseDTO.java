
package com.example.demo.dto;

import com.example.demo.model.StatusReserva;
import java.time.DayOfWeek;
import java.time.LocalTime;

public class EnsalamentoResponseDTO {

    private Long reservaId;
    private String periodo;
    private String disciplina;
    private String professor;
    private String coordenador;
    private String curso;
    private String turma;
    private String grupo;
    private String sala;
    private String campus;
    private Integer quantidadeAlunos;
    private Integer capacidadeSala;
    private Boolean interdisciplinar;
    private String cursoVinculado;
    private DayOfWeek diaDaSemana;
    private LocalTime horarioInicio;
    private LocalTime horarioFim;
    private StatusReserva status;

    public Long getReservaId() { return reservaId; }
    public void setReservaId(Long reservaId) { this.reservaId = reservaId; }

    public String getPeriodo() { return periodo; }
    public void setPeriodo(String periodo) { this.periodo = periodo; }

    public String getDisciplina() { return disciplina; }
    public void setDisciplina(String disciplina) { this.disciplina = disciplina; }

    public String getProfessor() { return professor; }
    public void setProfessor(String professor) { this.professor = professor; }

    public String getCoordenador() { return coordenador; }
    public void setCoordenador(String coordenador) { this.coordenador = coordenador; }

    public String getCurso() { return curso; }
    public void setCurso(String curso) { this.curso = curso; }

    public String getTurma() { return turma; }
    public void setTurma(String turma) { this.turma = turma; }

    public String getGrupo() { return grupo; }
    public void setGrupo(String grupo) { this.grupo = grupo; }

    public String getSala() { return sala; }
    public void setSala(String sala) { this.sala = sala; }

    public String getCampus() { return campus; }
    public void setCampus(String campus) { this.campus = campus; }

    public Integer getQuantidadeAlunos() { return quantidadeAlunos; }
    public void setQuantidadeAlunos(Integer quantidadeAlunos) {
        this.quantidadeAlunos = quantidadeAlunos;
    }

    public Integer getCapacidadeSala() { return capacidadeSala; }
    public void setCapacidadeSala(Integer capacidadeSala) {
        this.capacidadeSala = capacidadeSala;
    }

    public Boolean getInterdisciplinar() { return interdisciplinar; }
    public void setInterdisciplinar(Boolean interdisciplinar) {
        this.interdisciplinar = interdisciplinar;
    }

    public String getCursoVinculado() { return cursoVinculado; }
    public void setCursoVinculado(String cursoVinculado) {
        this.cursoVinculado = cursoVinculado;
    }

    public DayOfWeek getDiaDaSemana() { return diaDaSemana; }
    public void setDiaDaSemana(DayOfWeek diaDaSemana) {
        this.diaDaSemana = diaDaSemana;
    }

    public LocalTime getHorarioInicio() { return horarioInicio; }
    public void setHorarioInicio(LocalTime horarioInicio) {
        this.horarioInicio = horarioInicio;
    }

    public LocalTime getHorarioFim() { return horarioFim; }
    public void setHorarioFim(LocalTime horarioFim) {
        this.horarioFim = horarioFim;
    }

    public StatusReserva getStatus() { return status; }
    public void setStatus(StatusReserva status) { this.status = status; }
}
