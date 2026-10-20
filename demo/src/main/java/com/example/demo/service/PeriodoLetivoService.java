
package com.example.demo.service;

import com.example.demo.model.PeriodoLetivo;
import com.example.demo.model.enums.TipoPeriodo;
import com.example.demo.repository.PeriodoLetivoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PeriodoLetivoService {

    private final PeriodoLetivoRepository periodoLetivoRepository;

    public PeriodoLetivoService(PeriodoLetivoRepository periodoLetivoRepository) {
        this.periodoLetivoRepository = periodoLetivoRepository;
    }

    @Transactional
    public List<PeriodoLetivo> listarTodos() {
        encerrarExpirados();
        return periodoLetivoRepository.findAll();
    }

    @Transactional
    public PeriodoLetivo criar(PeriodoLetivo dados) {
        encerrarExpirados();
        validarDados(dados);

        PeriodoLetivo periodo = new PeriodoLetivo();
        periodo.setNome(dados.getNome().trim());
        periodo.setTipo(dados.getTipo());
        periodo.setDataInicio(dados.getDataInicio());
        periodo.setDataFim(dados.getDataFim());

        //todo período começa aberto para receber reservas.
        periodo.setAtivo(true);
        return periodoLetivoRepository.save(periodo);
    }

    @Transactional
    public PeriodoLetivo editar(Long id, PeriodoLetivo dados) {
        encerrarExpirados();

        PeriodoLetivo periodo = buscarPorId(id);
        validarSePodeAlterar(periodo);
        validarDados(dados);

        periodo.setNome(dados.getNome().trim());
        periodo.setTipo(dados.getTipo());
        periodo.setDataInicio(dados.getDataInicio());
        periodo.setDataFim(dados.getDataFim());
        //a edição não altera o estado de abertura do período.
        return periodoLetivoRepository.save(periodo);
    }

    @Transactional
    public PeriodoLetivo encerrar(Long id) {
        encerrarExpirados();
        PeriodoLetivo periodo = buscarPorId(id);
        if (!Boolean.TRUE.equals(periodo.getAtivo()))
            throw new IllegalArgumentException("Este período já está encerrado e não pode ser reaberto.");
        periodo.setAtivo(false);
        return periodoLetivoRepository.save(periodo);
    }

    @Transactional
    public PeriodoLetivo buscarPeriodoParaReserva(Long id) {
        encerrarExpirados();
        PeriodoLetivo periodo = buscarPorId(id);
        if (!Boolean.TRUE.equals(periodo.getAtivo()))
            throw new IllegalArgumentException("Este período está encerrado e não aceita novas reservas.");

        if (periodo.getDataFim().isBefore(LocalDate.now())) {
            periodo.setAtivo(false);
            periodoLetivoRepository.save(periodo);
            throw new IllegalArgumentException("O prazo deste período terminou. Não é possível associar novas reservas.");
        }
        return periodo;
    }

    private PeriodoLetivo buscarPorId(Long id) {
        return periodoLetivoRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Período letivo não encontrado."));
    }

    private void validarSePodeAlterar(PeriodoLetivo periodo) {
        if (!Boolean.TRUE.equals(periodo.getAtivo()))
            throw new IllegalArgumentException("Períodos encerrados não podem ser editados.");

        if (periodo.getDataFim().isBefore(LocalDate.now())) {
            periodo.setAtivo(false);
            periodoLetivoRepository.save(periodo);
            throw new IllegalArgumentException("O prazo deste período terminou. Ele não pode mais ser editado.");
        }
    }

    private void validarDados(PeriodoLetivo dados) {
        if (dados.getNome() == null || dados.getNome().isBlank())
            throw new IllegalArgumentException("O nome do período é obrigatório.");

        if (dados.getTipo() == null)
            throw new IllegalArgumentException("O tipo do período é obrigatório.");

        if (dados.getDataInicio() == null || dados.getDataFim() == null)
            throw new IllegalArgumentException("As datas de início e término são obrigatórias.");

        if (dados.getDataFim().isBefore(dados.getDataInicio()))
            throw new IllegalArgumentException("A data de término não pode ser anterior à data de início.");
    }

    private void encerrarExpirados() {
        LocalDate hoje = LocalDate.now();
        List<PeriodoLetivo> periodos = periodoLetivoRepository.findAll();
        for (PeriodoLetivo periodo : periodos) {
            if (Boolean.TRUE.equals(periodo.getAtivo())
                    && periodo.getDataFim() != null
                    && periodo.getDataFim().isBefore(hoje)) {

                periodo.setAtivo(false);
                periodoLetivoRepository.save(periodo);
            }
        }
    }
}
