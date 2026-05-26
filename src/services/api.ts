import axios from 'axios';

// Cria a instância do Axios apontando para a porta onde o backend está rodando
export const api = axios.create({
  baseURL: 'http://localhost:3333/api',
});

// Interceptor de Requisição
api.interceptors.request.use(
  (config) => {
    // Busca o token salvo no Local Storage
    const token = localStorage.getItem('@HelpDesk:token');

    // Se existir token, injeta no header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);