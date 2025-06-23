# Dr. Sávio do Carmo - Oftalmologia de Excelência

Landing page profissional para o oftalmologista Dr. Sávio do Carmo, com painel administrativo integrado ao Supabase para gerenciamento de conteúdo.

## Tecnologias Utilizadas

- React com TypeScript
- Tailwind CSS para estilização
- Framer Motion para animações
- Supabase para autenticação e banco de dados
- React Router para navegação
- React Hook Form para formulários
- Lucide React para ícones

## Recursos

### Landing Page
- Design elegante e profissional focado em oftalmologia
- Seções completas: banner principal, serviços, sobre o médico, depoimentos, contato
- Animações suaves para melhor experiência do usuário
- Design responsivo para todos os dispositivos
- Paleta de cores em tons de azul transmitindo confiança e limpeza

### Painel Administrativo
- Autenticação segura com email/senha via Supabase
- Gerenciamento completo do conteúdo do site:
  - Banner principal
  - Serviços oferecidos
  - Informações sobre o médico
  - Depoimentos de pacientes
- Interface intuitiva para edição de conteúdo

## Estrutura do Projeto

```
├── src/
│   ├── components/
│   │   ├── admin/        # Componentes do painel administrativo
│   │   └── landing/      # Componentes da landing page
│   ├── lib/              # Utilitários e configurações
│   ├── pages/            # Páginas da aplicação
│   │   ├── admin/        # Páginas do painel administrativo
│   │   └── LandingPage.tsx
│   ├── types/            # Tipos TypeScript
│   ├── App.tsx           # Componente principal
│   └── main.tsx          # Ponto de entrada da aplicação
└── supabase/
    └── migrations/       # Migrations SQL para o Supabase
```

## Configuração do Banco de Dados

O projeto utiliza Supabase como banco de dados e serviço de autenticação. As seguintes tabelas são criadas:

- `services`: Armazena os serviços oferecidos pelo médico
- `testimonials`: Armazena depoimentos de pacientes
- `hero_content`: Armazena o conteúdo do banner principal
- `about`: Armazena informações sobre o médico

## Como Iniciar

1. Clone o repositório
2. Instale as dependências com `npm install`
3. Configure suas variáveis de ambiente no arquivo `.env` com suas credenciais do Supabase
4. Execute `npm run dev` para iniciar o servidor de desenvolvimento
5. Acesse o painel administrativo em `/admin/login`

## Conexão com Supabase

Para conectar-se ao Supabase, siga estes passos:

1. Crie uma conta no [Supabase](https://supabase.io)
2. Crie um novo projeto
3. Obtenha a URL e a chave anônima do projeto nas configurações da API
4. Configure essas variáveis no arquivo `.env`:

```
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
```

5. Execute o arquivo de migração em `supabase/migrations/create_schema.sql` no editor SQL do Supabase para criar as tabelas necessárias