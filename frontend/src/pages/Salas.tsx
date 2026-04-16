import { useEffect, useState } from 'react';
import api from '../service/api';
import { useNavigate } from 'react-router-dom';

interface Sala {
  id: number;
  nome: string;
  campus: string;
  capacidade: number;
  interdisciplinar: boolean;
  cursoVinculado: string | null;
  tags: string[];
}

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconDoor = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/>
    <path d="M10 12v.01"/>
    <path d="M13 4.562v16.157a1 1 0 0 1-1.279.961L5 19V5.562a2 2 0 0 1 1.279-1.87l6-2.25a1 1 0 0 1 1.279.962v.118z"/>
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

const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconTrash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const IconInbox = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
  </svg>
);

export const Salas = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarSalas = async () => {
      try {
        const response = await api.get('/salas');
        setSalas(response.data);
      } catch (error) {
        console.error('Erro ao buscar salas:', error);
        alert('Sua sessão expirou ou ocorreu um erro.');
      } finally {
        setLoading(false);
      }
    };
    buscarSalas();
  }, []);

  const deletarSala = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta sala?')) {
      try {
        await api.delete(`/salas/${id}`);
        setSalas((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        console.error('Erro ao deletar sala:', error);
        alert('Erro ao excluir sala.');
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        Carregando catálogo de salas...
      </div>
    );
  }

  return (
    <div>
      {/*cabeçalho da página */}
      <div className="page-actions">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2>
            <IconDoor />
            Catálogo de Salas
          </h2>
          <p>{salas.length} {salas.length === 1 ? 'sala disponível' : 'salas disponíveis'}</p>
        </div>
        <button
          className="btn btn-success"
          onClick={() => navigate('/salas/nova')}
        >
          <IconPlus />
          Nova Sala
        </button>
      </div>

      {/*cards*/}
      {salas.length === 0 ? (
        <div className="empty-state">
          <IconInbox />
          <p>Nenhuma sala cadastrada ainda.</p>
          <button
            className="btn btn-primary"
            style={{ marginTop: '16px' }}
            onClick={() => navigate('/salas/nova')}
          >
            <IconPlus />
            Cadastrar primeira sala
          </button>
        </div>
      ) : (
        <div className="rooms-grid">
          {salas.map((sala) => (
            <div key={sala.id} className="room-card">
              {/*reflexo ao fundo do card */}
              <div className="room-card-inner-shine" />

              {/*cabeçalho dos cards*/}
              <div className="room-card-header">
                <h3 className="room-card-name">{sala.nome}</h3>
                <div className="room-card-meta">
                  <IconMapPin />
                  {sala.campus}
                  <span className="dot">·</span>
                  <IconUsers />
                  {sala.capacidade} lugares
                </div>
              </div>

              {/*badge com o tipo*/}
              <span className={`room-badge ${sala.interdisciplinar ? 'room-badge-multi' : 'room-badge-course'}`}>
                {sala.interdisciplinar
                  ? 'Multidisciplinar'
                  : sala.cursoVinculado
                    ? sala.cursoVinculado
                    : 'Sem curso vinculado'}
              </span>

              {sala.tags.length > 0 && (
                <div className="room-tags">
                  {sala.tags.map((tag, i) => (
                    <span key={i} className="tag-chip">{tag}</span>
                  ))}
                </div>
              )}

              <div className="room-card-actions">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => navigate(`/salas/editar/${sala.id}`)}
                >
                  <IconEdit />
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deletarSala(sala.id)}
                >
                  <IconTrash />
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
