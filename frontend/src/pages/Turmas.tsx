import { useContext, useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import api from '../service/api';
import { AuthContext } from '../contexts/AuthContext';

interface Turma {
  id: number;
  nome: string;
  grupoDisciplina: string;
  codigoDisciplina: string;
  capacidade: number;
  curso?: string;
}

interface TurmaForm {
  nome: string;
  grupoDisciplina: string;
  codigoDisciplina: string;
  capacidade: string;
}

const formularioVazio: TurmaForm = {
  nome: '',
  grupoDisciplina: '',
  codigoDisciplina: '',
  capacidade: ''
};

const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export const Turmas = () => {
  const { curso } = useContext(AuthContext);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [form, setForm] = useState<TurmaForm>(formularioVazio);
  const [idEditando, setIdEditando] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const carregarTurmas = async () => {
    try {
      setErro('');
      const response = await api.get('/turmas');
      // O backend deve retornar somente as turmas do curso do coordenador autenticado.
      setTurmas(response.data);
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
      setErro('Não foi possível carregar as turmas. Verifique sua conexão e permissões.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    void carregarTurmas();
  }, []);

  const alterarCampo = (campo: keyof TurmaForm, valor: string) => {
    setForm(atual => ({ ...atual, [campo]: valor }));
  };

  const limparFormulario = () => {
    setForm(formularioVazio);
    setIdEditando(null);
    setErro('');
  };

  const salvarTurma = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro('');

    const capacidade = Number(form.capacidade);
    if (!form.nome.trim() || !form.grupoDisciplina.trim() || !form.codigoDisciplina.trim()) {
      setErro('Preencha o nome, o grupo e o código da disciplina.');
      return;
    }
    if (!Number.isInteger(capacidade) || capacidade < 1) {
      setErro('A capacidade deve ser um número inteiro maior que zero.');
      return;
    }

    const payload = {
      nome: form.nome.trim(),
      grupoDisciplina: form.grupoDisciplina.trim(),
      codigoDisciplina: form.codigoDisciplina.trim(),
      capacidade
    };

    try {
      setSalvando(true);
      if (idEditando !== null) {
        await api.put(`/turmas/${idEditando}`, payload);
        alert('Turma atualizada com sucesso.');
      } else {
        await api.post('/turmas', payload);
        alert('Turma cadastrada com sucesso.');
      }
      limparFormulario();
      await carregarTurmas();
    } catch (error) {
      if (isAxiosError(error) && typeof error.response?.data === 'string') {
        setErro(error.response.data);
      } else if (isAxiosError(error) && error.response?.status === 409) {
        setErro('Já existe uma turma com esse código e grupo.');
      } else {
        setErro('Não foi possível salvar a turma. Verifique os dados e tente novamente.');
      }
    } finally {
      setSalvando(false);
    }
  };

  const iniciarEdicao = (turma: Turma) => {
    setIdEditando(turma.id);
    setForm({
      nome: turma.nome,
      grupoDisciplina: turma.grupoDisciplina,
      codigoDisciplina: turma.codigoDisciplina,
      capacidade: String(turma.capacidade)
    });
    setErro('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const excluirTurma = async (turma: Turma) => {
    const confirmar = window.confirm(
      `Deseja excluir a turma ${turma.nome}? Disciplinas associadas podem ficar sem turma, conforme a regra do backend.`
    );
    if (!confirmar) return;

    try {
      setErro('');
      await api.delete(`/turmas/${turma.id}`);
      if (idEditando === turma.id) limparFormulario();
      await carregarTurmas();
    } catch (error) {
      if (isAxiosError(error) && typeof error.response?.data === 'string') {
        setErro(error.response.data);
      } else {
        setErro('Não foi possível excluir a turma. Verifique se ela possui disciplinas associadas.');
      }
    }
  };

  return (
    <div className="tags-page">
      <div className="page-header">
        <h2><IconUsers /> Gerenciar Turmas</h2>
        <p>Gerencie as turmas do seu curso para associá-las às disciplinas e melhorar a escolha das salas.</p>
        <p style={{ marginTop: '0.4rem', fontWeight: 600, color: 'var(--ink-700)' }}>Curso: {curso || 'Curso não identificado'}</p>
      </div>

      <div className="tag-add-panel" style={{ maxWidth: '900px', marginBottom: '2rem' }}>
        <div className="tags-section-title" style={{ marginBottom: '16px' }}>
          <IconPlus /> {idEditando !== null ? 'Editar turma' : 'Nova turma'}
        </div>

        <form onSubmit={salvarTurma} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label className="form-label">Nome da turma *</label>
              <input className="form-input" required maxLength={100} placeholder="Ex.: Ciência da Computação - 2A"
                value={form.nome} onChange={e => alterarCampo('nome', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Código da disciplina *</label>
              <input className="form-input" required maxLength={50} placeholder="Ex.: CC201"
                value={form.codigoDisciplina} onChange={e => alterarCampo('codigoDisciplina', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Grupo da disciplina *</label>
              <input className="form-input" required maxLength={50} placeholder="Ex.: A"
                value={form.grupoDisciplina} onChange={e => alterarCampo('grupoDisciplina', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Capacidade da turma *</label>
              <input className="form-input" type="number" required min={1} step={1} placeholder="Ex.: 40"
                value={form.capacidade} onChange={e => alterarCampo('capacidade', e.target.value)} />
            </div>
          </div>

          {erro && <div role="alert" className="form-error" style={{ padding: '0.75rem', background: '#fff0f0', borderRadius: '8px' }}>{erro}</div>}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="submit" className={`btn ${idEditando !== null ? 'btn-warning' : 'btn-success'}`} disabled={salvando}>
              {salvando ? 'Salvando...' : idEditando !== null ? 'Salvar alterações' : 'Cadastrar turma'}
            </button>
            {idEditando !== null && (
              <button type="button" className="btn btn-secondary" onClick={limparFormulario}>Cancelar edição</button>
            )}
          </div>
        </form>
      </div>

      <div className="tag-list-panel">
        <div className="tag-list-header"><h3>Turmas do meu curso ({turmas.length})</h3></div>
        {carregando ? (
          <p style={{ padding: '1.25rem' }}>Carregando turmas...</p>
        ) : turmas.length === 0 ? (
          <div className="empty-state"><p>Nenhuma turma cadastrada ainda.</p></div>
        ) : (
          <div style={{ padding: '0 20px 20px' }}>
            {turmas.map(turma => (
              <div key={turma.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ minWidth: 0 }}>
                  <strong style={{ color: 'var(--ink-900)' }}>{turma.nome}</strong>
                  <div style={{ color: 'var(--ink-500)', fontSize: '0.86rem', marginTop: '4px' }}>
                    Código: {turma.codigoDisciplina} · Grupo: {turma.grupoDisciplina} · Capacidade: {turma.capacidade} alunos
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button type="button" className="btn btn-warning btn-sm" onClick={() => iniciarEdicao(turma)}><IconEdit /> Editar</button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => excluirTurma(turma)}><IconTrash /> Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
