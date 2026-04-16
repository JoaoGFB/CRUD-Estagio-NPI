import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../service/api';

interface Tag {
  id: number;
  nome: string;
}

interface NovaSalaForm {
  nome: string;
  campus: string;
  capacidade: number;
  interdisciplinar: boolean;
  cursoVinculado: string;
  tagIds: string[]; 
}

export const NovaSala = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const [tagsDisponiveis, setTagsDisponiveis] = useState<Tag[]>([]);
  const navigate = useNavigate();
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<NovaSalaForm>();
  const isInterdisciplinar = watch('interdisciplinar');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const tagsResponse = await api.get('/tags');
        const tagsBackend = tagsResponse.data;
        setTagsDisponiveis(tagsBackend);

        if (isEditing) {
          const salaResponse = await api.get(`/salas/${id}`);
          const sala = salaResponse.data;

          const tagIdsAtuais = sala.tags.map((nomeTag: string) => {
            const tagEncontrada = tagsBackend.find((t: Tag) => t.nome === nomeTag);
            return tagEncontrada ? String(tagEncontrada.id) : null;
          }).filter(Boolean);

          reset({
            nome: sala.nome,
            campus: sala.campus,
            capacidade: sala.capacidade,
            interdisciplinar: sala.interdisciplinar,
            cursoVinculado: sala.cursoVinculado || "",
            tagIds: tagIdsAtuais
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };
    carregarDados();
  }, [id, isEditing, reset]);

  const onSubmit = async (data: NovaSalaForm) => {
    try {
      const payload = {
        ...data,
        capacidade: Number(data.capacidade),
        cursoVinculado: data.interdisciplinar ? "" : data.cursoVinculado,
        tagIds: data.tagIds ? data.tagIds.map(Number) : []
      };

      if (isEditing) {
        await api.put(`/salas/${id}`, payload);
        alert('Infraestrutura atualizada com sucesso!');
      } else {
        await api.post('/salas', payload);
        alert('Nova sala provisionada com sucesso!');
      }
      navigate('/');
    } catch (error) {
      console.error("Erro ao salvar sala:", error);
      alert('Erro na transação. Verifique os dados fornecidos.');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, color: '#0369a1' }}>{isEditing ? 'Configurar Ambiente' : 'Provisionar Novo Ambiente'}</h2>
        <button onClick={() => navigate('/')} className="btn-glossy btn-outline" style={{ padding: '0.5rem 1rem' }}>Voltar</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bento-grid">
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="input-group">
            <label>Nomenclatura do Ambiente *</label>
            <input type="text" className="glass-input" {...register('nome', { required: 'Nome é obrigatório' })} />
            {errors.nome && <span style={{ color: '#be123c', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.nome.message}</span>}
          </div>
          <div className="input-group">
            <label>Localização / Campus *</label>
            <input type="text" className="glass-input" {...register('campus', { required: 'Campus é obrigatório' })} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="input-group">
            <label>Capacidade Operacional (Pessoas) *</label>
            <input type="number" className="glass-input" {...register('capacidade', { required: true, min: 1 })} />
          </div>
          
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem', borderRadius: '12px' }}>
            <input type="checkbox" {...register('interdisciplinar')} id="inter" style={{ width: '20px', height: '20px', accentColor: '#4facfe' }} />
            <label htmlFor="inter" style={{ margin: 0, fontWeight: 500, cursor: 'pointer' }}>Ambiente Multidisciplinar?</label>
          </div>
        </div>

        {!isInterdisciplinar && (
          <div className="input-group">
            <label>Curso Vinculado</label>
            <input type="text" className="glass-input" {...register('cursoVinculado')} placeholder="Ex: Ciência da Computação" />
          </div>
        )}

        <div className="input-group" style={{ marginTop: '1rem' }}>
          <label>Características e Recursos (Tags)</label>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', borderRadius: '12px' }}>
            {tagsDisponiveis.length === 0 ? <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>O catálogo de recursos está vazio.</p> : null}
            {tagsDisponiveis.map(tag => (
              <div key={tag.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" value={tag.id} {...register('tagIds')} id={`tag-${tag.id}`} style={{ width: '18px', height: '18px', accentColor: '#4facfe' }} />
                <label htmlFor={`tag-${tag.id}`} style={{ cursor: 'pointer' }}>{tag.nome}</label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className={`btn-glossy ${isEditing ? 'btn-yellow' : 'btn-cyan'}`} style={{ marginTop: '2rem', padding: '1rem', fontSize: '1.1rem' }}>
          {isEditing ? 'Aplicar Configurações' : 'Finalizar Provisionamento'}
        </button>
      </form>
    </div>
  );
};