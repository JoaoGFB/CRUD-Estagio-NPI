package com.example.demo.repository;

import com.example.demo.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    //a query impede conflitos de horário na mesma sala
    @Query("SELECT COUNT(r) > 0 FROM Reserva r WHERE r.sala.id = :salaId " +
            "AND r.data = :data " +
            "AND r.status = 'APROVADA' " +
            "AND (r.horarioInicio < :horarioFim AND r.horarioFim > :horarioInicio)")
    boolean existeConflitoDeHorario(@Param("salaId") Long salaId,
                                    @Param("data") LocalDate data,
                                    @Param("horarioInicio") LocalTime horarioInicio,
                                    @Param("horarioFim") LocalTime horarioFim);

    //para o Gestor ver o calendário de uma sala específica
    List<Reserva> findBySalaIdAndData(Long salaId, LocalDate data);
}