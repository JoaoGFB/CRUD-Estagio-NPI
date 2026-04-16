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
        console.error("Erro ao buscar salas:", error);
      } finally {
        setLoading(false);
      }
    };
    buscarSalas();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem', fontSize: '1.2rem', fontWeight: 600 }}>Sincronizando Ambientes NPI...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <span style={{ color: '#f97316', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase' }}>Infraestrutura Universitária</span>
          <h2 style={{ margin: '0.2rem 0 0 0', fontSize: '2.5rem', fontWeight: 800 }}>Catálogo de Espaços</h2>
        </div>
        <button onClick={() => navigate('/salas/nova')} className="btn-bubble btn-orange">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Novo Espaço
        </button>
      </div>
        
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
        {salas.map((sala) => (
          <div key={sala.id} className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '50px', height: '50px', background: 'var(--orange-soft)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#431407' }}>{sala.nome}</h3>
                <span style={{ color: '#f97316', fontSize: '0.85rem', fontWeight: 700 }}>{sala.campus}</span>
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.4)', borderRadius: '16px' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#7c2d12', fontWeight: 600 }}>
                {sala.capacidade} Lugares • {sala.interdisciplinar ? 'Multidisciplinar' : sala.cursoVinculado}
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
              {sala.tags.map((tag, index) => (
                <span key={index} style={{ padding: '0.4rem 0.8rem', background: 'white', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(251, 146, 60, 0.2)' }}>{tag}</span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', borderTop: '2px solid rgba(251, 146, 60, 0.1)', paddingTop: '1.5rem' }}>
              <button onClick={() => navigate(`/salas/editar/${sala.id}`)} className="btn-bubble btn-white" style={{ flex: 1, border: '1px solid #f97316', color: '#f97316' }}>Configurar</button>
              <button onClick={() => {/* ... logica deletar ... */}} className="btn-bubble btn-white" style={{ color: '#ef4444' }}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};