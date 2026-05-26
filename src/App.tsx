import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, type JSX } from 'react';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { Tickets } from './pages/Tickets';  
import { Services } from './pages/Services';
import { Techs } from './pages/Techs';
import { Register } from './pages/Register';
import { Clients } from './pages/Clients';
import { Profile } from './pages/Profile';
import { Landing } from './pages/Landing';

// Proteção de Rota
function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ========================================== */}
          {/* ROTAS PÚBLICAS (Fora do sistema)            */}
          {/* ========================================== */}
          
          {/* A Raiz exata do site mostra a Landing Page */}
          <Route path="/" element={<Landing />} />
          
          {/* Rotas de Autenticação */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ========================================== */}
          {/* ROTAS PRIVADAS (Dentro do sistema/Layout)   */}
          {/* ========================================== */}
          
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            {/* Como a raiz "/" agora é a Landing, a tela principal do sistema logado 
                precisa ter o próprio caminho, como "/chamados" */}
            <Route path="/chamados" element={<Tickets />} />
            
            {/* Outras rotas do sistema */}
            <Route path="/servicos" element={<Services />} />
            <Route path="/tecnicos" element={<Techs />} />
            <Route path="/clientes" element={<Clients />} />
            <Route path="/perfil" element={<Profile />} />
          </Route>

          {/* Rota de fallback (Curinga): Se o usuário digitar uma URL que não existe, joga ele para a Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}