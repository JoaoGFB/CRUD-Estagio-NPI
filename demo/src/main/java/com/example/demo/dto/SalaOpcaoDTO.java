package com.example.demo.dto;

public class SalaOpcaoDTO {
    private String codigo;
    private String nome;
    private String campus;

    public SalaOpcaoDTO(
            String codigo,
            String nome,
            String campus
    ) {
        this.codigo = codigo;
        this.nome = nome;
        this.campus = campus;
    }

    public String getCodigo() {
        return codigo;
    }
    public String getNome() {
        return nome;
    }
    public String getCampus() {
        return campus;
    }
}
