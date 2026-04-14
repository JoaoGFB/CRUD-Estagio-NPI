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

  //busca as salas no spring boot
  useEffect(() => {
    const buscarSalas = async () => {
      try {
        const response = await api.get('/salas');
        setSalas(response.data);
      } catch (error) {
        console.error("Erro ao buscar salas:", error);
        alert("Sua sessão expirou ou ocorreu um erro.");
      } finally {
        setLoading(false);
      }
    };

    buscarSalas();
  }, []);

  if (loading) return <h2>Carregando catálogo de salas...</h2>;

  const deletarSala = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta sala?")) {
      try {
        await api.delete(`/salas/${id}`);
        setSalas((prev) => prev.filter(sala => sala.id !== id));
      } catch (error) {
        console.error("Erro ao deletar sala:", error);
        alert("Erro ao excluir sala.");
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Catálogo de Salas</h2>
        <button 
          onClick={() => navigate('/salas/nova')}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Nova Sala
        </button>
      </div>
        
      {/*amostra de salas*/}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {salas.length === 0 ? (
          <p>Nenhuma sala cadastrada ainda.</p>
        ) : (
          salas.map((sala) => (
            <div key={sala.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{sala.nome}</h3>
              <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
                {sala.campus} • {sala.capacidade} lugares
                <br/>
                <small>{sala.interdisciplinar ? 'Multidisciplinar' : `Curso: ${sala.cursoVinculado}`}</small>
              </p>
              
              {/*renderizar tags*/}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {sala.tags.map((tag, index) => (
                  <span key={index} style={{ backgroundColor: '#e2e8f0', color: '#334155', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/*botões de editar e excluir*/}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                <button 
                  onClick={() => navigate(`/salas/editar/${sala.id}`)}
                  style={{ flex: 1, padding: '0.5rem', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Editar
                </button>
                <button 
                  onClick={() => deletarSala(sala.id)}
                  style={{ flex: 1, padding: '0.5rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};