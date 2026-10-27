
package com.example.demo.model;

import jakarta.persistence.*;
@Entity
@Table(
        name = "turma",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_turma_codigo_grupo",
                        columnNames = {"codigo_disciplina", "grupo_disciplina"}
                )
        }
)
public class Turma {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(name = "curso", nullable = false, length = 100)
    private String curso;

    @Column(name = "grupo_disciplina", nullable = false, length = 50)
    private String grupoDisciplina;

    @Column(name = "codigo_disciplina", nullable = false, length = 50)
    private String codigoDisciplina;

    @Column(nullable = false)
    private Integer capacidade;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getGrupoDisciplina() {
        return grupoDisciplina;
    }
    public void setGrupoDisciplina(String grupoDisciplina) {
        this.grupoDisciplina = grupoDisciplina;
    }
    public String getCodigoDisciplina() {
        return codigoDisciplina;
    }
    public void setCodigoDisciplina(String codigoDisciplina) {
        this.codigoDisciplina = codigoDisciplina;
    }
    public Integer getCapacidade() {
        return capacidade;
    }
    public void setCapacidade(Integer capacidade) {
        this.capacidade = capacidade;
    }
    public String getCurso() {
        return curso;
    }
    public void setCurso(String curso) {
        this.curso = curso;
    }
}
