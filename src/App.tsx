import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { Tickets } from './pages/Tickets';  
import { Services } from './pages/Services';
import { Techs } from './pages/Techs';
import { Register } from './pages/Register';
import { Clients } from './pages/Clients';

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
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rotas Privadas (Envolvidas pelo Layout) */}
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            {/* O "index" significa que esta é a rota padrão "/" dentro do Layout */}
            <Route index element={<Tickets />} />
            
            {/* Outras rotas internas */}
            <Route path="tecnicos" element={<Techs /> } />
            <Route path="clientes" element={<Clients />} />
            <Route path="servicos" element={<Services />} />
          </Route>
          
          {/* Redireciona qualquer rota inválida para a raiz */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}