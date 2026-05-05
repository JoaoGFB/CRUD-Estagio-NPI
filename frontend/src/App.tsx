import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { Salas } from './pages/Salas';
import { NovaSala } from './pages/NovaSala';
import { Tags } from './pages/Tags';
import { Disciplinas } from './pages/Disciplinas';

//import da guarda de rotas
import { PrivateRoute } from './components/PrivateRoute';

const RoutesConfig = () => {
  //extração da role do contexto para fazer o redirecionamento no login
  const { signed, role } = useContext(AuthContext);

  return (
    <Routes>
      {/*se já estiver logado, joga para a tela inicial correta do seu cargo */}
      <Route 
        path="/login" 
        element={signed ? <Navigate to={role === 'COORDENADOR' ? '/disciplinas' : '/'} /> : <Login />} 
      />
      
     
      {/*ROTAS EXCLUSIVAS DO GESTOR*/}
      <Route 
        path="/" 
        element={
          <PrivateRoute rolesRequeridos={['GESTOR']}>
            <Layout><Salas /></Layout>
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/salas/nova" 
        element={
          <PrivateRoute rolesRequeridos={['GESTOR']}>
            <Layout><NovaSala /></Layout>
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/salas/editar/:id" 
        element={
          <PrivateRoute rolesRequeridos={['GESTOR']}>
            <Layout><NovaSala /></Layout>
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/tags" 
        element={
          <PrivateRoute rolesRequeridos={['GESTOR']}>
            <Layout><Tags /></Layout>
          </PrivateRoute>
        } 
      />
      
      
      {/* ROTAS COMPARTILHADAS (GESTOR E COORDENADOR) */}
      <Route
        path="/disciplinas"
        element={
          <PrivateRoute rolesRequeridos={['GESTOR', 'COORDENADOR']}>
            <Layout><Disciplinas /></Layout>
          </PrivateRoute>
        }
      />
      
      {/*em caso de uma url errada, joga pro início, e o PrivateRoute assume*/}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoutesConfig />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;