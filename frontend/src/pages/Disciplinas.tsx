import { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import api from '../service/api';
import { isAxiosError } from 'axios';
import { AuthContext } from '../contexts/AuthContext';

//interfaces
interface Tag { id: number; nome: string; }
interface Disciplina { id: number; nome: string; nomeCoordenador: string; tagsExigidas: string[]; }
interface Sala { 
  id: number; 
  nome: string; 
  tags?: string[]; 
  interdisciplinar: boolean; 
  cursoVinculado: string | null; 
}
interface Reserva { 
  id: number; 
  nomeSala: string; 
  nomeDisciplina: string; 
  nomeCoordenador: string; 
  data: string; 
  horarioInicio: string; 
  horarioFim: string; 
  status: string; 
}
interface NovaDisciplinaForm { nome: string; tagIds: string[]; }

//ícones usados
const IconBook = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>);
const IconPlus = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
const IconEdit = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const IconTrash = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>);
const IconCalendar = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
const IconCheck = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);

export const Disciplinas = () => {
  //extração do campus do contexto
  const { role, userId, curso, campus } = useContext(AuthContext); 
  const isCoordenador = role === 'COORDENADOR';
  const isGestor = role === 'GESTOR';

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [tagsDisponiveis, setTagsDisponiveis] = useState<Tag[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  const [modalReservaAberto, setModalReservaAberto] = useState(false);
  const [disciplinaParaEnsalar, setDisciplinaParaEnsalar] = useState<Disciplina | null>(null);
  const [formReserva, setFormReserva] = useState({ salaId: '', data: '', horarioInicio: '', horarioFim: '' });

  const { register, handleSubmit, reset, setValue } = useForm<NovaDisciplinaForm>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlReservas = (isGestor && campus) 
          ? `/reservas/campus/${campus}` 
          : '/reservas';

        const [disciplinasRes, tagsRes, salasRes, reservasRes] = await Promise.all([
          isCoordenador ? api.get(`/disciplinas/coordenador/${userId}`) : api.get('/disciplinas'),
          api.get('/tags'),
          api.get('/salas'),
          api.get(urlReservas)
        ]);
        
        let disciplinasParaMostrar = disciplinasRes.data;
        
        if (isGestor) {
          //o gestor só vê o card se a matéria tiver uma reserva (pendente ou aprovada) no campus dele
          disciplinasParaMostrar = disciplinasRes.data.filter((disciplina: Disciplina) => 
            reservasRes.data.some((reserva: Reserva) => reserva.nomeDisciplina === disciplina.nome)
          );
        }

        setDisciplinas(disciplinasParaMostrar);
        setTagsDisponiveis(tagsRes.data);
        setSalas(salasRes.data);
        setReservas(reservasRes.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchData();
  }, [refreshTrigger, isCoordenador, isGestor, userId, campus]);

  const recarregarLista = () => setRefreshTrigger((prev) => prev + 1);

  //funções da disciplina
  const cancelarEdicao = () => {
    setIdEditando(null);
    reset({ nome: '', tagIds: [] });
  };

  const iniciarEdicao = (disciplina: Disciplina) => {
    setIdEditando(disciplina.id);
    setValue('nome', disciplina.nome);
    const idsDasTags = disciplina.tagsExigidas.map(nomeTag => String(tagsDisponiveis.find(t => t.nome === nomeTag)?.id)).filter(Boolean);
    setValue('tagIds', idsDasTags);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: NovaDisciplinaForm) => {
    try {
      const payload = {
        nome: data.nome,
        coordenadorId: userId || 0, 
        tagIds: data.tagIds ? data.tagIds.map(Number) : []
      };

      if (idEditando) {
        await api.put(`/disciplinas/${idEditando}`, payload);
      } else {
        await api.post('/disciplinas', payload);
      }
      cancelarEdicao();
      recarregarLista();
    } catch (error) {
      if (isAxiosError(error) && error.response && typeof error.response.data === 'string') {
        alert(error.response.data);
      } else {
        alert('Erro ao salvar disciplina.');
      }
    }
  };

  const deletarDisciplina = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir?")) {
      try {
        await api.delete(`/disciplinas/${id}`);
        recarregarLista();
      } catch (error) {
        if (isAxiosError(error) && error.response && typeof error.response.data === 'string') {
          alert(error.response.data);
        } else {
          alert('Erro ao excluir.');
        }
      }
    }
  };

  //lógica do filtro ABAC para as salas
  const getSalasCompativeis = () => {
    if (!disciplinaParaEnsalar) return [];
    
    const exigencias = disciplinaParaEnsalar.tagsExigidas;
    const meuCursoNormalizado = curso?.trim().toLowerCase();

    return salas.filter(sala => {
      const cursoSalaNormalizado = sala.cursoVinculado?.trim().toLowerCase();
      //a sala será liberada se for Interdisciplinar ou se o curso dela for igual ao curso do coordenador
      const temPermissaoDeAcesso = sala.interdisciplinar === true || cursoSalaNormalizado === meuCursoNormalizado;

      //se for coordenador e não tiver permissão, esconde a sala
      if (isCoordenador && !temPermissaoDeAcesso) 
        return false;
      
      //validação das tags
      if (exigencias.length === 0) return true;

      const tagsDaSala = sala.tags || []; 
      return exigencias.every(exigencia => tagsDaSala.includes(exigencia));
    });
  };

  const abrirModalReserva = (disciplina: Disciplina) => {
    setDisciplinaParaEnsalar(disciplina);
    setFormReserva({ salaId: '', data: '', horarioInicio: '', horarioFim: '' });
    setModalReservaAberto(true);
  };

  const solicitarReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disciplinaParaEnsalar || !formReserva.salaId) return;

    try {
      await api.post('/reservas', {
        salaId: Number(formReserva.salaId),
        disciplinaId: disciplinaParaEnsalar.id,
        data: formReserva.data,
        horarioInicio: formReserva.horarioInicio,
        horarioFim: formReserva.horarioFim
      });
      alert('Reserva solicitada com sucesso! Aguardando aprovação do Gestor.');
      setModalReservaAberto(false);
      recarregarLista();
    } catch (error) {
      if (isAxiosError(error) && error.response && typeof error.response.data === 'string') {
        alert(error.response.data);
      } else {
        alert('Erro ao solicitar reserva.');
      }
    }
  };

  const aprovarReserva = async (idReserva: number) => {
    try {
      await api.put(`/reservas/${idReserva}/aprovar`);
      alert('Reserva aprovada e efetivada!');
      recarregarLista();
    } catch (error) {
      if (isAxiosError(error) && error.response && typeof error.response.data === 'string') {
        alert(error.response.data);
      } else {
        alert('Erro ao aprovar reserva.');
      }
    }
  };

  //função para o gestor excluir/cancelar uma reserva
  const deletarReserva = async (idReserva: number) => {
    if (window.confirm("ATENÇÃO GESTOR: Tem certeza que deseja cancelar esta reserva? A disciplina voltará a ficar sem sala.")) {
      try {
        await api.delete(`/reservas/${idReserva}`);
        alert('Reserva cancelada com sucesso!');
        recarregarLista();
      } catch (error) {
        if (isAxiosError(error) && error.response && typeof error.response.data === 'string') {
          alert(error.response.data);
        } else {
          alert('Erro ao cancelar reserva.');
        }
      }
    }
  };

  const getReservaDaDisciplina = (nomeDisciplina: string) => {
    return reservas.find(r => r.nomeDisciplina === nomeDisciplina);
  };

  const salasDisponiveis = getSalasCompativeis();

  return (
    <div className="tags-page">
      <div className="page-header">
        <h2><IconBook /> {isCoordenador ? 'Minhas Disciplinas' : 'Painel de Ensalamento'}</h2>
        <p>Gere os horários, aloque as salas e gerencie as aprovações.</p>
      </div>

      {isCoordenador && (
        <div className="tag-add-panel" style={{ marginBottom: '2rem', border: idEditando ? '2px solid #ffc107' : 'none' }}>
          <div className="tags-section-title" style={{ marginBottom: '16px', color: idEditando ? '#d39e00' : 'inherit' }}>
            <IconPlus /> {idEditando ? 'Editar Disciplina' : 'Nova Disciplina'}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label">Nome da Matéria *</label>
              <input type="text" className="form-input" placeholder="Ex: Engenharia de Software II" {...register('nome', { required: true })} />
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

      <div className="tag-list-panel">
        <div className="tag-list-header"><h3>Status de Ensalamento</h3></div>
        
        {disciplinas.length === 0 ? (
          <div className="empty-state">
            <p>
              {isGestor ? 'Caixa de entrada limpa! Nenhuma solicitação de reserva para o seu campus.' : 'Nenhuma disciplina encontrada.'}
            </p>
          </div>
        ) : (
          <div className="rooms-grid" style={{ marginTop: '1rem' }}>
            {disciplinas.map((disciplina) => {
              const reservaVinculada = getReservaDaDisciplina(disciplina.nome);

              return (
                <div key={disciplina.id} className="room-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="room-card-header">
                    <h3 className="room-card-name">{disciplina.nome}</h3>
                    <div className="room-card-meta">Coord: {disciplina.nomeCoordenador}</div>
                  </div>
                  
                  <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <small style={{ fontWeight: 'bold', color: '#666', display: 'block', marginBottom: '0.5rem' }}>Exige:</small>
                    <div className="room-tags">
                      {disciplina.tagsExigidas.length > 0 
                        ? disciplina.tagsExigidas.map((t, i) => <span key={i} className="tag-chip">{t}</span>) 
                        : <span style={{ fontSize: '0.8rem', color: '#999' }}>Nenhuma exigência</span>}
                    </div>
                  </div>

                  {/*status da reserva*/}
                  <div style={{ marginTop: 'auto', padding: '1rem', backgroundColor: reservaVinculada ? '#f8f9fa' : 'transparent', borderRadius: '8px', border: reservaVinculada ? '1px solid #e9ecef' : 'none' }}>
                    
                    {!reservaVinculada && (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {isCoordenador ? (
                          <button className="btn btn-primary" onClick={() => abrirModalReserva(disciplina)} style={{ width: '100%' }}>
                            <IconCalendar /> Solicitar Ensalamento
                          </button>
                        ) : (
                          <span style={{ color: '#999', fontStyle: 'italic', fontSize: '0.9rem' }}>Aguardando solicitação do coordenador...</span>
                        )}
                      </div>
                    )}

                    {reservaVinculada && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <div><strong>Sala:</strong> {reservaVinculada.nomeSala}</div>
                        <div><strong>Data:</strong> {reservaVinculada.data.split('-').reverse().join('/')}</div>
                        <div><strong>Horário:</strong> {reservaVinculada.horarioInicio.slice(0,5)} às {reservaVinculada.horarioFim.slice(0,5)}</div>
                        <div>
                          <strong>Status: </strong> 
                          <span style={{ 
                            color: reservaVinculada.status === 'APROVADA' ? '#198754' : '#fd7e14', 
                            fontWeight: 'bold',
                            padding: '2px 6px',
                            backgroundColor: reservaVinculada.status === 'APROVADA' ? '#d1e7dd' : '#fff3cd',
                            borderRadius: '4px'
                          }}>
                            {reservaVinculada.status}
                          </span>
                        </div>
                        
                        {/*ações do gestor na reserva*/}
                        {isGestor && (
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            {reservaVinculada.status === 'PENDENTE' && (
                              <button className="btn btn-success" style={{ flex: 1, padding: '0.4rem' }} onClick={() => aprovarReserva(reservaVinculada.id)}>
                                <IconCheck /> Aprovar
                              </button>
                            )}
                            <button className="btn btn-danger" style={{ flex: reservaVinculada.status === 'PENDENTE' ? 1 : '100%', padding: '0.4rem' }} onClick={() => deletarReserva(reservaVinculada.id)}>
                              <IconTrash /> Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/*edição/exclusão da disciplina*/}
                  {isCoordenador && !reservaVinculada && (
                    <div className="room-card-actions" style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                      <button className="btn btn-warning btn-sm" onClick={() => iniciarEdicao(disciplina)}><IconEdit /> Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deletarDisciplina(disciplina.id)}><IconTrash /> Excluir</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/*modal de ensalamento*/}
      {modalReservaAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '450px', maxWidth: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Agendar: {disciplinaParaEnsalar?.nome}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Selecione uma das salas compatíveis com os requisitos.</p>
            
            <form onSubmit={solicitarReserva} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Sala Compatível *</label>
                {salasDisponiveis.length === 0 ? (
                  <div style={{ color: '#dc3545', fontSize: '0.9rem', padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
                    Nenhuma sala cadastrada atende aos requisitos desta disciplina.
                  </div>
                ) : (
                  <select 
                    className="form-input" 
                    required 
                    value={formReserva.salaId} 
                    onChange={e => setFormReserva({...formReserva, salaId: e.target.value})}
                  >
                    <option value="">Selecione uma sala...</option>
                    {salasDisponiveis.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                  </select>
                )}
              </div>

              <div>
                <label className="form-label">Data *</label>
                <input type="date" className="form-input" required value={formReserva.data} onChange={e => setFormReserva({...formReserva, data: e.target.value})} />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Início *</label>
                  <input type="time" className="form-input" required value={formReserva.horarioInicio} onChange={e => setFormReserva({...formReserva, horarioInicio: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Fim *</label>
                  <input type="time" className="form-input" required value={formReserva.horarioFim} onChange={e => setFormReserva({...formReserva, horarioFim: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModalReservaAberto(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={salasDisponiveis.length === 0}>Solicitar Reserva</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};