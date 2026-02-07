# 🧩 Anatomia de um Componente React

Vamos dissecar um componente React real e entender cada parte, comparando com código Java que você conhece.

---

## Exemplo 1: Componente Simples (Estado Local)

### ❌ JavaScript Vanilla (Tipo jQuery)

```html
<!-- HTML -->
<button id="btn-contador">Clique: 0</button>

<script>
  // JavaScript vanilla
  let count = 0;
  
  document.getElementById('btn-contador').addEventListener('click', function() {
    count++;
    document.getElementById('btn-contador').textContent = `Clique: ${count}`;
  });
</script>
```

**Problema:** Acoplado, difícil de reutilizar, muito boilerplate.

---

### ✅ React (Moderno)

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Contador() {
  // Estado local (como variável de instância em Java)
  const [count, setCount] = useState(0);
  
  // Render (HTML/JSX)
  return (
    <div className="p-4">
      <Button onClick={() => setCount(count + 1)}>
        Clique: {count}
      </Button>
    </div>
  );
}

// Usar:
<Contador />
<Contador />  // Cada um tem seu próprio estado!
```

**Vantagens:**
- ✓ Reutilizável (2+ contadores = 2+ estados independentes)
- ✓ Reativo (atualiza automaticamente quando estado muda)
- ✓ Sem seletor DOM manual
- ✓ Limpeza automática

---

### Comparação: React vs Java

```typescript
// React
const [count, setCount] = useState(0);

// é equivalente a...

```

```java
// Java
private int count = 0;

public void setCount(int newValue) {
  this.count = newValue;
  this.render();  // Re-renderizar (automático em React!)
}
```

---

## Exemplo 2: Componente com Props (Parâmetros)

### ❌ Sem Props (Hard-coded)

```typescript
export function CartaoVoluntario() {
  return (
    <div className="border p-4 rounded">
      <h3>João Silva</h3>
      <p>joao@email.com</p>
    </div>
  );
}
```

**Problema:** Só mostra João. Para Maria, precisa duplicar código.

---

### ✅ Com Props (Parametrizado)

```typescript
interface CartaoVoluntarioProps {
  nome: string;
  email: string;
}

export function CartaoVoluntario({ nome, email }: CartaoVoluntarioProps) {
  return (
    <div className="border p-4 rounded">
      <h3>{nome}</h3>
      <p>{email}</p>
    </div>
  );
}

// Usar:
<CartaoVoluntario nome="João Silva" email="joao@email.com" />
<CartaoVoluntario nome="Maria Santos" email="maria@email.com" />
<CartaoVoluntario nome="Pedro Costa" email="pedro@email.com" />
```

**Vantagens:**
- ✓ Componente reutilizável
- ✓ Dados dinâmicos
- ✓ Sem duplicação

---

### Comparação: Props vs Parâmetros Java

```typescript
// React Props
interface Props {
  nome: string;
  email: string;
}

export function CartaoVoluntario({ nome, email }: Props) {
  return <div>{nome}</div>;
}

// é equivalente a...

```

```java
// Java Constructor
class CartaoVoluntario {
  private String nome;
  private String email;
  
  public CartaoVoluntario(String nome, String email) {
    this.nome = nome;
    this.email = email;
  }
  
  public void render() {
    System.out.println(nome);
  }
}
```

---

## Exemplo 3: Componente com Estado + Props

Agora ficamos mais próximo do Java!

```typescript
interface CartaoVoluntarioProps {
  id: number;
  nome: string;
  email: string;
}

export function CartaoVoluntarioEditavel({ id, nome: nomeInicial, email: emailInicial }: CartaoVoluntarioProps) {
  // Estado local
  const [nome, setNome] = useState(nomeInicial);
  const [email, setEmail] = useState(emailInicial);
  const [isEditing, setIsEditing] = useState(false);
  
  // Handlers
  const handleSave = () => {
    // Chamar API para salvar
    console.log('Salvando:', { id, nome, email });
    setIsEditing(false);
  };
  
  // Render condicional
  if (isEditing) {
    return (
      <div className="border p-4 rounded space-y-4">
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <div className="flex gap-2">
          <button onClick={handleSave}>Salvar</button>
          <button onClick={() => setIsEditing(false)}>Cancelar</button>
        </div>
      </div>
    );
  }
  
  // Modo visualização
  return (
    <div className="border p-4 rounded">
      <h3>{nome}</h3>
      <p>{email}</p>
      <button onClick={() => setIsEditing(true)}>Editar</button>
    </div>
  );
}
```

**Anatomia:**
- Props (entrada): `id`, `nome`, `email`
- Estado local: `nome`, `email`, `isEditing`
- Handlers: `handleSave`
- Render condicional: `if (isEditing)`
- JSX (saída): HTML renderizado

---

### Comparação: React vs Java (Mais Realista)

```typescript
// React Component (Funcional)
export function CartaoVoluntario({ id, nomeInicial, emailInicial }) {
  const [nome, setNome] = useState(nomeInicial);
  const [email, setEmail] = useState(emailInicial);
  
  const handleSave = () => {
    api.put(`/voluntarios/${id}`, { nome, email });
  };
  
  return <div>{nome}</div>;
}
```

```java
// Java Class (Clássico)
public class CartaoVoluntario {
  private final int id;
  private String nome;
  private String email;
  
  public CartaoVoluntario(int id, String nomeInicial, String emailInicial) {
    this.id = id;
    this.nome = nomeInicial;
    this.email = emailInicial;
  }
  
  public void save() {
    api.put("/voluntarios/" + id, new Data(nome, email));
  }
  
  public void render() {
    System.out.println(nome);
  }
}
```

**Diferenças:**
- React usa **funções** em vez de classes (mais simples!)
- React re-renderiza **automaticamente** quando estado muda
- Java precisa chamar `render()` manualmente

---

## Exemplo 4: Hook Customizado (Lógica Reutilizável)

Quando lógica é complexa, extrair em um hook!

### ❌ Sem Hook (Repetição)

```typescript
export function Pagina1() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await api.post('/login', {email, password});
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return <form onSubmit={handleLogin}>...</form>;
}

// Outra página precisa mesmo código:
export function Pagina2() {
  // ... repetir tudo novamente!
}
```

---

### ✅ Com Hook Customizado

```typescript
// hooks/useForm.ts
export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (onSubmit) => async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    values,
    setValues,
    error,
    isLoading,
    handleSubmit,
  };
}

// pages/Pagina1.tsx
export function Pagina1() {
  const { values, setValues, error, isLoading, handleSubmit } = useForm({
    email: '',
    password: '',
  });
  
  return (
    <form onSubmit={handleSubmit(async (vals) => {
      await api.post('/login', vals);
    })}>
      <input value={values.email} onChange={(e) => setValues({...values, email: e.target.value})} />
      {error && <span className="text-red-500">{error}</span>}
      <button disabled={isLoading}>{isLoading ? 'Carregando...' : 'Login'}</button>
    </form>
  );
}

// pages/Pagina2.tsx
export function Pagina2() {
  const { values, setValues, error, isLoading, handleSubmit } = useForm({
    email: '',
    password: '',
  });
  
  return <form>...</form>;  // Mesmo pattern!
}
```

**Vantagem:** Lógica centralizada, reutilizável, testável.

---

### Comparação: Hook vs Service em Java

```typescript
// React Hook
export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  // ... lógica
  return { values, setValues, handleSubmit };
}

// é equivalente a...

```

```java
// Java Service
@Service
public class FormService {
  private Map<String, Object> values = new HashMap<>();
  
  public void setValues(Map<String, Object> newValues) {
    this.values = newValues;
  }
  
  public Map<String, Object> getValues() {
    return values;
  }
  
  // ... mais lógica
}

// Usar:
@Autowired
private FormService formService;

formService.setValues(newValues);
```

**Diferenças:**
- Hook é **função**, Service é **classe**
- Hook é **local** ao componente, Service é **global**
- Hook usa **Hooks API**, Service usa **Spring**

---

## Exemplo 5: Componente com Requisição HTTP

### O Padrão Completo

```typescript
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function ListaVoluntarios() {
  // 1. ESTADO
  const [voluntarios, setVoluntarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 2. SIDE EFFECT (requisição ao carregar)
  useEffect(() => {
    const fetchVoluntarios = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/crescer-aprender/voluntarios');
        setVoluntarios(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVoluntarios();
  }, []);  // [] = executar apenas uma vez, no mount
  
  // 3. RENDER
  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <div>
      {voluntarios.map(v => (
        <div key={v.id} className="border p-4">
          {v.nome}
        </div>
      ))}
    </div>
  );
}
```

**Anatomia:**
- Estado: `voluntarios`, `isLoading`, `error`
- useEffect: Buscar dados ao carregar componente
- Dependency array `[]`: Executar uma vez
- Render condicional: Loading, erro, ou dados

---

### Comparação: React vs Java (Ainda Melhor!)

```typescript
// React (sem library, manual)
const [data, setData] = useState([]);
useEffect(() => {
  api.get('/api').then(response => setData(response.data));
}, []);

// é equivalente a...

```

```java
// Java (sem library, manual)
private List<Data> data = new ArrayList<>();

public void init() {  // @PostConstruct
  this.data = api.get("/api");
}
```

**Mas React Query simplifica:**

```typescript
// React (com React Query)
const { data, isLoading, error } = useQuery({
  queryKey: ['voluntarios'],
  queryFn: () => api.get('/voluntarios')
});

// é equivalente a...

```

```java
// Java (com Spring)
@GetMapping("/voluntarios")
public ResponseEntity<List<Voluntario>> listar() {
  return ResponseEntity.ok(voluntarioService.listar());
}
```

---

## Exemplo 6: Componente Container vs Componente Presentacional

### Padrão: Separar Lógica de UI

#### Container (Lógica)

```typescript
// components/VoluntariosContainer.tsx
export function VoluntariosContainer() {
  // TODA lógica aqui
  const [voluntarios, setVoluntarios] = useState([]);
  
  const handleAdicionar = (novo) => {
    setVoluntarios([...voluntarios, novo]);
  };
  
  const handleRemover = (id) => {
    setVoluntarios(voluntarios.filter(v => v.id !== id));
  };
  
  // Passar tudo como props para componente presentacional
  return (
    <VoluntariosView
      voluntarios={voluntarios}
      onAdicionar={handleAdicionar}
      onRemover={handleRemover}
    />
  );
}
```

#### Presentacional (UI)

```typescript
// components/VoluntariosView.tsx
export function VoluntariosView({ voluntarios, onAdicionar, onRemover }) {
  // SÓ renderizar aqui, sem lógica
  return (
    <div>
      {voluntarios.map(v => (
        <div key={v.id}>
          {v.nome}
          <button onClick={() => onRemover(v.id)}>Remover</button>
        </div>
      ))}
      <button onClick={() => onAdicionar({nome: 'Novo'})}>
        Adicionar
      </button>
    </div>
  );
}
```

**Vantagens:**
- Container = testável (lógica)
- View = reutilizável (pode usar com dados diferentes)
- Separação de responsabilidades (tipo Model/View em Java)

---

### Comparação: Container/Presentational vs Java MVC

```
React:                          Java MVC:
├─ Container (Lógica)     ↔    ├─ Controller
├─ Presentational (UI)    ↔    ├─ View
└─ Props (Dados)          ↔    └─ Model
```

---

## Checklist: Entendi um Componente?

Quando olhar para um componente React, verifique:

- [ ] **Imports:** Quais dependencies ele usa?
- [ ] **Interface:** Quais props ele recebe?
- [ ] **Estado:** Quais `useState()` tem?
- [ ] **Effects:** Quais `useEffect()` tem?
- [ ] **Handlers:** Quais funções tem?
- [ ] **Render:** O que ele retorna (JSX)?
- [ ] **Dependency Array:** Quando re-executar?

---

## Exemplo Completo: Formulário de Voluntário

```typescript
/**
 * Componente para criar/editar voluntário
 * Props: id (opcional - se undefined, é novo; se existe, é edição)
 */

import { useState, useEffect } from 'react';
import { useVoluntario, useAtualizarVoluntario, useCriarVoluntario } from '@/hooks/useVoluntarios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface FormVoluntarioProps {
  id?: number;
  onSuccess?: () => void;
}

export function FormVoluntario({ id, onSuccess }: FormVoluntarioProps) {
  // 1. ESTADO LOCAL
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  
  // 2. REQUISIÇÕES
  const { data: voluntarioExistente, isLoading: carregando } = useVoluntario(id ?? 0);
  const { mutate: atualizar, isPending: atualizando } = useAtualizarVoluntario();
  const { mutate: criar, isPending: criando } = useCriarVoluntario();
  
  // 3. EFFECT - Preencher form ao carregar
  useEffect(() => {
    if (voluntarioExistente) {
      setNome(voluntarioExistente.nome);
      setEmail(voluntarioExistente.email);
      setTelefone(voluntarioExistente.telefone || '');
    }
  }, [voluntarioExistente]);
  
  // 4. HANDLERS
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dados = { nome, email, telefone };
    
    if (id) {
      // Editar
      atualizar({ id, voluntario: dados }, {
        onSuccess: () => {
          onSuccess?.();
        }
      });
    } else {
      // Criar novo
      criar(dados, {
        onSuccess: () => {
          setNome('');
          setEmail('');
          setTelefone('');
          onSuccess?.();
        }
      });
    }
  };
  
  // 5. RENDER
  const isLoading = carregando;
  const isSaving = atualizando || criando;
  
  if (isLoading) return <div>Carregando...</div>;
  
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {id ? 'Editar Voluntário' : 'Novo Voluntário'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Nome *</label>
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Email *</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Telefone</label>
          <Input
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
```

**Explicação passo a passo:**
1. Props recebe `id` (opcional)
2. Estado local para inputs
3. Hook busca dados se `id` existe
4. Effect preenche form quando dados chegam
5. Handler chama criar ou atualizar
6. Render mostra loading, form, ou mensagem de sucesso

---

## 🎓 Resumo: Partes de um Componente React

```
┌─────────────────────────────────────────────┐
│   COMPONENTE REACT = FUNÇÃO JAVASCRIPT      │
├─────────────────────────────────────────────┤
│                                             │
│ 1. IMPORTS                                  │
│    import { useState } from 'react';        │
│                                             │
│ 2. INTERFACE/TYPES                          │
│    interface Props { id: number }           │
│                                             │
│ 3. COMPONENTE (função)                      │
│    export function Foo(props) {             │
│                                             │
│      4. ESTADO                              │
│         const [x, setX] = useState(0);      │
│                                             │
│      5. HOOKS                               │
│         const data = useQuery(...);         │
│                                             │
│      6. EFFECTS                             │
│         useEffect(() => {...}, []);         │
│                                             │
│      7. HANDLERS                            │
│         const onClick = () => {...};        │
│                                             │
│      8. RENDER (JSX)                        │
│         return <div>{x}</div>;              │
│    }                                        │
│                                             │
└─────────────────────────────────────────────┘
```

---

**Pratique vendo componentes reais no projeto! 🚀**

