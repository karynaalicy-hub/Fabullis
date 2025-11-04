import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User as AuthUser } from '@supabase/supabase-js';
import { supabase } from '../src/lib/supabase';
import { User, UserSubscription } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  activeSubscription: UserSubscription | null;
  hasActiveSubscription: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  register: (nome_usuario: string, email: string, password: string, role?: string) => Promise<User>;
  refreshSubscription: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  // Buscar dados do usuário no banco
  const fetchUserData = async (authUser: AuthUser): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        return null;
      }

      return data as User;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  };

  // Verificar assinatura ativa
  const refreshSubscription = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', currentUser.id)
        .gte('end_date', new Date().toISOString())
        .order('end_date', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        setActiveSubscription(null);
        return;
      }

      setActiveSubscription(data as any);
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      setActiveSubscription(null);
    }
  };

  // Carregar sessão do usuário
  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userData = await fetchUserData(session.user);
          if (userData) {
            setCurrentUser(userData);
            // Verificar assinatura após carregar usuário
            const { data: subscription } = await supabase
              .from('user_subscriptions')
              .select(`
                *,
                subscription_plans (*)
              `)
              .eq('user_id', userData.id)
              .gte('end_date', new Date().toISOString())
              .order('end_date', { ascending: false })
              .limit(1)
              .single();
            
            if (subscription) {
              setActiveSubscription(subscription as any);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userData = await fetchUserData(session.user);
        if (userData) {
          setCurrentUser(userData);
          // Verificar assinatura
          const { data: sub } = await supabase
            .from('user_subscriptions')
            .select(`
              *,
              subscription_plans (*)
            `)
            .eq('user_id', userData.id)
            .gte('end_date', new Date().toISOString())
            .order('end_date', { ascending: false })
            .limit(1)
            .single();
          
          if (sub) {
            setActiveSubscription(sub as any);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setActiveSubscription(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('Erro ao fazer login');
      }

      const userData = await fetchUserData(data.user);
      if (!userData) {
        throw new Error('Usuário não encontrado no banco de dados');
      }

      setCurrentUser(userData);
      await refreshSubscription();
      
      return userData;
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.message || 'Email ou senha inválidos.');
    }
  };

  const register = async (nome_usuario: string, email: string, password: string, role: string = 'user'): Promise<User> => {
    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Erro ao criar conta');
      }

      // 2. Criar registro na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          nome_usuario,
          email,
          role: role as 'user' | 'author' | 'admin',
        })
        .select()
        .single();

      if (userError) {
        // Se falhar ao criar usuário, deletar da auth
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw userError;
      }

      setCurrentUser(userData as User);
      return userData as User;
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw new Error(error.message || 'Erro ao criar conta.');
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setActiveSubscription(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
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
    loading,
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
