import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    nome_usuario: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLoginView) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.nome_usuario, formData.email, formData.password);
      }
      navigate('/painel-escritor'); // Redirect after successful auth
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setFormData({ nome_usuario: '', email: '', password: '' });
  };
  
  const inputClasses = "appearance-none relative block w-full px-3 py-2 border border-slate-600 bg-background placeholder-text-secondary text-text-primary focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm";


  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
            {isLoginView ? 'Acesse sua conta' : 'Crie uma nova conta'}
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Ou{' '}
            <button onClick={toggleView} className="font-medium text-primary hover:text-primary-hover focus:outline-none">
              {isLoginView ? 'crie uma nova conta' : 'faça login na sua conta'}
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {!isLoginView && (
              <div>
                <label htmlFor="nome_usuario" className="sr-only">Nome de usuário</label>
                <input
                  id="nome_usuario"
                  name="nome_usuario"
                  type="text"
                  autoComplete="username"
                  required
                  className={`${inputClasses} rounded-md`}
                  placeholder="Nome de usuário"
                  value={formData.nome_usuario}
                  onChange={handleInputChange}
                />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`${inputClasses} rounded-md`}
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLoginView ? "current-password" : "new-password"}
                required
                className={`${inputClasses} rounded-md`}
                placeholder="Senha"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {isLoginView && (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-hover">
                  Esqueceu sua senha?
                </a>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-hover disabled:bg-slate-500 disabled:cursor-wait"
            >
              {loading ? 'Carregando...' : (isLoginView ? 'Entrar' : 'Registrar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;