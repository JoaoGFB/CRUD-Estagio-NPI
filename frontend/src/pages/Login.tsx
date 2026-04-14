import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../service/api';
import { AuthContext } from '../contexts/AuthContext';

//formato dos dados
interface LoginForm {
  login: string;
  senha: string;
}

export const Login = () => {
  const { login } = useContext(AuthContext);
  
  //controle de estado (mostra na tela caso a senha esteja errada)
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  //quando o usuário clica em "Entrar"
  const onSubmit = async (data: LoginForm) => {
    try {
      setErrorMsg(''); //limpa erros anteriores
      
      const response = await api.post('/auth/login', data);
      
      //pega o token da resposta e salva no contexto
      if (response.data.token) {
        login(response.data.token);
      }
    } catch (error) {
      setErrorMsg('Credenciais inválidas. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Sistema de Reserva de Salas</h2>
        
        {/*mensagem de erro caso o spring boot recuse o login*/}
        {errorMsg && <p style={{ color: 'red', textAlign: 'center' }}>{errorMsg}</p>}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>E-mail (Login)</label>
          <input 
            type="email" 
            {...register('login', { required: 'O e-mail é obrigatório' })}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          {errors.login && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.login.message}</span>}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Senha</label>
          <input 
            type="password" 
            {...register('senha', { required: 'A senha é obrigatória' })}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          {errors.senha && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.senha.message}</span>}
        </div>

        <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
    </div>
  );
};