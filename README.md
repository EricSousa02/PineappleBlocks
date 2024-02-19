<div align="center">
  <img src="public/assets/favicon.ico" width="100" alt="PineappleBlocks Logo">
</div>


## 📋 <a name="table">Tabela de Conteúdos</a>

1. 🤖 [Introdução](#introduction)
2. ⚙️ [Tecnologias Utilizadas](#tech-stack)
3. 🔋 [Recursos](#features)
4. 🤸 [Início Rápido](#quick-start)

## <a name="introduction">🤖 Introdução</a>

Um clone minimalista do Figma para mostrar como adicionar recursos do mundo real, como colaboração ao vivo com chat de cursor, comentários, reações e desenho de designs (formas, upload de imagens) no canvas usando fabric.js.

## <a name="tech-stack">⚙️ Tecnologias Utilizadas</a>

- ![Next](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)&nbsp;
- ![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)&nbsp;
- ![Liveblocks](https://img.shields.io/badge/Liveblocks-792DE4?style=for-the-badge&logo=pytorch-lightning&logoColor=white)&nbsp;
- ![FabricJS](https://img.shields.io/badge/Fabric%20JS-9696F5?style=for-the-badge&logo=pytorch-lightning&logoColor=white)&nbsp;
- ![Shadcn](https://img.shields.io/badge/Shadcn-09090B?style=for-the-badge&logo=pytorch-lightning&logoColor=white)&nbsp;
- ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)&nbsp;

## <a name="features">🔋 Recursos</a>

👉 **Múltiplos Cursores, Chat de Cursor e Reações**: Permite que vários usuários colaborem simultaneamente, mostrando cursores individuais, possibilitando chat em tempo real e reações para comunicação interativa.

👉 **Usuários Ativos**: Exibe uma lista de usuários atualmente ativos no ambiente colaborativo, fornecendo visibilidade sobre quem está envolvido no momento.

👉 **Bolhas de Comentários**: Permite que os usuários anexem comentários a elementos específicos no canvas, promovendo comunicação e feedback sobre componentes de design.

👉 **Criação de Diferentes Formas**: Fornece ferramentas para que os usuários gerem uma variedade de formas no canvas, permitindo elementos de design diversos.

👉 **Upload de Imagens**: Importa imagens para o canvas, expandindo a variedade de conteúdo visual no design.

👉 **Customização**: Permite que os usuários ajustem as propriedades dos elementos de design, oferecendo flexibilidade na personalização e ajuste fino de componentes visuais.

👉 **Desenho Livre**: Permite que os usuários desenhem livremente no canvas, promovendo expressão artística e design criativo.

👉 **Desfazer/Refazer**: Oferece a capacidade de reverter (desfazer) ou restaurar (refazer) ações anteriores, oferecendo flexibilidade na tomada de decisões de design.

👉 **Ações do Teclado**: Permite que os usuários utilizem atalhos de teclado para várias ações, incluindo copiar, colar, excluir e acionar atalhos para recursos como abrir chat de cursor, reações, etc., melhorando eficiência e acessibilidade.

👉 **Histórico**: Revisa o histórico cronológico de ações e alterações feitas no canvas, auxiliando no gerenciamento de projetos e controle de versões.

👉 **Excluir, Escalar, Mover, Limpar, Exportar Canvas**: Oferece uma variedade de funções para gerenciar elementos de design, incluindo exclusão, escala, movimentação, limpeza do canvas e exportação do design final para uso externo.

e muitos mais, incluindo arquitetura de código, ganchos avançados do React e reutilização.

## <a name="quick-start">🤸 Início Rápido</a>

Siga estas etapas para configurar o projeto localmente em sua máquina.

**Pré-requisitos**

Certifique-se de ter o seguinte instalado em sua máquina:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Clonando o Repositório**

```bash
git clone https://github.com/EricSousa02/PineappleBlocks.git
````

**Configurando env**

acesse o site https://liveblocks.io faça sua conta e crie um projeto, então acesse esse projeto e vá em "API KEYS"
la você copia sua chave publica da api e cole em um arquivo chamado ".env.local" e faça como mostrado a seguir:
```bash
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=sua_chave
```

**Iniciando a aplicação**

```bash
npm install

# Para rodar em desenvolvimento:
npm run dev

# Para rodar em Produção:
npm run build
npm run start
````
