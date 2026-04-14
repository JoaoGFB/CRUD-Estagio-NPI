import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../service/api';

interface Tag {
  id: number;
  nome: string;
}

interface NovaTagForm {
  nome: string;
}

export const Tags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  
  //isso é um estado numérico - serve apenas como gatilho para recarregar a lista
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NovaTagForm>();

  
  //roda na primeira vez que a tela abre, E toda vez que o 'refreshTrigger' mudar de valor.
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
      alert('Erro ao criar a tag.');
    }
  };

  const deletarTag = async (id: number) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta tag?");
    if (confirmar) {
      try {
        await api.delete(`/tags/${id}`);
        recarregarLista(); 
      } catch (error) {
        console.error("Erro ao deletar tag:", error);
        alert('Erro ao excluir. Verifique se esta tag não está vinculada a nenhuma sala!');
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Gerenciar Tags</h2>
      </div>

      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <input 
              type="text" 
              placeholder="Nome da nova tag (ex: Projetor)" 
              {...register('nome', { required: 'O nome da tag é obrigatório' })}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            {errors.nome && <span style={{ color: 'red', fontSize: '0.8rem', display: 'block', marginTop: '0.5rem' }}>{errors.nome.message}</span>}
          </div>
          <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Adicionar Tag
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Tags Cadastradas</h3>
        {tags.length === 0 ? (
          <p style={{ color: '#666' }}>Nenhuma tag cadastrada ainda.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {tags.map((tag) => (
              <li key={tag.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
                <span style={{ fontWeight: 'bold', color: '#334155' }}>{tag.nome}</span>
                <button 
                  onClick={() => deletarTag(tag.id)}
                  style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
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