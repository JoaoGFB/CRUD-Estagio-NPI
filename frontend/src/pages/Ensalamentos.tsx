
import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../service/api';

interface PeriodoLetivo {
  id: number;
  nome: string;
  tipo: string;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
}

interface Ensalamento {
  reservaId: number;
  periodo: string;
  disciplina: string;
  professor: string;
  coordenador: string;
  curso: string;
  turma: string | null;
  grupo: string | null;
  sala: string;
  campus: string;
  quantidadeAlunos: number;
  capacidadeSala: number;
  interdisciplinar: boolean;
  cursoVinculado: string | null;
  diaDaSemana: string;
  horarioInicio: string;
  horarioFim: string;
  status: string;
}

const DIAS_DA_SEMANA: Record<string, string> = {
  MONDAY: 'Segunda-feira',
  TUESDAY: 'Terça-feira',
  WEDNESDAY: 'Quarta-feira',
  THURSDAY: 'Quinta-feira',
  FRIDAY: 'Sexta-feira',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo'
};

export const Ensalamentos = () => {
  const [periodos, setPeriodos] = useState<PeriodoLetivo[]>([]);
  const [periodoSelecionado, setPeriodoSelecionado] = useState('');
  const [ensalamentos, setEnsalamentos] = useState<Ensalamento[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregarPeriodos = async () => {
      try {
        const response = await api.get('/periodos-letivos');
        setPeriodos(response.data);
      } catch (error) {
        console.error('Erro ao carregar períodos:', error);
        setErro('Não foi possível carregar os períodos letivos.');
      }
    };

    carregarPeriodos();
  }, []);

  const consultarEnsalamentos = async (periodoId: string) => {
    setPeriodoSelecionado(periodoId);
    setEnsalamentos([]);
    setErro('');

    if (!periodoId) return;

    try {
      setCarregando(true);

      const response = await api.get(
        `/reservas/ensalamentos/periodo/${periodoId}`
      );

      setEnsalamentos(response.data);
    } catch (error) {
      console.error('Erro ao consultar ensalamentos:', error);

      if (isAxiosError(error) && error.response) {
        setErro(
          typeof error.response.data === 'string'
            ? error.response.data
            : 'Não foi possível consultar os ensalamentos.'
        );
      } else {
        setErro('Não foi possível consultar os ensalamentos.');
      }
    } finally {
      setCarregando(false);
    }
  };

  const gerarPDF = () => {
    if (ensalamentos.length === 0) {
      alert('Não existem ensalamentos para exportar.');
      return;
    }

    const periodo = periodos.find(
      p => String(p.id) === periodoSelecionado
    );

    const documento = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    documento.setFontSize(16);
    documento.text('Relatório de Ensalamento', 14, 15);

    documento.setFontSize(10);
    documento.text(`Período: ${periodo?.nome || ''}`, 14, 23);

    documento.text(
      `Data de início: ${periodo?.dataInicio || ''}  |  Data de término: ${periodo?.dataFim || ''}`,
      14,
      29
    );

    documento.text(
      `Total de reservas aprovadas: ${ensalamentos.length}`,
      14,
      35
    );

    autoTable(documento, {
      startY: 41,
      head: [[
        'Dia',
        'Horário',
        'Disciplina',
        'Professor',
        'Curso',
        'Turma',
        'Sala',
        'Campus',
        'Alunos'
      ]],
      body: ensalamentos.map(item => [
        DIAS_DA_SEMANA[item.diaDaSemana] || item.diaDaSemana,
        `${item.horarioInicio} - ${item.horarioFim}`,
        item.disciplina,
        item.professor,
        item.curso,
        item.turma
          ? `${item.turma}${item.grupo ? ` - ${item.grupo}` : ''}`
          : 'Não informada',
        item.sala,
        item.campus,
        String(item.quantidadeAlunos)
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [0, 78, 100]
      },
      theme: 'grid'
    });

    const nomeArquivo = (periodo?.nome || 'periodo')
      .replace(/[^a-zA-Z0-9]/g, '_');

    documento.save(`Ensalamento_${nomeArquivo}.pdf`);
  };

  return (
    <div className="tags-page">
      <div className="page-header">
        <h2>Consulta de Ensalamentos</h2>
        <p>
          Consulte as reservas aprovadas e gere o relatório
          definitivo de ensalamento por período letivo.
        </p>
      </div>

      <div className="tag-add-panel" style={{ marginBottom: '2rem' }}>
        <div className="tags-section-title">
          Selecionar período letivo
        </div>

        <select
          className="form-input"
          value={periodoSelecionado}
          onChange={e => consultarEnsalamentos(e.target.value)}
        >
          <option value="">Selecione um período...</option>

          {periodos.map(periodo => (
            <option key={periodo.id} value={periodo.id}>
              {periodo.nome}
              {!periodo.ativo ? ' (Encerrado)' : ''}
            </option>
          ))}
        </select>
      </div>

      {erro && (
        <div className="empty-state">
          <p>{erro}</p>
        </div>
      )}

      {carregando && (
        <div className="empty-state">
          <p>Carregando ensalamentos...</p>
        </div>
      )}

      {!carregando && periodoSelecionado && !erro && (
        <div className="tag-list-panel">
          <div
            className="tag-list-header"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <h3>Reservas Aprovadas ({ensalamentos.length})</h3>

            <button
              className="btn btn-success"
              onClick={gerarPDF}
              disabled={ensalamentos.length === 0}
            >
              Exportar PDF
            </button>
          </div>

          {ensalamentos.length === 0 ? (
            <div className="empty-state">
              <p>
                Nenhuma reserva aprovada encontrada para
                este período.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', padding: '1rem' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '850px'
              }}>
                <thead>
                  <tr>
                    {[
                      'Dia',
                      'Horário',
                      'Disciplina',
                      'Professor',
                      'Turma',
                      'Sala',
                      'Campus',
                      'Alunos'
                    ].map(coluna => (
                      <th
                        key={coluna}
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          borderBottom: '2px solid #ddd'
                        }}
                      >
                        {coluna}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {ensalamentos.map(item => (
                    <tr key={item.reservaId}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        {DIAS_DA_SEMANA[item.diaDaSemana] || item.diaDaSemana}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        {item.horarioInicio} - {item.horarioFim}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        {item.disciplina}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        {item.professor}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        {item.turma || '—'}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        {item.sala}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        {item.campus}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                        {item.quantidadeAlunos}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!periodoSelecionado && !erro && (
        <div className="empty-state">
          <p>Selecione um período para consultar o ensalamento.</p>
        </div>
      )}
    </div>
  );
};
