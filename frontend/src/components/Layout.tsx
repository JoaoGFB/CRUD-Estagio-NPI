import { useContext, type ReactNode } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

//ícones inline
const IconRooms = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const IconTags = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const IconLogout = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const IconBuilding = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M9 3v18"/>
    <path d="M15 3v18"/>
    <path d="M3 9h18"/>
    <path d="M3 15h18"/>
  </svg>
);

export const Layout = ({ children }: LayoutProps) => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || (path === '/' && location.pathname === '/');

  return (
    <div className="app-layout">
      {/*sidebar*/}
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

        {/*menu*/}
        <span className="sidebar-section-label">Menu</span>

        <Link to="/" className={`sidebar-link ${isActive('/') ? 'active' : ''}`}>
          <IconRooms />
          Salas
        </Link>

        <Link to="/tags" className={`sidebar-link ${isActive('/tags') ? 'active' : ''}`}>
          <IconTags />
          Tags
        </Link>

        <div className="sidebar-bottom">
          <button className="btn-logout" onClick={logout}>
            <IconLogout />
            Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};
