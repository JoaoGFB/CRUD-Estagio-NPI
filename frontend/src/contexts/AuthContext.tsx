import { createContext, useState, type ReactNode } from 'react';

interface AuthContextData {
  signed: boolean;
  role: string | null;
  userId: number | null; 
  login: (token: string) => void;
  logout: () => void;
}

//extrai a role e o id
const decodificarToken = (jwtToken: string) => {
  try {
    if (!jwtToken || !jwtToken.includes('.')) return { role: null, id: null };

    const base64Url = jwtToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    return { 
      role: payload.role || null, 
      id: payload.id || null 
    };
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return { role: null, id: null };
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('@NPI_Token'));
  
  const [role, setRole] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('@NPI_Token');
    return storedToken ? decodificarToken(storedToken).role : null;
  });

  //estado para guardar o id do usuário
  const [userId, setUserId] = useState<number | null>(() => {
    const storedToken = localStorage.getItem('@NPI_Token');
    return storedToken ? decodificarToken(storedToken).id : null;
  });

  const login = (newToken: string) => {
    localStorage.setItem('@NPI_Token', newToken);
    setToken(newToken);
    const decoded = decodificarToken(newToken);
    setRole(decoded.role);
    setUserId(decoded.id); //salva o id no login
  };

  const logout = () => {
    localStorage.removeItem('@NPI_Token');
    setToken(null);
    setRole(null);
    setUserId(null); //limpa o id no logout
  };

  return (
    //passa o userid ara os outros componentes
    <AuthContext.Provider value={{ signed: !!token, role, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};