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

// Helper: Promise with timeout
const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), ms)
    )
  ]);
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  // Buscar dados do usuário no banco
  const fetchUserData = async (authUser: AuthUser): Promise<User | null> => {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single(),
        5000 // 5 segundos timeout
      );

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
      const { data, error } = await withTimeout(
        supabase
          .from('user_subscriptions')
          .select(`
            *,
            subscription_plans (*)
          `)
          .eq('user_id', currentUser.id)
          .gte('end_date', new Date().toISOString())
          .order('end_date', { ascending: false })
          .limit(1)
          .single(),
        5000
      );

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
        // Timeout de 8 segundos para getSession
        const { data: { session } } = await withTimeout(
          supabase.auth.getSession(),
          8000
        );
        
        if (session?.user) {
          const userData = await fetchUserData(session.user);
          if (userData) {
            setCurrentUser(userData);
            // Verificar assinatura após carregar usuário (não bloqueia se falhar)
            try {
              const { data: subscription } = await withTimeout(
                supabase
                  .from('user_subscriptions')
                  .select(`
                    *,
                    subscription_plans (*)
                  `)
                  .eq('user_id', userData.id)
                  .gte('end_date', new Date().toISOString())
                  .order('end_date', { ascending: false })
                  .limit(1)
                  .single(),
                5000
              );
              
              if (subscription) {
                setActiveSubscription(subscription as any);
              }
            } catch (subError) {
              console.warn('Não foi possível carregar assinatura:', subError);
              // Não bloqueia o app se falhar
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
        // Continua mesmo se falhar - usuário não autenticado
      } finally {
        // SEMPRE libera o loading, mesmo se falhar
        setLoading(false);
      }
    };

    loadSession();

    // Escutar mudanças na autenticação
    let subscription: any;
    try {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userData = await fetchUserData(session.user);
          if (userData) {
            setCurrentUser(userData);
            // Verificar assinatura (não bloqueia se falhar)
            try {
              const { data: sub } = await withTimeout(
                supabase
                  .from('user_subscriptions')
                  .select(`
                    *,
                    subscription_plans (*)
                  `)
                  .eq('user_id', userData.id)
                  .gte('end_date', new Date().toISOString())
                  .order('end_date', { ascending: false })
                  .limit(1)
                  .single(),
                5000
              );
              
              if (sub) {
                setActiveSubscription(sub as any);
              }
            } catch (subError) {
              console.warn('Não foi possível carregar assinatura:', subError);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setActiveSubscription(null);
        }
      });
      subscription = data.subscription;
    } catch (error) {
      console.error('Erro ao configurar listener de auth:', error);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({
          email,
          password,
        }),
        10000
      );

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
      const { data: authData, error: authError } = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
        }),
        10000
      );

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Erro ao criar conta');
      }

      // 2. Criar registro na tabela users
      const { data: userData, error: userError } = await withTimeout(
        supabase
          .from('users')
          .insert({
            id: authData.user.id,
            nome_usuario,
            email,
            role: role as 'user' | 'author' | 'admin',
          })
          .select()
          .single(),
        10000
      );

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
      await withTimeout(supabase.auth.signOut(), 5000);
      setCurrentUser(null);
      setActiveSubscription(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Limpa localmente mesmo se falhar
      setCurrentUser(null);
      setActiveSubscription(null);
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
        <div style={{ 
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ 
            fontSize: '1.5rem',
            marginBottom: '1rem'
          }}>Carregando...</div>
          <div style={{ 
            fontSize: '0.875rem',
            opacity: 0.8
          }}>Conectando ao servidor...</div>
        </div>
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
