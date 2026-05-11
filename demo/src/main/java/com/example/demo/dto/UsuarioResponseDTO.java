package com.example.demo.dto;

public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String login;
    private String role;
    private String curso;
    private String campus;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getCurso() { return curso; }
    public void setCurso(String curso) { this.curso = curso; }
    public String getCampus() { return campus; }
    public void setCampus(String campus) { this.campus = campus; }
}