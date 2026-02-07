# 🛠️ Tutorial Prático: Passo a Passo - Criar Feature Completa

## 🎯 Objetivo: Criar página "Detalhes do Voluntário"

Vamos criar uma nova página que mostra os detalhes de um voluntário selecionado, como um mini-projeto para você praticar tudo que aprendeu.

### Requisito
- Clicar em um voluntário na lista
- Abrir página com detalhes
- Editar e salvar
- Voltar para lista

---

## 📝 Passo 1: Entender o Backend

Primeiro, verifique quais endpoints o backend tem. No seu `lib/api.ts`, vemos:

```typescript
export const voluntariosApi = {
  buscarPorId: async (id: number): Promise<Voluntario> => {
    const response = await api.get(`/crescer-aprender/voluntarios/${id}`);
    return response.data;
  },
  
  atualizar: async (id: number, voluntario: VoluntarioCreate): Promise<Voluntario> => {
    const response = await api.put(`/crescer-aprender/voluntarios/${id}`, voluntario);
    return response.data;
  },
};
```

✓ Backend tem GET e PUT para voluntários. Perfeito!

---

## 🧠 Passo 2: Planejar a Arquitetura

```
App.tsx (rotas)
  ├─ /voluntarios → Voluntarios.tsx (lista)
  └─ /voluntarios/:id → VoluntarioDetalhes.tsx (detalhes) ← NOVO!

hooks/
  └─ useVoluntarios.ts
      ├─ useVoluntario(id) ← já existe
      └─ useAtualizarVoluntario() ← já existe

pages/
  ├─ Voluntarios.tsx
  └─ VoluntarioDetalhes.tsx ← NOVO!
```

---

## 💻 Passo 3: Criar Hook para Buscar Um Voluntário

Verifique se já existe em `src/hooks/useVoluntarios.ts`:

```typescript
export function useVoluntario(id: number) {
  return useQuery({
    queryKey: ['voluntarios', id],
    queryFn: () => voluntariosApi.buscarPorId(id),
    enabled: !!id,  // Só faz requisição se id existe
  });
}
```

✓ Já existe! Vamos usar.

---

## 🗂️ Passo 4: Criar Arquivo da Nova Página

Crie `src/pages/VoluntarioDetalhes.tsx`:

```typescript
import { useParams, useNavigate } from 'react-router-dom';
import { useVoluntario, useAtualizarVoluntario } from '@/hooks/useVoluntarios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function VoluntarioDetalhes() {
  // 1. Pegar ID da URL
  const { id } = useParams<{ id: string }>();
  const idNum = parseInt(id || '0');
  
  // 2. Buscar dados do voluntário
  const { data: voluntario, isLoading, error } = useVoluntario(idNum);
  
  // 3. Hook para atualizar
  const { mutate: atualizar, isPending } = useAtualizarVoluntario();
  
  // 4. State local do form
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  
  // 5. Voltar para lista
  const navigate = useNavigate();
  
  // 6. Preencher form quando dados chegarem
  useEffect(() => {
    if (voluntario) {
      setNome(voluntario.nome);
      setEmail(voluntario.email);
      setTelefone(voluntario.telefone || '');
    }
  }, [voluntario]);
  
  // 7. Submeter edições
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    atualizar(
      { id: idNum, voluntario: { nome, email, telefone } },
      {
        onSuccess: () => {
          navigate('/voluntarios');  // Volta para lista
        }
      }
    );
  };
  
  // 8. Tratamento de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando detalhes...</p>
        </div>
      </div>
    );
  }
  
  // 9. Tratamento de erro
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded">
          Erro ao carregar voluntário: {error.message}
        </div>
        <Button onClick={() => navigate('/voluntarios')} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }
  
  // 10. Renderizar
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/voluntarios')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold">Detalhes do Voluntário</h1>
      </div>
      
      {/* Card com form */}
      <Card>
        <CardHeader>
          <CardTitle>{voluntario?.nome}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Nome */}
            <div className="space-y-2">
              <label htmlFor="nome" className="text-sm font-medium">
                Nome
              </label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            
            {/* Campo Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {/* Campo Telefone */}
            <div className="space-y-2">
              <label htmlFor="telefone" className="text-sm font-medium">
                Telefone (opcional)
              </label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 9999-9999"
              />
            </div>
            
            {/* ID (read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">ID</label>
              <Input
                value={idNum}
                disabled
                className="bg-muted"
              />
            </div>
            
            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/voluntarios')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🛣️ Passo 5: Adicionar Rota em App.tsx

Abra `src/App.tsx` e adicione a rota:

```typescript
import VoluntarioDetalhes from "./pages/VoluntarioDetalhes";  // ← Novo import

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedLayout>
                  <Dashboard />
                </ProtectedLayout>
              }
            />
            <Route
              path="/voluntarios"
              element={
                <ProtectedLayout>
                  <Voluntarios />
                </ProtectedLayout>
              }
            />
            {/* ← Adicione esta rota */}
            <Route
              path="/voluntarios/:id"
              element={
                <ProtectedLayout>
                  <VoluntarioDetalhes />
                </ProtectedLayout>
              }
            />
            <Route
              path="/escalas"
              element={
                <ProtectedLayout>
                  <Escalas />
                </ProtectedLayout>
              }
            />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);
```

---

## 🔗 Passo 6: Adicionar Link em Voluntarios.tsx

Abra `src/pages/Voluntarios.tsx` e modifique para ter links:

```typescript
import { Link } from 'react-router-dom';  // ← Novo import
import { Button } from '@/components/ui/button';

export default function Voluntarios() {
  const { data: voluntarios, isLoading } = useVoluntarios();
  
  if (isLoading) return <div>Carregando...</div>;
  
  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-bold">Voluntários</h1>
      
      <div className="grid gap-4">
        {voluntarios?.map(v => (
          <Link
            key={v.id}
            to={`/voluntarios/${v.id}`}  // ← Link para detalhes
            className="block border rounded hover:bg-accent p-4 transition"
          >
            <p className="font-bold text-lg">{v.nome}</p>
            <p className="text-sm text-muted-foreground">{v.email}</p>
            {v.telefone && (
              <p className="text-sm text-muted-foreground">{v.telefone}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
```

---

## 🧪 Passo 7: Testar

**Checklist de testes:**

```bash
# 1. Rodar dev
npm run dev

# 2. Fazer login
# Ir para http://localhost:5173/login
# Digitar credenciais

# 3. Clicar em Voluntários
# Ir para /voluntarios
# Ver lista

# 4. Clicar em um voluntário
# Ir para /voluntarios/1 (ou outro ID)
# Ver detalhes

# 5. Editar nome
# Trocar "João" para "João Silva"

# 6. Clicar "Salvar Alterações"
# Deve voltar para /voluntarios
# Novo nome deve aparecer na lista

# 7. DevTools (F12)
# Network: POST /crescer-aprender/voluntarios/1
# Status: 200 OK
# Payload: {nome: "João Silva", email: "..."}
```

---

## 🐛 Se Algo Quebrar

### "Erro: Cannot find module '@/pages/VoluntarioDetalhes'"

**Causa:** Arquivo não foi criado ou caminho errado.

**Solução:**
```bash
# Verificar arquivo existe
ls -la src/pages/VoluntarioDetalhes.tsx

# Verificar import está correto em App.tsx
# Deve ser:
import VoluntarioDetalhes from "./pages/VoluntarioDetalhes";
```

---

### "Não consegue navegar para /voluntarios/:id"

**Causa:** Rota não foi adicionada ou está em ordem errada.

**Solução:**
```typescript
// Em App.tsx, rota específica deve vir ANTES de genérica
<Routes>
  <Route path="/voluntarios" element={...} />  ← Genérica
  <Route path="/voluntarios/:id" element={...} />  ← Específica (primeiro!)
</Routes>
```

---

### "Editar não salva"

**Debug:**
```typescript
// Adicione logs em VoluntarioDetalhes.tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log('Form submetido com:', {nome, email, telefone});  // ← Ver dados
  atualizar({id: idNum, voluntario: {nome, email, telefone}});
};
```

Verifique DevTools Network se requisição é enviada.

---

### "Hook useAtualizarVoluntario() não existe"

**Solução:** Verifique se existe em `useVoluntarios.ts`:

```typescript
// Se não tiver, copie de useVoluntarios.ts:
export function useAtualizarVoluntario() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, voluntario }: { id: number; voluntario: VoluntarioCreate }) =>
      voluntariosApi.atualizar(id, voluntario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voluntarios'] });
      toast({
        title: 'Sucesso!',
        description: 'Voluntário atualizado com sucesso.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o voluntário.',
        variant: 'destructive',
      });
    },
  });
}
```

---

## 📊 Fluxo do Que Você Criou

```
User abre http://localhost:5173/voluntarios/1
│
├─ App.tsx verifica rota
│  └─ Route path="/voluntarios/:id" match! ✓
│
├─ VoluntarioDetalhes renderiza
│  └─ useParams() → {id: "1"}
│
├─ useVoluntario(1) dispara:
│  └─ GET /crescer-aprender/voluntarios/1
│
├─ Backend retorna:
│  └─ {id: 1, nome: "João", email: "joao@email.com", ...}
│
├─ useEffect preenche form:
│  ├─ setNome("João")
│  ├─ setEmail("joao@email.com")
│  └─ setTelefone("")
│
├─ Página renderiza com dados
│
├─ User edita nome para "João Silva"
│  └─ setNome("João Silva")
│
├─ User clica "Salvar"
│  └─ handleSubmit dispara
│
├─ useAtualizarVoluntario().mutate() chamado:
│  └─ PUT /crescer-aprender/voluntarios/1
│  └─ Body: {nome: "João Silva", email: "joao@email.com"}
│
├─ Backend salva e retorna:
│  └─ {id: 1, nome: "João Silva", ...}
│
├─ onSuccess executa:
│  ├─ queryClient.invalidateQueries(['voluntarios'])
│  ├─ toast("Sucesso!")
│  └─ navigate("/voluntarios")
│
└─ User volta para lista
   └─ Lista é refetchada
   └─ Novo nome "João Silva" aparece ✓
```

---

## 🎉 Parabéns!

Você criou:
- ✅ Nova página React
- ✅ Requisição GET para buscar dados
- ✅ Requisição PUT para atualizar
- ✅ Roteamento com parâmetros dinâmicos
- ✅ Form controlado com useState
- ✅ Tratamento de loading e erro
- ✅ Integração completa frontend-backend

**Isso é 80% do que você precisa saber de React!**

---

## 🚀 Próximas Features para Praticar

1. **Adicionar foto do voluntário:**
   - Upload de imagem
   - Mostrar com componente `<Image>`

2. **Adicionar botão deletar:**
   - useMutation para DELETE
   - Confirmação antes de deletar

3. **Adicionar histórico de escalas:**
   - Fetch escalas daquele voluntário
   - Mostrar tabela com datas

4. **Adicionar filtros na lista:**
   - Filtrar por nome
   - Filtrar por status (ativo/inativo)

5. **Adicionar paginação:**
   - Mostrar 10 por página
   - Botões previous/next

---

## 📚 Arquivos Modificados (Resumo)

| Arquivo | Ação | O que fez |
|---------|------|----------|
| `src/pages/VoluntarioDetalhes.tsx` | **CRIADO** | Nova página com detalhes |
| `src/App.tsx` | **MODIFICADO** | Adicionou rota `/voluntarios/:id` |
| `src/pages/Voluntarios.tsx` | **MODIFICADO** | Adicionou links para detalhes |

**Simples assim!** 🎯

---

## 🔑 Lições Aprendidas

1. **useParams()** → Pega parâmetros da URL (`/voluntarios/1` → `{id: "1"}`)
2. **Link component** → Navegar sem recarregar página (SPA)
3. **useNavigate()** → Programaticamente ir para outra página
4. **useEffect** → Sincronizar dados com inputs
5. **isPending** → Desabilitar botão enquanto aguarda
6. **onSuccess callback** → Executar após mutação bem-sucedida
7. **React Router** → Sistema de roteamento do React

---

**Continue praticando e boa sorte! 🚀**

