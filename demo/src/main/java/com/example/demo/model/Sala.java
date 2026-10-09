package com.example.demo.model;

import com.example.demo.model.enums.NomeSala;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sala")
public class Sala {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private NomeSala nome;

    @Column(nullable = false, length = 100)
    private String campus;

    @Column(nullable = false)
    private Integer capacidade;

    @Column(nullable = false)
    private Boolean interdisciplinar = false;

    @Column(name = "curso_vinculado", length = 100)
    private String cursoVinculado;

    @ManyToMany
    @JoinTable(
            name = "sala_tag",
            joinColumns = @JoinColumn(name = "sala_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public NomeSala getNome() {
        return nome;
    }
    public void setNome(NomeSala nome) {
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
    public List<Tag> getTags() {
        return tags;
    }
    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }
}
