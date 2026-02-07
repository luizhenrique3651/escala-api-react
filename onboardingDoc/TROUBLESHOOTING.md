# 🔧 Guia Prático: Troubleshooting & Dicas

## ❌ Problemas Comuns e Soluções

### 1. "Erro CORS: Access to XMLHttpRequest blocked"

**Mensagem no console:**
```
Access to XMLHttpRequest at 'http://localhost:8080/auth/login' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Causa:** Seu backend Java não está permitindo requisições do frontend.

**Solução - Configure CORS no seu Backend:**

```java
// Backend Java - Spring Boot

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:5173",  // Frontend dev
                    "http://localhost:8080"   // Frontend build
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

**Teste:**
```bash
npm run dev  # Frontend em http://localhost:5173
# Você pode chamar o backend em http://localhost:8080 agora!
```

---

### 2. "Erro 401 Unauthorized em todas as requisições"

**Mensagem:**
```
401 Unauthorized
```

**Possíveis causas:**
- Token não está sendo enviado
- Token expirou
- Token é inválido

**Debug:**

```typescript
// Abra DevTools (F12) → Console → execute:
console.log('Token:', localStorage.getItem('auth_token'));
console.log('User:', localStorage.getItem('user'));
```

**Se estiver vazio:**
- Login falhou silenciosamente
- Verifique as credenciais de login

**Se tiver um token:**
- Problema está no backend validando o JWT
- Verifique se a assinatura JWT do backend é igual à esperada

**Solução rápida - teste o token:**

```bash
# Teste sua API com curl
curl -X GET http://localhost:8080/crescer-aprender/voluntarios \
  -H "Authorization: Bearer seu_token_aqui"

# Se retornar 200 OK, o backend está OK
# Se retornar 401, o JWT validation está quebrando
```

---

### 3. "Erro: Expected 2 arguments but got 1" (TypeScript)"

**Código:**
```typescript
const handleClick = (name) => {  // ← Falta tipo!
  console.log(name);
};
```

**Mensagem de erro:**
```
Parameter 'name' implicitly has an 'any' type.ts(7006)
```

**Solução:**
```typescript
// Opção 1: Adicione tipo
const handleClick = (name: string) => {
  console.log(name);
};

// Opção 2: Use inferência de tipo
const handleClick: (name: string) => void = (name) => {
  console.log(name);
};

// Opção 3: Configure tsconfig.json para ser menos rigoroso
// (não recomendado!)
```

---

### 4. "Componente não atualiza após mutação"

**Problema:** Depois de criar/editar, a lista não atualiza.

**Causa:** React Query cache não foi invalidado.

**Solução - Adicione invalidateQueries:**

```typescript
// ERRADO - sem invalidação
export function useCriarVoluntario() {
  return useMutation({
    mutationFn: (voluntario) => voluntariosApi.criar(voluntario),
    // onSuccess vazio ❌
  });
}

// CORRETO - com invalidação
export function useCriarVoluntario() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (voluntario) => voluntariosApi.criar(voluntario),
    onSuccess: () => {
      // Força refetch da lista ✓
      queryClient.invalidateQueries({ queryKey: ['voluntarios'] });
    }
  });
}
```

---

### 5. "Página de login mostra brevemente, depois redireciona para dashboard mesmo sem logar"

**Problema:** Token de teste no localStorage está causando isso.

**Solução:**
```bash
# DevTools (F12) → Application → Local Storage → Delete all

# Ou execute no console:
localStorage.clear();

# Depois recarregue a página
```

---

### 6. "useAuth() fora de AuthProvider"

**Erro:**
```
Error: useAuth must be used within an AuthProvider
```

**Causa:** Tentou usar `useAuth()` em um componente que não está dentro de `AuthProvider`.

**Solução - Verifique App.tsx:**

```typescript
// ERRADO ❌
export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);

// CORRETO ✓
export const App = () => (
  <AuthProvider>  ← Envolver TUDO
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
```

---

### 7. "Inputs controlados não atualizam (React aviso)"

**Aviso:**
```
Warning: You provided a `value` prop to a form field without an `onChange` handler
```

**Código:**
```typescript
const [email, setEmail] = useState('');

return (
  <Input 
    value={email}
    // onChange faltando! ❌
  />
);
```

**Solução:**
```typescript
const [email, setEmail] = useState('');

return (
  <Input 
    value={email}
    onChange={(e) => setEmail(e.target.value)}  // ✓
  />
);
```

---

### 8. "Função assíncrona sem await"

**Código:**
```typescript
const handleLogin = async (email, pwd) => {
  login(email, pwd);  // Falta await! ❌
  navigate('/dashboard');  // Executa imediatamente!
};
```

**Solução:**
```typescript
const handleLogin = async (email, pwd) => {
  await login(email, pwd);  // ✓ Aguarda
  navigate('/dashboard');   // Depois navega
};
```

---

### 9. "localStorage não persiste dados"

**Problema:** Desloga ao recarregar a página.

**Causa:** Token não foi salvo corretamente.

**Debug - verifique AuthContext:**

```typescript
// Em AuthContext.tsx
const login = async (email, password) => {
  const token = await authApi.login({ email, senha: password });
  
  console.log('Token recebido:', token);  // ← Adicione log
  
  localStorage.setItem('auth_token', token);  // Verifique se salva
  localStorage.setItem('user', JSON.stringify({email, token}));
  
  console.log('Token salvo:', localStorage.getItem('auth_token'));  // ← Verify
};
```

**Se não salva:** Backend não está retornando token.
**Se salva:** Próxima página não está carregando token (check useEffect).

---

### 10. "Tailwind classes não aplicam estilo"

**Código:**
```jsx
<button className="px-4 py-2 bg-blue-600 text-white rounded">
  Clique
</button>
```

**Problema:** Não há estilo azul.

**Possíveis causas:**
1. Tailwind não foi compilado
2. Classe inválida
3. CSS não foi importado

**Solução:**

```bash
# 1. Certifique que index.css tem Tailwind
# src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

# 2. Reinicie o dev server
npm run dev

# 3. Verifique classe válida
# Válido: bg-blue-600, px-4, py-2, rounded
# Inválido: bg-blue, px, rounded-2xl (sem valor específico)
```

---

### 11. "Não consigo editar componente shadcn/ui"

**Problema:** Componente é muito customizado para sua necessidade.

**Solução:** Edite diretamente!

```typescript
// src/components/ui/button.tsx

// Todo componente shadcn/ui é seu!
// Modifique livremente:

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  // Adicione novo prop customizado:
  loading?: boolean  // ← Novo!
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium",
        // Adicionar lógica de loading
        loading && "opacity-50 cursor-not-allowed"
      )}
      disabled={loading || props.disabled}
      {...props}
    />
  )
)
```

---

## ✅ Checklist: Tudo OK?

Antes de chamar seu senior (ou dar bug report), verifique:

```
SISTEMA
- [ ] Backend Java rodando em http://localhost:8080
- [ ] CORS configurado no backend
- [ ] npm install rodou sem erro
- [ ] npm run dev abre em http://localhost:5173

AUTENTICAÇÃO
- [ ] Consegue fazer login com credenciais corretas
- [ ] Após login, localStorage tem 'auth_token'
- [ ] Redireciona para /dashboard após login
- [ ] Recarregar página mantém login (session persistence)

DADOS
- [ ] Páginas protegidas mostram dados corretos
- [ ] React Query cache está funcionando (check F12 Network)
- [ ] Criar novo item atualiza lista automaticamente
- [ ] Deletar item remove da lista

ERROS
- [ ] npm run lint não mostra erros
- [ ] Console (F12) não mostra erros em vermelho
- [ ] Network (F12) mostra status 200 OK nas requisições

TAILWIND
- [ ] Buttons têm cores
- [ ] Layout tem espaçamentos corretos
- [ ] Responsive funciona (teste em mobile/tablet)
```

---

## 🎯 Dicas do Senior

### 1. Use DevTools efetivamente

**Network tab (F12 → Network):**
```
GET /crescer-aprender/voluntarios
Status: 200 OK
Headers:
  Authorization: Bearer eyJhbGciOi...
  Content-Type: application/json

Response:
[{id:1, nome:"João", ...}]
```

Isso é seu melhor amigo! Vê exatamente o que está sendo enviado e recebido.

---

### 2. Console.log é seu debugger

```typescript
// Não tenha medo de adicionar logs temporários
const { data: voluntarios } = useVoluntarios();
console.log('Voluntários:', voluntarios);  // ← Veja o que veio

const handleClick = () => {
  console.log('Botão clicado!');  // ← Verifique se entra
  mutate(data);
  console.log('Mutate executado!');
};
```

Depois remove. É ok.

---

### 3. Comece simples

Não tente fazer um dialog complex de primeira. Comece com:

```typescript
// 1. Apenas mostrar lista
const { data } = useVoluntarios();
return data.map(v => <div key={v.id}>{v.nome}</div>);

// 2. Adicionar botão criar
<button onClick={() => setOpen(true)}>Criar</button>

// 3. Abrir dialog
<Dialog open={open}>...</Dialog>

// 4. Form dentro do dialog
<Input value={nome} onChange={(e) => setNome(e.target.value)} />

// 5. Submit do form
<button onClick={handleSubmit}>Criar</button>

// 6. Chamar mutate
mutate({nome})
```

Passo a passo, teste cada coisa.

---

### 4. Use TypeScript a seu favor

```typescript
// ❌ Errado - any é seu inimigo
const handleResponse = (data: any) => {
  console.log(data.nome);  // Pode quebrar em runtime!
};

// ✓ Correto - TypeScript verifica tudo
interface Voluntario {
  id: number;
  nome: string;
  email: string;
}

const handleResponse = (data: Voluntario) => {
  console.log(data.nome);  // TypeScript garante que existe!
};
```

Quando o TypeScript reclama, é porque há bug!

---

### 5. React Query é mágico, entenda a chave

```typescript
// Mesma chave = mesmo cache
const query1 = useQuery({ queryKey: ['voluntarios'], ... });
const query2 = useQuery({ queryKey: ['voluntarios'], ... });
// Ambos compartilham cache! ✓

// Chaves diferentes = caches diferentes
const query1 = useQuery({ queryKey: ['voluntarios'], ... });
const query2 = useQuery({ queryKey: ['escalas'], ... });
// Caches separados ✓

// Invalidar a chave = refetch automático
queryClient.invalidateQueries({ queryKey: ['voluntarios'] });
// Próxima vez que alguém usar ['voluntarios'], faz requisição nova ✓
```

---

### 6. Entenda o fluxo de login

```typescript
// Sempre nessa ordem:
1. user digita email/pwd
2. clica login
3. handleSubmit chama login()
4. login() salva no localStorage
5. setUser() atualiza context
6. navigate() vai para dashboard
7. ProtectedLayout verifica isAuthenticated
8. Se true, renderiza. Se false, volta para login
```

Se não funcionar, trace cada passo.

---

### 7. Interceptadores são automáticos

```typescript
// Você escreve:
api.get('/voluntarios')

// Axios automaticamente:
// 1. Adiciona Authorization header
// 2. Envia para backend
// 3. Se 401, faz logout automático
// 4. Se sucesso, retorna dados

// Você não precisa fazer nada! 🎉
```

---

### 8. Forms com React Hook Form (opcional mas recomendado)

Seus forms atuais com useState funcionam, mas se quiser coisa mais robusta:

```typescript
import { useForm } from "react-hook-form";

export function VoluntarioForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { nome: '', email: '' }
  });

  const onSubmit = (data) => {
    mutate(data);  // data já validado
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('nome', { required: 'Nome é obrigatório' })} />
      {errors.nome && <span>{errors.nome.message}</span>}
      
      <input {...register('email', { required: 'Email é obrigatório' })} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <button type="submit">Criar</button>
    </form>
  );
}
```

Menos boilerplate, melhor validação.

---

### 9. Tailwind: customizando cores e tamanhos

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'crescer': {
          50: '#f0f9ff',   // Mais claro
          500: '#3b82f6',  // Sua cor principal
          900: '#1e3a8a',  // Mais escuro
        }
      },
      spacing: {
        '128': '32rem',  // Novo tamanho
      }
    }
  }
}

// Depois use:
<div className="bg-crescer-500 p-128">...</div>
```

---

### 10. Testes são seus aliados (depois)

Por enquanto, focus em fazer funcionar. Mas quando estiver confortável:

```typescript
// src/test/voluntarios.test.ts
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Voluntarios } from '@/pages/Voluntarios';

describe('Voluntarios Page', () => {
  it('should render title', () => {
    render(<Voluntarios />);
    expect(screen.getByText('Voluntários')).toBeInTheDocument();
  });
});

// npm test para rodar
```

---

## 📚 Recursos para Aprender

### Rápido (leia em 30 min)
- React Docs: Thinking in React → https://react.dev/learn/thinking-in-react
- TypeScript Handbook Basics → https://www.typescriptlang.org/docs/handbook/2/basic-types.html

### Médio (leia em 2-3h)
- React + TypeScript: https://react.dev/learn
- Tailwind CSS Fundamentals: https://tailwindcss.com/docs/utility-first
- React Query Overview: https://tanstack.com/query/latest/docs/react/overview

### Aprofundado (leia quando quiser otimizar)
- React Hooks Deep Dive: https://react.dev/reference/react/hooks
- React Query Advanced Patterns: https://tanstack.com/query/latest/docs/react/important-defaults
- Performance Optimization: https://react.dev/reference/react-dom#performance

---

## 🚀 Próximos Passos Recomendados

### Semana 1 - Entender Básico
- [ ] Ler GUIA_ARQUITETURA.md
- [ ] Ler DIAGRAMA_ARQUITETURA.md
- [ ] Rodar `npm run dev` e explorar a app
- [ ] Fazer login com dados do backend
- [ ] Ver dados chegando em Network tab

### Semana 2 - Fazer Mudanças Pequenas
- [ ] Editar textos de componentes existentes
- [ ] Mudar cores com Tailwind
- [ ] Adicionar novo campo em forms existentes
- [ ] Testar com DevTools

### Semana 3 - Criar Features
- [ ] Criar nova página simples
- [ ] Adicionar novo hook para requisições
- [ ] Integrar com novo endpoint do backend
- [ ] Testar CRUD (Create, Read, Update, Delete)

### Semana 4 - Otimizar e Aprender
- [ ] Melhorar UX do layout
- [ ] Adicionar validações
- [ ] Escrever testes simples
- [ ] Conhecer melhor React Query

---

## 💬 Quando Chamar Help

**Chame seu senior quando:**
- Não conseguir conectar com backend (CORS, JWT)
- TypeScript reclama e você não entende
- Componente não renderiza e não há erro claro
- Network mostra requisição 500 do backend
- Precisa de opinião arquitetural (como organizar novo código)

**Não precisa chamar quando:**
- Tailwind: Google "tailwind how to do X"
- React: DevTools extension mostra o estado
- API: Postman/Curl testa sem frontend
- Performance: mude className e vê resultado

---

**Boa sorte! Você vai dominar isso em pouco tempo! 🚀**

