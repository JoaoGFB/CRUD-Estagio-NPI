package com.example.demo.dto;

import java.util.List;

public class SalaResponseDTO {
    private Long id;
    private String nome;
    private String campus;
    private Integer capacidade;
    private Boolean interdisciplinar;
    private String cursoVinculado;
    private List<String> tags; //o frontend recebe os nomes para exibir

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
    public List<String> getTags() {
        return tags;
    }
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}
