CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,
    login VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL -- Ex: 'ROLE_GESTOR' ou 'ROLE_COORDENADOR'
);

-- Inserindo um gestor de teste (A senha abaixo é um hash BCrypt para a palavra "123456")
INSERT INTO usuario (login, senha, role)
VALUES ('gestor@unifil.br', '$2a$10$Y50UaMFOxteibQEYLrwuHeehHYfcoafCopUazP12.rqB41bsolF5.', 'ROLE_GESTOR');