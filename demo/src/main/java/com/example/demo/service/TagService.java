package com.example.demo.service;

import com.example.demo.dto.TagRequestDTO;
import com.example.demo.dto.TagResponseDTO;
import com.example.demo.model.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.example.demo.repository.TagRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TagService {
    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
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
        //busca a tag no banco (se não achar, devolve erro 404)
        Tag tagExistente = tagRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tag não encontrada"));

        tagExistente.setNome(dto.getNome());

        //salva novamente (como tem ID, é um update e não um insert)
        Tag tagAtualizada = tagRepository.save(tagExistente);
        return mapToResponse(tagAtualizada);
    }

    // DELETE
    public void deleteTag(Long id) {
        // Verifica se existe antes de deletar
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
