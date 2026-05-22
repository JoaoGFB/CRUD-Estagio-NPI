import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../service/api';
import { isAxiosError } from 'axios';

interface PeriodoLetivo {
  id: number;
  nome: string;
  tipo: string;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
}

interface NovoPeriodoForm {
  nome: string;
  tipo: string;
  dataInicio: string;
  dataFim: string;
}

// Ícones
const IconCalendar = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
const IconPlus = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const IconPower = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>);

export const Periodos = () => {
  const [periodos, setPeriodos] = useState<PeriodoLetivo[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<NovoPeriodoForm>({
    defaultValues: { tipo: 'BIMESTRE' }
  });

  useEffect(() => {
    api.get('/periodos-letivos')
       .then(res => setPeriodos(res.data))
       .catch(err => console.error('Erro ao buscar períodos:', err));
  }, [refreshTrigger]);

  const recarregar = () => setRefreshTrigger(prev => prev + 1);

  const onSubmit = async (data: NovoPeriodoForm) => {
    try {
      await api.post('/periodos-letivos', { ...data, ativo: true });
      alert('Período Letivo criado com sucesso!');
      reset();
      recarregar();
    } catch (error) {
      if (isAxiosError(error) && error.response && typeof error.response.data === 'string') {
        alert(error.response.data);
      } else {
        alert('Erro ao criar período.');
      }
    }
  };

  const alterarStatus = async (id: number, statusAtual: boolean) => {
    try {
      await api.put(`/periodos-letivos/${id}/status?ativo=${!statusAtual}`);
      recarregar();
    } catch {
      alert('Erro ao alterar status.');
    }
  };

  const formatarData = (dataSql: string) => dataSql.split('-').reverse().join('/');

  return (
    <div className="tags-page" style={{ maxWidth: '900px' }}>
      <div className="page-header">
        <h2><IconCalendar /> Gestão de Períodos Letivos</h2>
        <p>Cadastre os bimestres e semestres para liberar o ensalamento aos coordenadores.</p>
      </div>

      <div className="tag-add-panel" style={{ marginBottom: '2rem' }}>
        <div className="tags-section-title" style={{ marginBottom: '16px' }}>
          <IconPlus /> Novo Período
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Nome de Exibição *</label>
              <input type="text" className="form-input" required placeholder="Ex: 1º Bimestre de 2026" {...register('nome')} />
            </div>
            <div>
              <label className="form-label">Tipo de Ciclo *</label>
              <select className="form-input" required {...register('tipo')}>
                <option value="BIMESTRE">Bimestre</option>
                <option value="TRIMESTRE">Trimestre</option>
                <option value="SEMESTRE">Semestre</option>
                <option value="ESPECIAL">Especial / Evento</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Data de Início *</label>
              <input type="date" className="form-input" required {...register('dataInicio')} />
            </div>
            <div>
              <label className="form-label">Data de Término *</label>
              <input type="date" className="form-input" required {...register('dataFim')} />
            </div>
          </div>

          <button type="submit" className="btn btn-success" disabled={isSubmitting} style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
            Cadastrar Período
          </button>
        </form>
      </div>

      <div className="tag-list-panel">
        <div className="tag-list-header"><h3>Ciclos Letivos Registrados</h3></div>
        <div style={{ padding: '0 20px 20px 20px' }}>
          {periodos.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>Nenhum período cadastrado.</p>
          ) : (
            periodos.map((p) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--ink-900)' }}>{p.nome}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ink-500)', marginBottom: '4px' }}>
                    De {formatarData(p.dataInicio)} até {formatarData(p.dataFim)}
                  </div>
                  <span className={`room-badge ${p.ativo ? 'room-badge-multi' : 'room-badge-course'}`} style={{ marginBottom: 0 }}>
                    {p.ativo ? 'Ativo (Recebendo Reservas)' : 'Encerrado'}
                  </span>
                </div>
                <button 
                  className={`btn ${p.ativo ? 'btn-danger' : 'btn-success'} btn-sm`} 
                  onClick={() => alterarStatus(p.id, p.ativo)}
                >
                  <IconPower /> {p.ativo ? 'Encerrar Período' : 'Reativar'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};