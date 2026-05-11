package com.example.demo.service;

import com.example.demo.dto.UsuarioRequestDTO;
import com.example.demo.dto.UsuarioResponseDTO;
import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.dto.TrocarSenhaDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UsuarioResponseDTO criar(UsuarioRequestDTO dto) {
        //verifica se o email já existe
        if (usuarioRepository.findByLogin(dto.getLogin()) != null) {
            throw new IllegalArgumentException("Ação bloqueada: Já existe um utilizador com este e-mail.");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setLogin(dto.getLogin());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha())); // Encriptação da senha!
        usuario.setRole(dto.getRole());

        //se for gestor, guarda o campus, se for coordenador, guarda o curso.
        if ("GESTOR".equals(dto.getRole())) {
            usuario.setCampus(dto.getCampus());
            usuario.setCurso(null);
        } else {
            usuario.setCurso(dto.getCurso());
            usuario.setCampus(null);
        }

        Usuario salvo = usuarioRepository.save(usuario);
        return mapToResponse(salvo);
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deletar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Utilizador não encontrado.");
        }
        usuarioRepository.deleteById(id);
    }

    public void trocarSenha(Long idUsuario, TrocarSenhaDTO dto) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado."));

        //compara a senha digitada com o hash guardado no banco
        if (!passwordEncoder.matches(dto.getSenhaAtual(), usuario.getSenha()))
            throw new IllegalArgumentException("Acesso negado: A palavra-passe atual está incorreta.");

        usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha()));
        usuarioRepository.save(usuario);
    }

    private UsuarioResponseDTO mapToResponse(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setLogin(usuario.getLogin());
        dto.setRole(usuario.getRole());
        dto.setCurso(usuario.getCurso());
        dto.setCampus(usuario.getCampus());
        return dto;
    }
}