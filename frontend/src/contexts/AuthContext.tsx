import { createContext, useState, type ReactNode } from 'react';

interface AuthContextData {
  signed: boolean; // true se estiver logado
  login: (token: string) => void;
  logout: () => void;
}

//eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  //lê ocalStorage na criação.
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('@NPI_Token');
  });

  //salva o token quando o usuário faz login com sucesso
  const login = (newToken: string) => {
    localStorage.setItem('@NPI_Token', newToken);
    setToken(newToken);
  };

  //limpa tudo quando o usuário sai do sistema
  const logout = () => {
    localStorage.removeItem('@NPI_Token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};