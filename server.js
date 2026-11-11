// ==============================================================================
// SUSHI HOUSE - BACKEND SERVER (Node.js)
// Disciplina: IHC e Técnicas Avançadas de Programação Web e Mobile
// Atividade Final: Desenvolvimento de App Mobile e Backend de Funcionalidades
// ==============================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Garante que os diretórios necessários existam
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Arquivos de persistência JSON
const PRODUTOS_FILE = path.join(DATA_DIR, 'produtos.json');
const PEDIDOS_FILE = path.join(DATA_DIR, 'pedidos.json');
const USUARIOS_FILE = path.join(DATA_DIR, 'usuarios.json');
const FAQ_FILE = path.join(DATA_DIR, 'faq.json');
const AVALIACOES_FILE = path.join(DATA_DIR, 'avaliacoes.json');

// ------------------------------------------------------------------------------
// DADOS INICIAIS (SEEDS)
// ------------------------------------------------------------------------------
const defaultProdutos = [
  {
    id: 1,
    nome: "Sashimi Salmão Prime",
    categoria: "sashimi",
    preco: 36.90,
    descricao: "Fatias nobres de salmão fresco, macias e com corte tradicional japonês.",
    destaque: false,
    imagem: "bannercapainicial.png",
    detalhes: "10 fatias frescas selecionadas pelo nosso sushiman."
  },
  {
    id: 2,
    nome: "Uramaki Filadélfia Especial",
    categoria: "uramaki",
    preco: 28.90,
    descricao: "Arroz por fora, salmão fresco, cream cheese cremoso e gergelim tostado.",
    destaque: false,
    imagem: "comboshushihome.png",
    detalhes: "8 unidades enroladas com alga nori e gergelim duplo."
  },
  {
    id: 3,
    nome: "Hot Roll Crocante",
    categoria: "hot-roll",
    preco: 29.90,
    descricao: "Sushi empanado e frito na hora, salmão, cream cheese e molho tarê especial.",
    destaque: false,
    imagem: "banercomboscardapiocelular.png",
    detalhes: "10 peças crocantes com cebolinha fresca e tarê da casa."
  },
  {
    id: 4,
    nome: "Combo Especial House",
    categoria: "combinados",
    preco: 32.90,
    descricao: "Seleção clássica do sushiman com sashimis, niguiris e uramakis variados.",
    destaque: true,
    imagem: "comboshushihome.png",
    detalhes: "16 peças equilibradas para uma experiência autêntica."
  },
  {
    id: 5,
    nome: "Combo Temaki Sabor",
    categoria: "combinados",
    preco: 32.90,
    descricao: "1 Temaki de salmão completo crocante + 4 hot rolls + 4 uramakis.",
    destaque: true,
    imagem: "banercomboscardapiocelular.png",
    detalhes: "Perfeito para quem ama a crocância da alga combinada com sushi quente."
  },
  {
    id: 6,
    nome: "Salmão Especial Supremo",
    categoria: "sashimi",
    preco: 22.90,
    descricao: "Lâminas de salmão seladas com azeite trufado, flor de sal e raspas de limão siciliano.",
    destaque: true,
    imagem: "bannercapainicial.png",
    detalhes: "6 lâminas maçaricadas artesanalmente na hora."
  },
  {
    id: 7,
    nome: "Super Combo Semana (20 Peças + Bebida)",
    categoria: "combinados",
    preco: 54.90,
    precoAntigo: 89.90,
    descricao: "Super promoção da semana: 20 peças selecionadas + 1 refrigerante ou chá verde gelado.",
    destaque: true,
    promocao: true,
    imagem: "combosespeciaisbanner.png",
    detalhes: "4 sashimis salmão, 4 uramakis, 6 hot rolls, 6 hossomakis + 1 bebida lata."
  },
  {
    id: 8,
    nome: "Temaki Salmão com Cream Cheese",
    categoria: "uramaki",
    preco: 24.90,
    descricao: "Cone de alga crocante generosamente recheado com cubos de salmão e cream cheese.",
    destaque: false,
    imagem: "bannerbemvindocapahomecelular.png",
    detalhes: "Alga sequinha servida separadamente para montar na hora ou já montada."
  }
];

const defaultFaq = [
  {
    id: 1,
    pergunta: "É necessário fazer reserva para jantar no restaurante?",
    resposta: "Recomendamos a realização de reservas, especialmente para os fins de semana e noites com maior movimento, para garantir que desfruta da nossa experiência única com todo o conforto e sem tempo de espera."
  },
  {
    id: 2,
    pergunta: "O restaurante dispõe de opções vegetarianas ou adaptadas a restrições alimentares?",
    resposta: "Sim! Dispomos de opções vegetarianas, veganas (como hossomakis de pepino, manga e shimeji na manteiga) e pratos adaptáveis para celíacos sem glúten (com shoyu especial)."
  },
  {
    id: 3,
    pergunta: "Qual é o tempo médio de entrega dos pedidos no delivery?",
    resposta: "Nosso tempo médio é de 35 a 50 minutos. Cada pedido é montado artesanalmente apenas após a confirmação para garantir frescor absoluto."
  },
  {
    id: 4,
    pergunta: "Quais são as formas de pagamento aceitas pelo aplicativo?",
    resposta: "Aceitamos PIX instantâneo com confirmação em tempo real, cartões de crédito e débito das principais bandeiras e pagamento na entrega."
  }
];

const defaultAvaliacoes = [
  {
    id: 1,
    nome: "Mariana S.",
    estrelas: 5,
    foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=140&auto=format&fit=crop&q=80",
    comentario: "Perfeito, eu amei! A melhor comida japonesa que já comi! Salmão super fresco e entrega rápida."
  },
  {
    id: 2,
    nome: "Lívia M.",
    estrelas: 5,
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&auto=format&fit=crop&q=80",
    comentario: "Que comida maravilhosa! Tudo estava perfeito, quentinho e as embalagens térmicas são impecáveis."
  },
  {
    id: 3,
    nome: "Guilherme R.",
    estrelas: 5,
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=140&auto=format&fit=crop&q=80",
    comentario: "Nossa, que delícia! Dá vontade de pedir todos os dias! O Hot Roll crocante com molho tarê é imbatível."
  },
  {
    id: 4,
    nome: "Rafael Costa",
    estrelas: 5,
    foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=140&auto=format&fit=crop&q=80",
    comentario: "Experiência gastronômica de alto nível! O combo House tem um frescor incomparável. Mestre sushiman de parabéns!"
  },
  {
    id: 5,
    nome: "Beatriz Lima",
    estrelas: 5,
    foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=140&auto=format&fit=crop&q=80",
    comentario: "O melhor delivery da cidade, sem dúvidas! O sashimi derrete na boca e a alga do temaki vem super crocante."
  },
  {
    id: 6,
    nome: "Lucas Almeida",
    estrelas: 5,
    foto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=140&auto=format&fit=crop&q=80",
    comentario: "Pedimos para comemorar um jantar especial em casa e nos surpreendeu. Apresentação linda e muito saboroso!"
  }
];

const defaultUsuarios = [
  {
    id: 1,
    nome: "Cliente Demonstração",
    email: "cliente@sushihouse.com",
    senhaHash: crypto.createHash('sha256').update("123456").digest('hex'),
    telefone: "(11) 98765-4321",
    endereco: "Av. Paulista, 1000 - Apto 42",
    role: "cliente"
  },
  {
    id: 2,
    nome: "Administrador Sushi House",
    email: "admin@gmail.com",
    senhaHash: crypto.createHash('sha256').update("123456").digest('hex'),
    telefone: "(11) 99999-0000",
    endereco: "Sushi House Matriz - Gerência",
    role: "admin"
  }
];

// Funções utilitárias de leitura e gravação
function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Erro ao ler ${file}:`, err);
    return fallback;
  }
}

function writeJson(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Erro ao gravar ${file}:`, err);
  }
}

// Inicializa dados se não existirem
readJson(PRODUTOS_FILE, defaultProdutos);
readJson(FAQ_FILE, defaultFaq);
readJson(AVALIACOES_FILE, defaultAvaliacoes);
readJson(USUARIOS_FILE, defaultUsuarios);
readJson(PEDIDOS_FILE, []);

// Helper para ler corpo da requisição JSON (com suporte a upload base64 de até 35MB)
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 40 * 1024 * 1024) {
        req.destroy(new Error('Tamanho máximo da requisição excedido (40MB).'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// Tipos MIME
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

// ------------------------------------------------------------------------------
// SERVIDOR HTTP COM ROTAS REST
// ------------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  // CORS Headers para integração mobile e testes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  const jsonResponse = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=UTF-8' });
    res.end(JSON.stringify(data));
  };

  // --------------------------------------------------------------------------
  // ROTAS DA API REST (BACKEND)
  // --------------------------------------------------------------------------

  // 1. GET /api/produtos - Listagem de produtos com filtros (categoria, busca, destaques)
  if (req.method === 'GET' && pathname === '/api/produtos') {
    let produtos = readJson(PRODUTOS_FILE, defaultProdutos);
    const categoria = searchParams.get('categoria');
    const busca = searchParams.get('busca');
    const destaque = searchParams.get('destaque');

    if (categoria && categoria !== 'todos') {
      produtos = produtos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
    }

    if (destaque === 'true') {
      produtos = produtos.filter(p => p.destaque === true);
    }

    if (busca) {
      const q = busca.toLowerCase();
      produtos = produtos.filter(p => 
        p.nome.toLowerCase().includes(q) || 
        p.descricao.toLowerCase().includes(q)
      );
    }

    return jsonResponse(200, {
      sucesso: true,
      total: produtos.length,
      dados: produtos
    });
  }

  // 2. GET /api/produtos/:id - Detalhes de um produto específico
  if (req.method === 'GET' && pathname.startsWith('/api/produtos/')) {
    const id = parseInt(pathname.split('/')[3], 10);
    const produtos = readJson(PRODUTOS_FILE, defaultProdutos);
    const produto = produtos.find(p => p.id === id);

    if (!produto) {
      return jsonResponse(404, { sucesso: false, mensagem: 'Produto não encontrado' });
    }

    return jsonResponse(200, { sucesso: true, dados: produto });
  }

  // 1.4 POST /api/upload - Upload de Imagem de Arquivo (Admin)
  if (req.method === 'POST' && pathname === '/api/upload') {
    try {
      const body = await parseRequestBody(req);
      const { nome, dados } = body;

      if (!dados) {
        return jsonResponse(400, { sucesso: false, mensagem: 'Nenhum dado de imagem fornecido.' });
      }

      // Suporte a Data URI Base64: data:image/png;base64,...
      let base64Data = dados;
      let extensao = '.png';

      const matches = dados.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        const rawExt = matches[1].toLowerCase();
        if (rawExt === 'jpeg' || rawExt === 'jpg') extensao = '.jpg';
        else if (rawExt === 'webp') extensao = '.webp';
        else if (rawExt === 'svg+xml') extensao = '.svg';
        else if (rawExt === 'gif') extensao = '.gif';
        else extensao = '.png';
        base64Data = matches[2];
      }

      const buffer = Buffer.from(base64Data, 'base64');
      if (buffer.length === 0) {
        return jsonResponse(400, { sucesso: false, mensagem: 'Arquivo de imagem inválido ou vazio.' });
      }

      const timestamp = Date.now();
      const randomStr = crypto.randomBytes(4).toString('hex');
      const safePrefix = (nome ? path.parse(nome).name : 'prato')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .toLowerCase()
        .substring(0, 30);

      const fileName = `${safePrefix}-${timestamp}-${randomStr}${extensao}`;
      const filePath = path.join(UPLOADS_DIR, fileName);

      fs.writeFileSync(filePath, buffer);

      const relativeUrl = `uploads/${fileName}`;
      return jsonResponse(201, {
        sucesso: true,
        mensagem: 'Upload da imagem realizado com sucesso!',
        url: relativeUrl,
        nomeArquivo: fileName,
        tamanhoBytes: buffer.length
      });
    } catch (err) {
      console.error('Erro ao realizar upload de imagem:', err);
      return jsonResponse(500, { sucesso: false, mensagem: 'Falha ao salvar imagem no servidor.', erro: err.message });
    }
  }

  // 2.1 POST /api/produtos - Cadastrar Novo Prato no Cardápio (Admin)
  if (req.method === 'POST' && pathname === '/api/produtos') {
    try {
      const body = await parseRequestBody(req);
      const { nome, categoria, preco, precoAntigo, descricao, detalhes, imagem, destaque, promocao, porcao, peso, destaqueTag } = body;

      if (!nome || preco === undefined || !categoria) {
        return jsonResponse(400, { sucesso: false, mensagem: 'Nome, preço e categoria são campos obrigatórios.' });
      }

      const produtos = readJson(PRODUTOS_FILE, defaultProdutos);
      const nextId = produtos.length > 0 ? Math.max(...produtos.map(p => Number(p.id) || 0)) + 1 : 1;
      const imgPrincipal = imagem ? String(imagem).trim() : 'prato-essencia.jpg';

      const novoProduto = {
        id: nextId,
        nome: String(nome).trim(),
        categoria: String(categoria).trim().toLowerCase(),
        preco: parseFloat(parseFloat(preco).toFixed(2)),
        precoAntigo: precoAntigo ? parseFloat(parseFloat(precoAntigo).toFixed(2)) : null,
        descricao: descricao ? String(descricao).trim() : 'Prato artesanal preparado na hora pelo sushiman.',
        detalhes: detalhes ? String(detalhes).trim() : 'Ingredientes frescos de alta qualidade selecionados diariamente.',
        porcao: porcao ? String(porcao).trim() : (detalhes ? String(detalhes).trim() : 'Porção individual'),
        peso: peso ? String(peso).trim() : 'Aprox. 250 g',
        destaqueTag: destaqueTag || (promocao ? 'PROMOÇÃO DA SEMANA' : 'ESPECIAL DA CASA'),
        avaliacao: 5.0,
        avaliacoesQtd: 1,
        imagem: imgPrincipal,
        galeria: [imgPrincipal, 'prato-essencia.jpg', 'galeria-3.jpg', 'galeria-1.jpg'],
        destaque: Boolean(destaque),
        promocao: Boolean(promocao)
      };

      produtos.unshift(novoProduto);
      writeJson(PRODUTOS_FILE, produtos);

      return jsonResponse(201, {
        sucesso: true,
        mensagem: 'Prato cadastrado com sucesso no cardápio!',
        dados: novoProduto
      });
    } catch (err) {
      return jsonResponse(500, { sucesso: false, mensagem: 'Erro interno ao cadastrar prato.', erro: err.message });
    }
  }

  // 2.2 PUT /api/produtos/:id - Editar Prato Existente (Admin)
  if (req.method === 'PUT' && pathname.startsWith('/api/produtos/')) {
    try {
      const id = parseInt(pathname.split('/')[3], 10);
      const body = await parseRequestBody(req);
      const produtos = readJson(PRODUTOS_FILE, defaultProdutos);
      const index = produtos.findIndex(p => p.id === id);

      if (index === -1) {
        return jsonResponse(404, { sucesso: false, mensagem: 'Prato não encontrado para edição.' });
      }

      const imgAtualizada = body.imagem ? String(body.imagem).trim() : produtos[index].imagem;
      let novaGaleria = produtos[index].galeria || [];
      if (imgAtualizada && (!novaGaleria.length || novaGaleria[0] !== imgAtualizada)) {
        novaGaleria = [imgAtualizada, ...novaGaleria.filter(g => g !== imgAtualizada)];
      }

      produtos[index] = {
        ...produtos[index],
        ...body,
        id, // Mantém id original
        imagem: imgAtualizada,
        galeria: novaGaleria,
        preco: body.preco !== undefined ? parseFloat(parseFloat(body.preco).toFixed(2)) : produtos[index].preco
      };

      writeJson(PRODUTOS_FILE, produtos);
      return jsonResponse(200, {
        sucesso: true,
        mensagem: 'Prato atualizado com sucesso!',
        dados: produtos[index]
      });
    } catch (err) {
      return jsonResponse(500, { sucesso: false, mensagem: 'Erro interno ao atualizar prato.', erro: err.message });
    }
  }

  // 2.3 DELETE /api/produtos/:id - Excluir Prato do Cardápio (Admin)
  if (req.method === 'DELETE' && pathname.startsWith('/api/produtos/')) {
    try {
      const id = parseInt(pathname.split('/')[3], 10);
      let produtos = readJson(PRODUTOS_FILE, defaultProdutos);
      const index = produtos.findIndex(p => p.id === id);

      if (index === -1) {
        return jsonResponse(404, { sucesso: false, mensagem: 'Prato não encontrado para exclusão.' });
      }

      const removido = produtos.splice(index, 1)[0];
      writeJson(PRODUTOS_FILE, produtos);

      return jsonResponse(200, {
        sucesso: true,
        mensagem: `Prato "${removido.nome}" excluído com sucesso do cardápio!`,
        dados: removido
      });
    } catch (err) {
      return jsonResponse(500, { sucesso: false, mensagem: 'Erro ao excluir prato.', erro: err.message });
    }
  }

  // 2.4 DELETE /api/pedidos/:id - Excluir Pedido (Admin)
  if (req.method === 'DELETE' && pathname.startsWith('/api/pedidos/')) {
    try {
      const id = pathname.split('/')[3];
      let pedidos = readJson(PEDIDOS_FILE, []);
      const index = pedidos.findIndex(p => p.id === id);

      if (index === -1) {
        return jsonResponse(404, { sucesso: false, mensagem: 'Pedido não encontrado.' });
      }

      pedidos.splice(index, 1);
      writeJson(PEDIDOS_FILE, pedidos);
      return jsonResponse(200, { sucesso: true, mensagem: `Pedido ${id} removido com sucesso.` });
    } catch (err) {
      return jsonResponse(500, { sucesso: false, mensagem: 'Erro ao excluir pedido.', erro: err.message });
    }
  }

  // 2.5 GET /api/usuarios - Listar usuários cadastrados (Admin)
  if (req.method === 'GET' && pathname === '/api/usuarios') {
    const usuarios = readJson(USUARIOS_FILE, defaultUsuarios);
    const sanitizados = usuarios.map(u => ({
      id: u.id,
      nome: u.nome,
      email: u.email,
      telefone: u.telefone || '',
      endereco: u.endereco || '',
      role: u.role || 'cliente',
      dataCriacao: u.dataCriacao || ''
    }));
    return jsonResponse(200, { sucesso: true, total: sanitizados.length, dados: sanitizados });
  }

  // 3. POST /api/pedidos - Criação de novo pedido (Checkout do App)
  if (req.method === 'POST' && pathname === '/api/pedidos') {
    try {
      const body = await parseRequestBody(req);
      const { itens, cliente, endereco, formaPagamento, observacoes } = body;

      if (!itens || !Array.isArray(itens) || itens.length === 0) {
        return jsonResponse(400, { sucesso: false, mensagem: 'O carrinho não pode estar vazio.' });
      }

      if (!cliente || !cliente.nome || !cliente.telefone) {
        return jsonResponse(400, { sucesso: false, mensagem: 'Dados do cliente (nome e telefone) são obrigatórios.' });
      }

      if (!endereco || !endereco.rua) {
        return jsonResponse(400, { sucesso: false, mensagem: 'Endereço de entrega é obrigatório.' });
      }

      // Calcula totais no backend para garantia de segurança e integridade
      const produtosDb = readJson(PRODUTOS_FILE, defaultProdutos);
      let subtotal = 0;
      const itensProcessados = itens.map(item => {
        const prod = produtosDb.find(p => p.id === item.id);
        const precoUnitario = prod ? prod.preco : (item.preco || 0);
        const qtd = item.quantidade || 1;
        const totalItem = precoUnitario * qtd;
        subtotal += totalItem;
        return {
          id: item.id,
          nome: prod ? prod.nome : item.nome,
          precoUnitario,
          quantidade: qtd,
          total: totalItem
        };
      });

      const taxaEntrega = 7.00;
      const totalGeral = subtotal + taxaEntrega;

      const novoPedido = {
        id: 'PED-' + Date.now().toString().slice(-6),
        data: new Date().toISOString(),
        status: 'Recebido', // Recebido -> Em Preparação -> Saiu para Entrega -> Entregue
        cliente,
        endereco,
        formaPagamento: formaPagamento || 'PIX',
        observacoes: observacoes || '',
        itens: itensProcessados,
        subtotal: parseFloat(subtotal.toFixed(2)),
        taxaEntrega: parseFloat(taxaEntrega.toFixed(2)),
        total: parseFloat(totalGeral.toFixed(2))
      };

      const pedidos = readJson(PEDIDOS_FILE, []);
      pedidos.unshift(novoPedido);
      writeJson(PEDIDOS_FILE, pedidos);

      return jsonResponse(201, {
        sucesso: true,
        mensagem: 'Pedido realizado com sucesso!',
        dados: novoPedido
      });
    } catch (err) {
      return jsonResponse(500, { sucesso: false, mensagem: 'Erro interno ao processar pedido.', erro: err.message });
    }
  }

  // 4. GET /api/pedidos - Histórico e listagem de pedidos
  if (req.method === 'GET' && pathname === '/api/pedidos') {
    const pedidos = readJson(PEDIDOS_FILE, []);
    return jsonResponse(200, { sucesso: true, total: pedidos.length, dados: pedidos });
  }

  // 4.1 POST /api/pedidos/status - Atualização de status do pedido (Painel Admin)
  if (req.method === 'POST' && pathname === '/api/pedidos/status') {
    try {
      const body = await parseRequestBody(req);
      const { id, status } = body;
      const pedidos = readJson(PEDIDOS_FILE, []);
      const pedido = pedidos.find(p => p.id === id);
      if (!pedido) {
        return jsonResponse(404, { sucesso: false, mensagem: 'Pedido não encontrado.' });
      }
      pedido.status = status;
      writeJson(PEDIDOS_FILE, pedidos);
      return jsonResponse(200, { sucesso: true, mensagem: `Status atualizado para "${status}".`, dados: pedido });
    } catch (err) {
      return jsonResponse(500, { sucesso: false, mensagem: 'Erro ao atualizar status do pedido.', erro: err.message });
    }
  }

  // 5. POST /api/auth/register - Cadastro de novos usuários
  if (req.method === 'POST' && pathname === '/api/auth/register') {
    try {
      const body = await parseRequestBody(req);
      const { nome, email, senha, telefone, endereco } = body;

      if (!nome || !email || !senha) {
        return jsonResponse(400, { sucesso: false, mensagem: 'Nome, e-mail e senha são obrigatórios.' });
      }

      const usuarios = readJson(USUARIOS_FILE, defaultUsuarios);
      const usuarioExistente = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (usuarioExistente) {
        return jsonResponse(409, { sucesso: false, mensagem: 'E-mail já cadastrado.' });
      }

      const novoUsuario = {
        id: usuarios.length + 1,
        nome,
        email: email.toLowerCase(),
        senhaHash: crypto.createHash('sha256').update(senha).digest('hex'),
        telefone: telefone || '',
        endereco: endereco || '',
        dataCriacao: new Date().toISOString()
      };

      usuarios.push(novoUsuario);
      writeJson(USUARIOS_FILE, usuarios);

      return jsonResponse(201, {
        sucesso: true,
        mensagem: 'Usuário cadastrado com sucesso!',
        dados: {
          id: novoUsuario.id,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          telefone: novoUsuario.telefone,
          endereco: novoUsuario.endereco
        }
      });
    } catch (err) {
      return jsonResponse(500, { sucesso: false, mensagem: 'Erro ao cadastrar usuário.', erro: err.message });
    }
  }

  // 6. POST /api/auth/login - Autenticação de usuário
  if (req.method === 'POST' && pathname === '/api/auth/login') {
    try {
      const body = await parseRequestBody(req);
      const { email, senha } = body;

      if (!email || !senha) {
        return jsonResponse(400, { sucesso: false, mensagem: 'E-mail e senha são obrigatórios.' });
      }

      const usuarios = readJson(USUARIOS_FILE, defaultUsuarios);
      const senhaHash = crypto.createHash('sha256').update(senha).digest('hex');
      const usuario = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase() && u.senhaHash === senhaHash);

      if (!usuario) {
        return jsonResponse(401, { sucesso: false, mensagem: 'E-mail ou senha inválidos.' });
      }

      return jsonResponse(200, {
        sucesso: true,
        mensagem: 'Login realizado com sucesso!',
        dados: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.telefone,
          endereco: usuario.endereco,
          role: usuario.role || 'cliente',
          token: 'token-' + crypto.randomBytes(16).toString('hex')
        }
      });
    } catch (err) {
      return jsonResponse(500, { sucesso: false, mensagem: 'Erro ao realizar login.', erro: err.message });
    }
  }

  // 6.1 POST /api/auth/admin-login - Acesso Direto do Administrador com Senha Padrão
  if (req.method === 'POST' && pathname === '/api/auth/admin-login') {
    try {
      const body = await parseRequestBody(req);
      const { senha } = body;

      if (!senha || senha !== '123456') {
        return jsonResponse(401, { sucesso: false, mensagem: 'Senha padrão incorreta. Use a senha: 123456' });
      }

      return jsonResponse(200, {
        sucesso: true,
        mensagem: 'Acesso de Administrador concedido!',
        dados: {
          id: 99,
          nome: 'Administrador Sushi House',
          email: 'admin@gmail.com',
          role: 'admin',
          token: 'token-admin-' + crypto.randomBytes(16).toString('hex')
        }
      });
    } catch (err) {
      return jsonResponse(500, { sucesso: false, mensagem: 'Erro ao autenticar administrador.', erro: err.message });
    }
  }

  // 7. GET /api/faq - Perguntas frequentes
  if (req.method === 'GET' && pathname === '/api/faq') {
    const faq = readJson(FAQ_FILE, defaultFaq);
    return jsonResponse(200, { sucesso: true, dados: faq });
  }

  // 8. GET /api/avaliacoes - Depoimentos de clientes
  if (req.method === 'GET' && pathname === '/api/avaliacoes') {
    const avaliacoes = readJson(AVALIACOES_FILE, defaultAvaliacoes);
    return jsonResponse(200, { sucesso: true, dados: avaliacoes });
  }

  // --------------------------------------------------------------------------
  // SERVIDOR DE ARQUIVOS ESTÁTICOS (HTML, CSS, JS, IMAGENS)
  // --------------------------------------------------------------------------
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

  // Se a rota não tem extensão e existe um .html correspondente (ex: /sobre -> sobre.html)
  if (!path.extname(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath += '.html';
    }
  }

  // Normaliza o caminho para segurança contra directory traversal
  filePath = path.normalize(filePath);
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Acesso negado');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Se não encontrou o arquivo estático e não é rota de API, tenta o index.html (SPA fallback)
      const indexPath = path.join(__dirname, 'index.html');
      fs.readFile(indexPath, (errIndex, content) => {
        if (errIndex) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
          res.end('Página não encontrada');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('Erro ao ler arquivo');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`==============================================================`);
  console.log(`🥢 SUSHI HOUSE - SERVIDOR INICIADO COM SUCESSO!`);
  console.log(`📍 URL Local: http://localhost:${PORT}`);
  console.log(`📱 APIs Prontas:`);
  console.log(`   - GET  /api/produtos`);
  console.log(`   - POST /api/pedidos`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - GET  /api/faq`);
  console.log(`   - GET  /api/avaliacoes`);
  console.log(`==============================================================`);
});
