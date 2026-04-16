import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../service/api';
import { AuthContext } from '../contexts/AuthContext';

interface LoginForm {
  login: string;
  senha: string;
}

const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const IconKey = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);

const IconAlert = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

export const Login = () => {
  const { login } = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setErrorMsg('');
      const response = await api.post('/auth/login', data);
      if (response.data.token) {
        login(response.data.token);
      }
    } catch (error) {
      setErrorMsg('Credenciais inválidas. Verifique seus dados e tente novamente.');
      console.error(error);
    }
  };

  return (
    <div className="login-wrapper">
      {/*orbs de fundo */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      <div className="login-card">
        {/*reflexo inferior do card */}
        <div className="login-card-shine" />

        <div className="login-header">
          <div className="login-icon">
            <IconLock />
          </div>
          <h1 className="login-title">Reserva de Salas</h1>
          <p className="login-subtitle">Acesse com suas credenciais institucionais</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          {errorMsg && (
            <div className="error-banner">
              <IconAlert />
              {errorMsg}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <IconMail />
              E-mail
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="seu@email.institucional"
              {...register('login', { required: 'O e-mail é obrigatório' })}
            />
            {errors.login && (
              <span className="form-error">
                <IconAlert />
                {errors.login.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <IconKey />
              Senha
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              {...register('senha', { required: 'A senha é obrigatória' })}
            />
            {errors.senha && (
              <span className="form-error">
                <IconAlert />
                {errors.senha.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner" style={{ borderWidth: '2px', width: '16px', height: '16px' }} />
                Entrando...
              </>
            ) : (
              'Entrar no Sistema'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
