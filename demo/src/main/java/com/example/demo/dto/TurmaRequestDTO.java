
package com.example.demo.dto;

public class TurmaRequestDTO {

    private String nome;
    private String grupoDisciplina;
    private String codigoDisciplina;
    private Integer capacidade;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getGrupoDisciplina() { return grupoDisciplina; }
    public void setGrupoDisciplina(String grupoDisciplina) {
        this.grupoDisciplina = grupoDisciplina;
    }

    public String getCodigoDisciplina() { return codigoDisciplina; }
    public void setCodigoDisciplina(String codigoDisciplina) {
        this.codigoDisciplina = codigoDisciplina;
    }

    public Integer getCapacidade() { return capacidade; }
    public void setCapacidade(Integer capacidade) {
        this.capacidade = capacidade;
    }
}
