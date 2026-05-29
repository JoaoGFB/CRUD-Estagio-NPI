package com.example.demo.dto;

import java.util.List;

public class DisciplinaResponseDTO {
    private Long id;
    private String nome;
    private String nomeCoordenador; //envia só o nome, e não a entidade inteira
    private String nomeProfessor;
    private List<String> tagsExigidas; //tags para exibir na tela
    private Integer numeroAlunos;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getNomeCoordenador() { return nomeCoordenador; }
    public void setNomeCoordenador(String nomeCoordenador) { this.nomeCoordenador = nomeCoordenador; }
    public List<String> getTagsExigidas() { return tagsExigidas; }
    public void setTagsExigidas(List<String> tagsExigidas) { this.tagsExigidas = tagsExigidas; }
    public Integer getNumeroAlunos() {
        return numeroAlunos;
    }
    public void setNumeroAlunos(Integer numeroAlunos) {
        this.numeroAlunos = numeroAlunos;
    }
    public String getNomeProfessor() {
        return nomeProfessor;
    }
    public void setNomeProfessor(String nomeProfessor) {
        this.nomeProfessor = nomeProfessor;
    }
}