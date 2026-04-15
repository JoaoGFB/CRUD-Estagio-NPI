package com.example.demo.service;

import com.example.demo.dto.TagRequestDTO;
import com.example.demo.dto.TagResponseDTO;
import com.example.demo.model.Tag;
import com.example.demo.repository.SalaRepository;
import com.example.demo.repository.TagRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TagService {
    private final TagRepository tagRepository;
    private final SalaRepository salaRepository;

    public TagService(TagRepository tagRepository, SalaRepository salaRepository) {
        this.tagRepository = tagRepository;
        this.salaRepository = salaRepository;
    }

    //create
    public TagResponseDTO createTag(TagRequestDTO dto) {
        Tag tag = new Tag();
        tag.setNome(dto.getNome());
        Tag savedTag = tagRepository.save(tag);
        return mapToResponse(savedTag);
    }

    //read (ler todos)
    public List<TagResponseDTO> getAllTags() {
        return tagRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    //read (ler por ID)
    public TagResponseDTO getTagById(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tag não encontrada"));
        return mapToResponse(tag);
    }

    //update
    public TagResponseDTO updateTag(Long id, TagRequestDTO dto) {
        Tag tagExistente = tagRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tag não encontrada"));

        tagExistente.setNome(dto.getNome());

        Tag tagAtualizada = tagRepository.save(tagExistente);
        return mapToResponse(tagAtualizada);
    }

    //delete
    public void deleteTag(Long id) {
       //verifica se a tag está em uso por alguma sala
        if (salaRepository.existsByTagsId(id))
            throw new IllegalStateException("Ação bloqueada: Esta tag está vinculada a uma ou mais salas.");

        //verifica se a tag existe e deleta
        Tag tagExistente = tagRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tag não encontrada"));

        tagRepository.delete(tagExistente);
    }

    //mapper (auxiliar)
    private TagResponseDTO mapToResponse(Tag tag) {
        TagResponseDTO dto = new TagResponseDTO();
        dto.setId(tag.getId());
        dto.setNome(tag.getNome());
        return dto;
    }
}