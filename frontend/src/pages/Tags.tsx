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

export const Tags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NovaTagForm>();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await api.get('/tags');
        setTags(response.data);
      } catch (error) {
        console.error("Erro ao buscar tags:", error);
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
      console.error("Erro ao criar tag:", error);
      alert('Erro de comunicação ao registrar recurso.');
    }
  };

  const deletarTag = async (id: number) => {
    const confirmar = window.confirm("Atenção: Confirmar exclusão deste recurso do catálogo?");
    if (confirmar) {
      try {
        await api.delete(`/tags/${id}`);
        recarregarLista();
      } catch (error) {
        console.error("Erro ao deletar tag:", error);
        if (isAxiosError(error) && error.response) {
          alert(error.response.data);
        } else {
          alert('Ação bloqueada. Verifique dependências deste recurso em salas ativas.');
        }
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '2rem' }}>Catálogo de Recursos</h2>
        <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Gerencie tags, equipamentos e características dos ambientes.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div className="input-group" style={{ flex: 1 }}>
            <input 
              type="text" 
              className="glass-input"
              placeholder="Ex: Projetor 4K, Lousa Digital..." 
              {...register('nome', { required: 'Defina a nomenclatura do recurso' })}
            />
            {errors.nome && <span style={{ color: '#be123c', fontSize: '0.8rem', display: 'block', marginTop: '0.5rem' }}>{errors.nome.message}</span>}
          </div>
          <button type="submit" className="btn-glossy btn-lime" style={{ padding: '0.75rem 2rem' }}>
            Registrar Recurso
          </button>
        </form>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#0369a1' }}>Recursos Cadastrados</h3>
        {tags.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>O catálogo está vazio.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {tags.map((tag) => (
              <li key={tag.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.3)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{tag.nome}</span>
                <button 
                  onClick={() => deletarTag(tag.id)}
                  className="btn-glossy btn-red"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                >
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