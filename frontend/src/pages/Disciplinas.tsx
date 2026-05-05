import { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import api from '../service/api';
import { isAxiosError } from 'axios';
import { AuthContext } from '../contexts/AuthContext'; 

interface Tag {
  id: number;
  nome: string;
}

interface Disciplina {
  id: number;
  nome: string;
  nomeCoordenador: string;
  tagsExigidas: string[];
}

interface NovaDisciplinaForm {
  nome: string;
  tagIds: string[];
}

const IconBook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

export const Disciplinas = () => {
  // 1. LÊ O CONTEXTO PARA DESCOBRIR QUEM LOGOU
  const { role } = useContext(AuthContext); 
  const isCoordenador = role === 'COORDENADOR';

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [tagsDisponiveis, setTagsDisponiveis] = useState<Tag[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<NovaDisciplinaForm>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [disciplinasRes, tagsRes] = await Promise.all([
          //se for coordenador busca só as dele, se for gestor busca todas
          isCoordenador ? api.get('/disciplinas/coordenador/2') : api.get('/disciplinas'),
          api.get('/tags')
        ]);
        setDisciplinas(disciplinasRes.data);
        setTagsDisponiveis(tagsRes.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchData();
  }, [refreshTrigger, isCoordenador]);

  const recarregarLista = () => setRefreshTrigger((prev) => prev + 1);

  const onSubmit = async (data: NovaDisciplinaForm) => {
    try {
      const payload = {
        nome: data.nome,
        coordenadorId: 2, //TESTE FIXO
        tagIds: data.tagIds ? data.tagIds.map(Number) : []
      };

      if (idEditando) {
        await api.put(`/disciplinas/${idEditando}`, payload);
        alert('Disciplina atualizada com sucesso!');
      } else {
        await api.post('/disciplinas', payload);
        alert('Disciplina criada com sucesso!');
      }
      
      cancelarEdicao();
      recarregarLista();
    } catch (error) {
      console.error('Erro ao salvar disciplina:', error);
      if (isAxiosError(error) && error.response && typeof error.response.data === 'string') {
        alert(error.response.data);
      } else {
        alert('Erro ao salvar os dados.');
      }
    }
  };

  const deletarDisciplina = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta disciplina?")) {
      try {
        await api.delete(`/disciplinas/${id}`);
        recarregarLista();
      } catch (error) {
        console.error("Erro ao deletar disciplina:", error);
        alert("Erro ao excluir.");
      }
    }
  };

  const iniciarEdicao = (disciplina: Disciplina) => {
    setIdEditando(disciplina.id);
    setValue('nome', disciplina.nome);
    
    const idsDasTags = disciplina.tagsExigidas.map(nomeTag => {
      const tag = tagsDisponiveis.find(t => t.nome === nomeTag);
      return tag ? String(tag.id) : null;
    }).filter(Boolean) as string[];

    setValue('tagIds', idsDasTags);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setIdEditando(null);
    reset({ nome: '', tagIds: [] });
  };

  return (
    <div className="tags-page">
      <div className="page-header">
        <h2>
          <IconBook />
          {isCoordenador ? 'Minhas Disciplinas' : 'Catálogo de Disciplinas'}
        </h2>
        <p>
          {isCoordenador 
            ? 'Cadastre as matérias e as características que elas exigem das salas' 
            : 'Visualize as disciplinas cadastradas pelos coordenadores do NPI'}
        </p>
      </div>

      {/*mostra o formulário apenas ao coordenador*/}
      {isCoordenador && (
        <div className="tag-add-panel" style={{ marginBottom: '2rem', border: idEditando ? '2px solid #ffc107' : 'none' }}>
          <div className="tags-section-title" style={{ marginBottom: '16px', color: idEditando ? '#d39e00' : 'inherit' }}>
            <IconPlus /> {idEditando ? 'Editar Disciplina' : 'Nova Disciplina'}
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label">Nome da Matéria *</label>
              <input type="text" className="form-input" placeholder="Ex: Engenharia de Software II" {...register('nome', { required: 'O nome é obrigatório' })} />
            </div>

            <div>
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>Equipamentos / Características Exigidas</label>
              <div className="tags-grid" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {tagsDisponiveis.map((tag) => (
                  <div key={tag.id} className="tag-checkbox-item" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <input type="checkbox" id={`tag-${tag.id}`} value={tag.id} {...register('tagIds')} />
                    <label htmlFor={`tag-${tag.id}`}>{tag.nome}</label>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className={`btn ${idEditando ? 'btn-warning' : 'btn-success'}`}>
                {idEditando ? 'Salvar Alterações' : 'Cadastrar Disciplina'}
              </button>
              {idEditando && (
                <button type="button" className="btn btn-secondary" onClick={cancelarEdicao}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/*listagem de disciplinas*/}
      <div className="tag-list-panel">
        <div className="tag-list-header">
          <h3>Disciplinas Cadastradas</h3>
        </div>

        {disciplinas.length === 0 ? (
          <div className="empty-state"><p>Nenhuma disciplina encontrada.</p></div>
        ) : (
          <div className="rooms-grid" style={{ marginTop: '1rem' }}>
            {disciplinas.map((disciplina) => (
              <div key={disciplina.id} className="room-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="room-card-header">
                  <h3 className="room-card-name">{disciplina.nome}</h3>
                  <div className="room-card-meta">Coord: {disciplina.nomeCoordenador}</div>
                </div>
                
                <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
                  <small style={{ fontWeight: 'bold', color: '#666', display: 'block', marginBottom: '0.5rem' }}>Exige:</small>
                  {disciplina.tagsExigidas.length > 0 ? (
                    <div className="room-tags">
                      {disciplina.tagsExigidas.map((tag, i) => (
                        <span key={i} className="tag-chip">{tag}</span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#999' }}>Nenhuma exigência especial</span>
                  )}
                </div>

                {/*mostra os botões de excluir e editar apenas ao coordenador*/}
                {isCoordenador && (
                  <div className="room-card-actions" style={{ marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                    <button className="btn btn-warning btn-sm" onClick={() => iniciarEdicao(disciplina)}>
                      <IconEdit /> Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deletarDisciplina(disciplina.id)}>
                      <IconTrash /> Excluir
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};