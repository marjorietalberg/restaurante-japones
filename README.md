# 🥢 Sushi House - Sabor do Oriente
## Sistema Completo de Restaurante Japonês & E-commerce Delivery

> **Status:** 100% Concluído e Funcional  
> **Repositório GitHub:** [https://github.com/marjorietalberg/restaurante-japones.git](https://github.com/marjorietalberg/restaurante-japones.git)  
> **Arquitetura:** Frontend Web & Mobile Alta Fidelidade + Backend REST API em Node.js com persistência JSON.

---

## 🔑 Credenciais de Acesso (Administrador e Clientes)

Para acessar o painel de gerenciamento ou realizar testes na loja, utilize as credenciais pré-configuradas:

| Tipo de Usuário | E-mail de Acesso | Senha / PIN Padrão | Onde Acessar | O que pode fazer |
| :--- | :--- | :--- | :--- | :--- |
| 👑 **Administrador** | **`admin@gmail.com`** | **`123456`** | [`admin.html`](http://localhost:3000/admin.html) ou botão *"Entrar como Administrador"* | Cadastrar novos pratos com upload de fotos, editar, excluir, gerenciar pedidos, faturamento e clientes |
| 👤 **Cliente de Teste** | **`cliente@sushihouse.com`** | **`123456`** | [`login.html`](http://localhost:3000/login.html) ou modal de login | Fazer pedidos na sacola, simular CEP, acumular pontos no Clube Sushi e resgatar cupons |

> 🛡️ **Acesso Rápido de Administrador:**  
> Diretamente abaixo do botão de login em todas as telas, há a opção **"Acessar como Administrador"**. Basta clicar, digitar a senha padrão **`123456`** e o sistema autenticará diretamente no Painel do Administrador.

---

## 📋 Sobre o Projeto

O **Sushi House** é uma solução completa desenvolvida para restaurantes e delivery oriental de alta gastronomia. Ele integra:
- **Cardápio Digital Interativo** com carrossel horizontal contínuo e setas de navegação.
- **Sacola de Pedidos & Checkout Completo no padrão iFood** (cálculo de frete por CEP via API ViaCEP, desconto de 5% no PIX, barra de frete grátis e formulário de entrega).
- **Painel Administrativo Completo (Dashboard)** com CRUD de pratos (Criar, Editar, Excluir), upload de imagens locais para o servidor, estatísticas e gerenciamento de status de pedidos.
- **Área de Perfil do Cliente com Clube de Fidelidade** com pontos acumuláveis, cupons de desconto e histórico de pedidos com botão "Pedir Novamente".
- **Design 100% Responsivo para Celular e Computador** no tema *Dark Obsidian & Japanese Crimson Red*, adaptado para qualquer resolução (320px, 360px, 375px, 390px, 412px, desktop).

---

## 🚀 Funcionalidades Principais

### 1. Painel Administrativo & Gestão de Pratos (`admin.html`)
- **Dashboard de Métricas (KPIs):** Faturamento Total (R$), Total de Pedidos, Pratos Ativos no Menu e Usuários Cadastrados.
- **Cadastro de Novos Pratos com Upload de Imagem:**
  - Suporte a upload de arquivos do computador (`.png`, `.jpg`, `.jpeg`, `.webp`), salvos automaticamente na pasta `/uploads/`.
  - Zona de arrastar e soltar (*drag & drop*) ou clique para selecionar do disco.
  - Seleção rápida de fotos do restaurante ou URLs externas.
  - Definição de nome, categoria, preço normal, preço riscado promocional, descrição e porção.
  - Opção de marcar para **"Exibir em Destaque na Home"**.
- **Sincronização em Tempo Real:** Novos pratos cadastrados no Admin aparecem instantaneamente nos destaques da Home (`index.html`) e no Cardápio (`cardapio.html`).
- **Edição e Exclusão com Confirmação:** Permite alterar dados de pratos existentes ou removê-los com atualização imediata no banco de dados JSON.
- **Gestão de Pedidos:** Acompanhamento do status dos pedidos (*Recebido*, *Em Preparo*, *Saiu para Entrega*, *Entregue*) e impressão de comanda.

### 2. Cardápio Digital & Carrossel Horizontal (`cardapio.html`)
- **Filtro de Categorias no Celular:** Carrossel horizontal deslizável (*touch swipe*) em linha única (sem quebra de linhas) com setas de navegação **`‹`** e **`›`**.
- **Ícones Orientais nos Chips:** 🥢 Todos, 🐟 Sushis, 🌶️ Temakis, 🍚 Entradas, 🍱 Combinados, 🍨 Sobremesas, 🍷 Bebidas.
- **Grade de Pratos em 2 Colunas no Celular:** Fotos com proporção uniforme, títulos nítidos, badges e botões de compra rápida.
- **Busca em Tempo Real:** Filtra pratos instantaneamente conforme o usuário digita.
- **Modal de Detalhes Estilo Mercado Livre:** Visualização ampliada com ficha técnica, ingredientes e recálculo do preço dinâmico conforme a quantidade.

### 3. Sacola de Pedidos & Checkout iFood (`#cartModal`)
- **Formato Bottom Sheet:** Abre suavemente encostando nas bordas da tela no celular, sem sobras e sem cortar botões.
- **Barra Dinâmica de Frete Grátis:** Regra de frete grátis acima de R$ 100,00 com barra de progresso colorida em tempo real.
- **Cálculo de CEP (ViaCEP API):** Máscara automática, busca de endereço, bairro e cidade, calculando o frete e tempo de entrega estimado.
- **Formas de Pagamento:**
  - **PIX Instantâneo** com desconto de 5% aplicado na hora sobre os itens.
  - **Cartão Online** (até 3x s/ juros).
  - **Cartão na Entrega** (maquininha).
  - **Dinheiro** (com campo para troco).
- **Rodapé Fixo:** O botão vermelho **"Confirmar e Fazer Pedido"** e o botão **"Limpar"** ficam sempre visíveis e nunca são cortados pela base da tela.

### 4. Perfil do Cliente & Clube de Pontos (`perfil.html`)
- **Clube de Fidelidade:** Saldo de pontos (cada R$ 1,00 = 1 ponto), níveis VIP (*Bronze, Prata, Ouro, Diamante*).
- **Catálogo de Cupons:** Resgate de cupons de R$ 10, R$ 20 e combos cortesia com dedução direta dos pontos.
- **Histórico de Pedidos:** Lista completa dos pedidos realizados com fotos dos itens e botão *"Pedir Novamente"*.
- **Foto de Perfil:** Seletor de avatares orientais personalizáveis.

### 5. Responsividade Completa para Todos os Smartphones
- **Sem Vazamento Lateral:** Travamento de rolagem horizontal com `overflow-x: clip !important` para a tela nunca balançar para os lados.
- **Barra Inferior Fixa (Mobile Bottom Tabs):** Acesso rápido com o polegar em 5 abas: *Home, Cardápio, Sacola (com contador de itens), Sobre e Perfil*.
- **Menu do Topo (Dropdown):** Menu suspenso limpo que abre direto abaixo do cabeçalho sem bloquear a tela.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - HTML5 Semântico e Acessível (WCAG/IHC)
  - CSS3 Moderno (CSS Grid, Flexbox, Glassmorphism, Variáveis CSS, Animações e Media Queries)
  - JavaScript Vanilla (ES6+, Fetch API, LocalStorage, Manipulação de DOM Reativa)
  - FontAwesome 6.4.0 (Ícones Temáticos)
  - Fontes Google (*Poppins, Inter, Cinzel*)
- **Backend:**
  - Node.js (Servidor HTTP nativo e Router REST)
  - Persistência em arquivos JSON locais (`/data/produtos.json`, `/data/pedidos.json`, `/data/usuarios.json`)
  - Módulo nativo de multipart/form-data e streams para upload de arquivos de imagem em `/uploads/`.

---

## 💻 Como Rodar o Projeto Localmente

### Pré-requisitos:
- **Node.js** instalado na máquina (versão 14 ou superior recomendada).

### Passo a Passo:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/marjorietalberg/restaurante-japones.git
   cd restaurante-japones
   ```

2. **Inicie o servidor Node.js:**
   ```bash
   node server.js
   ```

3. **Acesse no seu navegador:**
   - **Loja / Home:** [http://localhost:3000](http://localhost:3000)
   - **Cardápio Digital:** [http://localhost:3000/cardapio.html](http://localhost:3000/cardapio.html)
   - **Painel Administrativo:** [http://localhost:3000/admin.html](http://localhost:3000/admin.html)
   - **Meu Perfil:** [http://localhost:3000/perfil.html](http://localhost:3000/perfil.html)
   - **Sobre Nós:** [http://localhost:3000/sobre.html](http://localhost:3000/sobre.html)
   - **Login / Cadastro:** [http://localhost:3000/login.html](http://localhost:3000/login.html)

---

## 📁 Estrutura de Arquivos

```text
restaurante/
├── admin.html          # Painel Administrativo de Pratos e Pedidos
├── index.html          # Página Inicial / Home
├── cardapio.html       # Catálogo do Cardápio Digital com carrossel
├── cardapio.css        # Estilos específicos do Cardápio e Modal de Prato
├── cardapio.js         # Lógica de filtros, carrossel e busca do Cardápio
├── produto.html        # Página individual do prato estilo Mercado Livre
├── produto.js          # Lógica de cálculo em tempo real e miniaturas
├── sobre.html          # Página institucional Sobre Nós e Galeria
├── sobre.css           # Estilos da página Sobre e Mapa
├── perfil.html         # Página de Perfil, Clube de Pontos e Cupons
├── perfil.css          # Estilos do Perfil do Cliente
├── perfil.js           # Lógica do Clube de Fidelidade e Histórico
├── login.html          # Tela de Autenticação (Login, Cadastro, Admin)
├── styles.css          # Folha de estilos global, temas e responsividade
├── app.js              # Lógica global da aplicação, Sacola iFood e rotas
├── server.js           # Backend Node.js REST API e servidor estático
├── package.json        # Configuração do projeto Node.js
├── README.md           # Documentação completa do sistema
├── data/               # Banco de dados baseado em arquivos JSON
│   ├── produtos.json   # Base de pratos do cardápio
│   ├── pedidos.json    # Histórico de pedidos realizados
│   └── usuarios.json   # Contas de usuários e administradores
└── uploads/            # Fotos de pratos enviadas pelo painel admin
```

---

## 🔒 Segurança e Credenciais Padrão

- **Administrador:**
  - Usuário: `admin@gmail.com`
  - Senha: `123456`
- **Cliente:**
  - Usuário: `cliente@sushihouse.com`
  - Senha: `123456`

---

## 👩‍💻 Autoria e Licença

Desenvolvido para fins acadêmicos e profissionais com foco em **Interação Humano-Computador (IHC)** e **Boas Práticas de Engenharia Web e Mobile**.  
Código aberto sob a licença MIT.
