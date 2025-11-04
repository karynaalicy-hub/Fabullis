import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserSubscription } from '../types';
import { authAPI, storeAPI } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  activeSubscription: UserSubscription | null;
  hasActiveSubscription: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (nome_usuario: string, email: string, password: string, role?: string) => Promise<User>;
  refreshSubscription: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSubscription = async () => {
    if (currentUser) {
      try {
        const data = await storeAPI.checkSubscription();
        if (data.hasActiveSubscription && data.subscription) {
          setActiveSubscription(data.subscription);
        } else {
          setActiveSubscription(null);
        }
      } catch (error) {
        console.error('Erro ao verificar assinatura:', error);
        setActiveSubscription(null);
      }
    }
  };

  const loadCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await authAPI.getMe();
      setCurrentUser(data);
      
      // Verificar assinatura
      if (data.hasActiveSubscription !== undefined) {
        // O backend já retorna se tem assinatura ativa
        if (!data.hasActiveSubscription) {
          setActiveSubscription(null);
        } else {
          // Buscar detalhes da assinatura
          await refreshSubscription();
        }
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      localStorage.removeItem('token');
      setCurrentUser(null);
      setActiveSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const data = await authAPI.login(email, password);
      setCurrentUser(data.user);
      
      // Verificar assinatura após login
      await refreshSubscription();
      
      return data.user;
    } catch (error: any) {
      throw new Error(error.message || 'Email ou senha inválidos.');
    }
  };

  const register = async (nome_usuario: string, email: string, password: string, role: string = 'user'): Promise<User> => {
    try {
      const data = await authAPI.register(nome_usuario, email, password, role);
      setCurrentUser(data.user);
      return data.user;
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao criar conta.');
    }
  };

  const logout = () => {
    authAPI.logout();
    setCurrentUser(null);
    setActiveSubscription(null);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    activeSubscription,
    hasActiveSubscription: !!activeSubscription,
    login,
    logout,
    register,
    refreshSubscription,
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Carregando...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
