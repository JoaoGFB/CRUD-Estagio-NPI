
package com.example.demo.repository;

import com.example.demo.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TurmaRepository extends JpaRepository<Turma, Long> {

    List<Turma> findAllByCursoOrderByCodigoDisciplinaAscGrupoDisciplinaAsc(
            String curso);

    Optional<Turma> findByIdAndCurso(Long id, String curso);

    boolean existsByCodigoDisciplinaAndGrupoDisciplinaAndCurso(
            String codigoDisciplina,
            String grupoDisciplina,
            String curso);

    Optional<Turma> findByCodigoDisciplinaAndGrupoDisciplinaAndCurso(
            String codigoDisciplina,
            String grupoDisciplina,
            String curso);
}
