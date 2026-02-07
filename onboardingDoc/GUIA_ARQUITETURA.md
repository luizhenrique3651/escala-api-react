# 🎓 Guia de Arquitetura - Frontend React
## Um manual senior para dev backend Java

---

## 📌 TL;DR - O Essencial

Este é um **frontend React moderno** que:
- ✅ Autentica usuários via JWT com seu backend Java
- ✅ Gerencia escalas de voluntários para o projeto "Crescer & Aprender"
- ✅ Usa TypeScript (tipo/segurança de tipos)
- ✅ Tem UI linda com Tailwind CSS + componentes shadcn/ui
- ✅ Faz requisições HTTP com Axios (tipo fetch do JavaScript)
- ✅ Gerencia cache de dados com React Query
- ✅ Roda em `http://localhost:5173` (dev) ou `http://localhost:8080` (build)

---

## 🏗️ Arquitetura - Camadas

```
┌─────────────────────────────────────────────────────────┐
│                    CAMADA UI (React)                    │
│  (Login, Dashboard, Voluntários, Escalas)               │
│  🧩 Componentes reutilizáveis + shadcn/ui               │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  CAMADA DE LÓGICA                       │
│  • Hooks (useVoluntarios, useEscalas)                  │
│  • Contexts (AuthContext para autenticação)            │
│  • React Query (cache e sincronização)                 │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│               CAMADA DE API (lib/api.ts)                │
│  • Configuração Axios (HTTP client)                    │
│  • Interceptadores (JWT, tratamento de erros)          │
│  • Funções wrapper (login, CRUD de voluntários)        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│            SEU BACKEND JAVA (localhost:8080)            │
│  • API REST: /auth/login, /crescer-aprender/*          │
│  • Autentica com JWT                                   │
│  • Banco de dados (voluntários, escalas)               │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 Estrutura de Pastas Explicada

### `/src`
```
src/
├── main.tsx              ← Ponto de entrada (chama React no HTML)
├── App.tsx               ← Roteamento (quais páginas existem)
├── index.css             ← Estilos globais (Tailwind)
├── App.css               ← Estilos específicos da app
│
├── pages/                ← Páginas completas (telas da app)
│   ├── Login.tsx         ← Tela de login
│   ├── Dashboard.tsx     ← Tela inicial (após login)
│   ├── Voluntarios.tsx   ← Gerenciar voluntários
│   ├── Escalas.tsx       ← Gerenciar escalas
│   └── NotFound.tsx      ← Página 404
│
├── components/           ← Componentes reutilizáveis
│   ├── layout/
│   │   ├── ProtectedLayout.tsx  ← Wrapper que verifica autenticação
│   │   └── AppSidebar.tsx       ← Menu lateral da app
│   ├── ui/               ← Componentes visuais (buttons, inputs, etc)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ... (50+ componentes)
│   └── NavLink.tsx       ← Link de navegação customizado
│
├── contexts/             ← Estado global (tipo service em Java)
│   └── AuthContext.tsx   ← Gerencia login, logout, JWT
│
├── hooks/                ← Lógica reutilizável (tipo utils em Java)
│   ├── useVoluntarios.ts ← Requisições de voluntários (GET, POST, PUT, DELETE)
│   ├── useEscalas.ts     ← Requisições de escalas
│   ├── use-toast.ts      ← Mostrar notificações
│   └── use-mobile.tsx    ← Detectar se é mobile
│
└── lib/                  ← Configurações e utilidades
    ├── api.ts            ← CONFIGURAÇÃO AXIOS + TIPOS (IMPORTANTE!)
    └── utils.ts          ← Funções helper
```

---

## 🔑 Conceitos Principais (Mapeados do Java)

### 1️⃣ **React Component = Uma Tela/Componente Visual**

**Java:**
```java
// Um servlet ou controller que retorna HTML
@GetMapping("/login")
public String login(Model model) {
    return "login";
}
```

**React:**
```typescript
// Um componente que retorna JSX (HTML + JS)
export default function Login() {
    return (
        <div className="login-container">
            <h1>Login</h1>
        </div>
    );
}
```

### 2️⃣ **useState = Variável de Instância**

**Java:**
```java
public class Login {
    private String email;
    private String password;
    
    public void setEmail(String email) {
        this.email = email;
    }
}
```

**React:**
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

// Usar:
setEmail('novo@email.com'); // Atualiza estado e re-renderiza
```

### 3️⃣ **useEffect = Ciclo de vida (@PostConstruct, etc)**

**Java:**
```java
@PostConstruct
public void init() {
    // Executado quando a classe é criada
    this.carregarVoluntarios();
}
```

**React:**
```typescript
useEffect(() => {
    // Executado quando o componente monta na tela
    carregarVoluntarios();
}, []); // [] = executar apenas uma vez (no mount)
```

### 4️⃣ **Context = Injeção de Dependência Global**

**Java (Spring):**
```java
@Autowired
private AuthService authService; // Acessível em qualquer Bean

public User login(String email, String password) {
    return authService.login(email, password);
}
```

**React:**
```typescript
// AuthContext.tsx - define o estado global
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
}

// Qualquer componente pode acessar:
const { user } = useAuth(); // useAuth = useContext
```

### 5️⃣ **Axios = RestTemplate do Java**

**Java:**
```java
// Spring RestTemplate
ResponseEntity<User> response = restTemplate.postForEntity(
    "http://localhost:8080/auth/login",
    new LoginRequest(email, password),
    User.class
);
```

**React (Axios):**
```typescript
const response = await axios.post('http://localhost:8080/auth/login', {
    email,
    password
});
```

### 6️⃣ **React Query = Cache Manager inteligente**

**Sem React Query (manual):**
```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    fetch('/api/voluntarios')
        .then(r => r.json())
        .then(data => {
            setData(data);
            setLoading(false);
        })
        .catch(err => {
            setError(err);
            setLoading(false);
        });
}, []);
```

**Com React Query (automático):**
```typescript
const { data, isLoading, error } = useQuery({
    queryKey: ['voluntarios'],
    queryFn: () => api.get('/voluntarios')
});
```

React Query também:
- Cache automático
- Retry automático
- Sincronização entre abas
- Garbage collection

---

## 🔐 Fluxo de Autenticação (Importante!)

```
┌──────────────────────────────────────────────────────────┐
│ 1. Usuário acessa login.tsx                              │
│    • Digita email e password                             │
└─────────────────┬──────────────────────────────────────┘
                  │
┌─────────────────▼──────────────────────────────────────┐
│ 2. onClick → handleSubmit → useAuth().login(email, pwd) │
└─────────────────┬──────────────────────────────────────┘
                  │
┌─────────────────▼──────────────────────────────────────┐
│ 3. api.post('/auth/login', {email, senha})             │
│    • Vai para AuthContext.tsx                          │
│    • Chama authApi.login() do lib/api.ts               │
└─────────────────┬──────────────────────────────────────┘
                  │
┌─────────────────▼──────────────────────────────────────┐
│ 4. Backend Java responde com JWT Token                 │
│    Response: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ..." │
└─────────────────┬──────────────────────────────────────┘
                  │
┌─────────────────▼──────────────────────────────────────┐
│ 5. React salva em localStorage (armazenamento local)    │
│    localStorage.setItem('auth_token', token)           │
│    localStorage.setItem('user', JSON.stringify(user))   │
└─────────────────┬──────────────────────────────────────┘
                  │
┌─────────────────▼──────────────────────────────────────┐
│ 6. Redireciona para /dashboard                          │
│    ProtectedLayout verifica: isAuthenticated = true ✓   │
└──────────────────────────────────────────────────────────┘

PRÓXIMAS REQUISIÇÕES:
┌──────────────────────────────────────────────────────────┐
│ axios interceptor (no lib/api.ts) adiciona:              │
│ Headers: {                                               │
│   'Authorization': 'Bearer {token}'                     │
│ }                                                        │
│                                                          │
│ Backend valida o token JWT e permite acesso ✓           │
└──────────────────────────────────────────────────────────┘
```

---

## 🎯 Arquivo Crítico: `/src/lib/api.ts`

Este arquivo é **sua ponte com o backend Java**. É o equivalente a um `ApiClient.java` ou `RestTemplateConfig.java`.

```typescript
// 1. CONFIGURAÇÃO AXIOS
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. INTERCEPTADOR DE REQUEST (Adiciona JWT automaticamente)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. INTERCEPTADOR DE RESPONSE (Trata erros 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirou → volta pro login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 4. TIPOS (tipo interface/record em Java)
export interface Voluntario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  disponibilidade?: string[];
  ativo: boolean;
}

// 5. FUNÇÕES WRAPPER (tipo Dao.java ou Repository)
export const voluntariosApi = {
  listar: async (): Promise<Voluntario[]> => {
    const response = await api.get('/crescer-aprender/voluntarios');
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
```

**Comparação com Java:**
```java
// Java equivalent
@Service
public class VoluntarioService {
    @Autowired
    private RestTemplate restTemplate;
    
    public List<Voluntario> listar() {
        return restTemplate.getForObject("http://localhost:8080/crescer-aprender/voluntarios", List.class);
    }
    
    public Voluntario criar(Voluntario v) {
        return restTemplate.postForObject("http://localhost:8080/crescer-aprender/voluntarios", v, Voluntario.class);
    }
}
```

---

## 🪝 Hooks: Lógica Reutilizável

Um **Hook** é uma função que encapsula lógica de React. É como uma `Util` ou `Service` em Java.

### Exemplo: `useVoluntarios.ts`

```typescript
// É literalmente um objeto com funções de CRUD
// Integrado com React Query para cache automático

export function useVoluntarios() {
  return useQuery({
    queryKey: ['voluntarios'],  // Chave do cache
    queryFn: voluntariosApi.listar,  // Função que busca dados
  });
}

export function useCriarVoluntario() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (voluntario: VoluntarioCreate) => 
      voluntariosApi.criar(voluntario),
    onSuccess: () => {
      // Após sucesso, atualiza o cache
      queryClient.invalidateQueries({ queryKey: ['voluntarios'] });
      toast({ title: 'Sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro', variant: 'destructive' });
    },
  });
}
```

**Como usar em um componente:**

```typescript
export function VoluntariosPage() {
  // Hook retorna: data, isLoading, error
  const { data: voluntarios, isLoading } = useVoluntarios();
  
  // Hook retorna: mutate function
  const { mutate: criar } = useCriarVoluntario();
  
  if (isLoading) return <div>Carregando...</div>;
  
  return (
    <div>
      {voluntarios.map(v => <VoluntarioCard key={v.id} {...v} />)}
      <button onClick={() => criar({ nome: 'João', email: 'joao@email.com' })}>
        Criar
      </button>
    </div>
  );
}
```

**Equivalente em Java (Spring):**
```java
@Service
public class VoluntarioService {
    @Autowired
    private VoluntarioRepository repo;
    
    public List<Voluntario> listar() {
        return repo.findAll(); // Sim, é literalmente isso!
    }
    
    public Voluntario criar(Voluntario v) {
        return repo.save(v);
    }
}
```

---

## 🎨 Tailwind CSS + shadcn/ui

### Tailwind = Utility-First CSS

**Bootstrap (que você conhece):**
```html
<div class="container mt-5 p-3">
    <button class="btn btn-primary">Clique</button>
</div>
```

**Tailwind (novo):**
```jsx
<div className="container mt-5 p-3">
    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Clique
    </button>
</div>
```

**Vantagens:**
- Sem CSS separado
- Customização rápida (mude no className)
- Tamanho final pequeno (tree-shaking)

**shadcn/ui** = Componentes pre-feitos em Tailwind
- Botão, Card, Input, Dialog, etc
- Todos em `/src/components/ui/`
- Copie, customize, use!

---

## 🏃 Como Executar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (http://localhost:5173)
npm run dev

# Ou rodar na porta 8080 (como está configurado em vite.config.ts)
npm run dev -- --port 8080

# Build para produção
npm run build

# Testes
npm test

# Lint (verifica erros)
npm run lint
```

---

## 🔗 Fluxo Típico: Criar um Novo Voluntário

**Passo 1: Usuário clica em "Novo Voluntário"**
```typescript
// Em Voluntarios.tsx
<button onClick={() => setOpen(true)}>+ Novo Voluntário</button>
```

**Passo 2: Dialog abre com formulário**
```typescript
<Dialog open={open} onOpenChange={setOpen}>
  <Form onSubmit={handleSubmit}>
    <Input value={nome} onChange={(e) => setNome(e.target.value)} />
    <Button type="submit">Criar</Button>
  </Form>
</Dialog>
```

**Passo 3: Chama o hook de mutação**
```typescript
const { mutate: criar } = useCriarVoluntario();

const handleSubmit = (e) => {
  criar({ nome, email, telefone });
};
```

**Passo 4: Hook faz requisição HTTP**
```typescript
// Em useVoluntarios.ts
mutationFn: (voluntario) => 
  voluntariosApi.criar(voluntario)
```

**Passo 5: Axios envia ao backend**
```typescript
// Em lib/api.ts
api.post('/crescer-aprender/voluntarios', voluntario)
// Adiciona automaticamente: Authorization: Bearer {token}
```

**Passo 6: Backend Java processa**
```java
@PostMapping("/crescer-aprender/voluntarios")
public ResponseEntity<Voluntario> criar(@RequestBody VoluntarioCreate dto) {
    Voluntario v = new Voluntario(dto.getNome(), dto.getEmail());
    return ResponseEntity.ok(voluntarioRepository.save(v));
}
```

**Passo 7: React atualiza a tela**
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['voluntarios'] });
  // React Query refaz a requisição GET automaticamente
  // A tela atualiza com o novo voluntário
}
```

---

## ⚠️ Armadilhas Comuns

### 1. "Meu backend rodando em HTTP não funciona na HTTPS"
**Problema:** Navegadores bloqueiam requisições HTTP de páginas HTTPS (Mixed Content)
**Solução:** Rode o frontend em HTTP também (`localhost:5173` ✓)

### 2. "Recebo erro 401 em requisições"
**Problema:** Token não está sendo enviado
**Solução:** Verifique se o token está em `localStorage.auth_token` e se o interceptor está adicionando o header

### 3. "Preciso mudar a URL da API"
**Solução:** Mude em `/src/lib/api.ts` linha 3:
```typescript
const API_BASE_URL = 'http://localhost:8080'; // ← aqui
```

### 4. "Como sei que o TypeScript é correto?"
```bash
npm run lint  # Verifica erros de tipo
```

---

## 📚 Próximos Passos para Aprender

1. **React Basics:**
   - Components, JSX, props, state
   - Hooks: useState, useEffect, useContext

2. **TypeScript:**
   - Interfaces, types, generics
   - Type checking (faz diferença GRANDE!)

3. **React Query:**
   - useQuery, useMutation
   - Cache invalidation
   - Polling, refetching

4. **Tailwind CSS:**
   - Utility classes
   - Responsive design (md:, lg:)
   - Dark mode

5. **Testing:**
   - Vitest, React Testing Library
   - Testes unitários e integração

---

## 🤝 Comparação Rápida: Java vs React

| Conceito | Java | React |
|----------|------|-------|
| Ponto de entrada | `main()` | `main.tsx` + `createRoot()` |
| Classe | `class Foo {}` | `function Foo() {}` |
| Dependências | `@Autowired` | `useContext`, props |
| Estado | Variáveis de instância | `useState()` |
| Ciclo de vida | `@PostConstruct`, `@PreDestroy` | `useEffect()` |
| Chamada HTTP | `RestTemplate` | `axios` |
| Tratamento de erros | `try/catch` | `.catch()` ou `onError()` |
| Cache | `@Cacheable` | `React Query` |
| Validação | `@Valid`, `Validator` | `useForm` + `zod` |

---

## 📞 Checklist: Tudo Funcionando?

- [ ] `npm install` rodou sem erros?
- [ ] `npm run dev` abre em `localhost:5173`?
- [ ] Backend Java rodando em `localhost:8080`?
- [ ] Backend tem CORS configurado?
- [ ] Consegue fazer login?
- [ ] Página protegida carrega após login?
- [ ] `npm run lint` passa sem erros?

---

## 🎓 Dicas Finais

1. **Leia o código da esquerda para a direita:**
   - Página (`pages/`)
   - Hook (`hooks/`)
   - API (`lib/api.ts`)
   - Backend (seu Java)

2. **Desenvolva com DevTools:**
   - F12 → Network: veja requisições HTTP
   - F12 → Storage → localStorage: veja token
   - React DevTools extensão: veja estado dos componentes

3. **Console logs são seus amigos:**
   ```typescript
   console.log('valor:', data);
   ```

4. **TypeScript é seu protetor:**
   - Se piscar vermelho, há bug
   - Nunca ignore erros TypeScript!

5. **Tailwind é rápido:**
   - Brinca com className enquanto desenvolve
   - Resultado em tempo real!

---

## 📖 Recursos Externos

- React Docs: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs/
- Tailwind CSS: https://tailwindcss.com/docs
- React Query: https://tanstack.com/query/latest
- Axios: https://axios-http.com/

---

**Boa sorte! 🚀 Qualquer dúvida, é só chamar!**

