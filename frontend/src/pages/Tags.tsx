import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../service/api';
import { isAxiosError } from 'axios';

interface Tag {
  id: number;
  nome: string;
}

interface NovaTagForm {
  nome: string;
}

const IconTag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const IconList = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
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

export const Tags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<NovaTagForm>();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get('/tags');
        setTags(response.data);
      } catch (error) {
        console.error('Erro ao buscar tags:', error);
      }
    };
    fetchTags();
  }, [refreshTrigger]);

  const recarregarLista = () => setRefreshTrigger((prev) => prev + 1);

  const onSubmit = async (data: NovaTagForm) => {
    try {
      await api.post('/tags', data);
      reset();
      recarregarLista();
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      alert('Erro ao criar a tag.');
    }
  };

  const deletarTag = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta tag?')) {
      try {
        await api.delete(`/tags/${id}`);
        recarregarLista();
      } catch (error) {
        console.error('Erro ao deletar tag:', error);
        if (isAxiosError(error) && error.response) {
          alert(error.response.data);
        } else {
          alert('Erro ao excluir. Verifique se esta tag não está vinculada a nenhuma sala!');
        }
      }
    }
  };

  return (
    <div className="tags-page">
      {/*cabeçalho*/}
      <div className="page-header">
        <h2>
          <IconTag />
          Gerenciar Tags
        </h2>
        <p>Crie e gerencie as características disponíveis para as salas</p>
      </div>

      {/*painel para adição */}
      <div className="tag-add-panel">
        <div className="tags-section-title" style={{ marginBottom: '16px' }}>
          <IconPlus />
          Nova Tag
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="tag-add-row">
            <div style={{ flex: 1 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Nome da tag (ex: Projetor, Ar-condicionado...)"
                {...register('nome', { required: 'O nome da tag é obrigatório' })}
              />
              {errors.nome && (
                <span className="form-error" style={{ marginTop: '6px' }}>
                  <IconAlert />
                  {errors.nome.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting}
              style={{ flexShrink: 0 }}
            >
              {isSubmitting ? (
                <span className="spinner" style={{ borderWidth: '2px', width: '16px', height: '16px' }} />
              ) : (
                <IconPlus />
              )}
              Adicionar
            </button>
          </div>
        </form>
      </div>

      {/*lista com as tags */}
      <div className="tag-list-panel">
        <div className="tag-list-header">
          <h3>
            <IconList />
            Tags Cadastradas
            <span style={{
              marginLeft: 'auto',
              fontSize: '0.75rem',
              background: 'rgba(34,187,238,0.15)',
              color: 'var(--sky-600)',
              padding: '2px 8px',
              borderRadius: '50px',
              fontWeight: '600',
            }}>
              {tags.length}
            </span>
          </h3>
        </div>

        {tags.length === 0 ? (
          <div className="empty-state">
            <IconTag />
            <p>Nenhuma tag cadastrada ainda.</p>
          </div>
        ) : (
          <ul className="tag-list">
            {tags.map((tag) => (
              <li key={tag.id} className="tag-list-item">
                <span className="tag-list-name">{tag.nome}</span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deletarTag(tag.id)}
                >
                  <IconTrash />
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
