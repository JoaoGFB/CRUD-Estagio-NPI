import { useContext, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { Salas } from './pages/Salas';
import { NovaSala } from './pages/NovaSala';
import { Tags } from './pages/Tags';

//evita erros de tipagem no children
interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { signed } = useContext(AuthContext);
  
  return signed ? <>{children}</> : <Navigate to="/login" />;
};

const RoutesConfig = () => {
  const { signed } = useContext(AuthContext);

  return (
    <Routes>
      {/*se já estiver logado, não precisa ver a tela de login*/}
      <Route path="/login" element={signed ? <Navigate to="/" /> : <Login />} />
      
      {/*rota protegida*/}
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <Layout>
              <Salas />
            </Layout>
          </PrivateRoute>
        } 
      />
      {/*rota do catálogo */}
      <Route 
        path="/" 
        element={<PrivateRoute><Layout><Salas /></Layout></PrivateRoute>} 
      />
      {/*rota de cadastro de sala*/}
      <Route 
        path="/salas/nova" 
        element={<PrivateRoute><Layout><NovaSala /></Layout></PrivateRoute>} 
      />
      <Route 
        path="/tags" 
        element={<PrivateRoute><Layout><Tags /></Layout></PrivateRoute>} 
      />
      <Route 
        path="/salas/editar/:id" 
        element={<PrivateRoute><Layout><NovaSala /></Layout></PrivateRoute>} 
      />
      
      
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