import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../service/api';
import { isAxiosError } from 'axios';

interface Professor {
  id: number;
  nome: string;
}

interface NovoProfessorForm {
  nome: string;
}

const IconUserDetail = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const IconPlus = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const IconTrash = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>);
const IconList = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>);

export const Professores = () => {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<NovoProfessorForm>();

  useEffect(() => {
    api.get('/professores')
       .then(res => setProfessores(res.data))
       .catch(err => console.error('Erro ao buscar professores:', err));
  }, [refreshTrigger]);

  const recarregarLista = () => setRefreshTrigger((prev) => prev + 1);

  const onSubmit = async (data: NovoProfessorForm) => {
    try {
      await api.post('/professores', data);
      reset();
      recarregarLista();
    } catch {
      alert('Erro ao cadastrar o professor.');
    }
  };

  const deletarProfessor = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este professor?')) {
      try {
        await api.delete(`/professores/${id}`);
        recarregarLista();
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          alert(error.response.data);
        } else {
          alert('Erro ao excluir. Verifique se este professor não está vinculado a nenhuma disciplina.');
        }
      }
    }
  };

  return (
    <div className="tags-page">
      <div className="page-header">
        <h2><IconUserDetail /> Corpo Docente</h2>
        <p>Cadastre os professores que ministrarão as disciplinas do seu curso.</p>
      </div>

      <div className="tag-add-panel">
        <div className="tags-section-title" style={{ marginBottom: '16px' }}><IconPlus /> Novo Professor</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="tag-add-row">
            <div style={{ flex: 1 }}>
              <input type="text" className="form-input" placeholder="Nome Completo (Ex: Dr. Alan Turing)" required {...register('nome')} />
            </div>
            <button type="submit" className="btn btn-success" disabled={isSubmitting} style={{ flexShrink: 0 }}>
              {isSubmitting ? <span className="spinner" style={{ borderWidth: '2px', width: '16px', height: '16px' }} /> : <IconPlus />}
              Cadastrar
            </button>
          </div>
        </form>
      </div>

      <div className="tag-list-panel">
        <div className="tag-list-header">
          <h3><IconList /> Professores Cadastrados
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', background: 'rgba(34,187,238,0.15)', color: 'var(--sky-600)', padding: '2px 8px', borderRadius: '50px', fontWeight: '600' }}>
              {professores.length}
            </span>
          </h3>
        </div>

        {professores.length === 0 ? (
          <div className="empty-state">
            <IconUserDetail />
            <p>Nenhum professor cadastrado ainda.</p>
          </div>
        ) : (
          <ul className="tag-list">
            {professores.map((prof) => (
              <li key={prof.id} className="tag-list-item">
                <span className="tag-list-name" style={{ color: 'var(--aqua-600)' }}>{prof.nome}</span>
                <button className="btn btn-danger btn-sm" onClick={() => deletarProfessor(prof.id)}><IconTrash /> Excluir</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};