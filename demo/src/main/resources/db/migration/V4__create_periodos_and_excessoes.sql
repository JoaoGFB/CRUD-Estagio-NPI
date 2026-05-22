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