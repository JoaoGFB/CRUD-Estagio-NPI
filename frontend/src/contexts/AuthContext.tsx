import { createContext, useState, type ReactNode } from 'react';

interface AuthContextData {
  signed: boolean;
  role: string | null; //GESTOR ou COORDENADOR
  login: (token: string) => void;
  logout: () => void;
}

//a função fica fora do componente
const decodificarRoleDoToken = (jwtToken: string): string | null => {
  try {
    if (!jwtToken || !jwtToken.includes('.')) return null;

    const base64Url = jwtToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    return payload.role || null;
  } catch (error) {
    console.error("Erro ao decodificar token JWT:", error);
    return null;
  }
};

//erro de fast refresh (Vite)
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  //lê o token quando inicia
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('@NPI_Token'));
  
  //calcula a Role na inicialização do estado
  const [role, setRole] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('@NPI_Token');
    return storedToken ? decodificarRoleDoToken(storedToken) : null;
  });

  const login = (newToken: string) => {
    localStorage.setItem('@NPI_Token', newToken);
    setToken(newToken);
    
    //atualiza a role na hora do login
    const userRole = decodificarRoleDoToken(newToken);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem('@NPI_Token');
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};