import { useContext, type ReactNode } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom'; 

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { logout } = useContext(AuthContext);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <header style={{ backgroundColor: '#0056b3', padding: '1rem 2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/*títulos e links*/}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Reserva de Salas</h1>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Salas</Link>
            <Link to="/tags" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Tags</Link>
          </nav>
        </div>

        
        <button 
          onClick={logout} 
          style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
        >
          Sair do Sistema
        </button>
      </header>

      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
};