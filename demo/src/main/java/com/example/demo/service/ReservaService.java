package com.example.demo.service;

import com.example.demo.dto.ReservaRequestDTO;
import com.example.demo.dto.ReservaResponseDTO;
import com.example.demo.model.*;
import com.example.demo.repository.DisciplinaRepository;
import com.example.demo.repository.PeriodoLetivoRepository;
import com.example.demo.repository.ReservaRepository;
import com.example.demo.repository.SalaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final SalaRepository salaRepository;
    private final DisciplinaRepository disciplinaRepository;

    private final PeriodoLetivoRepository periodoLetivoRepository;

    public ReservaService(ReservaRepository reservaRepository, SalaRepository salaRepository, DisciplinaRepository disciplinaRepository, PeriodoLetivoRepository periodoLetivoRepository) {
        this.reservaRepository = reservaRepository;
        this.salaRepository = salaRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.periodoLetivoRepository = periodoLetivoRepository;
    }

    //ação do coordenador
    public ReservaResponseDTO solicitarReserva(ReservaRequestDTO dto) {
        Sala sala = salaRepository.findById(dto.getSalaId())
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        //valida a capacidade com uma tolerância de até 15% de superlotação
        double capacidadeMinimaExigida = disciplina.getNumeroAlunos() * 0.85;
        if (sala.getCapacidade() < capacidadeMinimaExigida) {
            throw new IllegalArgumentException("Ação bloqueada: A capacidade da sala ("
                    + sala.getCapacidade() + " lugares) é muito inferior ao número de alunos da turma ("
                    + disciplina.getNumeroAlunos() + " alunos).");
        }

        PeriodoLetivo periodo = periodoLetivoRepository.findById(dto.getPeriodoLetivoId())
                .orElseThrow(() -> new RuntimeException("Período Letivo não encontrado"));

        List<Long> tagsSalaIds = sala.getTags().stream().map(Tag::getId).collect(Collectors.toList());
        List<Long> tagsDisciplinaIds = disciplina.getTagsExigidas().stream().map(Tag::getId).collect(Collectors.toList());

        if (!tagsSalaIds.containsAll(tagsDisciplinaIds))
            throw new IllegalArgumentException("Ação bloqueada: A sala escolhida não possui todos os equipamentos exigidos.");

        boolean conflito = reservaRepository.existeConflitoDeHorario(
                dto.getSalaId(), dto.getPeriodoLetivoId(), dto.getDiaDaSemana(), dto.getHorarioInicio(), dto.getHorarioFim());

        if (conflito)
            throw new IllegalArgumentException("Ação bloqueada: Já existe uma reserva (Aprovada ou Pendente) para esta sala neste horário.");

        //valida se um professor não está em 2 lugares
        boolean conflitoProfessor = reservaRepository.existeConflitoParaProfessor(
                disciplina.getProfessor().getId(), dto.getPeriodoLetivoId(), dto.getDiaDaSemana(), dto.getHorarioInicio(), dto.getHorarioFim());

        if (conflitoProfessor) {
            throw new IllegalArgumentException("Ação bloqueada: O(A) professor(a) " + disciplina.getProfessor().getNome() +
                    " já possui uma aula agendada em outra sala neste mesmo dia e horário.");
        }

        Reserva reserva = new Reserva();
        reserva.setSala(sala);
        reserva.setDisciplina(disciplina);
        reserva.setPeriodoLetivo(periodo);
        reserva.setDiaDaSemana(dto.getDiaDaSemana());
        reserva.setHorarioInicio(dto.getHorarioInicio());
        reserva.setHorarioFim(dto.getHorarioFim());
        reserva.setStatus(StatusReserva.PENDENTE);

        Reserva salva = reservaRepository.save(reserva);
        return mapToResponse(salva);
    }

    //ação do gestor
    public ReservaResponseDTO aprovarReserva(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        //verifica se ninguém aprovou outra sala no mesmo horário, período e dia da semana por último
        boolean conflito = reservaRepository.existeConflitoDeHorario(
                reserva.getSala().getId(), reserva.getPeriodoLetivo().getId(), reserva.getDiaDaSemana(), reserva.getHorarioInicio(), reserva.getHorarioFim());

        if (conflito) {
            reserva.setStatus(StatusReserva.REJEITADA);
            reservaRepository.save(reserva);
            throw new IllegalArgumentException("A aprovação falhou: O horário foi ocupado recentemente por outra reserva. Status alterado para REJEITADA.");
        }

        reserva.setStatus(StatusReserva.APROVADA);
        Reserva aprovada = reservaRepository.save(reserva);
        return mapToResponse(aprovada);
    }

    public List<ReservaResponseDTO> listarTodasReservas() {
        return reservaRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ReservaResponseDTO> listarReservasPorCampus(String campus) {
        return reservaRepository.findBySalaCampus(campus).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deletar(Long id) {
        if (!reservaRepository.existsById(id)) {
            throw new RuntimeException("Reserva não encontrada");
        }
        reservaRepository.deleteById(id);
    }

    private ReservaResponseDTO mapToResponse(Reserva reserva) {
        ReservaResponseDTO dto = new ReservaResponseDTO();
        dto.setId(reserva.getId());
        dto.setNomeSala(reserva.getSala().getNome());
        dto.setNomeDisciplina(reserva.getDisciplina().getNome());
        dto.setNomeCoordenador(reserva.getDisciplina().getCoordenador().getLogin());

        dto.setNomePeriodo(reserva.getPeriodoLetivo().getNome());
        dto.setDiaDaSemana(reserva.getDiaDaSemana());

        dto.setHorarioInicio(reserva.getHorarioInicio());
        dto.setHorarioFim(reserva.getHorarioFim());
        dto.setStatus(reserva.getStatus());
        return dto;
    }
}