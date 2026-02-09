# Crescer & Aprender - Frontend

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Interface web para o sistema de gestão de escalas de voluntários do projeto social **Crescer & Aprender**. Este frontend consome a [Escala API](https://github.com/luizhenrique3651/escala-crescer-aprender-api) e proporciona uma experiência moderna e intuitiva para coordenadores e voluntários.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [História do Desenvolvimento](#-história-do-desenvolvimento)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Execução](#-instalação-e-execução)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Documentação de Onboarding](#-documentação-de-onboarding)
- [Backend](#-backend)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)
- [Contato](#-contato)

---

## 💡 Sobre o Projeto

O **Crescer & Aprender** é um projeto social que oferece aulas gratuitas de Informática, Matemática e Língua Portuguesa para crianças em situação de vulnerabilidade social. Todo sábado, aproximadamente 40 voluntários se organizam para ministrar aulas presenciais.

Este sistema web foi desenvolvido para:

- ✅ Facilitar o cadastro e gestão de voluntários
- ✅ Registrar disponibilidade dos voluntários
- ✅ Gerar escalas automáticas respeitando disponibilidade e regras do projeto
- ✅ Visualizar escalas por data ou por voluntário
- ✅ Editar escalas manualmente quando necessário
- ✅ Controlar acesso através de autenticação JWT

---

## 📖 História do Desenvolvimento

### Fase Inicial: Prototipação com Lovable

O desenvolvimento deste projeto foi **iniciado utilizando o [Lovable](https://lovable.dev)**, uma plataforma de criação assistida por IA que gerou rapidamente a estrutura base do frontend. O Lovable foi fundamental para:

- 🚀 Criar a estrutura inicial do projeto React + TypeScript
- 🎨 Configurar o design system com Tailwind CSS e shadcn/ui
- 🔧 Estabelecer a arquitetura de pastas e componentes
- 📱 Implementar as primeiras telas (Login, Dashboard, Voluntários, Escalas)

**Tecnologias já estabelecidas pelo Lovable:**
- React 18 com TypeScript
- Vite como bundler
- Tailwind CSS para estilização
- shadcn/ui para componentes de UI
- React Query (TanStack Query) para gerenciamento de estado servidor
- Axios para requisições HTTP
- React Router para navegação
- Framer Motion para animações

### Fase de Continuidade: Desenvolvimento Manual

Após a geração inicial, o desenvolvimento foi **continuado manualmente** por mim (Luiz Henrique), um desenvolvedor com background em Java/Spring Boot que está fazendo a transição para o ecossistema React. 

**Desafios Enfrentados:**
- 🔄 Adaptação do modelo mental de Java para JavaScript/TypeScript
- ⚛️ Compreensão do paradigma de componentes e hooks do React
- 🔀 Entendimento do fluxo de dados unidirecional
- 🎯 Correção de bugs nas implementações iniciais do Lovable
- 🔧 Refatoração de código gerado automaticamente

**Estratégia de Aprendizado:**

Durante todo o processo, utilizei o **GitHub Copilot** não como gerador automático de código, mas como um **mentor virtual**. O Copilot está sendo essencial para:

- 📚 Explicar peculiaridades do React comparadas ao Java/Spring
- 🏗️ Clarificar detalhes da arquitetura de componentes
- 🔍 Entender conceitos como hooks, contextos e custom hooks
- 💡 Sugerir boas práticas e padrões do ecossistema React
- 🎓 Simular um desenvolvedor sênior orientando um júnior

Essa abordagem está me permitindo aprender profundamente os conceitos, ao invés de apenas copiar código gerado. Está sendo uma experiência semelhante a ter um programador sênior me guiando até conseguir fazer meu primeiro Pull Request de forma consciente e compreendendo cada decisão técnica.

### Documentação do Processo

Todo o passo a passo dessa jornada de aprendizado está sendo documentado na pasta **`onboardingDoc/`**, que contém:

- 📝 Anotações sobre conceitos aprendidos
- 🔄 Comparações entre paradigmas Java e React
- 🐛 Problemas encontrados e suas soluções
- 💭 Reflexões sobre decisões arquiteturais
- 📖 Guias de referência rápida

Esta documentação serve como referência para outros desenvolvedores que estejam fazendo transição similar ou queiram entender o processo de desenvolvimento do projeto.

---

## 🛠️ Tecnologias

### Core
- **[React 18](https://reactjs.org/)** - Biblioteca para interfaces de usuário
- **[TypeScript 5.5](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Vite 5](https://vitejs.dev/)** - Build tool e dev server ultrarrápido

### UI/UX
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes de UI reutilizáveis e acessíveis
- **[Framer Motion](https://www.framer.com/motion/)** - Biblioteca de animações

### Estado e Dados
- **[TanStack Query (React Query)](https://tanstack.com/query)** - Gerenciamento de estado assíncrono
- **[Axios](https://axios-http.com/)** - Cliente HTTP
- **[React Router](https://reactrouter.com/)** - Roteamento client-side

### Qualidade de Código
- **[ESLint](https://eslint.org/)** - Linter para JavaScript/TypeScript
- **[Vitest](https://vitest.dev/)** - Framework de testes unitários

### Ferramentas de Desenvolvimento
- **[GitHub Copilot](https://github.com/features/copilot)** - Assistente de código IA (usado como mentor)
- **[Lovable](https://lovable.dev)** - Plataforma de prototipação assistida por IA

---

## ✨ Funcionalidades

### Autenticação
- 🔐 Login com e-mail e senha
- 🎫 Autenticação via JWT (JSON Web Token)
- 🚪 Logout e limpeza de sessão
- 🛡️ Proteção de rotas baseada em autenticação

### Gestão de Voluntários
- 👥 Listagem de voluntários com busca e filtros
- ➕ Cadastro de novos voluntários
- ✏️ Edição de dados de voluntários
- 🗑️ Exclusão de voluntários (com validação de escalas)
- 📊 Visualização de estatísticas de participação

### Gestão de Escalas
- 📅 Visualização de escalas por data
- 🗓️ Calendário mensal de escalas
- 👤 Consulta de escalas por voluntário
- 🎲 Geração automática de escalas
- ✍️ Edição manual de escalas
- 📋 Validação de regras (mínimo/máximo de voluntários por aula)

### Interface
- 📱 Design responsivo (desktop, tablet, mobile)
- 🌓 Animações suaves e transições
- ♿ Acessibilidade (WCAG guidelines)
- 🎨 Interface moderna e intuitiva

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn** ou **bun**
- **Git**
- **Backend da API** rodando (veja seção [Backend](#-backend))

---

## 🚀 Instalação e Execução

### 1. Clone o Repositório

```bash
git clone https://github.com/luizhenrique3651/escala-api-react.git
cd escala-api-react
```

### 2. Instale as Dependências

```bash
npm install
# ou
yarn install
# ou
bun install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080
```

> **Nota:** Se o backend estiver rodando em outra porta ou host, ajuste conforme necessário.

### 4. Execute o Projeto

```bash
npm run dev
# ou
yarn dev
# ou
bun dev
```

O aplicativo estará disponível em: **http://localhost:8081**

### 5. Execute os Testes (Opcional)

```bash
npm run test
# ou
yarn test
# ou
bun test
```

---

## ⚠️ Importante: HTTPS vs HTTP (Mixed Content)

O preview do Lovable roda em **HTTPS**, mas o backend Java geralmente roda em **HTTP** (`http://localhost:8080`). Navegadores modernos bloqueiam requisições HTTP de páginas HTTPS por questões de segurança (mixed content).

**Para testar com o backend local, é necessário rodar o frontend localmente** conforme as instruções acima.

### Configuração de CORS no Backend

Certifique-se de que o backend está configurado para aceitar requisições do frontend. Exemplo de configuração Spring Boot:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

---

## 📁 Estrutura do Projeto

```
escala-api-react/
├── public/                  # Arquivos públicos estáticos
├── src/
│   ├── assets/             # Imagens, ícones, etc.
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/            # Componentes shadcn/ui
│   │   └── ...
│   ├── contexts/          # Contextos React (AuthContext, etc.)
│   ├── hooks/             # Custom hooks
│   │   ├── useVoluntarios.ts
│   │   ├── useEscalas.ts
│   │   └── ...
│   ├── lib/               # Utilitários e configurações
│   │   ├── api.ts         # Configuração do Axios
│   │   └── utils.ts
│   ├── pages/             # Páginas da aplicação
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Voluntarios.tsx
│   │   ├── Escalas.tsx
│   │   └── ...
│   ├── types/             # Definições de tipos TypeScript
│   ├── App.tsx            # Componente raiz
│   └── main.tsx           # Entry point
├── onboardingDoc/         # Documentação do processo de aprendizado
├── .env                   # Variáveis de ambiente (não versionado)
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Destaques da Arquitetura

- **`/contexts`**: Implementa Context API para gerenciamento de estado global (autenticação)
- **`/hooks`**: Custom hooks para encapsular lógica de negócio e chamadas à API
- **`/lib/api.ts`**: Configuração centralizada do Axios com interceptors para JWT
- **`/pages`**: Componentes de página que representam rotas da aplicação
- **`/components/ui`**: Componentes do shadcn/ui totalmente customizáveis

---

## 📚 Documentação de Onboarding

A pasta **`onboardingDoc/`** contém toda a documentação do processo de aprendizado e desenvolvimento:

```
onboardingDoc/
├── 01-conceitos-react.md          # Fundamentos do React
├── 02-react-vs-java.md            # Comparação de paradigmas
├── 03-hooks-explicados.md         # Deep dive em hooks
├── 04-state-management.md         # Gerenciamento de estado
├── 05-problemas-resolvidos.md     # Debug e soluções
├── 06-boas-praticas.md           # Padrões e convenções
└── README.md                      # Índice da documentação
```

Esta documentação é especialmente útil para:

- 🎓 Desenvolvedores Java aprendendo React
- 🔄 Pessoas fazendo transição de backend para frontend
- 📖 Entender decisões arquiteturais do projeto
- 🐛 Referência de problemas comuns e soluções

---

## 🔗 Backend

Este frontend consome a **Escala API**, desenvolvida em Java com Spring Boot.

**Repositório do Backend:**
👉 [https://github.com/luizhenrique3651/escala-crescer-aprender-api](https://github.com/luizhenrique3651/escala-crescer-aprender-api)

### Como executar o Backend

```bash
git clone https://github.com/luizhenrique3651/escala-crescer-aprender-api.git
cd escala-crescer-aprender-api
docker compose up --build
```

O backend estará disponível em: **http://localhost:8080**

### Documentação da API (Swagger)

Acesse: **http://localhost:8080/swagger-ui/index.html**

**Credenciais padrão:**
- E-mail: `admin@email.com`
- Senha: `cresceraprender`

> ⚠️ **Importante:** Altere as credenciais padrão em produção!

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Este é um projeto open source e toda ajuda é apreciada.

### Como Contribuir

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

### Diretrizes

- Siga os padrões de código do projeto (ESLint)
- Escreva mensagens de commit claras e descritivas
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Respeite o código de conduta do projeto

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Contato

### Desenvolvedor
**Luiz Henrique**
- GitHub: [@luizhenrique3651](https://github.com/luizhenrique3651)
- LinkedIn: [luizhenrique3651](https://linkedin.com/in/luizhenrique3651)

### Projeto Crescer & Aprender
- Instagram: [@proj_crescereaprender](https://www.instagram.com/proj_crescereaprender/)
- Repositório Backend: [escala-crescer-aprender-api](https://github.com/luizhenrique3651/escala-crescer-aprender-api)

---

## 🌟 Agradecimentos

- 🙏 À equipe do **Crescer & Aprender** por todo o trabalho social
- 🤖 Ao **Lovable** pela base inicial do projeto
- 💻 Ao **GitHub Copilot** pela orientação técnica
- 👥 À comunidade **React** pelos excelentes recursos de aprendizado
- ❤️ A todos os **voluntários** que dedicam seu tempo às crianças

---

<div align="center">
  
**Desenvolvido com ❤️ para o Projeto Crescer & Aprender**

⭐ Se este projeto foi útil para você, considere dar uma estrela!

</div>
