
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isAxiosError } from 'axios';
import api from '../service/api';

interface PeriodoLetivo {
  id: number;
  nome: string;
  tipo: string;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
}

interface PeriodoForm {
  nome: string;
  tipo: string;
  dataInicio: string;
  dataFim: string;
}

const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>
  </svg>
);

const IconPower = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
    <line x1="12" y1="2" x2="12" y2="12"/>
  </svg>
);

export const Periodos = () => {
  const [periodos, setPeriodos] = useState<PeriodoLetivo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [periodoEditando, setPeriodoEditando] =
    useState<PeriodoLetivo | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PeriodoForm>({
    defaultValues: {
      nome: '',
      tipo: 'BIMESTRE',
      dataInicio: '',
      dataFim: ''
    }
  });

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataJaPassou = (data: string) => {
    const [ano, mes, dia] = data.split('-').map(Number);
    const dataPeriodo = new Date(ano, mes - 1, dia);
    dataPeriodo.setHours(0, 0, 0, 0);

    return dataPeriodo < hoje;
  };

  const estaEncerrado = (periodo: PeriodoLetivo) => {
    return !periodo.ativo || dataJaPassou(periodo.dataFim);
  };

  const carregarPeriodos = async () => {
    try {
      setCarregando(true);

      const response = await api.get('/periodos-letivos');
      setPeriodos(response.data);
    } catch (error) {
      console.error('Erro ao buscar períodos:', error);
      alert('Não foi possível carregar os períodos letivos.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarPeriodos();
  }, []);

  const limparFormulario = () => {
    setPeriodoEditando(null);

    reset({
      nome: '',
      tipo: 'BIMESTRE',
      dataInicio: '',
      dataFim: ''
    });
  };

  const iniciarEdicao = (periodo: PeriodoLetivo) => {
    if (estaEncerrado(periodo)) {
      alert('Este período já está encerrado e não pode ser editado.');
      return;
    }

    setPeriodoEditando(periodo);

    reset({
      nome: periodo.nome,
      tipo: periodo.tipo,
      dataInicio: periodo.dataInicio,
      dataFim: periodo.dataFim
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: PeriodoForm) => {
    if (data.dataFim < data.dataInicio) {
      alert('A data de término não pode ser anterior à data de início.');
      return;
    }

    const payload = {
      nome: data.nome.trim(),
      tipo: data.tipo,
      dataInicio: data.dataInicio,
      dataFim: data.dataFim
    };

    try {
      if (periodoEditando) {
        await api.put(
          `/periodos-letivos/${periodoEditando.id}`,
          payload
        );

        alert('Período atualizado com sucesso!');
      } else {
        await api.post('/periodos-letivos', payload);

        alert('Período criado com sucesso!');
      }

      limparFormulario();
      await carregarPeriodos();
    } catch (error) {
      console.error('Erro ao salvar período:', error);

      if (isAxiosError(error) && error.response) {
        const mensagem = typeof error.response.data === 'string'
          ? error.response.data
          : error.response.data?.message;

        alert(mensagem || 'Não foi possível salvar o período.');
      } else {
        alert('Não foi possível salvar o período.');
      }
    }
  };

  const encerrarPeriodo = async (periodo: PeriodoLetivo) => {
    if (estaEncerrado(periodo)) {
      alert('Este período já está encerrado.');
      return;
    }

    const confirmar = window.confirm(
      `Deseja encerrar definitivamente "${periodo.nome}"? ` +
      'Após o encerramento, não será possível reabri-lo nem associar novas reservas.'
    );

    if (!confirmar) return;

    try {
      await api.put(
        `/periodos-letivos/${periodo.id}/encerrar`
      );

      if (periodoEditando?.id === periodo.id) {
        limparFormulario();
      }

      alert('Período encerrado definitivamente.');
      await carregarPeriodos();
    } catch (error) {
      console.error('Erro ao encerrar período:', error);

      if (isAxiosError(error) && error.response) {
        const mensagem = typeof error.response.data === 'string'
          ? error.response.data
          : error.response.data?.message;

        alert(mensagem || 'Não foi possível encerrar o período.');
      } else {
        alert('Não foi possível encerrar o período.');
      }
    }
  };

  const formatarData = (data: string) => {
    if (!data) return '';

    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="tags-page" style={{ maxWidth: '900px' }}>

      <div className="page-header">
        <h2>
          <IconCalendar />
          Gestão de Períodos Letivos
        </h2>

        <p>
          Cadastre, edite e encerre os períodos que liberam
          o ensalamento aos coordenadores.
        </p>
      </div>

      {/* Formulário de criação e edição */}
      <div className="tag-add-panel" style={{ marginBottom: '2rem' }}>

        <div
          className="tags-section-title"
          style={{ marginBottom: '16px' }}
        >
          {periodoEditando ? <IconEdit /> : <IconPlus />}

          {periodoEditando
            ? 'Editar Período'
            : 'Novo Período'}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '1rem'
            }}
          >
            <div>
              <label className="form-label">
                Nome de Exibição *
              </label>

              <input
                type="text"
                className="form-input"
                placeholder="Ex.: 1º Bimestre de 2027"
                maxLength={100}
                {...register('nome', {
                  required: 'O nome do período é obrigatório.',
                  validate: value =>
                    value.trim().length > 0 ||
                    'Informe um nome válido.'
                })}
              />

              {errors.nome && (
                <span className="form-error">
                  {errors.nome.message}
                </span>
              )}
            </div>

            <div>
              <label className="form-label">
                Tipo de Ciclo *
              </label>

              <select
                className="form-input"
                {...register('tipo', { required: true })}
              >
                <option value="BIMESTRE">Bimestre</option>
                <option value="TRIMESTRE">Trimestre</option>
                <option value="SEMESTRE">Semestre</option>
                <option value="ESPECIAL">Especial / Evento</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}
          >
            <div>
              <label className="form-label">
                Data de Início *
              </label>

              <input
                type="date"
                className="form-input"
                {...register('dataInicio', {
                  required: 'A data de início é obrigatória.'
                })}
              />

              {errors.dataInicio && (
                <span className="form-error">
                  {errors.dataInicio.message}
                </span>
              )}
            </div>

            <div>
              <label className="form-label">
                Data de Término *
              </label>

              <input
                type="date"
                className="form-input"
                {...register('dataFim', {
                  required: 'A data de término é obrigatória.'
                })}
              />

              {errors.dataFim && (
                <span className="form-error">
                  {errors.dataFim.message}
                </span>
              )}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              marginTop: '0.5rem'
            }}
          >
            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Salvando...'
                : periodoEditando
                  ? 'Salvar Alterações'
                  : 'Cadastrar Período'}
            </button>

            {periodoEditando && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={limparFormulario}
              >
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de períodos */}
      <div className="tag-list-panel">

        <div className="tag-list-header">
          <h3>Ciclos Letivos Registrados</h3>
        </div>

        <div style={{ padding: '0 20px 20px 20px' }}>

          {carregando ? (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              Carregando períodos...
            </p>
          ) : periodos.length === 0 ? (
            <p
              style={{
                textAlign: 'center',
                color: '#888',
                marginTop: '20px'
              }}
            >
              Nenhum período cadastrado.
            </p>
          ) : (
            periodos.map((periodo) => {
              const encerrado = estaEncerrado(periodo);

              return (
                <div
                  key={periodo.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '15px 0',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    flexWrap: 'wrap'
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 'bold',
                        color: 'var(--ink-900)'
                      }}
                    >
                      {periodo.nome}
                    </div>

                    <div
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--ink-500)',
                        marginBottom: '4px'
                      }}
                    >
                      {periodo.tipo} · De{' '}
                      {formatarData(periodo.dataInicio)} até{' '}
                      {formatarData(periodo.dataFim)}
                    </div>

                    <span
                      className={`room-badge ${
                        encerrado
                          ? 'room-badge-course'
                          : 'room-badge-multi'
                      }`}
                      style={{ marginBottom: 0 }}
                    >
                      {encerrado
                        ? 'Encerrado'
                        : 'Aberto para reservas'}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    {!encerrado && (
                      <>
                        <button
                          type="button"
                          className="btn btn-warning btn-sm"
                          onClick={() => iniciarEdicao(periodo)}
                        >
                          <IconEdit />
                          Editar
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => encerrarPeriodo(periodo)}
                        >
                          <IconPower />
                          Encerrar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}

        </div>
      </div>
    </div>
  );
};
