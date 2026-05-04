package com.example.demo.repository;

import com.example.demo.model.Disciplina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {
    //ao logar, o coordenador só deve ver as próprias disciplinas
    List<Disciplina> findByCoordenadorId(Long coordenadorId);
}