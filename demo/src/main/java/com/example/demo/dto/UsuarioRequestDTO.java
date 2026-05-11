package com.example.demo.dto;

public class UsuarioRequestDTO {
    private String nome;
    private String login; //email
    private String senha;
    private String role; //"GESTOR" ou "COORDENADOR"
    private String curso;
    private String campus;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getCurso() { return curso; }
    public void setCurso(String curso) { this.curso = curso; }
    public String getCampus() { return campus; }
    public void setCampus(String campus) { this.campus = campus; }
}