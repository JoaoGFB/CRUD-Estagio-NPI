package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "excecao_reserva")
public class ExcecaoReserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reserva_original_id", nullable = false)
    private Reserva reservaOriginal;

    @Column(name = "data_especifica", nullable = false)
    private LocalDate dataEspecifica;

    @ManyToOne
    @JoinColumn(name = "nova_sala_id")
    private Sala novaSala; // Preenchido se for troca de sala

    @Column(name = "aula_cancelada")
    private Boolean aulaCancelada = false; // Preenchido como true se for feriado

    private String motivo;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Reserva getReservaOriginal() { return reservaOriginal; }
    public void setReservaOriginal(Reserva reservaOriginal) { this.reservaOriginal = reservaOriginal; }
    public LocalDate getDataEspecifica() { return dataEspecifica; }
    public void setDataEspecifica(LocalDate dataEspecifica) { this.dataEspecifica = dataEspecifica; }
    public Sala getNovaSala() { return novaSala; }
    public void setNovaSala(Sala novaSala) { this.novaSala = novaSala; }
    public Boolean getAulaCancelada() { return aulaCancelada; }
    public void setAulaCancelada(Boolean aulaCancelada) { this.aulaCancelada = aulaCancelada; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
}