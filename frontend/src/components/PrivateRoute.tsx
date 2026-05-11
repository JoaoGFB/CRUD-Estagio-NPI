import React, { useContext, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
  rolesRequeridos?: string[];
  campusRequerido?: string;
}

export const PrivateRoute = ({ children, rolesRequeridos, campusRequerido }: PrivateRouteProps) => {
  const { signed, role, campus } = useContext(AuthContext);
  const location = useLocation();

  if (!signed) {
    return <Navigate to="/login" replace />;
  }

  //verifica se tem a role correta
  const roleInvalida = rolesRequeridos && role && !rolesRequeridos.includes(role);
  
  //verifica se tem o campus correto (quando a tela exigir)
  const campusInvalido = campusRequerido && campus !== campusRequerido;

  if (roleInvalida || campusInvalido) {
    const destinoPadrao = role === 'COORDENADOR' ? '/disciplinas' : '/';

    if (location.pathname === destinoPadrao) {
      return (
        <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>🚨 Bloqueio de Segurança / Loop Evitado</h2>
          <p>Você não tem privilégios de <b>Super Admin (Sede)</b> para acessar esta tela.</p>
          <button onClick={() => { localStorage.clear(); window.location.href='/login'; }}>
            Limpar Dados e Sair
          </button>
        </div>
      );
    }
    return <Navigate to={destinoPadrao} replace />;
  }

  return <>{children}</>;
};