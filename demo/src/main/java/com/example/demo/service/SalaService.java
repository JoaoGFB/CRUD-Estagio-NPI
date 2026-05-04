package com.example.demo.service;

import com.example.demo.dto.SalaRequestDTO;
import com.example.demo.dto.SalaResponseDTO;
import com.example.demo.model.Sala;
import com.example.demo.model.Tag;
import com.example.demo.repository.SalaRepository;
import com.example.demo.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SalaService {
    private final SalaRepository salaRepository;
    private final TagRepository tagRepository;

    public SalaService(SalaRepository salaRepository, TagRepository tagRepository) {
        this.salaRepository = salaRepository;
        this.tagRepository = tagRepository;
    }

    public SalaResponseDTO createSala(SalaRequestDTO dto) {
        validarNomeDuplicado(dto.getNome(), null);//validar nome da sala se já existe

        Sala sala = new Sala();
        sala.setNome(dto.getNome());
        sala.setCampus(dto.getCampus());
        sala.setCapacidade(dto.getCapacidade());
        sala.setInterdisciplinar(dto.getInterdisciplinar());

        if (dto.getInterdisciplinar().equals(Boolean.TRUE))
            sala.setCursoVinculado(null);
        else
            sala.setCursoVinculado(dto.getCursoVinculado());

        if (dto.getTagIds() != null && !dto.getTagIds().isEmpty()) {
            List<Tag> tags = tagRepository.findAllById(dto.getTagIds());
            sala.setTags(tags);
        }

        Sala salaSalva = salaRepository.save(sala);
        return mapToResponse(salaSalva);
    }

    public List<SalaResponseDTO> getAllSalas() {
        return salaRepository.findAll().stream()
                .map(this::mapToResponse)//map(sala -> this.mapToResponse(sala))
                .collect(Collectors.toList());
    }

    public SalaResponseDTO getSalaById(Long id) {
        Sala sala = salaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));
        return mapToResponse(sala);
    }

    private SalaResponseDTO mapToResponse(Sala sala) {
        SalaResponseDTO dto = new SalaResponseDTO();
        dto.setId(sala.getId());
        dto.setNome(sala.getNome());
        dto.setCampus(sala.getCampus());
        dto.setCapacidade(sala.getCapacidade());
        dto.setInterdisciplinar(sala.getInterdisciplinar());
        dto.setCursoVinculado(sala.getCursoVinculado());

        List<String> tagNames = sala.getTags().stream()
                .map(Tag::getNome)//map(tag -> tag.getNome())
                .collect(Collectors.toList());
        dto.setTags(tagNames);
        return dto;
    }


    public void deletar(Long id) {
        if (!salaRepository.existsById(id)) {
            throw new RuntimeException("Sala não encontrada");
        }
        salaRepository.deleteById(id);
    }

    public SalaResponseDTO atualizar(Long id, SalaRequestDTO dto) {
        validarNomeDuplicado(dto.getNome(), id);

        Sala sala = salaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        sala.setNome(dto.getNome());
        sala.setCampus(dto.getCampus());
        sala.setCapacidade(dto.getCapacidade());
        sala.setInterdisciplinar(dto.getInterdisciplinar());
        sala.setCursoVinculado(dto.getInterdisciplinar() ? null : dto.getCursoVinculado());

        if (dto.getTagIds() != null && !dto.getTagIds().isEmpty()) {
            List<Tag> novasTags = tagRepository.findAllById(dto.getTagIds());
            sala.setTags(novasTags);
        } else
            sala.getTags().clear();

        Sala salaAtualizada = salaRepository.save(sala);
        return mapToResponse(salaAtualizada);
    }

    private void validarNomeDuplicado(String nomeNovo, Long idIgnorado) {
        //remove todos os espaços e converte para minúsculo
        String nomeNormalizado = nomeNovo.replaceAll("\\s+", "").toLowerCase();
        List<Sala> todasAsSalas = salaRepository.findAll();
        for (Sala salaExistente : todasAsSalas) {
            String nomeExistenteNormalizado = salaExistente.getNome().replaceAll("\\s+", "").toLowerCase();

            //confere se os nomes batem após a formatação
            if (nomeNormalizado.equals(nomeExistenteNormalizado)) {
                //se não for a própria sala sendo editada (idIgnorado)
                if (!salaExistente.getId().equals(idIgnorado))
                    throw new IllegalArgumentException("Ação bloqueada: Já existe uma sala cadastrada como '" + salaExistente.getNome() + "'.");
            }
        }
    }
}
