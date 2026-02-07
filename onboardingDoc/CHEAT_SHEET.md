# ⚡ Cheat Sheet React - Referência Rápida

Use este documento como cola durante o desenvolvimento. Copie, customize, use!

---

## 🧠 Conceitos Rápidos

| Conceito | Código | O que faz |
|----------|--------|----------|
| **Componente** | `export function App() { return <div>...</div>; }` | Renderiza UI |
| **Estado** | `const [x, setX] = useState(0);` | Variável reativa |
| **Props** | `<Botao texto=\"Clique\" />` | Passar dados |
| **Hook** | `const data = useQuery(...);` | Lógica reutilizável |
| **Effect** | `useEffect(() => {...}, []);` | Executar ao montar |
| **Context** | `const {user} = useAuth();` | Estado global |

---

## 📝 Snippets: Copie e Cole

### useState (Estado Local)

```typescript
// Simples
const [contador, setContador] = useState(0);

// Com tipo
const [nome, setNome] = useState<string>('');

// Múltiplos
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);
```

---

### useEffect (Executar ao Montar)

```typescript
// Uma vez (ao montar)
useEffect(() => {
  console.log('Componente montou');
}, []);

// Quando dependencies mudam
useEffect(() => {
  console.log('ID mudou:', id);
}, [id]);

// Cleanup (ao desmontar)
useEffect(() => {
  const listener = () => {};
  window.addEventListener('resize', listener);
  
  return () => {
    window.removeEventListener('resize', listener);
  };
}, []);
```

---

### Conditional Rendering

```typescript
// if simples
if (loading) return <div>Carregando...</div>;

// ternário
return isLogado ? <Dashboard /> : <Login />;

// &&
{hasError && <div className="text-red">Erro!</div>}

// switch
switch(status) {
  case 'loading': return <Spinner />;
  case 'error': return <Error />;
  default: return <Data />;
}
```

---

### Formulário Controlado

```typescript
const [formData, setFormData] = useState({
  nome: '',
  email: '',
  telefone: '',
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

return (
  <form>
    <input
      name="nome"
      value={formData.nome}
      onChange={handleChange}
    />
    <input
      name="email"
      value={formData.email}
      onChange={handleChange}
    />
  </form>
);
```

---

### Requisição HTTP com useEffect

```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await api.get('/voluntarios');
      setData(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);  // Executar apenas uma vez
```

---

### React Query (Recomendado)

```typescript
// GET (consultar)
const { data, isLoading, error } = useQuery({
  queryKey: ['voluntarios'],
  queryFn: () => api.get('/voluntarios').then(r => r.data),
});

// POST (criar)
const { mutate, isPending } = useMutation({
  mutationFn: (dados) => api.post('/voluntarios', dados),
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ['voluntarios']});
    toast({title: 'Sucesso!'});
  },
  onError: () => {
    toast({title: 'Erro', variant: 'destructive'});
  }
});

// Usar:
<button onClick={() => mutate({nome: 'João'})}>Criar</button>
```

---

### Roteamento (React Router)

```typescript
// Em App.tsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
  <Route path="/voluntarios/:id" element={<Detalhes />} />
  <Route path="*" element={<NotFound />} />
</Routes>

// Em um componente
import { useParams, useNavigate } from 'react-router-dom';

const { id } = useParams();  // Pega parâmetro da URL
const navigate = useNavigate();  // Navega

<button onClick={() => navigate('/dashboard')}>Ir</button>
<Link to={`/voluntarios/${id}`}>Ver</Link>
```

---

## 🎨 Tailwind: Classes Comuns

```jsx
{/* Layout */}
<div className="flex gap-4">           {/* Flexbox com espaço */}
<div className="grid grid-cols-3">     {/* Grid 3 colunas */}
<div className="container mx-auto">    {/* Container centralizado */}

{/* Espaçamento */}
<div className="p-4">                  {/* Padding 1rem */}
<div className="m-2">                  {/* Margin 0.5rem */}
<div className="px-4 py-2">            {/* Padding horizontal/vertical */}

{/* Cores */}
<div className="bg-blue-500">          {/* Background azul */}
<button className="bg-green-600 text-white">  {/* Verde com texto branco */}
<div className="text-red-500">         {/* Texto vermelho */}
<div className="border border-gray-300">     {/* Borda cinza */}

{/* Tamanhos */}
<div className="text-sm">              {/* Texto pequeno */}
<div className="text-2xl font-bold">   {/* Texto grande e bold */}
<div className="w-full">               {/* 100% de largura */}
<div className="max-w-md">             {/* Máxima largura */}

{/* Efeitos */}
<button className="hover:bg-blue-600">     {/* Cor ao passar mouse */}
<div className="rounded">              {/* Bordas arredondadas */}
<div className="shadow">               {/* Sombra */}
<div className="opacity-50">           {/* Transparência 50% */}

{/* Responsive */}
<div className="hidden md:block">       {/* Escondido em mobile, visível em desktop */}
<div className="text-sm md:text-lg">   {/* Tamanho diferente por dispositivo */}
```

---

## 🧩 shadcn/ui: Componentes Comuns

```jsx
import { Button } from '@/components/ui/button';
<Button>Clique</Button>
<Button variant="outline">Outline</Button>
<Button disabled>Disabled</Button>

import { Input } from '@/components/ui/input';
<Input placeholder="Digite..." />

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
<Card>
  <CardHeader><CardTitle>Título</CardTitle></CardHeader>
  <CardContent>Conteúdo</CardContent>
</Card>

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader><DialogTitle>Modal</DialogTitle></DialogHeader>
    Conteúdo do modal
  </DialogContent>
</Dialog>

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
<Select value={selected} onValueChange={setSelected}>
  <SelectTrigger>
    <SelectValue placeholder="Selecione..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="opção1">Opção 1</SelectItem>
    <SelectItem value="opção2">Opção 2</SelectItem>
  </SelectContent>
</Select>
```

---

## 🔑 Estrutura de Arquivo: Template Mínimo

```typescript
// src/pages/MinhaPagina.tsx

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

// 1. Tipos
interface Dado {
  id: number;
  nome: string;
}

// 2. Componente
export default function MinhaPagina() {
  // Estado local
  const [formData, setFormData] = useState({ nome: '' });
  
  // Requisições
  const { data, isLoading } = useQuery({
    queryKey: ['dados'],
    queryFn: () => api.get('/dados').then(r => r.data),
  });
  
  const { mutate: criar } = useMutation({
    mutationFn: (d: Dado) => api.post('/dados', d),
    onSuccess: () => {
      setFormData({ nome: '' });
      // Atualizar cache se necessário
    }
  });
  
  // Render
  if (isLoading) return <div>Carregando...</div>;
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Minha Página</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Formulário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Nome"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
          />
          <Button onClick={() => criar(formData)}>
            Salvar
          </Button>
        </CardContent>
      </Card>
      
      <div className="grid gap-4">
        {data?.map(item => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              {item.nome}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 🐛 Debug: DevTools & Console

```typescript
// Log do estado
console.log('Estado:', variavel);

// Log de requisições
console.log('Requisição enviada:', {
  url: '/api/endpoint',
  data: payload,
  headers: { Authorization: 'Bearer ...' }
});

// Verificar localStorage
console.log('Token:', localStorage.getItem('auth_token'));
console.log('User:', localStorage.getItem('user'));

// Verificar estado React Query
import { useQueryClient } from '@tanstack/react-query';
const queryClient = useQueryClient();
console.log('Cache:', queryClient.getQueryData(['voluntarios']));
```

**No DevTools (F12):**
- **Network:** Ver requisições HTTP
- **Console:** Logs e erros
- **Application → Storage → Local Storage:** Ver dados salvos
- **React DevTools:** Ver estado dos componentes

---

## 🚨 Erros Comuns & Soluções Rápidas

| Erro | Solução |
|------|---------|
| `Cannot find module '@/...'` | Caminho errado. Verifique `/src` |
| `Parameter X implicitly has type 'any'` | Adicione tipo: `(x: string)` |
| `useAuth must be used within AuthProvider` | AuthProvider não envolvendo componente |
| `Unexpected token '<'` | Arquivo `.tsx` sendo importado como `.ts` |
| `CORS error` | Configure CORS no backend Java |
| `401 Unauthorized` | Token não sendo enviado. Verifique localStorage |
| `Tailwind não está aplicando` | Reinicie `npm run dev` |

---

## 📋 Checklist: Antes de Commitar

```bash
# TypeScript correto?
npm run lint

# Build funciona?
npm run build

# Sem erros no console?
npm run dev
# Abra app em http://localhost:5173
# F12 → Console (deve estar limpo)

# Testou criar/editar/deletar?
# Se aplicável
```

---

## 🎯 Hook Customizado: Template

```typescript
// hooks/useMeuDado.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useToast } from './use-toast';

export interface MeuDado {
  id: number;
  nome: string;
}

// GET
export function useMeusDados() {
  return useQuery({
    queryKey: ['meusdados'],
    queryFn: async () => {
      const response = await api.get('/meusdados');
      return response.data;
    },
  });
}

// GET um
export function useMeuDado(id: number) {
  return useQuery({
    queryKey: ['meusdados', id],
    queryFn: async () => {
      const response = await api.get(`/meusdados/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// POST
export function useCriarMeuDado() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (dados: Omit<MeuDado, 'id'>) => {
      const response = await api.post('/meusdados', dados);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meusdados'] });
      toast({ title: 'Sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro', variant: 'destructive' });
    },
  });
}

// PUT
export function useAtualizarMeuDado() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, dados }: { id: number; dados: Omit<MeuDado, 'id'> }) => {
      const response = await api.put(`/meusdados/${id}`, dados);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meusdados'] });
      toast({ title: 'Atualizado!' });
    },
  });
}

// DELETE
export function useDeletarMeuDado() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/meusdados/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meusdados'] });
      toast({ title: 'Deletado!' });
    },
  });
}
```

---

## 🔗 Links Rápidos

| Necessidade | Link |
|------------|------|
| Documentação React | https://react.dev |
| TypeScript Docs | https://www.typescriptlang.org/docs/ |
| Tailwind Classes | https://tailwindcss.com/docs |
| React Query | https://tanstack.com/query/latest |
| shadcn/ui | https://ui.shadcn.com |
| React Router | https://reactrouter.com |

---

## ✅ Pronto para Começar?

Mantenha este documento aberto enquanto desenvolve. Sempre que precisar:

1. **Encontre o snippet** no arquivo
2. **Copie a estrutura**
3. **Customize para seu caso**
4. **Cole no seu arquivo**

Boa sorte! 🚀

---

**Criado para Dev Backend Java aprender React** ❤️

