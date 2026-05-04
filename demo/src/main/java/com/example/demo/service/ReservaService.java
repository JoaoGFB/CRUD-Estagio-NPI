package com.example.demo.service;

import com.example.demo.dto.ReservaRequestDTO;
import com.example.demo.dto.ReservaResponseDTO;
import com.example.demo.model.*;
import com.example.demo.repository.DisciplinaRepository;
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

    public ReservaService(ReservaRepository reservaRepository, SalaRepository salaRepository, DisciplinaRepository disciplinaRepository) {
        this.reservaRepository = reservaRepository;
        this.salaRepository = salaRepository;
        this.disciplinaRepository = disciplinaRepository;
    }

    //atuação do coordenador
    public ReservaResponseDTO solicitarReserva(ReservaRequestDTO dto) {
        Sala sala = salaRepository.findById(dto.getSalaId())
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));
        Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

       //valida as tags pegando o id para comparação
        List<Long> tagsSalaIds = sala.getTags().stream().map(Tag::getId).collect(Collectors.toList());
        List<Long> tagsDisciplinaIds = disciplina.getTagsExigidas().stream().map(Tag::getId).collect(Collectors.toList());

        if (!tagsSalaIds.containsAll(tagsDisciplinaIds)) {
            throw new IllegalArgumentException("Ação bloqueada: A sala escolhida não possui todos os equipamentos/características exigidos pela disciplina.");
        }

        //validação de conflito de horário
        boolean conflito = reservaRepository.existeConflitoDeHorario(
                dto.getSalaId(), dto.getData(), dto.getHorarioInicio(), dto.getHorarioFim());

        if (conflito) {
            throw new IllegalArgumentException("Ação bloqueada: Já existe uma reserva aprovada para esta sala neste horário.");
        }

        Reserva reserva = new Reserva();
        reserva.setSala(sala);
        reserva.setDisciplina(disciplina);
        reserva.setData(dto.getData());
        reserva.setHorarioInicio(dto.getHorarioInicio());
        reserva.setHorarioFim(dto.getHorarioFim());

        //por padrão a reserva é criada pendente
        reserva.setStatus(StatusReserva.PENDENTE);

        Reserva salva = reservaRepository.save(reserva);
        return mapToResponse(salva);
    }

    //atuação do gestor
    public ReservaResponseDTO aprovarReserva(Long id) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        //faz com que ninguém aprovou outra sala no mesmo horário por último
        boolean conflito = reservaRepository.existeConflitoDeHorario(
                reserva.getSala().getId(), reserva.getData(), reserva.getHorarioInicio(), reserva.getHorarioFim());

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

    private ReservaResponseDTO mapToResponse(Reserva reserva) {
        ReservaResponseDTO dto = new ReservaResponseDTO();
        dto.setId(reserva.getId());
        dto.setNomeSala(reserva.getSala().getNome());
        dto.setNomeDisciplina(reserva.getDisciplina().getNome());
        dto.setNomeCoordenador(reserva.getDisciplina().getCoordenador().getLogin());
        dto.setData(reserva.getData());
        dto.setHorarioInicio(reserva.getHorarioInicio());
        dto.setHorarioFim(reserva.getHorarioFim());
        dto.setStatus(reserva.getStatus());
        return dto;
    }
}