import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../service/api';
import { AuthContext } from '../contexts/AuthContext';

//definir a interface para tipar os dados do formulário e remover o 'any'
interface LoginForm {
  login: string;
  senha: string;
}

export const Login = () => {
  const { login } = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { register, handleSubmit } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await api.post('/auth/login', data);
      if (response.data.token) login(response.data.token);
    } catch (error: unknown) { 
      console.error('Erro na tentativa de login:', error);
      setErrorMsg('Acesso negado. Verifique os dados.');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ 
            width: '60px', height: '60px', background: 'var(--orange-glossy)', 
            borderRadius: '20px', margin: '0 auto 1.5rem', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(251, 146, 60, 0.3)' 
          }}>
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#431407' }}>Reserva de Salas</h2>
          <span style={{ color: '#f97316', fontWeight: 800 }}>NÚCLEO DE PRÁTICAS EM INFORMÁTICA</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {errorMsg && <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600 }}>{errorMsg}</div>}
          
          <div className="input-group">
            <label style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>E-mail institucional</label>
            <input type="email" className="aero-input" placeholder="usuario@unifil.br" {...register('login')} />
          </div>

          <div className="input-group">
            <label style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>Chave de Acesso</label>
            <input type="password" className="aero-input" placeholder="••••••••" {...register('senha')} />
          </div>

          <button type="submit" className="btn-bubble btn-orange" style={{ padding: '1.2rem', marginTop: '1rem' }}>Acessar Sistema</button>
        </form>
      </div>
    </div>
  );
};