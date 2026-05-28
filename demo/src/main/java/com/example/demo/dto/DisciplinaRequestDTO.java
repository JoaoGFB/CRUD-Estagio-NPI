package com.example.demo.dto;

import java.util.List;

public class DisciplinaRequestDTO {
    private String nome;
    private Long coordenadorId; //o react manda só o id do usuário logado
    private List<Long> tagIds;  //id's das características que a matéria exige
    private Integer numeroAlunos;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Long getCoordenadorId() { return coordenadorId; }
    public void setCoordenadorId(Long coordenadorId) { this.coordenadorId = coordenadorId; }
    public List<Long> getTagIds() { return tagIds; }
    public void setTagIds(List<Long> tagIds) { this.tagIds = tagIds; }
    public Integer getNumeroAlunos() {
        return numeroAlunos;
    }
    public void setNumeroAlunos(Integer numeroAlunos) {
        this.numeroAlunos = numeroAlunos;
    }
}