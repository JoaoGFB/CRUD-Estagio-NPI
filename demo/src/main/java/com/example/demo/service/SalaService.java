package com.example.demo.service;

import com.example.demo.dto.SalaOpcaoDTO;
import com.example.demo.dto.SalaRequestDTO;
import com.example.demo.dto.SalaResponseDTO;
import com.example.demo.model.Sala;
import com.example.demo.model.Tag;
import com.example.demo.model.Usuario;
import com.example.demo.model.enums.NomeSala;
import com.example.demo.repository.SalaRepository;
import com.example.demo.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
public class SalaService {
    private final SalaRepository salaRepository;
    private final TagRepository tagRepository;

    public SalaService(
            SalaRepository salaRepository,
            TagRepository tagRepository
    ) {
        this.salaRepository = salaRepository;
        this.tagRepository = tagRepository;
    }

    public SalaResponseDTO createSala(SalaRequestDTO dto, Usuario usuario) {
        NomeSala nomeSala = dto.getNome();
        if (nomeSala == null)
            throw new IllegalArgumentException("Nome da sala é obrigatório");

        //verifica se o gestor pertence ao campus da sala
        validarCampus(nomeSala, usuario);

        //verifica se já existe essa sala nesse campus
        if (salaRepository.findByCampus(usuario.getCampus())
                .stream()
                .anyMatch(s -> s.getNome() == nomeSala)) {

            throw new IllegalArgumentException(
                    "Ação bloqueada: Essa sala já está cadastrada."
            );
        }

        Sala sala = new Sala();

        sala.setNome(nomeSala);

        //o campus vem do enum, não do frontend
        sala.setCampus(nomeSala.getCampus());

        sala.setCapacidade(dto.getCapacidade());
        sala.setInterdisciplinar(dto.getInterdisciplinar());

        if (Boolean.TRUE.equals(dto.getInterdisciplinar()))
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


    public List<SalaResponseDTO> getAllSalas(Usuario usuario) {
//        return salaRepository.findByCampus(usuario.getCampus())
//                .stream()
//                .map(this::mapToResponse)
//                .collect(Collectors.toList());
        List<Sala> salas;
        if ("COORDENADOR".equals(usuario.getRole())) {
            // O coordenador precisa consultar salas de todos os campi
            // para encontrar salas compatíveis com seu curso.
            salas = salaRepository.findAll();
        } else {
            // O gestor continua visualizando apenas as salas
            // do próprio campus.
            salas = salaRepository.findByCampus(usuario.getCampus());
        }
        return salas.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public SalaResponseDTO getSalaById(Long id, Usuario usuario) {
        Sala sala = salaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));
        validarAcessoSala(sala, usuario);
        return mapToResponse(sala);
    }

    public List<SalaOpcaoDTO> getOpcoesSalas(Usuario usuario) {
        return List.of(NomeSala.values())
                .stream()
                .filter(sala -> sala.getCampus().equals(usuario.getCampus()))
                .map(sala -> new SalaOpcaoDTO(
                        sala.name(),
                        sala.getNome(),
                        sala.getCampus()
                ))
                .collect(Collectors.toList());
    }

    public SalaResponseDTO atualizar(
            Long id,
            SalaRequestDTO dto,
            Usuario usuario
    ) {

        Sala sala = salaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        //garante que o gestor só edite seu campus
        validarAcessoSala(sala, usuario);

        //o nome também não pode pertencer a outro campus
        validarCampus(dto.getNome(), usuario);

        sala.setNome(dto.getNome());

        //campus continua vindo do enum
        sala.setCampus(dto.getNome().getCampus());

        //atributos continuam editáveis
        sala.setCapacidade(dto.getCapacidade());
        sala.setInterdisciplinar(dto.getInterdisciplinar());

        if (Boolean.TRUE.equals(dto.getInterdisciplinar()))
            sala.setCursoVinculado(null);
        else
            sala.setCursoVinculado(dto.getCursoVinculado());

        if (dto.getTagIds() != null && !dto.getTagIds().isEmpty()) {
            List<Tag> novasTags =
                    tagRepository.findAllById(dto.getTagIds());
            sala.setTags(novasTags);
        } else {
            sala.getTags().clear();
        }

        Sala salaAtualizada = salaRepository.save(sala);
        return mapToResponse(salaAtualizada);
    }


    public void deletar(Long id, Usuario usuario) {
        Sala sala = salaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sala não encontrada"));

        //gestor só pode excluir sala do próprio campus
        validarAcessoSala(sala, usuario);

        salaRepository.delete(sala);
    }


    private void validarCampus(
            NomeSala nomeSala,
            Usuario usuario
    ) {
        if (!nomeSala.getCampus().equals(usuario.getCampus())) {
            throw new IllegalArgumentException(
                    "Ação bloqueada: Essa sala pertence a outro campus."
            );
        }
    }


    private void validarAcessoSala(
            Sala sala,
            Usuario usuario
    ) {
        if (!sala.getCampus().equals(usuario.getCampus())) {

            throw new IllegalArgumentException(
                    "Ação bloqueada: Você só pode gerenciar salas do seu campus."
            );
        }
    }


    private SalaResponseDTO mapToResponse(Sala sala) {
        SalaResponseDTO dto = new SalaResponseDTO();

        dto.setId(sala.getId());

        //nome amigável do enum
        dto.setNome(sala.getNome().getNome());
        dto.setCampus(sala.getCampus());
        dto.setCapacidade(sala.getCapacidade());
        dto.setInterdisciplinar(sala.getInterdisciplinar());
        dto.setCursoVinculado(sala.getCursoVinculado());

        List<String> tagNames = sala.getTags()
                .stream()
                .map(Tag::getNome)
                .collect(Collectors.toList());

        dto.setTags(tagNames);
        return dto;
    }
}
