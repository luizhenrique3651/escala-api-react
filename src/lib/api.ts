import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tipos
export interface LoginCredentials {
  email: string;
  senha: string;
}

// Função helper para extrair data com fallback
// Prioridade: dias (objeto) → datas (array) → data (string)
export function extrairDataEscala(escala: Escala): string | null {
  // Estratégia 1: Se tem 'dias' (objeto com chaves de data), extrai dela (PRIORIDADE)
  if (escala.dias && typeof escala.dias === 'object' && Object.keys(escala.dias).length > 0) {
    const datasDosDias = Object.keys(escala.dias).filter(
      (key) => !isNaN(Date.parse(key)) // Verifica se é uma data válida
    );

    if (datasDosDias.length > 0) {
      return datasDosDias[0]; // Retorna a primeira data encontrada
    }
  }

  // Estratégia 2: Se tem 'datas' (array de strings), usa a primeira
  if (escala.datas && Array.isArray(escala.datas) && escala.datas.length > 0) {
    return escala.datas[0];
  }

  // Estratégia 3: Se tem 'data' (string), usa ela como fallback
  if (escala.data) {
    return escala.data;
  }

  // Se não encontrar nada, retorna null
  return null;
}

export interface LoginResponse {
  voluntarioId: number;
  email: string;
  nome: string;
  datasDisponiveis: string[];
  role: string;
  token: string;
}

export interface Voluntario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  disponibilidade?: string[];
  ativo: boolean;
}

export interface UsuarioCreate {
  email: string;
  senha: string;
  role: string;
}

export interface VoluntarioCreate {
  nome: string;
  usuario: UsuarioCreate;
  datasDisponiveis?: string[];
}

export interface Escala {
  id: number;
  data?: string;  // String com data única
  datas?: string[];  // Array de strings com datas (NOVO)
  dias?: Record<string, unknown>;  // Objeto com dias (estrutura do backend)
  voluntarios: Voluntario[];
}

export interface EscalaCreate {
  data: string;
  voluntariosIds: number[];
}

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

// Voluntários API
export const voluntariosApi = {
  listar: async (): Promise<Voluntario[]> => {
    const response = await api.get('/crescer-aprender/voluntarios');
    return response.data;
  },
  
  buscarPorId: async (id: number): Promise<Voluntario> => {
    const response = await api.get(`/crescer-aprender/voluntarios/${id}`);
    return response.data;
  },
  
  criar: async (voluntario: VoluntarioCreate): Promise<Voluntario> => {
    const response = await api.post('/crescer-aprender/voluntarios', voluntario);
    return response.data;
  },
  
  atualizar: async (id: number, voluntario: VoluntarioCreate): Promise<Voluntario> => {
    const response = await api.put(`/crescer-aprender/voluntarios/${id}`, voluntario);
    return response.data;
  },
  
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/crescer-aprender/voluntarios/${id}`);
  },
};

// Escalas API
export const escalasApi = {
  listar: async (): Promise<Escala[]> => {
    const response = await api.get('/crescer-aprender/escala');
    return response.data;
  },
  
  buscarPorId: async (id: number): Promise<Escala> => {
    const response = await api.get(`/crescer-aprender/escala/byId/${id}`);
    return response.data;
  },
  
  buscarPorData: async (data: string): Promise<Escala> => {
    const response = await api.get(`/crescer-aprender/escala/byDate/${data}`);
    return response.data;
  },
  
  buscarPorMesAnoVoluntario: async (mes: number, ano: number, idVoluntario: number): Promise<Escala[]> => {
    const response = await api.get('/crescer-aprender/escala/buscar-por-mes-ano-voluntario', {
      params: { mes, ano, idVoluntario },
    });
    return response.data;
  },
  
  criar: async (escala: EscalaCreate): Promise<Escala> => {
    const response = await api.post('/crescer-aprender/escala', escala);
    return response.data;
  },
  
  atualizar: async (id: number, escala: EscalaCreate): Promise<Escala> => {
    const response = await api.put(`/crescer-aprender/escala/${id}`, escala);
    return response.data;
  },
  
  deletar: async (id: number): Promise<void> => {
    await api.delete(`/crescer-aprender/escala/${id}`);
  },
};
