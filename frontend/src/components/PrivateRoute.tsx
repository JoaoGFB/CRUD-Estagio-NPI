import React, { useContext, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: ReactNode; 
  rolesRequeridos?: string[];
}

export const PrivateRoute = ({ children, rolesRequeridos }: PrivateRouteProps) => {
  const { signed, role } = useContext(AuthContext);

  //se não estiver logado, manda pro login
  if (!signed) {
    return <Navigate to="/login" replace />;
  }

  //se a rota exigir uma role específica e o usuário não tiver ela
  if (rolesRequeridos && role && !rolesRequeridos.includes(role)) {
    // ...empurra ele para a página inicial certa dele!
    return <Navigate to={role === 'COORDENADOR' ? '/disciplinas' : '/'} replace />;
  }

  //se passou por essas barreiras, renderiza a tela com um Fragment (compatibilidade com o ReactNode)
  return <>{children}</>;
};