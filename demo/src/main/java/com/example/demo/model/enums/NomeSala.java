package com.example.demo.model.enums;

public enum NomeSala {
    LABORATORIO_01("Laboratório 1", "SEDE"),
    LABORATORIO_02("Laboratório 2", "SEDE"),
    SALA_101("Sala 101", "SEDE"),
    SALA_102("Sala 102", "SEDE"),
    SALA_1027("Sala 1027", "IPOLON"),
    SALA_1032("Sala 1032", "IPOLON");

    private final String nome;
    private final String campus;

    NomeSala(String nome, String campus) {
        this.nome = nome;
        this.campus = campus;
    }
    public String getNome() {
        return nome;
    }
    public String getCampus() {
        return campus;
    }
}
