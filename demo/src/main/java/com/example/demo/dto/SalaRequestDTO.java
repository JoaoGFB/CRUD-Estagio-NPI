package com.example.demo.dto;

import java.util.List;

public class SalaRequestDTO {
    private String nome;
    private String campus;
    private Integer capacidade;
    private Boolean interdisciplinar;
    private String cursoVinculado;
    private List<Long> tagIds; //o frontend envia os IDs das tags

    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getCampus() {
        return campus;
    }
    public void setCampus(String campus) {
        this.campus = campus;
    }
    public Integer getCapacidade() {
        return capacidade;
    }
    public void setCapacidade(Integer capacidade) {
        this.capacidade = capacidade;
    }
    public Boolean getInterdisciplinar() {
        return interdisciplinar;
    }
    public void setInterdisciplinar(Boolean interdisciplinar) {
        this.interdisciplinar = interdisciplinar;
    }
    public String getCursoVinculado() {
        return cursoVinculado;
    }
    public void setCursoVinculado(String cursoVinculado) {
        this.cursoVinculado = cursoVinculado;
    }
    public List<Long> getTagIds() {
        return tagIds;
    }
    public void setTagIds(List<Long> tagIds) {
        this.tagIds = tagIds;
    }
}
