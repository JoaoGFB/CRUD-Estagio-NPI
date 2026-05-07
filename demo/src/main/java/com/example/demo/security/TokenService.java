package com.example.demo.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.example.demo.model.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {
    @Value("${api.security.token.secret:meu-segredo-super-secreto}")
    private String secret;

    public String gerarToken(Usuario usuario) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer("api-reserva-salas")
                    .withSubject(usuario.getLogin())
                    //injeção da role no payload do token
                    .withClaim("role", usuario.getRole())
                    .withClaim("id", usuario.getId())
                    .withClaim("curso", usuario.getCurso())
                    .withExpiresAt(gerarDataExpiracao())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro ao gerar token JWT", exception);
        }
    }

    public String validarToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            return JWT.require(algorithm)
                    .withIssuer("api-reserva-salas")
                    .build()
                    .verify(token)
                    .getSubject(); //devolve o email do usuário se o token estiver válido
        } catch (JWTVerificationException exception) {
            return ""; //se der erro (token falso, expirado, etc), retorna string vazia
        }
    }

    //define que o token vale por 2 horas a partir do momento do login
    private Instant gerarDataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
