CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100),
    login VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, --'GESTOR' ou 'COORDENADOR'
    curso VARCHAR(100),
    campus VARCHAR(100)
);

INSERT INTO usuario (nome, login, senha, role, campus)-- senha 456789
VALUES ('Gestor Ipolon', 'gestoripolon@unifil.br', '$2a$09$k2l2qQcsTolIfUlD6t9YKOCUHG0MJn.lXnEekO75/MYPJbM2nJa72', 'GESTOR', 'IPOLON');

INSERT INTO usuario (nome, login, senha, role, campus)--senha 123456
VALUES ('Gestor Sede', 'gestorsede@unifil.br', '$2a$09$QgpFE8ljcc6Cz0sSOV39qujGDOPCzJYzszLbF5yUh6MFlZVJ8b8U.', 'GESTOR', 'SEDE');

INSERT INTO usuario (nome, login, senha, role, curso)-- senha 654321
VALUES ('Coordenador de Computação', 'coordcomputacao@unifil.br', '$2a$09$A6ds0ZcD9MtgvTiDQjKrqeuVc6Sr4g2sVyZDierYlbRZ1.WbfojkO', 'COORDENADOR', 'Computação');