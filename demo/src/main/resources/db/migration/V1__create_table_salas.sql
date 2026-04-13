CREATE TABLE sala (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    campus VARCHAR(100) NOT NULL,
    capacidade INT NOT NULL,
    interdisciplinar BOOLEAN NOT NULL DEFAULT FALSE,
    curso_vinculado VARCHAR(100) -- Fica nulo se a sala for interdisciplinar
);

CREATE TABLE tag (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE sala_tag (
    sala_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (sala_id, tag_id),
    CONSTRAINT fk_sala FOREIGN KEY (sala_id) REFERENCES sala (id) ON DELETE CASCADE,
    CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE
);