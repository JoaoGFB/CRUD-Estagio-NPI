CREATE TABLE disciplina (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    coordenador_id BIGINT NOT NULL,
    CONSTRAINT fk_disciplina_coordenador FOREIGN KEY (coordenador_id) REFERENCES usuario (id)
);

CREATE TABLE disciplina_tag (
    disciplina_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (disciplina_id, tag_id),
    CONSTRAINT fk_dt_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplina (id) ON DELETE CASCADE,
    CONSTRAINT fk_dt_tag FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE
);

CREATE TABLE reserva (
    id BIGSERIAL PRIMARY KEY,
    sala_id BIGINT NOT NULL,
    disciplina_id BIGINT NOT NULL,
    data DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    CONSTRAINT fk_reserva_sala FOREIGN KEY (sala_id) REFERENCES sala (id),
    CONSTRAINT fk_reserva_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplina (id)
);