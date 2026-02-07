# 📚 Guias de Aprendizado para Dev Backend Java

Bem-vindo ao projeto Crescer & Aprender! Se você é um dev backend Java novo em React/Frontend, leia os documentos nesta ordem:

---

## 🎯 Para Começar Agora

### 1. **GUIA_ARQUITETURA.md** (Leia primeiro! ⭐)
- Tempo: ~20 minutos
- O que você aprenderá:
  - Comparações entre Java e React
  - Como a aplicação é estruturada
  - Onde cada arquivo fica e por que
  - Fluxo básico de autenticação
  - Conceitos principais (useState, useEffect, Context, hooks)

**Comece aqui se:**
- Você nunca viu React antes
- Quer entender a "big picture" da aplicação
- Quer comparações diretas Java vs React

---

### 2. **DIAGRAMA_ARQUITETURA.md** (Leia em seguida)
- Tempo: ~15 minutos
- O que você aprenderá:
  - Visualização de fluxos de dados
  - Diagrama de componentes
  - Ciclo de vida completo (login até visualizar dados)
  - Como estado é gerenciado
  - HTTP request lifecycle

**Leia se:**
- Você aprende melhor com diagramas
- Quer ver o fluxo passo a passo
- Quer entender como requisições HTTP acontecem

---

### 3. **TUTORIAL_PRATICO.md** (Faça hands-on! 💻)
- Tempo: ~1-2 horas (prático)
- O que você fará:
  - Criar uma nova página de detalhes
  - Integrar com o backend
  - Praticar roteamento, forms, requisições HTTP
  - Testar tudo passo a passo

**Faça se:**
- Você já leu os 2 documentos anteriores
- Quer praticar com código real
- Quer ganhar confiança fazendo algo do zero

---

### 4. **TROUBLESHOOTING.md** (Consulte quando quebrar)
- Tempo: Consulta conforme necessário
- O que você encontrará:
  - 11 problemas comuns e soluções
  - Checklist de debug
  - Dicas do senior developer
  - Recursos para aprender mais

**Leia quando:**
- Algo não funciona como esperado
- Recebe mensagem de erro estranha
- Precisa de dica sobre dev tools
- Quer saber "quando chamar para help"

---

## 📋 Leitura Rápida (TL;DR)

Se você tem pouco tempo agora:

1. **Leia a seção "Conceitos Principais (Mapeados do Java)"** em GUIA_ARQUITETURA.md
2. **Leia a seção "Fluxo de Autenticação"** em GUIA_ARQUITETURA.md
3. **Veja o arquivo `/src/lib/api.ts`** do projeto (é o mais importante!)
4. **Execute `npm run dev`** e explore a aplicação no navegador

Isso te dará 70% do conhecimento necessário.

---

## 🎮 Hands-On Rápido (30 min)

Se você quer aprender fazendo:

1. Rodar `npm install && npm run dev`
2. Fazer login com seu backend
3. Abrir DevTools (F12) → Network
4. Clicar em botões e ver requisições HTTP
5. Ver localStorage em Application tab
6. Mudar texto em arquivo `.tsx` e ver resultado em tempo real (hot reload)

Isso vai desmistificar muita coisa!

---

## 🛣️ Roteiro Completo (Recomendado)

### Dia 1: Teoria (2-3h)
- [ ] Ler GUIA_ARQUITETURA.md
- [ ] Ler DIAGRAMA_ARQUITETURA.md
- [ ] Explorar estrutura de pastas do projeto
- [ ] Abrir alguns arquivos `.tsx` e tentar entender

### Dia 2: Prático (2-3h)
- [ ] Fazer o TUTORIAL_PRATICO.md (criar página de detalhes)
- [ ] Testar tudo com DevTools
- [ ] Entender por que funcionou

### Dia 3: Exploração (1-2h)
- [ ] Adicionar um novo campo em algum form
- [ ] Editar estilos com Tailwind
- [ ] Criar pequenas variações do tutorial

### Dia 4+: Desenvolvimento Real
- [ ] Trabalhar em features reais
- [ ] Consultar TROUBLESHOOTING.md quando quebrar
- [ ] Pedir help quando bloquear

---

## 🗂️ Estrutura de Arquivos do Projeto

```
.
├── GUIA_ARQUITETURA.md          ← Comece AQUI
├── DIAGRAMA_ARQUITETURA.md      ← Depois aqui
├── TUTORIAL_PRATICO.md          ← Faça este
├── TROUBLESHOOTING.md           ← Quando quebrar
│
├── src/
│   ├── main.tsx                 ← Ponto de entrada
│   ├── App.tsx                  ← Roteamento da app
│   │
│   ├── pages/                   ← Páginas (Login, Dashboard, etc)
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Voluntarios.tsx
│   │   ├── Escalas.tsx
│   │   └── NotFound.tsx
│   │
│   ├── components/              ← Componentes reutilizáveis
│   │   ├── layout/
│   │   │   ├── AppSidebar.tsx
│   │   │   └─ ProtectedLayout.tsx
│   │   ├── ui/                  ← Componentes shadcn/ui (botão, input, etc)
│   │   └── NavLink.tsx
│   │
│   ├── contexts/                ← Estado global
│   │   └── AuthContext.tsx      ← Gerencia login/JWT
│   │
│   ├── hooks/                   ← Lógica reutilizável
│   │   ├── useVoluntarios.ts    ← Requisições de voluntários
│   │   └── useEscalas.ts        ← Requisições de escalas
│   │
│   └── lib/                     ← Configurações
│       └── api.ts               ← ⭐ MAIS IMPORTANTE!
│
└── package.json                 ← Dependências (React, Tailwind, etc)
```

---

## 🔑 Arquivos Mais Importantes (Nessa Ordem)

1. **`/src/lib/api.ts`** ← Comece aqui!
   - Como você fala com o backend
   - Configuração de JWT
   - Todos os endpoints

2. **`/src/contexts/AuthContext.tsx`** ← Depois aqui
   - Como autenticação funciona
   - Onde JWT é armazenado
   - Como outros componentes acessam `useAuth()`

3. **`/src/App.tsx`** ← Depois aqui
   - Todas as rotas da aplicação
   - Como páginas são protegidas
   - Ordem de renderização

4. **`/src/hooks/useVoluntarios.ts`** ← Depois aqui
   - Como requisições são feitas
   - Como dados são cacheados
   - Como mutações funcionam

5. **`/src/pages/Voluntarios.tsx`** ← Exemplo real
   - Como tudo se junta
   - Exemplo de componente "pronto"
   - Pode copiar pattern para outras páginas

---

## 🎓 Antes de Começar: Mindset

### ✅ Coisas que vão parecer estranhas (mas são normais)

1. **JSX = HTML dentro de JavaScript**
   - Parece HTML mas é JavaScript
   - Verá `className` em vez de `class` (JavaScript reservado)
   - Verá `{variavel}` dentro de HTML

2. **React re-renderiza quando estado muda**
   - Isso é automático e mágico
   - Você não precisa fazer `document.getElementById()` manualmente

3. **Requisições HTTP são simples**
   - `axios.get()` em vez de RestTemplate
   - Promises em vez de Futures
   - Interceptadores são automáticos

4. **TypeScript = Type Safety**
   - É um adicional, mas **ajuda muito**
   - Quando ficar vermelho, há bug mesmo
   - Não ignore erros TypeScript!

### ❌ Coisas para NÃO fazer

- Não misture req HTTP com estado local sem React Query
- Não use `any` em TypeScript (derrota o propósito)
- Não coloque lógica complexa dentro de componentes (use hooks)
- Não ignore erros no console (sempre há razão)
- Não use inline functions em event handlers (cria a cada render)

### ✅ Boas Práticas

- Use DevTools! (F12 Network e React DevTools)
- Divida componentes grandes em menores
- Use hooks para lógica reutilizável
- Deixe TypeScript te proteger
- Teste com `npm run lint` antes de commitar

---

## 🤔 FAQ Rápido

**P: Preciso aprender JavaScript antes?**
- Não, mas ajuda. React é JavaScript, então se souber, melhor!

**P: TypeScript é obrigatório?**
- Não, mas já está no projeto. Você vai aprender!

**P: Posso rodar isso sem internet?**
- Sim, exceto para instalar pacotes. npm install uma vez.

**P: Quanto tempo para ficar confortável?**
- 1-2 semanas se estudar diariamente
- 1 mês para ser produtivo
- 3 meses para dominar

**P: Devo memorizar Tailwind?**
- Não! Google "tailwind como fazer X" sempre que precisar

**P: Por que tanto abstração (hooks, contexts)?**
- Para código ser reutilizável, testável e manutenível. Tipo Java!

**P: Posso criar um botão do zero?**
- Sim! Use o componente `<Button>` pronto ou customize

---

## 📞 Como Pedir Help

Antes de chamar seu senior, verifique:

1. **Erro em TypeScript?**
   - Google o erro
   - Verifique tipos (interface/type)
   - Use `npm run lint`

2. **Página branca sem carregar?**
   - F12 → Console → tem erro em vermelho?
   - F12 → Network → requisições estão 200 OK?
   - localStorage tem token? (`localStorage.getItem('auth_token')`)

3. **Requisição retorna 401?**
   - Backend está rodando?
   - Token está sendo enviado? (F12 → Network → Headers)
   - JWT é válido?

4. **Tailwind não aplica cor?**
   - Reinicie `npm run dev`
   - Verifique classe (ex: `bg-blue-500` é válido, `bg-blue` não)
   - Check se `@tailwind` está em `index.css`

Se depois disso ainda não funcionar, **aí chama help!** 👍

---

## 🚀 Você Está Pronto!

Parabéns por ter chegado aqui! Você tem tudo que precisa para começar.

### Próximo passo:
1. Leia **GUIA_ARQUITETURA.md**
2. Explore a pasta `/src` enquanto lê
3. Faça `npm run dev` e experimente
4. Depois leia **DIAGRAMA_ARQUITETURA.md**
5. Depois faça o **TUTORIAL_PRATICO.md**

**Boa sorte! Você vai aprender rápido! 🎉**

---

## 📚 Recursos Externos (Quando Tiver Tempo)

- [React Docs](https://react.dev/) - Melhor recurso
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Oficial
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Referência rápida
- [React Query Docs](https://tanstack.com/query/latest) - Avançado
- [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Fundamentals

---

**Criado com ❤️ para dev backend Java aprender React**

*Última atualização: Fevereiro 2026*

