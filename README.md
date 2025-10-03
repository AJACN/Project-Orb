# Project Orb 🔮

Um mini-jogo mobile desenvolvido com React Native e Expo, onde o jogador utiliza o giroscópio do celular para controlar uma esfera e coletar orbes que aparecem na tela antes que o tempo acabe.

## 🚀 Funcionalidades Implementadas

-   **🎮 Controle por Giroscópio:** Movimentação fluida da esfera do jogador baseada na inclinação do dispositivo.
-   **🏆 Sistema de Placar:** Contagem em tempo real de quantos orbes foram coletados.
-   **⏳ Timer Regressivo:** O jogo possui um cronômetro que, ao zerar, finaliza a partida.
-   **🖥️ Gerenciamento de Telas:** O jogo flui entre uma tela de "Início", a tela principal do jogo e uma tela de "Fim de Jogo" com o placar final.
-   **🔊 Efeitos Sonoros:** Um som é reproduzido a cada orbe coletado, melhorando o feedback para o jogador (utilizando `expo-av`).
-   **🔥 Dificuldade Progressiva:** A cada orbe coletado, o próximo se torna ligeiramente menor, aumentando o desafio.
-   **🎨 Fundo Dinâmico:** A cor de fundo da tela transiciona suavemente de um azul calmo para um vermelho intenso à medida que o tempo se esgota, criando uma sensação de urgência.
-   **📱 Design Responsivo:** O jogo se adapta a diferentes tamanhos de tela e considera as áreas seguras (safe areas) para evitar que elementos fiquem escondidos atrás de barras de sistema ou notches.

## 🛠️ Tecnologias Utilizadas

-   **React Native:** Framework para desenvolvimento de aplicativos móveis.
-   **Expo:** Plataforma e conjunto de ferramentas para construir e implantar aplicativos React Native.
-   **TypeScript:** Superset do JavaScript que adiciona tipagem estática ao código.
-   **Expo Sensors:** Módulo para acessar sensores do dispositivo, como o Giroscópio.
-   **Expo AV:** Módulo para manipulação de áudio e vídeo.
-   **Expo Router:** Para a estrutura de navegação baseada em arquivos.
-   **React Native Reanimated (opcional):** A estrutura do projeto inclui a biblioteca, pronta para futuras otimizações de animação.

## ⚙️ Como Executar o Projeto

Para rodar este projeto em sua máquina local, siga os passos abaixo.

### Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão LTS recomendada)
-   [Git](https://git-scm.com/)
-   Um dispositivo móvel com o app Expo Go ou um emulador Android/iOS.

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://[URL-DO-SEU-REPOSITORIO].git
    cd [NOME-DA-PASTA-DO-PROJETO]
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento do Expo:**
    ```bash
    npx expo start
    ```

4.  **Abra no seu dispositivo:**
    -   Escaneie o QR code exibido no terminal com o aplicativo Expo Go (para Android) ou o app de Câmera (para iOS).

## 📂 Estrutura do Projeto

A estrutura de pastas principal do projeto está organizada da seguinte forma:

```text
.
├── app/                # Arquivos de rota e telas (Expo Router)
│   ├── _layout.tsx     # Layout raiz da aplicação
│   └── index.tsx       # Tela inicial que renderiza o jogo
├── assets/             # Arquivos estáticos como imagens e sons
│   ├── images/
│   └── sounds/
├── components/         # Componentes React reutilizáveis
│   └── OrbeCorrigido.tsx # O componente principal com a lógica do jogo
├── README.md           # A documentação do projeto
└── package.json        # Dependências e scripts