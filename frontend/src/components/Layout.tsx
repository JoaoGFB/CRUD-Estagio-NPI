import { useContext, useState, type ReactNode } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../service/api';
import { isAxiosError } from 'axios';

interface LayoutProps {
  children: ReactNode;
}

interface TrocaSenhaForm {
  senhaAtual: string;
  novaSenha: string;
}

//ícones usados
const IconRooms = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const IconTags = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>);
const IconBook = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>);
const IconLogout = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>);
const IconBuilding = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>);
const IconUsersMenu = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const IconLock = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
const IconAlert = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>);
const IconUserDetail = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const IconMail = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>);
const IconBriefcase = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);
const IconCalendar = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);

export const Layout = ({ children }: LayoutProps) => {
  const { logout, role, nome, email, curso, campus, userId } = useContext(AuthContext);
  const location = useLocation();

  //controla o modal com estados
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false);
  const [modoPerfil, setModoPerfil] = useState<'info' | 'senha'>('info'); // Diz o que desenhar no Modal
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TrocaSenhaForm>();

  const isActive = (path: string) => location.pathname === path || (path === '/' && location.pathname === '/');

  //abre o modal na aba de informações
  const abrirModalPerfil = () => {
    setModoPerfil('info');
    setModalPerfilAberto(true);
  };

  const fecharModal = () => {
    setModalPerfilAberto(false);
    reset();
  };

  const onSubmitSenha = async (data: TrocaSenhaForm) => {
    try {
      await api.put(`/usuarios/${userId}/senha`, data);
      alert('Palavra-passe alterada com sucesso!');
      fecharModal();
    } catch (error) {
      if (isAxiosError(error) && error.response && typeof error.response.data === 'string') {
        alert(error.response.data);
      } else {
        alert('Erro ao alterar a palavra-passe.');
      }
    }
  };

  return (
    <div className="app-layout">
      {/*menu lateral*/}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <IconBuilding />
          </div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">Reserva de Salas</span>
            <span className="sidebar-logo-sub">NPI</span>
          </div>
        </div>

        <span className="sidebar-section-label">Menu</span>

        {role === 'GESTOR' && (
          <>
            <Link to="/" className={`sidebar-link ${isActive('/') ? 'active' : ''}`}><IconRooms /> Salas</Link>
            <Link to="/tags" className={`sidebar-link ${isActive('/tags') ? 'active' : ''}`}><IconTags /> Tags</Link>
          </>
        )}

        {role === 'GESTOR' && campus === 'SEDE' && (
          <>
            <Link to="/usuarios" className={`sidebar-link ${isActive('/usuarios') ? 'active' : ''}`}><IconUsersMenu />Time</Link>
            <Link to="/periodos" className={`sidebar-link ${isActive('/periodos') ? 'active' : ''}`}><IconCalendar />Períodos</Link>
          </>
        )}

      

        {role === 'COORDENADOR' && (
          <Link to="/professores" className={`sidebar-link ${isActive('/professores') ? 'active' : ''}`}><IconUserDetail /> Professores</Link>
        )}

        <Link to="/disciplinas" className={`sidebar-link ${isActive('/disciplinas') ? 'active' : ''}`}><IconBook /> Disciplinas</Link>

        <div className="sidebar-bottom">
          <button className="btn-logout" onClick={logout}><IconLogout /> Sair do Sistema</button>
        </div>
      </aside>

      <main className="main-content">
        
        {/*cabeçalho*/}
        <header style={{ 
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center', 
          marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.4)' 
        }}>
          <div 
            onClick={abrirModalPerfil}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '14px', 
              background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(16px)',
              padding: '8px 10px 8px 20px', borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.7)',
              boxShadow: '0 4px 16px rgba(0, 150, 210, 0.1), inset 0 2px 0 rgba(255,255,255,0.8)',
              cursor: 'pointer', transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: '800', color: 'var(--ink-900)', fontSize: '0.95rem', lineHeight: '1.2' }}>{nome || 'Usuário NPI'}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--ink-500)', fontWeight: '600' }}>
                {role === 'GESTOR' ? `Gestão: ${campus}` : `Coordenação: ${curso}`}
              </span>
            </div>
            
            <div style={{ 
              width: '42px', height: '42px', borderRadius: '50%', 
              background: role === 'GESTOR' ? 'linear-gradient(135deg, var(--mint-300), var(--mint-600))' : 'linear-gradient(135deg, var(--aqua-300), var(--aqua-600))', 
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontWeight: '900', fontSize: '1.2rem', position: 'relative', overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)', borderRadius: '50% 50% 10px 10px' }}/>
              <span style={{ position: 'relative', zIndex: 1, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                {nome ? nome.charAt(0).toUpperCase() : (email ? email.charAt(0).toUpperCase() : 'U')}
              </span>
            </div>
          </div>
        </header>

        {children}

        {/*modal do perfil*/}
        {modalPerfilAberto && (
          <div style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,30,50,0.4)', backdropFilter: 'blur(4px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 
          }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(24px)',
              padding: '2.5rem', borderRadius: '24px', width: '420px', maxWidth: '90%', 
              boxShadow: '0 20px 40px rgba(0,100,150,0.2), inset 0 1px 0 rgba(255,255,255,0.9)',
              border: '1px solid rgba(255,255,255,0.5)', position: 'relative'
            }}>
              
              {/* informações do perfil*/}
              {modoPerfil === 'info' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
                  <h3 style={{ margin: 0, color: 'var(--ink-900)', fontSize: '1.3rem' }}>Meu Perfil</h3>
                  
                  {/* Avatar em Destaque */}
                  <div style={{ 
                    width: '76px', height: '76px', borderRadius: '50%', 
                    background: role === 'GESTOR' ? 'linear-gradient(135deg, var(--mint-300), var(--mint-600))' : 'linear-gradient(135deg, var(--aqua-300), var(--aqua-600))', 
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontWeight: '900', fontSize: '2.5rem', position: 'relative', overflow: 'hidden',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.15)'
                  }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)', borderRadius: '50% 50% 10px 10px' }}/>
                    <span style={{ position: 'relative', zIndex: 1, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                      {nome ? nome.charAt(0).toUpperCase() : (email ? email.charAt(0).toUpperCase() : 'U')}
                    </span>
                  </div>

                  {/*exibição dos dados do usuário*/}
                  <div style={{ 
                    width: '100%', background: 'rgba(255,255,255,0.6)', padding: '1.2rem', 
                    borderRadius: '16px', border: '1px solid rgba(255,255,255,0.8)', 
                    display: 'flex', flexDirection: 'column', gap: '0.8rem',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--ink-700)' }}>
                      <span style={{ color: 'var(--aqua-500)' }}><IconUserDetail /></span>
                      <span style={{ fontWeight: '700', fontSize: '1rem' }}>{nome || 'Não informado'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--ink-500)' }}>
                      <span style={{ color: 'var(--aqua-500)' }}><IconMail /></span>
                      <span style={{ fontSize: '0.9rem' }}>{email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--ink-500)' }}>
                      <span style={{ color: 'var(--aqua-500)' }}><IconBriefcase /></span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: role === 'GESTOR' ? 'var(--mint-600)' : 'var(--aqua-600)' }}>
                        {role === 'GESTOR' ? `Gestor Institucional (${campus})` : `Coordenador de Curso (${curso})`}
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '0.6rem', marginTop: '0.5rem' }}>
                    <button className="btn btn-primary" onClick={() => setModoPerfil('senha')} style={{ width: '100%', justifyContent: 'center' }}>
                      <IconLock /> Alterar Palavra-Passe
                    </button>
                    <button className="btn btn-secondary" onClick={fecharModal} style={{ width: '100%', justifyContent: 'center' }}>
                      Fechar
                    </button>
                  </div>
                </div>
              )}

              {/*formulário pra troca de senha*/}
              {modoPerfil === 'senha' && (
                <>
                  <h3 style={{ marginTop: 0, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconLock /> Segurança
                  </h3>
                  <p style={{ color: 'var(--ink-500)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Altere a sua palavra-passe de acesso ao sistema.
                  </p>
                  
                  <form onSubmit={handleSubmit(onSubmitSenha)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="form-label">Palavra-Passe Atual *</label>
                      <input type="password" className="form-input" placeholder="••••••••" {...register('senhaAtual', { required: 'Informe a palavra-passe atual' })} />
                      {errors.senhaAtual && <span className="form-error" style={{marginTop: '4px'}}><IconAlert /> {errors.senhaAtual.message}</span>}
                    </div>

                    <div>
                      <label className="form-label">Nova Palavra-Passe *</label>
                      <input type="password" className="form-input" placeholder="••••••••" {...register('novaSenha', { required: 'Informe a nova palavra-passe', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} />
                      {errors.novaSenha && <span className="form-error" style={{marginTop: '4px'}}><IconAlert /> {errors.novaSenha.message}</span>}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                      <button type="button" className="btn btn-secondary" onClick={() => { reset(); setModoPerfil('info'); }}>
                        Voltar
                      </button>
                      <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                        {isSubmitting ? 'A guardar...' : 'Atualizar'}
                      </button>
                    </div>
                  </form>
                </>
              )}

            </div>
          </div>
        )}
      </main>
    </div>
  );
};