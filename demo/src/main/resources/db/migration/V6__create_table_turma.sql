
CREATE TABLE turma (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    grupo_disciplina VARCHAR(50) NOT NULL,
    codigo_disciplina VARCHAR(50) NOT NULL,
    capacidade INTEGER NOT NULL,

    CONSTRAINT uk_turma_codigo_grupo
        UNIQUE (codigo_disciplina, grupo_disciplina),

    CONSTRAINT ck_turma_capacidade
        CHECK (capacidade > 0)
);

ALTER TABLE disciplina
    ADD COLUMN turma_id BIGINT;

ALTER TABLE disciplina
    ADD CONSTRAINT fk_disciplina_turma
    FOREIGN KEY (turma_id)
    REFERENCES turma(id)
    ON DELETE SET NULL;

CREATE INDEX idx_disciplina_turma
    ON disciplina(turma_id);
