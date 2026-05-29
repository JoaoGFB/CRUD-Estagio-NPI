package com.example.demo.repository;

import com.example.demo.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    //bloqueia conflitos se a reserva estiver APROVADA ou PENDENTE
    @Query("SELECT COUNT(r) > 0 FROM Reserva r WHERE r.sala.id = :salaId " +
            "AND r.periodoLetivo.id = :periodoId " +
            "AND r.diaDaSemana = :dia " +
            "AND r.status IN ('APROVADA', 'PENDENTE') " +
            "AND (r.horarioInicio < :horarioFim AND r.horarioFim > :horarioInicio)")
    boolean existeConflitoDeHorario(
            @Param("salaId") Long salaId,
            @Param("periodoId") Long periodoId,
            @Param("dia") DayOfWeek dia,
            @Param("horarioInicio") LocalTime horarioInicio,
            @Param("horarioFim") LocalTime horarioFim);

    //checa se o professor já está dando aula no mesmo horário, dia e período
    @Query("SELECT COUNT(r) > 0 FROM Reserva r WHERE r.disciplina.professor.id = :professorId " +
            "AND r.periodoLetivo.id = :periodoId " +
            "AND r.diaDaSemana = :dia " +
            "AND r.status IN ('APROVADA', 'PENDENTE') " +
            "AND (r.horarioInicio < :horarioFim AND r.horarioFim > :horarioInicio)")
    boolean existeConflitoParaProfessor(
            @Param("professorId") Long professorId,
            @Param("periodoId") Long periodoId,
            @Param("dia") DayOfWeek dia,
            @Param("horarioInicio") LocalTime horarioInicio,
            @Param("horarioFim") LocalTime horarioFim);

    List<Reserva> findBySalaCampus(String campus);
}