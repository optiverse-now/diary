'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import Cookies from 'js-cookie';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  signUp?: (name: string, email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      // クッキーから認証情報を復元
      const storedToken = Cookies.get('token');
      const storedUser = Cookies.get('user');
      
      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        // 必要なプロパティが存在することを確認
        if (parsedUser && typeof parsedUser === 'object' && 
            'id' in parsedUser && 'name' in parsedUser && 'email' in parsedUser) {
          setUser(parsedUser);
          setToken(storedToken);
          // クッキーにもトークンを設定
          Cookies.set('token', storedToken, { 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
        } else {
          // 無効なデータの場合は認証情報をクリア
          clearAuth();
        }
      }
    } catch (error) {
      // JSON解析エラーが発生した場合は認証情報をクリア
      console.error('Failed to parse stored user data:', error);
      clearAuth();
    }
  }, []);

  const setAuth = (user: User, token: string) => {
    try {
      setUser(user);
      setToken(token);
      // クッキーに保存
      Cookies.set('token', token, { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      Cookies.set('user', JSON.stringify(user), { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    } catch (error) {
      console.error('Failed to store auth data:', error);
      clearAuth();
    }
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    // クッキーから削除
    Cookies.remove('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}; 