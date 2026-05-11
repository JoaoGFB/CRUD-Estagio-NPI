import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../service/api';
import { isAxiosError } from 'axios';

interface Usuario {
  id: number;
  nome: string;
  login: string;
  role: string;
  curso: string | null;
  campus: string | null;
}

interface NovoUsuarioForm {
  nome: string;
  login: string;
  senha: string;
  role: string;
  curso: string;
  campus: string;
}

const IconUserPlus = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>);
const IconUsers = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const IconTrash = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>);

export const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm<NovoUsuarioForm>({
    defaultValues: { role: 'COORDENADOR' }
  });

  const roleSelecionada = watch('role');

  useEffect(() => {
    api.get('/usuarios')
       .then(res => setUsuarios(res.data))
       .catch(err => console.error('Erro ao buscar utilizadores:', err));
  }, [refreshTrigger]);

  const recarregar = () => setRefreshTrigger(prev => prev + 1);

  const onSubmit = async (data: NovoUsuarioForm) => {
    try {
      await api.post('/usuarios', data);
      alert('Utilizador cadastrado com sucesso!');
      reset();
      recarregar();
    } catch (error) {
      if (isAxiosError(error) && error.response && typeof error.response.data === 'string') {
        alert(error.response.data);
      } else {
        alert('Erro ao cadastrar utilizador.');
      }
    }
  };

  const deletarUsuario = async (id: number) => {
    if (window.confirm("Atenção: Tem a certeza que deseja excluir esta conta?")) {
      try {
        await api.delete(`/usuarios/${id}`);
        recarregar();
      } catch {
        alert('Erro ao excluir conta. Verifique se o utilizador possui vínculos no sistema.');
      }
    }
  };

  return (
    <div className="tags-page" style={{ maxWidth: '900px' }}>
      <div className="page-header">
        <h2><IconUsers /> Gestão da Equipa</h2>
        <p>Registe novos Gestores e Coordenadores para terem acesso ao sistema.</p>
      </div>

      <div className="tag-add-panel" style={{ marginBottom: '2rem' }}>
        <div className="tags-section-title" style={{ marginBottom: '16px' }}>
          <IconUserPlus /> Nova Conta de Acesso
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Nome Completo *</label>
              <input type="text" className="form-input" required placeholder="Ex: Ana Souza" {...register('nome')} />
            </div>
            <div>
              <label className="form-label">E-mail Institucional *</label>
              <input type="email" className="form-input" required placeholder="ana@unifil.br" {...register('login')} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Palavra-Passe Inicial *</label>
              <input type="text" className="form-input" required placeholder="Defina uma senha" {...register('senha')} />
            </div>
            <div>
              <label className="form-label">Papel no Sistema *</label>
              <select className="form-input" required {...register('role')}>
                <option value="COORDENADOR">Coordenador(a)</option>
                <option value="GESTOR">Gestor(a)</option>
              </select>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)' }}>
            <label className="form-label" style={{ color: 'var(--aqua-600)' }}>
              {roleSelecionada === 'GESTOR' ? 'Campus de Atuação *' : 'Curso Vinculado *'}
            </label>
            <input 
              type="text" 
              className="form-input" 
              required 
              placeholder={roleSelecionada === 'GESTOR' ? "Ex: IPOLON" : "Ex: Direito"} 
              {...register(roleSelecionada === 'GESTOR' ? 'campus' : 'curso')} 
            />
            <small style={{ color: 'var(--ink-400)', marginTop: '6px', display: 'block' }}>
              Esta configuração define as permissões e salas que a pessoa poderá aceder.
            </small>
          </div>

          <button type="submit" className="btn btn-success" disabled={isSubmitting} style={{ alignSelf: 'flex-start' }}>
            Cadastrar Membro da Equipa
          </button>
        </form>
      </div>

      <div className="tag-list-panel">
        <div className="tag-list-header"><h3>Equipa Atual</h3></div>
        <div style={{ padding: '0 20px 20px 20px' }}>
          {usuarios.map((u) => (
            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: 'var(--ink-900)' }}>{u.nome}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--ink-500)', marginBottom: '4px' }}>{u.login}</div>
                <span className={`room-badge ${u.role === 'GESTOR' ? 'room-badge-multi' : 'room-badge-course'}`} style={{ marginBottom: 0 }}>
                  {u.role === 'GESTOR' ? `Gestor - ${u.campus}` : `Coordenação - ${u.curso}`}
                </span>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => deletarUsuario(u.id)}><IconTrash /> Excluir</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};