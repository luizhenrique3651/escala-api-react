# Crescer & Aprender - Frontend

Sistema de gestão de escalas para voluntários do projeto social Crescer & Aprender.

## ⚠️ Importante: Desenvolvimento Local

O preview do Lovable roda em HTTPS, mas seu backend Java roda em `http://localhost:8080`. Navegadores bloqueiam requisições HTTP de páginas HTTPS (mixed content).

**Para testar com seu backend local, rode o frontend localmente:**

### Instalação

```bash
# Clone o repositório
git clone <YOUR_GIT_URL>

# Entre na pasta
cd <YOUR_PROJECT_NAME>

# Instale as dependências
npm install

# Rode o frontend
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

### Configuração do Backend (CORS)

O backend precisa permitir CORS:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
    }
}
```

## 📁 Estrutura

- `/src/pages` - Login, Dashboard, Voluntários, Escalas
- `/src/contexts` - AuthContext (JWT)
- `/src/hooks` - useVoluntarios, useEscalas
- `/src/lib/api.ts` - Configuração Axios

## 🛠️ Tecnologias

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- React Query + Axios
- Framer Motion
