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
  const { id } = useParams(); //pega o ID da URL se existir
  const isEditing = !!id; //modo de edição
  
  const [tagsDisponiveis, setTagsDisponiveis] = useState<Tag[]>([]);
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<NovaSalaForm>();
  const isInterdisciplinar = watch('interdisciplinar');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        //busca as tags disponíveis
        const tagsResponse = await api.get('/tags');
        const tagsBackend = tagsResponse.data;
        setTagsDisponiveis(tagsBackend);

        //busca os dados da sala específica
        if (isEditing) {
          const salaResponse = await api.get(`/salas/${id}`);
          const sala = salaResponse.data;

          //IDs que a sala já tem
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
        alert('Sala atualizada com sucesso!');
      } else {
        await api.post('/salas', payload);
        alert('Sala criada com sucesso!');
      }
      
      navigate('/'); 
    } catch (error) {
      console.error("Erro ao salvar sala:", error);
      alert('Erro ao salvar. Verifique os dados.');
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        
        <h2>{isEditing ? 'Editar Sala' : 'Cadastrar Nova Sala'}</h2>
        <button onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Voltar</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '1.5rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome da Sala *</label>
            <input type="text" {...register('nome', { required: 'Nome é obrigatório' })} style={{ width: '100%', padding: '0.5rem' }} />
            {errors.nome && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.nome.message}</span>}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Campus *</label>
            <input type="text" {...register('campus', { required: 'Campus é obrigatório' })} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Capacidade (Lugares) *</label>
            <input type="number" {...register('capacidade', { required: true, min: 1 })} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
            <input type="checkbox" {...register('interdisciplinar')} id="inter" />
            <label htmlFor="inter">É uma sala Multidisciplinar?</label>
          </div>
        </div>

        {!isInterdisciplinar && (
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Curso Vinculado</label>
            <input type="text" {...register('cursoVinculado')} placeholder="Ex: Ciência da Computação" style={{ width: '100%', padding: '0.5rem' }} />
          </div>
        )}

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Características da Sala (Tags)</label>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {tagsDisponiveis.length === 0 ? <p style={{ fontSize: '0.9rem', color: '#666' }}>Nenhuma tag cadastrada.</p> : null}
            {tagsDisponiveis.map(tag => (
              <div key={tag.id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <input type="checkbox" value={tag.id} {...register('tagIds')} id={`tag-${tag.id}`} />
                <label htmlFor={`tag-${tag.id}`}>{tag.nome}</label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" style={{ padding: '0.75rem', backgroundColor: isEditing ? '#ffc107' : '#28a745', color: isEditing ? '#000' : 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', marginTop: '1rem', fontWeight: 'bold' }}>
          {isEditing ? 'Salvar Alterações' : 'Salvar Nova Sala'}
        </button>
      </form>
    </div>
  );
};