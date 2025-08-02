# Repositório do Portal Web da Igreja Batista Central em Taguatinga (IBCT)

Este repositório contém o código-fonte e a documentação do portal web oficial da Igreja Batista Central em Taguatinga. O projeto visa fornecer uma plataforma digital centralizada para comunicação, engajamento e disponibilização de recursos para a comunidade.

## Sumário

- [Visão Geral do Sistema](#visão-geral-do-sistema)
- [Pilha Tecnológica (Technology Stack)](#pilha-tecnológica-technology-stack)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução Local](#instalação-e-execução-local)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Processo de Contribuição](#processo-de-contribuição)
- [Licença](#licença)

## Visão Geral do Sistema

O sistema é composto por uma aplicação front-end estática (HTML/CSS/JS), servida pelo Firebase Hosting, que consome dados de serviços do Firebase (Firestore e Authentication) para funcionalidades dinâmicas.

### Funcionalidades Implementadas:

*   **Front-end Público:**
    *   **Home:** Apresentação de eventos, ministérios e informações de contato.
    *   **IBCT TV:** Galeria de vídeos com sistema de busca e filtragem.
    *   **Páginas de Ministérios:** Seções dedicadas com conteúdo específico para cada departamento (ex: Hodos).
    *   **Institucional:** Informações sobre a história, visão e liderança da igreja.
*   **Painel Administrativo (Área Restrita):**
    *   Interface para autenticação de usuários.
    *   Gerenciamento de conteúdo (CRUD para eventos, postagens, avisos).
    *   Administração de usuários e permissões.

## Pilha Tecnológica (Technology Stack)

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) | Estrutura, estilo e interatividade do client-side. | 
| **Backend (Serverless)** | Firebase | Plataforma utilizada para autenticação, banco de dados e hospedagem. |
| | Firebase Authentication | Gerenciamento de identidade e controle de acesso. |
| | Firestore | Banco de dados NoSQL para armazenamento de dados dinâmicos. |
| **Infraestrutura** | Firebase Hosting | Hospedagem de conteúdo estático e dinâmico com CDN global. |
| **Desenvolvimento** | Live Server (VS Code) ou similar | Para servir os arquivos localmente e evitar erros de CORS. |

## Pré-requisitos

- [Git](https://git-scm.com/)
- Um navegador web moderno.
- (Opcional) [Firebase CLI](https://firebase.google.com/docs/cli) para deploy e gerenciamento do projeto: `npm install -g firebase-tools`.
- (Opcional) Um editor de código como o [VS Code](https://code.visualstudio.com/) com a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).

## Instalação e Execução Local

1.  **Clonar o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/IBCT_site.git
    cd IBCT_site
    ```

2.  **Executar o ambiente de desenvolvimento:**
    *   Não há dependências para instalar ou um processo de build.
    *   Abra o diretório no VS Code e clique em "Go Live" no canto inferior direito para iniciar o Live Server.
    *   Alternativamente, abra qualquer arquivo `.html` diretamente no seu navegador (algumas funcionalidades que carregam dados de arquivos `.json` locais podem não funcionar devido a políticas de segurança do navegador).

3.  **(Opcional) Executar Emuladores do Firebase:**
    Para desenvolver e testar funcionalidades de backend localmente:
    ```bash
    firebase emulators:start
    ```

## Estrutura do Projeto

A estrutura de diretórios foi projetada para separar as diferentes áreas do site de forma lógica.

```
/
├── admin/                # Contém o painel administrativo
│   ├── css/              # Estilos do painel
│   └── js/               # Scripts do painel
├── componentes/          # Componentes reutilizáveis (ex: calendário)
├── css/                  # Arquivos de estilo globais
├── departamentos/        # Páginas específicas para cada ministério
│   └── hodos/            # Exemplo: Ministério de Jovens Hodos
├── img/                  # Imagens globais (logos, etc.)
├── js/                   # Scripts JavaScript globais
├── index.html            # Página inicial
├── ibct_tv.html          # Página da IBCT TV
├── sobre_ibct.html       # Página sobre a igreja
├── .gitignore            # Especificação de arquivos ignorados pelo Git
├── firebase.json         # Configuração do Firebase (Hosting, Emulators)
├── firestore.rules       # Regras de segurança do Firestore
└── README.md             # Documentação do projeto
```

## Testes

Atualmente, o projeto não possui uma suíte de testes automatizados. A verificação de funcionalidades é realizada manualmente.

## Processo de Contribuição

Contribuições são muito bem-vindas. Para propor alterações, por favor, siga o processo abaixo:

1.  Crie um fork do repositório.
2.  Crie uma nova branch a partir da `main` (`git checkout -b feature/nome-da-feature`).
3.  Desenvolva a funcionalidade.
4.  Faça o commit de suas alterações seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/).
5.  Abra um Pull Request detalhando as alterações realizadas.

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo `LICENSE` para mais detalhes (se aplicável).