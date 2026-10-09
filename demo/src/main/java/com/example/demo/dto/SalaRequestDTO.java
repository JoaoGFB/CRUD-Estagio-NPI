package com.example.demo.dto;

import com.example.demo.model.enums.NomeSala;

import java.util.List;

public class SalaRequestDTO {
    private NomeSala nome;
    private Integer capacidade;
    private Boolean interdisciplinar;
    private String cursoVinculado;
    private List<Long> tagIds;//o frontend envia os IDs das tags

    public NomeSala getNome() {
        return nome;
    }
    public void setNome(NomeSala nome) {
        this.nome = nome;
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
