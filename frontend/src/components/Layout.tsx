import { useContext, type ReactNode } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

//ícones usados
const IconRooms = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const IconTags = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const IconBook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const IconBuilding = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M9 3v18"/>
    <path d="M15 3v18"/>
    <path d="M3 9h18"/>
    <path d="M3 15h18"/>
  </svg>
);

export const Layout = ({ children }: LayoutProps) => {
  const { logout, role, nome, email, curso, campus } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || (path === '/' && location.pathname === '/');

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

        {/*bloqueio de RBAC: só o GESTOR renderiza esses dois botões */}
        {role === 'GESTOR' && (
          <>
            <Link to="/" className={`sidebar-link ${isActive('/') ? 'active' : ''}`}>
              <IconRooms />
              Salas
            </Link>

            <Link to="/tags" className={`sidebar-link ${isActive('/tags') ? 'active' : ''}`}>
              <IconTags />
              Tags
            </Link>
          </>
        )}

        {/*disciplinas fica de fora da condição, pois todos têm acesso à página*/}
        <Link to="/disciplinas" className={`sidebar-link ${isActive('/disciplinas') ? 'active' : ''}`}>
          <IconBook /> 
          Disciplinas
        </Link>

        <div className="sidebar-bottom">
          <button className="btn-logout" onClick={logout}>
            <IconLogout />
            Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="main-content">
        
        {/*cabeçalho superior do perfil*/}
        <header style={{ 
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center', 
          marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.4)' 
        }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '14px', 
            background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(16px)',
            padding: '8px 10px 8px 20px', borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: '0 4px 16px rgba(0, 150, 210, 0.1), inset 0 2px 0 rgba(255,255,255,0.8)'
          }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: '800', color: 'var(--ink-900)', fontSize: '0.95rem', lineHeight: '1.2' }}>
                {nome || 'Usuário NPI'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--ink-500)', fontWeight: '600' }}>
                {role === 'GESTOR' ? `Gestão: ${campus}` : `Coordenação: ${curso}`}
              </span>
            </div>
            
            <div style={{ 
              width: '42px', height: '42px', borderRadius: '50%', 
              background: role === 'GESTOR' 
                ? 'linear-gradient(135deg, var(--mint-300), var(--mint-600))'
                : 'linear-gradient(135deg, var(--aqua-300), var(--aqua-600))', 
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontWeight: '900', fontSize: '1.2rem', position: 'relative', overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)',
                borderRadius: '50% 50% 10px 10px'
              }}/>
              <span style={{ position: 'relative', zIndex: 1, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                {nome ? nome.charAt(0).toUpperCase() : (email ? email.charAt(0).toUpperCase() : 'U')}
              </span>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};