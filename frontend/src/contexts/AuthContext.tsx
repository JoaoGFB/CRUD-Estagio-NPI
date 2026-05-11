import { createContext, useState, type ReactNode } from 'react';

interface AuthContextData {
  signed: boolean;
  role: string | null;
  userId: number | null; 
  curso: string | null;
  campus: string | null;
  nome: string | null;
  email: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const decodificarToken = (jwtToken: string) => {
  try {
    if (!jwtToken || !jwtToken.includes('.')) return { role: null, id: null, curso: null, campus: null, nome: null, email: null };

    const base64Url = jwtToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );

    const payload = JSON.parse(jsonPayload);
    return { 
      role: payload.role || null, 
      id: payload.id || null,
      curso: payload.curso || null,
      campus: payload.campus || null,
      nome: payload.nome || null,
      email: payload.sub || null  //o subject (email) nativo do JWT
    };
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return { role: null, id: null, curso: null, campus: null, nome: null, email: null };
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('@NPI_Token'));
  
  const tokenData = token ? decodificarToken(token) : { role: null, id: null, curso: null, campus: null, nome: null, email: null };
  
  const [role, setRole] = useState<string | null>(tokenData.role);
  const [userId, setUserId] = useState<number | null>(tokenData.id);
  const [curso, setCurso] = useState<string | null>(tokenData.curso); 
  const [campus, setCampus] = useState<string | null>(tokenData.campus); 
  const [nome, setNome] = useState<string | null>(tokenData.nome);
  const [email, setEmail] = useState<string | null>(tokenData.email);

  const login = (newToken: string) => {
    localStorage.setItem('@NPI_Token', newToken);
    setToken(newToken);
    const decoded = decodificarToken(newToken);
    
    setRole(decoded.role);
    setUserId(decoded.id); 
    setCurso(decoded.curso); 
    setCampus(decoded.campus); 
    setNome(decoded.nome);
    setEmail(decoded.email);
  };

  const logout = () => {
    localStorage.removeItem('@NPI_Token');
    setToken(null);
    setRole(null);
    setUserId(null); 
    setCurso(null); 
    setCampus(null); 
    setNome(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!token, role, userId, curso, campus, nome, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};