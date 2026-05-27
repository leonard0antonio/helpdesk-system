import { createContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../services/api';
import { jwtDecode } from 'jwt-decode';

// Tipagem dos dados do usuário
interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TECH' | 'CLIENT';
  profileImage?: string;
}

// Tipagem das credenciais de login
interface LoginCredentials {
  email: string;
  password: string;
}

// Tipagem do que o Contexto vai exportar
interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean; // 👇 1. Adicionado à tipagem
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => void;
  updateUser: (updatedUser: User) => void;
}

// Criação do Contexto
export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  // 👇 2. Estado de loading inicia como TRUE (bloqueando redirecionamentos apressados)
  const [loading, setLoading] = useState(true); 

  // useEffect roda ao carregar a aplicação para ver se já existe alguém logado no Local Storage
  useEffect(() => {
    const storedToken = localStorage.getItem('@HelpDesk:token');
    const storedUser = localStorage.getItem('@HelpDesk:user');

    if (storedToken && storedUser) {
      // Opcional: Aqui você pode usar o jwtDecode(storedToken) para checar se o token já expirou
      setUser(JSON.parse(storedUser));
    }

    // 👇 3. Avisamos que a verificação do Local Storage terminou!
    setLoading(false);
  }, []);

  async function signIn({ email, password }: LoginCredentials) {
    try {
      const response = await api.post('/login', { email, password });
      
      const { token, user } = response.data;

      // Salva no Local Storage para manter logado após refresh da página
      localStorage.setItem('@HelpDesk:token', token);
      localStorage.setItem('@HelpDesk:user', JSON.stringify(user));

      // Atualiza o estado da aplicação
      setUser(user);
    } catch (error) {
      console.error("Erro no login", error);
      throw error; // Lança o erro para a página de Login mostrar um alerta
    }
  }

  function signOut() {
    localStorage.removeItem('@HelpDesk:token');
    localStorage.removeItem('@HelpDesk:user');
    setUser(null);
  }

  function updateUser(updatedUser: User) {
    setUser(updatedUser);
    localStorage.setItem('@HelpDesk:user', JSON.stringify(updatedUser));
  }

  return (
    // 👇 4. Exportamos o loading no Provider para o App.tsx conseguir ler
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}