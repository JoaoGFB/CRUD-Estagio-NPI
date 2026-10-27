ALTER TABLE turma
ADD COLUMN curso VARCHAR(100);

ALTER TABLE turma
    ADD CONSTRAINT uk_turma_codigo_grupo_curso
    UNIQUE (codigo_disciplina, grupo_disciplina, curso);