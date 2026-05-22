-- Cria a tabela do Bimestre/Semestre
CREATE TABLE periodo_letivo (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

--tabela de Reserva (Remove a data fixa e adiciona o Período e Dia da Semana)
ALTER TABLE reserva DROP COLUMN data;
ALTER TABLE reserva ADD COLUMN periodo_letivo_id BIGINT;
ALTER TABLE reserva ADD COLUMN dia_da_semana VARCHAR(20);

ALTER TABLE reserva ADD CONSTRAINT fk_reserva_periodo
    FOREIGN KEY (periodo_letivo_id) REFERENCES periodo_letivo (id);


CREATE TABLE excecao_reserva (
    id BIGSERIAL PRIMARY KEY,
    reserva_original_id BIGINT NOT NULL,
    data_especifica DATE NOT NULL,
    nova_sala_id BIGINT,
    aula_cancelada BOOLEAN DEFAULT FALSE,
    motivo VARCHAR(255),
    CONSTRAINT fk_excecao_reserva FOREIGN KEY (reserva_original_id) REFERENCES reserva(id) ON DELETE CASCADE,
    CONSTRAINT fk_excecao_sala FOREIGN KEY (nova_sala_id) REFERENCES sala(id)
);