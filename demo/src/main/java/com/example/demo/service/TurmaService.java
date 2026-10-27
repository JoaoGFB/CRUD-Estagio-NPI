
package com.example.demo.service;

import com.example.demo.dto.TurmaRequestDTO;
import com.example.demo.dto.TurmaResponseDTO;
import com.example.demo.model.Turma;
import com.example.demo.repository.TurmaRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TurmaService {

    private final TurmaRepository turmaRepository;

    public TurmaService(TurmaRepository turmaRepository) {
        this.turmaRepository = turmaRepository;
    }

    public TurmaResponseDTO criar(TurmaRequestDTO dto, String curso) {
        validarDados(dto);

        String codigo = dto.getCodigoDisciplina().trim();
        String grupo = dto.getGrupoDisciplina().trim();

        if (turmaRepository
                .existsByCodigoDisciplinaAndGrupoDisciplinaAndCurso(
                        codigo, grupo, curso)) {
            throw new IllegalArgumentException(
                    "Já existe uma turma com esse código e grupo no seu curso.");
        }

        Turma turma = new Turma();
        preencherTurma(turma, dto);

        // O curso vem do usuário autenticado, nunca do frontend.
        turma.setCurso(curso);

        return mapear(turmaRepository.save(turma));
    }

    public List<TurmaResponseDTO> listarPorCurso(String curso) {
        return turmaRepository
                .findAllByCursoOrderByCodigoDisciplinaAscGrupoDisciplinaAsc(
                        curso)
                .stream()
                .map(this::mapear)
                .toList();
    }

    public TurmaResponseDTO atualizar(Long id, TurmaRequestDTO dto, String curso) {
        validarDados(dto);
        Turma turma = turmaRepository.findByIdAndCurso(id, curso)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Turma não encontrada no seu curso."));

        String codigo = dto.getCodigoDisciplina().trim();
        String grupo = dto.getGrupoDisciplina().trim();

        var existente = turmaRepository
                .findByCodigoDisciplinaAndGrupoDisciplinaAndCurso(
                        codigo, grupo, curso);

        if (existente.isPresent()
                && !existente.get().getId().equals(id)) {
            throw new IllegalArgumentException(
                    "Já existe uma turma com esse código e grupo no seu curso.");
        }

        preencherTurma(turma, dto);

        // Mantém o curso original da turma.
        return mapear(turmaRepository.save(turma));
    }

    @Transactional
    public void excluir(Long id, String curso) {
        Turma turma = turmaRepository.findByIdAndCurso(id, curso)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Turma não encontrada no seu curso."));

        turmaRepository.delete(turma);
    }

    private void validarDados(TurmaRequestDTO dto) {
        if (dto.getNome() == null || dto.getNome().isBlank()) {
            throw new IllegalArgumentException(
                    "O nome da turma é obrigatório.");
        }

        if (dto.getGrupoDisciplina() == null
                || dto.getGrupoDisciplina().isBlank()) {
            throw new IllegalArgumentException(
                    "O grupo da disciplina é obrigatório.");
        }

        if (dto.getCodigoDisciplina() == null
                || dto.getCodigoDisciplina().isBlank()) {
            throw new IllegalArgumentException(
                    "O código da disciplina é obrigatório.");
        }

        if (dto.getCapacidade() == null || dto.getCapacidade() <= 0) {
            throw new IllegalArgumentException(
                    "A capacidade deve ser maior que zero.");
        }
    }

    private void preencherTurma(Turma turma, TurmaRequestDTO dto) {
        turma.setNome(dto.getNome().trim());
        turma.setGrupoDisciplina(dto.getGrupoDisciplina().trim());
        turma.setCodigoDisciplina(dto.getCodigoDisciplina().trim());
        turma.setCapacidade(dto.getCapacidade());
    }

    private TurmaResponseDTO mapear(Turma turma) {
        TurmaResponseDTO dto = new TurmaResponseDTO();

        dto.setId(turma.getId());
        dto.setNome(turma.getNome());
        dto.setGrupoDisciplina(turma.getGrupoDisciplina());
        dto.setCodigoDisciplina(turma.getCodigoDisciplina());
        dto.setCapacidade(turma.getCapacidade());
        dto.setCurso(turma.getCurso());

        return dto;
    }
}
