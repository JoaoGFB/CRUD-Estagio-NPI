import { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../service/api';
import { AuthContext } from '../contexts/AuthContext';

interface Tag {
  id: number;
  nome: string;
}

interface SalaOpcao {
  codigo: string;
  nome: string;
  campus: string;
}

interface NovaSalaForm {
  nome: string;
  capacidade: number;
  interdisciplinar: boolean;
  cursoVinculado: string;
  tagIds: string[];
}

const IconArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IconSave = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

const IconText = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7"/>
    <line x1="9" y1="20" x2="15" y2="20"/>
    <line x1="12" y1="4" x2="12" y2="20"/>
  </svg>
);

const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconBook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const IconTag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const IconAlert = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export const NovaSala = () => {
  const { id } = useParams();
  const isEditing = !!id;

  const { campus } = useContext(AuthContext);

  const [tagsDisponiveis, setTagsDisponiveis] = useState<Tag[]>([]);
  const [salasOpcoes, setSalasOpcoes] = useState<SalaOpcao[]>([]);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<NovaSalaForm>();

  const isInterdisciplinar = watch('interdisciplinar');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Busca as tags disponíveis
        const tagsResponse = await api.get('/tags');
        const tagsBackend = tagsResponse.data;

        setTagsDisponiveis(tagsBackend);

        // Busca as opções de salas permitidas para o campus do usuário
        const opcoesResponse = await api.get('/salas/opcoes');
        const opcoesBackend: SalaOpcao[] = opcoesResponse.data;

        setSalasOpcoes(opcoesBackend);

        // Se estiver editando, busca os dados atuais da sala
        if (isEditing) {
          const salaResponse = await api.get(`/salas/${id}`);
          const sala = salaResponse.data;

          const tagIdsAtuais = sala.tags
            .map((nomeTag: string) => {
              const tagEncontrada = tagsBackend.find(
                (t: Tag) => t.nome === nomeTag
              );

              return tagEncontrada ? String(tagEncontrada.id) : null;
            })
            .filter(Boolean) as string[];

          // O backend devolve o nome amigável:
          // "Laboratório 01"
          //
          // O select trabalha com o código do enum:
          // "LABORATORIO_01"
          const opcaoSala = opcoesBackend.find(
            (opcao) => opcao.nome === sala.nome
          );

          reset({
            nome: opcaoSala ? opcaoSala.codigo : '',
            capacidade: sala.capacidade,
            interdisciplinar: sala.interdisciplinar,
            cursoVinculado: sala.cursoVinculado || '',
            tagIds: tagIdsAtuais,
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar os dados da sala.');
      }
    };

    carregarDados();
  }, [id, isEditing, reset]);

  const onSubmit = async (data: NovaSalaForm) => {
    try {
      const payload = {
        nome: data.nome,
        capacidade: Number(data.capacidade),
        interdisciplinar: data.interdisciplinar,
        cursoVinculado: data.interdisciplinar
          ? ''
          : data.cursoVinculado,
        tagIds: data.tagIds
          ? data.tagIds.map(Number)
          : [],
      };

      if (isEditing) {
        await api.put(`/salas/${id}`, payload);

        alert('Sala atualizada com sucesso!');
      } else {
        await api.post('/salas', payload);

        alert('Sala criada com sucesso!');
      }

      navigate('/');
    } catch (error) {
      console.error('Erro ao salvar sala:', error);

      alert('Erro ao salvar. Verifique os dados.');
    }
  };

  return (
    <div>
      <div className="form-panel">

        <div className="form-title-row">
          <h2>
            {isEditing ? 'Editar Sala' : 'Cadastrar Nova Sala'}
          </h2>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/')}
          >
            <IconArrowLeft />
            Voltar
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="form-grid"
        >

          {/* NOME E CAMPUS */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}
            className="form-grid-2"
          >

            {/* Nome da sala */}
            <div className="form-group">

              <label className="form-label">
                <IconText />
                Nome da Sala *
              </label>

              <select
                className="form-input"
                disabled={isEditing}
                {...register('nome', {
                  required: 'Nome da sala é obrigatório'
                })}
              >
                <option value="">
                  Selecione uma sala...
                </option>

                {salasOpcoes.map((opcao) => (
                  <option
                    key={opcao.codigo}
                    value={opcao.codigo}
                  >
                    {opcao.nome}
                  </option>
                ))}
              </select>

              {isEditing && (
                <small
                  style={{
                    color: 'var(--text-muted)',
                    marginTop: '5px'
                  }}
                >
                  O nome da sala não pode ser alterado após o cadastro.
                </small>
              )}

              {errors.nome && (
                <span className="form-error">
                  <IconAlert />
                  {errors.nome.message}
                </span>
              )}

            </div>

            {/* Campus */}
            <div className="form-group">

              <label className="form-label">
                <IconMapPin />
                Campus Vinculado
              </label>

              <input
                type="text"
                className="form-input"
                value={campus || ''}
                disabled
                style={{
                  cursor: 'not-allowed',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                }}
              />

            </div>

          </div>

          {/* CAPACIDADE E MULTIDISCIPLINAR */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}
            className="form-grid-2"
          >

            {/* Capacidade */}
            <div className="form-group">

              <label className="form-label">
                <IconUsers />
                Capacidade (lugares) *
              </label>

              <input
                type="number"
                className="form-input"
                placeholder="Ex: 40"
                {...register('capacidade', {
                  required: true,
                  min: 1,
                  valueAsNumber: true
                })}
              />

              {errors.capacidade && (
                <span className="form-error">
                  <IconAlert />
                  Capacidade mínima de 1 lugar
                </span>
              )}

            </div>

            {/* Multidisciplinar */}
            <div
              className="form-group"
              style={{ justifyContent: 'flex-end' }}
            >

              <label
                className="form-label"
                style={{ visibility: 'hidden' }}
              >
                ·
              </label>

              <div className="checkbox-group">

                <input
                  type="checkbox"
                  id="interdisciplinar"
                  {...register('interdisciplinar')}
                />

                <label htmlFor="interdisciplinar">
                  Sala Multidisciplinar?
                </label>

              </div>

            </div>

          </div>

          {/* CURSO VINCULADO */}
          {!isInterdisciplinar && (
            <div className="form-group">

              <label className="form-label">
                <IconBook />
                Curso Vinculado
              </label>

              <input
                type="text"
                className="form-input"
                placeholder="Ex: Ciência da Computação"
                {...register('cursoVinculado')}
              />

            </div>
          )}

          {/* TAGS */}
          <div>

            <div className="tags-section-title">
              <IconTag />
              Características da Sala (Tags)
            </div>

            {tagsDisponiveis.length === 0 ? (

              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)'
                }}
              >
                Nenhuma tag cadastrada. Crie tags na seção de Tags.
              </p>

            ) : (

              <div className="tags-grid">

                {tagsDisponiveis.map((tag) => (

                  <div
                    key={tag.id}
                    className="tag-checkbox-item"
                  >

                    <input
                      type="checkbox"
                      id={`tag-${tag.id}`}
                      value={tag.id}
                      {...register('tagIds')}
                    />

                    <label htmlFor={`tag-${tag.id}`}>
                      {tag.nome}
                    </label>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* BOTÃO SALVAR */}
          <div style={{ marginTop: '8px' }}>

            <button
              type="submit"
              className={`btn ${
                isEditing ? 'btn-warning' : 'btn-success'
              }`}
              disabled={isSubmitting}
            >

              {isSubmitting ? (

                <>
                  <span
                    className="spinner"
                    style={{
                      borderWidth: '2px',
                      width: '16px',
                      height: '16px'
                    }}
                  />

                  Salvando...
                </>

              ) : (

                <>
                  <IconSave />

                  {isEditing
                    ? 'Salvar Alterações'
                    : 'Salvar Nova Sala'}
                </>

              )}

            </button>

          </div>

        </form>

      </div>
    </div>
  );
};