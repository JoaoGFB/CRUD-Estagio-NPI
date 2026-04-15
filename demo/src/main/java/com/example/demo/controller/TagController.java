package com.example.demo.controller;

import com.example.demo.dto.TagRequestDTO;
import com.example.demo.dto.TagResponseDTO;
import com.example.demo.service.TagService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "http://localhost:5173")
public class TagController {
    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @PostMapping
    public ResponseEntity<TagResponseDTO> create(@RequestBody TagRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tagService.createTag(dto));
    }

    @GetMapping
    public ResponseEntity<List<TagResponseDTO>> getAll() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TagResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(tagService.getTagById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TagResponseDTO> update(@PathVariable Long id, @RequestBody TagRequestDTO dto) {
        return ResponseEntity.ok(tagService.updateTag(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            tagService.deleteTag(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());//devolve 400 Bad Request
        }
    }
}