package com.example.demo.service;

import com.example.demo.dto.DisciplinaRequestDTO;
import com.example.demo.dto.DisciplinaResponseDTO;
import com.example.demo.model.Disciplina;
import com.example.demo.model.Professor;
import com.example.demo.model.Tag;
import com.example.demo.model.Usuario;
import com.example.demo.repository.DisciplinaRepository;
import com.example.demo.repository.ProfessorRepository;
import com.example.demo.repository.TagRepository;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DisciplinaService {

    private final DisciplinaRepository disciplinaRepository;
    private final UsuarioRepository usuarioRepository;
    private final TagRepository tagRepository;
    private final ProfessorRepository professorRepository;

    public DisciplinaService(DisciplinaRepository disciplinaRepository, UsuarioRepository usuarioRepository, TagRepository tagRepository, ProfessorRepository professorRepository) {
        this.disciplinaRepository = disciplinaRepository;
        this.usuarioRepository = usuarioRepository;
        this.tagRepository = tagRepository;
        this.professorRepository = professorRepository;
    }

    public DisciplinaResponseDTO createDisciplina(DisciplinaRequestDTO dto) {
        Disciplina disciplina = new Disciplina();
        disciplina.setNome(dto.getNome());
        disciplina.setNumeroAlunos(dto.getNumeroAlunos());

        //faz a busca do coordenador no banco
        Usuario coordenador = usuarioRepository.findById(dto.getCoordenadorId())
                .orElseThrow(() -> new RuntimeException("Coordenador não encontrado"));
        disciplina.setCoordenador(coordenador);

        //busca o professor no banco
        Professor professor = professorRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        disciplina.setProfessor(professor);

        //liga com as tags
        if (dto.getTagIds() != null && !dto.getTagIds().isEmpty()) {
            List<Tag> tags = tagRepository.findAllById(dto.getTagIds());
            disciplina.setTagsExigidas(tags);
        }

        Disciplina salva = disciplinaRepository.save(disciplina);
        return mapToResponse(salva);
    }


    public DisciplinaResponseDTO atualizar(Long id, DisciplinaRequestDTO dto) {
        Disciplina disciplina = disciplinaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        disciplina.setNome(dto.getNome());
        disciplina.setNumeroAlunos(dto.getNumeroAlunos());

        Professor professor = professorRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        disciplina.setProfessor(professor);

        if (dto.getTagIds() != null && !dto.getTagIds().isEmpty()) {
            List<Tag> novasTags = tagRepository.findAllById(dto.getTagIds());
            disciplina.setTagsExigidas(novasTags);
        } else
            disciplina.getTagsExigidas().clear();

        Disciplina atualizada = disciplinaRepository.save(disciplina);
        return mapToResponse(atualizada);
    }

    public void deletar(Long id) {
        if (!disciplinaRepository.existsById(id))
            throw new RuntimeException("Disciplina não encontrada");
        disciplinaRepository.deleteById(id);
    }

    public List<DisciplinaResponseDTO> getAllDisciplinas() {
        return disciplinaRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    //faz o coordenador ver apenas as matérias dele
    public List<DisciplinaResponseDTO> getDisciplinasByCoordenador(Long coordenadorId) {
        return disciplinaRepository.findByCoordenadorId(coordenadorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private DisciplinaResponseDTO mapToResponse(Disciplina disciplina) {
        DisciplinaResponseDTO dto = new DisciplinaResponseDTO();
        dto.setId(disciplina.getId());
        dto.setNome(disciplina.getNome());
        dto.setNomeCoordenador(disciplina.getCoordenador().getLogin());
        dto.setNumeroAlunos(disciplina.getNumeroAlunos());

        if (disciplina.getProfessor() != null)
            dto.setNomeProfessor(disciplina.getProfessor().getNome());

        List<String> tagsNames = disciplina.getTagsExigidas().stream()
                .map(Tag::getNome)
                .collect(Collectors.toList());
        dto.setTagsExigidas(tagsNames);

        return dto;
    }
}