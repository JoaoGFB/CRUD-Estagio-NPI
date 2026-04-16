import { useContext, type ReactNode } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <header className="glass-panel" style={{ 
        margin: '1.5rem', 
        padding: '0.75rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderRadius: '100px'
      }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ 
              width: '40px', height: '40px', background: 'var(--orange-glossy)', 
              borderRadius: '12px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', boxShadow: '0 4px 12px rgba(251, 146, 60, 0.4)' 
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              </svg>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#9a3412', letterSpacing: '-0.5px' }}>Reserva de Salas - NPI</h1>
          </div>
          
          <nav style={{ 
            display: 'flex', 
            background: 'rgba(0,0,0,0.03)', 
            padding: '0.4rem', 
            borderRadius: '50px',
            gap: '0.5rem'
          }}>
            <Link to="/" className={isActive('/') ? 'btn-bubble btn-white' : ''} style={{ 
              padding: '0.5rem 1.5rem', 
              color: isActive('/') ? '#f97316' : '#7c2d12', 
              textDecoration: 'none', 
              fontWeight: '700',
              borderRadius: '50px',
              fontSize: '0.9rem'
            }}>Salas</Link>
            <Link to="/tags" className={isActive('/tags') ? 'btn-bubble btn-white' : ''} style={{ 
              padding: '0.5rem 1.5rem', 
              color: isActive('/tags') ? '#f97316' : '#7c2d12', 
              textDecoration: 'none', 
              fontWeight: '700',
              borderRadius: '50px',
              fontSize: '0.9rem'
            }}>Tags</Link>
          </nav>
        </div>

        <button onClick={logout} className="btn-bubble btn-ghost" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
          Finalizar Sessão
        </button>
      </header>

      <main style={{ padding: '0 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
};