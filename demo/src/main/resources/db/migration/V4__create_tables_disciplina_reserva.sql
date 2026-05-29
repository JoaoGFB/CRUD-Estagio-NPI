CREATE TABLE disciplina (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    coordenador_id BIGINT NOT NULL,
    professor_id BIGINT NOT NULL,
    numero_alunos INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_disciplina_coordenador FOREIGN KEY (coordenador_id) REFERENCES usuario (id),
    CONSTRAINT fk_disciplina_professor FOREIGN KEY (professor_id) REFERENCES professor(id)
);

CREATE TABLE disciplina_tag (
    disciplina_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (disciplina_id, tag_id),
    CONSTRAINT fk_dt_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplina (id) ON DELETE CASCADE,
    CONSTRAINT fk_dt_tag FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE
);

CREATE TABLE periodo_letivo (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE reserva (
    id BIGSERIAL PRIMARY KEY,
    sala_id BIGINT NOT NULL,
    disciplina_id BIGINT NOT NULL,
    periodo_letivo_id BIGINT NOT NULL,
    dia_da_semana VARCHAR(20) NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    CONSTRAINT fk_reserva_sala FOREIGN KEY (sala_id) REFERENCES sala (id),
    CONSTRAINT fk_reserva_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplina (id),
    CONSTRAINT fk_reserva_periodo FOREIGN KEY (periodo_letivo_id) REFERENCES periodo_letivo (id)
);