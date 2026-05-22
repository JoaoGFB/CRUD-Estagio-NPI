package com.example.demo.model;

import com.example.demo.model.enums.TipoPeriodo;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class PeriodoLetivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome; //ex: 1º Bimestre de 2026

    @Enumerated(EnumType.STRING)
    private TipoPeriodo tipo;

    private LocalDate dataInicio;
    private LocalDate dataFim;

    private Boolean ativo;

    // === GETTERS E SETTERS ===
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public TipoPeriodo getTipo() { return tipo; }
    public void setTipo(TipoPeriodo tipo) { this.tipo = tipo; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
}
