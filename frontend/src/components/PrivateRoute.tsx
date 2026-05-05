import React, { useContext, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
  rolesRequeridos?: string[];
}

export const PrivateRoute = ({ children, rolesRequeridos }: PrivateRouteProps) => {
  const { signed, role } = useContext(AuthContext);
  const location = useLocation(); //descobre a url do momento atual

  if (!signed) {
    return <Navigate to="/login" replace />;
  }

  //verifica se a rota exige uma permissão que o suário não tem
  if (rolesRequeridos && role && !rolesRequeridos.includes(role)) {
    
    //define para onde o usuário deve ser redirecionado
    const destinoPadrao = role === 'COORDENADOR' ? '/disciplinas' : '/';

    //se já estiver na tela de destino, para o redirecionamento
    if (location.pathname === destinoPadrao) {
      return (
        <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>🚨 Bloqueio de Segurança / Loop Evitado</h2>
          <p>O sistema tentou te enviar para <b>{destinoPadrao}</b>, mas seu cargo (<b>{role}</b>) não foi reconhecido nas regras de permissão dessa página.</p>
          <p>As regras exigiam: <b>{rolesRequeridos.join(', ')}</b></p>
          <button onClick={() => { localStorage.clear(); window.location.href='/login'; }}>
            Limpar Dados e Sair
          </button>
        </div>
      );
    }

    //se não for loop redireciona normalmente
    return <Navigate to={destinoPadrao} replace />;
  }

  //exibe a tela normalmente
  return <>{children}</>;
};