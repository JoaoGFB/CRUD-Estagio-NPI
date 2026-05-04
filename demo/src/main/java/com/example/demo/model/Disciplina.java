package com.example.demo.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "disciplina")
public class Disciplina {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    //conexão com tabela de usuário
    @ManyToOne
    @JoinColumn(name = "coordenador_id", nullable = false)
    private Usuario coordenador;

    //conexão com as tags
    @ManyToMany
    @JoinTable(
            name = "disciplina_tag",
            joinColumns = @JoinColumn(name = "disciplina_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tagsExigidas = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Usuario getCoordenador() { return coordenador; }
    public void setCoordenador(Usuario coordenador) { this.coordenador = coordenador; }
    public List<Tag> getTagsExigidas() { return tagsExigidas; }
    public void setTagsExigidas(List<Tag> tagsExigidas) { this.tagsExigidas = tagsExigidas; }
}