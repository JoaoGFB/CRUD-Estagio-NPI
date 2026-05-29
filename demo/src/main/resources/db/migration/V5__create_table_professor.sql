CREATE TABLE professor (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

ALTER TABLE disciplina ADD COLUMN professor_id BIGINT;

ALTER TABLE disciplina ADD CONSTRAINT fk_disciplina_professor
    FOREIGN KEY (professor_id) REFERENCES professor(id);