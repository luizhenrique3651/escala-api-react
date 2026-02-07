# 🗺️ Mapa Visual da Arquitetura

## Fluxo de Dados - Visão Geral

```
┌─────────────────────────────────────────────────────────────────────┐
│                       APLICAÇÃO REACT                              │
│  (Frontend rodando em http://localhost:5173)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      App.tsx (Roteamento)                    │  │
│  │  ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │  Login Page     │  │  Dashboard   │  │  Voluntários │   │  │
│  │  │  (pública)      │  │  (protegida) │  │  (protegida) │   │  │
│  │  └────────┬────────┘  └──────┬───────┘  └──────┬───────┘   │  │
│  └───────────┼────────────────────┼─────────────────┼──────────┘  │
│              │                    │                 │              │
│  ┌───────────▼────────────────────▼─────────────────▼──────────┐  │
│  │            AuthContext (Estado Global)                      │  │
│  │  - user: { email, token }                                   │  │
│  │  - isAuthenticated: boolean                                 │  │
│  │  - login() / logout()                                       │  │
│  └────────────────────────┬─────────────────────────────────────┘  │
│                           │                                        │
│  ┌────────────────────────▼─────────────────────────────────────┐  │
│  │           Hooks & React Query (Requisições)                  │  │
│  │  ┌──────────────────┐  ┌──────────────────┐                │  │
│  │  │ useVoluntarios() │  │ useCriarVol()    │                │  │
│  │  │  - GET lista     │  │  - POST novo     │                │  │
│  │  │  - useQuery      │  │  - useMutation   │                │  │
│  │  └────────┬─────────┘  └─────────┬────────┘                │  │
│  │           │                      │                         │  │
│  │  ┌────────▼─────────────────────▼──────┐                   │  │
│  │  │   React Query Cache                 │                   │  │
│  │  │  (Armazena dados em memória)        │                   │  │
│  │  └────────┬─────────────────────┬──────┘                   │  │
│  └───────────┼─────────────────────┼───────────────────────────┘  │
│              │                     │                              │
│  ┌───────────▼─────────────────────▼───────────────────────────┐  │
│  │              lib/api.ts (Configuração HTTP)                │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │ axios.create({                                       │  │  │
│  │  │   baseURL: 'http://localhost:8080'                  │  │  │
│  │  │ })                                                   │  │  │
│  │  │                                                      │  │  │
│  │  │ Interceptor Request:                                │  │  │
│  │  │  - Adiciona: Authorization: Bearer {token}          │  │  │
│  │  │                                                      │  │  │
│  │  │ Interceptor Response:                               │  │  │
│  │  │  - Se 401: logout e redireciona /login              │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └────────────────────────┬─────────────────────────────────────┘  │
│                           │                                        │
└───────────────────────────┼────────────────────────────────────────┘
                            │
                ┌───────────▼──────────────┐
                │  HTTP REQUEST/RESPONSE   │
                │  (Axios → Fetch)         │
                └───────────┬──────────────┘
                            │
                ┌───────────▼──────────────────────────────┐
                │    SEU BACKEND JAVA (localhost:8080)    │
                ├──────────────────────────────────────────┤
                │                                          │
                │  @RestController                        │
                │  ┌─────────────────────────────────┐   │
                │  │ @PostMapping("/auth/login")     │   │
                │  │  - Autentica com JWT            │   │
                │  │  - Retorna token                │   │
                │  └─────────────────────────────────┘   │
                │                                          │
                │  ┌─────────────────────────────────┐   │
                │  │ @GetMapping("/voluntarios")     │   │
                │  │  - Lista voluntários            │   │
                │  │  - Requer Authorization header  │   │
                │  └─────────────────────────────────┘   │
                │                                          │
                │  ┌─────────────────────────────────┐   │
                │  │ @PostMapping("/voluntarios")    │   │
                │  │  - Cria novo voluntário         │   │
                │  │  - Salva no banco               │   │
                │  └─────────────────────────────────┘   │
                │                                          │
                │  Service → Repository → Database        │
                │                                          │
                └──────────────────────────────────────────┘
```

---

## Fluxo de Autenticação (Detalhado)

```
┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 1: Usuário acessa http://localhost:5173/login               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  App.tsx verifica:                                                   │
│  - AuthContext.isAuthenticated = false                             │
│  - Renderiza: <Route path="/login" element={<Login />} />          │
│                                                                      │
│  Tela exibe:                                                        │
│  ┌──────────────────────────────────────────┐                      │
│  │  Crescer & Aprender                      │                      │
│  │                                          │                      │
│  │  Email:    [                        ]    │                      │
│  │  Senha:    [                        ]    │                      │
│  │                                          │                      │
│  │            [ ENTRAR ]                    │                      │
│  └──────────────────────────────────────────┘                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 2: Usuário digita email/senha e clica ENTRAR                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Login.tsx executa:                                                  │
│  ```typescript                                                       │
│  const { login } = useAuth();                                       │
│                                                                      │
│  const handleSubmit = async (email, password) => {                  │
│    await login(email, password);  // ← Chama AuthContext           │
│    navigate('/dashboard');                                          │
│  }                                                                   │
│  ```                                                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 3: AuthContext.login() é chamado                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  AuthContext.tsx:                                                    │
│  ```typescript                                                       │
│  const login = async (email: string, password: string) => {        │
│    const token = await authApi.login({                             │
│      email,                                                         │
│      senha: password  // ← Nota: "senha" (português no backend)    │
│    });                                                              │
│                                                                      │
│    localStorage.setItem('auth_token', token);                      │
│    localStorage.setItem('user', JSON.stringify({email, token}));   │
│    setUser({email, token});                                        │
│  }                                                                   │
│  ```                                                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 4: authApi.login() faz requisição HTTP                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  lib/api.ts:                                                         │
│  ```typescript                                                       │
│  export const authApi = {                                           │
│    login: async (credentials: LoginCredentials): Promise<string> => │
│      const response = await api.post(                               │
│        '/auth/login',                                               │
│        credentials  // {email: "user@example.com", senha: "123"}   │
│      );                                                             │
│      return response.data;  // retorna token string                │
│    }                                                                │
│  }                                                                   │
│                                                                      │
│  Axios interceptor adiciona automaticamente:                        │
│  Headers: {                                                         │
│    'Content-Type': 'application/json',                             │
│  }                                                                   │
│  ```                                                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 5: Requisição chega no Backend Java                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Seu Controller Java:                                               │
│  ```java                                                             │
│  @PostMapping("/auth/login")                                       │
│  public ResponseEntity<String> login(                              │
│    @RequestBody LoginRequest request  // {email, senha}            │
│  ) {                                                                │
│    User user = userService.authenticate(                           │
│      request.getEmail(),                                           │
│      request.getSenha()                                            │
│    );                                                              │
│                                                                      │
│    String token = jwtProvider.generateToken(user);                │
│    return ResponseEntity.ok(token);  // Retorna JWT               │
│  }                                                                   │
│  ```                                                                 │
│                                                                      │
│  Token exemplo:                                                     │
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.                            │
│  eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ │
│  SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 6: React salva token e atualiza estado                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  localStorage agora tem:                                            │
│  ┌────────────────────────────────────────────────────┐            │
│  │ auth_token: "eyJhbGciOi..."                        │            │
│  │ user: '{"email":"user@email.com","token":"..."}'  │            │
│  └────────────────────────────────────────────────────┘            │
│                                                                      │
│  AuthContext.user agora = {                                        │
│    email: "user@email.com",                                        │
│    token: "eyJhbGciOi..."                                          │
│  }                                                                   │
│                                                                      │
│  AuthContext.isAuthenticated = true                                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 7: Redireciona para /dashboard                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  App.tsx re-renderiza:                                              │
│  <Route                                                             │
│    path="/dashboard"                                                │
│    element={                                                        │
│      <ProtectedLayout>  ← Verifica autenticação                    │
│        <Dashboard />                                                │
│      </ProtectedLayout>                                             │
│    }                                                                │
│  />                                                                 │
│                                                                      │
│  ProtectedLayout.tsx:                                               │
│  ```typescript                                                       │
│  const { isAuthenticated } = useAuth();                            │
│  if (!isAuthenticated) return <Navigate to="/login" />;            │
│  return <AppSidebar>{children}</AppSidebar>;  ← Renderiza!        │
│  ```                                                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 8: Dashboard carrega dados protegidos                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Dashboard.tsx usa:                                                 │
│  ```typescript                                                       │
│  const { data: voluntarios } = useVoluntarios();                   │
│  // Isso chama: GET /crescer-aprender/voluntarios                  │
│  ```                                                                 │
│                                                                      │
│  O interceptor Axios adiciona automaticamente:                      │
│  ```                                                                 │
│  GET /crescer-aprender/voluntarios HTTP/1.1                        │
│  Authorization: Bearer eyJhbGciOi...  ← Token JWT                  │
│  Content-Type: application/json                                    │
│  ```                                                                 │
│                                                                      │
│  Backend Java verifica:                                             │
│  ```java                                                             │
│  @GetMapping("/voluntarios")                                       │
│  public ResponseEntity<List<Voluntario>> listar(                   │
│    @RequestHeader("Authorization") String header  ← "Bearer ..."   │
│  ) {                                                                │
│    String token = header.replace("Bearer ", "");                   │
│    if (!jwtProvider.isValid(token)) {                              │
│      return ResponseEntity.status(401).build();  ← 401 Unauthorized│
│    }                                                                │
│    User user = jwtProvider.getUserFromToken(token);                │
│    return ResponseEntity.ok(voluntarioService.listar());           │
│  }                                                                   │
│  ```                                                                 │
│                                                                      │
│  Resposta:                                                          │
│  ```json                                                             │
│  [                                                                   │
│    {                                                                │
│      "id": 1,                                                       │
│      "nome": "João Silva",                                         │
│      "email": "joao@email.com",                                    │
│      "ativo": true                                                 │
│    },                                                              │
│    {                                                                │
│      "id": 2,                                                       │
│      "nome": "Maria Santos",                                       │
│      "email": "maria@email.com",                                   │
│      "ativo": true                                                 │
│    }                                                                │
│  ]                                                                   │
│  ```                                                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ PASSO 9: React renderiza a lista                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Dashboard.tsx:                                                      │
│  ```typescript                                                       │
│  return (                                                            │
│    <div>                                                            │
│      {voluntarios.map(v => (                                       │
│        <Card key={v.id}>                                           │
│          <p>{v.nome}</p>                                           │
│          <p>{v.email}</p>                                          │
│        </Card>                                                      │
│      ))}                                                            │
│    </div>                                                           │
│  );                                                                 │
│  ```                                                                 │
│                                                                      │
│  Tela exibe:                                                         │
│  ┌──────────────────────────────────────────┐                      │
│  │ Crescer & Aprender                       │                      │
│  │ ┌────────────────────────────────────┐   │                      │
│  │ │ João Silva                         │   │                      │
│  │ │ joao@email.com                     │   │                      │
│  │ └────────────────────────────────────┘   │                      │
│  │ ┌────────────────────────────────────┐   │                      │
│  │ │ Maria Santos                       │   │                      │
│  │ │ maria@email.com                    │   │                      │
│  │ └────────────────────────────────────┘   │                      │
│  └──────────────────────────────────────────┘                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Arquitetura de Componentes

```
src/
│
├── App.tsx ◄─── RAIZ da aplicação
│   │
│   └─► AuthProvider
│       │
│       └─► QueryClientProvider  (React Query)
│           │
│           └─► BrowserRouter (React Router)
│               │
│               ├─► Route /login
│               │   └─► Login.tsx
│               │
│               ├─► Route /dashboard
│               │   └─► ProtectedLayout
│               │       └─► Dashboard.tsx
│               │
│               ├─► Route /voluntarios
│               │   └─► ProtectedLayout
│               │       └─► Voluntarios.tsx
│               │
│               └─► Route /escalas
│                   └─► ProtectedLayout
│                       └─► Escalas.tsx

ComponenteTree Típica:
┌─ ProtectedLayout
│  ├─ AppSidebar (menu lateral)
│  │  ├─ NavLink
│  │  ├─ NavLink
│  │  └─ NavLink
│  │
│  └─ Dashboard (ou Voluntarios, ou Escalas)
│     ├─ Card
│     │  ├─ Button
│     │  └─ Input
│     ├─ Dialog
│     │  ├─ Form
│     │  │  ├─ Input
│     │  │  ├─ Select
│     │  │  └─ Button (submit)
│     │  └─ Button (cancel)
│     └─ Table
│        ├─ TableRow
│        │  └─ TableCell
│        └─ TableRow
│           └─ TableCell
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────┐
│              Global State (Contexts)                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  AuthContext (usada em toda a app)                │
│  ├─ user: {email, token}                          │
│  ├─ isAuthenticated: boolean                      │
│  ├─ isLoading: boolean                            │
│  ├─ login(email, pwd): Promise<void>              │
│  └─ logout(): void                                │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│          Server State (React Query)                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Voluntários:                                      │
│  ├─ useVoluntarios() → {data, isLoading, error}   │
│  ├─ useCriarVoluntario() → {mutate, isPending}    │
│  ├─ useAtualizarVoluntario() → {mutate, isPending}│
│  └─ useDeletarVoluntario() → {mutate, isPending}  │
│                                                     │
│  Escalas:                                          │
│  ├─ useEscalas() → {data, isLoading, error}       │
│  ├─ useCriarEscala() → {mutate, isPending}        │
│  └─ ...                                            │
│                                                     │
│  ┌────────────────────────────────────────────┐  │
│  │        React Query Cache (em memória)       │  │
│  │  ├─ queryKey: ['voluntarios']               │  │
│  │  │  └─ data: [{id:1, nome: '...'}, ...]    │  │
│  │  ├─ queryKey: ['voluntarios', 1]            │  │
│  │  │  └─ data: {id:1, nome: '...'}           │  │
│  │  └─ queryKey: ['escalas']                   │  │
│  │     └─ data: [{id:1, data: '2026-02-06'}]  │  │
│  └────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│          Local Component State                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Voluntarios.tsx:                                  │
│  ├─ const [open, setOpen] = useState(false)       │
│  ├─ const [nome, setNome] = useState('')          │
│  ├─ const [email, setEmail] = useState('')        │
│  └─ const [selectedId, setSelectedId] = useState() │
│                                                     │
│  Dashboard.tsx:                                    │
│  └─ const [dateRange, setDateRange] = useState()  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## HTTP Request Lifecycle

```
┌─ useVoluntarios() hook chamado
│
├─ useQuery({
│   queryKey: ['voluntarios'],
│   queryFn: voluntariosApi.listar
│ })
│
├─ React Query verifica cache:
│   ├─ Se existe e é fresco → retorna cache imediatamente
│   └─ Se não existe ou é velho → faz requisição HTTP
│
├─ voluntariosApi.listar() chamado:
│   └─ api.get('/crescer-aprender/voluntarios')
│
├─ axios interceptor request:
│   ├─ Pega token: localStorage.getItem('auth_token')
│   ├─ Adiciona header: Authorization: Bearer {token}
│   └─ Envia requisição HTTP
│
├─ Requisição enviada:
│   GET http://localhost:8080/crescer-aprender/voluntarios HTTP/1.1
│   Authorization: Bearer eyJhbGciOi...
│   Content-Type: application/json
│
├─ Backend Java recebe:
│   ├─ Valida JWT
│   ├─ Busca voluntários no banco
│   └─ Retorna JSON
│
├─ Response recebido:
│   [
│     {id: 1, nome: "João", email: "joao@email.com", ativo: true},
│     {id: 2, nome: "Maria", email: "maria@email.com", ativo: true}
│   ]
│
├─ axios interceptor response:
│   ├─ Status 200-299 → próxima étapa
│   ├─ Status 401 → logout() + redirect(/login)
│   └─ Outro erro → Promise.reject(error)
│
├─ React Query processa:
│   ├─ Salva em cache com key ['voluntarios']
│   ├─ Retorna { data, isLoading: false, error: null }
│   └─ Componente re-renderiza
│
└─ Componente renderiza:
    {voluntarios.map(v => <Card key={v.id} {...v} />)}
```

---

## Ciclo de Uma Mutação (Criar Voluntário)

```
┌─ useCriarVoluntario() hook chamado em componente
│
├─ Usuário clica "Criar"
│
├─ Função mutate() executada:
│   mutate({ nome: "Pedro", email: "pedro@email.com" })
│
├─ React Query executa:
│   ├─ mutationFn chamada
│   ├─ voluntariosApi.criar(voluntario) executada
│   ├─ api.post('/crescer-aprender/voluntarios', data)
│   │
│   ├─ axios interceptor adiciona JWT
│   │
│   ├─ Backend Java cria e retorna novo voluntário
│   │ {id: 3, nome: "Pedro", email: "pedro@email.com"}
│   │
│   └─ onSuccess callback:
│       ├─ queryClient.invalidateQueries({queryKey: ['voluntarios']})
│       │  → força refetch da lista
│       │
│       ├─ toast({ title: "Sucesso!" })
│       │  → mostra notificação
│       │
│       └─ Componente re-renderiza com novo voluntário
│
└─ Se erro:
    ├─ onError callback
    ├─ toast({ title: "Erro", variant: "destructive" })
    └─ Componente mostra mensagem de erro
```

---

## Exemplo Prático: Criar novo Voluntário

**Arquivo: `src/pages/Voluntarios.tsx`**

```
TELA:
┌────────────────────────────────────────────┐
│ Voluntários                                 │
│ ┌────────────────────────────────────────┐ │
│ │  João Silva          [Editar] [Deletar]│ │
│ │  joao@email.com                        │ │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │  Maria Santos        [Editar] [Deletar]│ │
│ │  maria@email.com                       │ │
│ └────────────────────────────────────────┘ │
│                                             │
│  [+ Novo Voluntário]  ◄── Clica aqui      │
└────────────────────────────────────────────┘

CLIQUE em "+ Novo Voluntário":
│
├─ Dialog abre (popup modal)
│
├─ Form aparece:
│  ┌──────────────────────────────┐
│  │ Nome:   [_______________]    │
│  │ Email:  [_______________]    │
│  │                              │
│  │  [Cancelar]  [Criar]         │
│  └──────────────────────────────┘
│
├─ Usuário digita dados
│  └─ setNome(), setEmail() atualizam state local
│
├─ Clica [Criar]
│  └─ handleSubmit() executa
│
├─ mutate({ nome, email }) chamado
│  └─ Envia POST ao backend
│
├─ Backend processa
│  └─ Salva no banco e retorna novo voluntário
│
├─ onSuccess executa
│  ├─ invalida cache de voluntários
│  ├─ React Query refaz GET /voluntarios
│  ├─ Lista atualiza com novo voluntário
│  └─ toast("Sucesso!")
│
└─ Dialog fecha
   └─ Novo voluntário aparece na lista
```

---

**Código real:**

```typescript
// src/pages/Voluntarios.tsx
import { useState } from 'react';
import { useVoluntarios, useCriarVoluntario } from '@/hooks/useVoluntarios';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function Voluntarios() {
  // 1. Hook que busca lista
  const { data: voluntarios, isLoading } = useVoluntarios();
  
  // 2. Hook que faz POST
  const { mutate: criar } = useCriarVoluntario();
  
  // 3. State local do dialog
  const [open, setOpen] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  
  // 4. Submeter form
  const handleSubmit = (e) => {
    e.preventDefault();
    criar({ nome, email }, {
      onSuccess: () => {
        setOpen(false);  // Fecha dialog
        setNome('');     // Limpa form
        setEmail('');
      }
    });
  };
  
  if (isLoading) return <div>Carregando...</div>;
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Voluntários</h1>
      
      {/* Lista */}
      <div className="space-y-2">
        {voluntarios?.map(v => (
          <div key={v.id} className="border p-4 rounded">
            <p className="font-bold">{v.nome}</p>
            <p className="text-sm text-gray-500">{v.email}</p>
          </div>
        ))}
      </div>
      
      {/* Botão */}
      <Button onClick={() => setOpen(true)}>
        + Novo Voluntário
      </Button>
      
      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Voluntário</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Nome</label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label>Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Criar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

## Conclusão

Essa é a arquitetura completa! Cada camada tem uma responsabilidade:

1. **Componentes React** - UI e interação
2. **Hooks** - Lógica de requisições
3. **React Query** - Cache e sincronização
4. **Axios + Interceptadores** - HTTP e autenticação
5. **Backend Java** - Lógica e persistência

Todos conectados por JSON sobre HTTP! 🚀

