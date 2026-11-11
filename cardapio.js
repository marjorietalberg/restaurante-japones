// ==============================================================================
// SUSHI HOUSE - CARDÁPIO DIGITAL LOGIC (cardapio.js)
// Conexão com a API Node.js /api/produtos, Filtros, Detalhes estilo Mercado Livre
// ==============================================================================

let cardapioProducts = [];
let currentCategory = 'todos';
let searchQuery = '';
let currentDetailProduct = null;
let currentDetailQty = 1;

// Carrega os dados na inicialização
document.addEventListener('DOMContentLoaded', () => {
  loadCardapioData();

  // Fechar modal com tecla Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductDetails();
    }
  });
});

// Busca produtos da API Node.js
async function loadCardapioData() {
  const grid = document.getElementById('cardapioProductsGrid');
  if (!grid) return;

  grid.innerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 0; color: #888;">
      <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; color: #e50914; margin-bottom: 1rem;"></i>
      <p>Carregando pratos do servidor...</p>
    </div>
  `;

  try {
    const res = await fetch('/api/produtos');
    const json = await res.json();
    
    if (json.sucesso && Array.isArray(json.dados)) {
      cardapioProducts = json.dados;
    } else {
      cardapioProducts = getFallbackCardapioData();
    }
  } catch (err) {
    console.warn('Backend offline ou inacessível, utilizando dados locais:', err);
    cardapioProducts = getFallbackCardapioData();
  }

  updateCategoryCounts();
  renderCardapioGrid();
  updateCartBadge();
}

// Filtra produtos por categoria
function selectCategory(cat, btnElement) {
  currentCategory = cat;

  // Atualiza classe ativa dos botões
  document.querySelectorAll('.cat-pill-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) {
    btnElement.classList.add('active');
    
    // Centraliza suavemente o botão selecionado no carrossel horizontal no celular
    try {
      btnElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    } catch (e) {}
  }

  renderCardapioGrid();
}

// Rola o carrossel de categorias através das setas de navegação
function scrollCatCarousel(direction) {
  const list = document.getElementById('categoryPillsList');
  if (list) {
    const scrollAmount = Math.max(160, Math.floor(window.innerWidth * 0.45));
    list.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }
}

// Busca em tempo real
function filterCardapioProducts() {
  const input = document.getElementById('cardapioSearchInput');
  searchQuery = input ? input.value.trim().toLowerCase() : '';
  renderCardapioGrid();
}

// Abre a página dedicada do produto estilo Mercado Livre
function goToProductPage(productId) {
  window.location.href = `produto.html?id=${productId}`;
}

// Normaliza categoria para garantir correspondência exata entre Admin e Cardápio
function normalizeCategory(cat) {
  const c = String(cat || '').toLowerCase().trim();
  if (['sashimi', 'sashimis', 'uramaki', 'uramakis', 'hot-roll', 'hotroll', 'hot-rolls', 'niguiri', 'niguiris', 'hossomaki', 'sushi', 'sushis'].includes(c)) return 'sushis';
  if (['temaki', 'temakis'].includes(c)) return 'temakis';
  if (['entrada', 'entradas', 'aperitivo', 'shimeji', 'ceviche'].includes(c)) return 'entradas';
  if (['combinado', 'combinados', 'combo', 'combos', 'barca', 'barcas'].includes(c)) return 'combinados';
  if (['sobremesa', 'sobremesas', 'doce', 'doces'].includes(c)) return 'sobremesas';
  if (['bebida', 'bebidas', 'refrigerante', 'suco'].includes(c)) return 'bebidas';
  return c;
}

// Renderiza os produtos na grade
function renderCardapioGrid() {
  const grid = document.getElementById('cardapioProductsGrid');
  if (!grid) return;

  // Filtra por categoria e busca
  const filtered = cardapioProducts.filter(p => {
    const pCatNorm = normalizeCategory(p.categoria);
    const matchCategory = (currentCategory === 'todos') ? true : (pCatNorm === currentCategory || p.categoria === currentCategory);
    const matchSearch = searchQuery === '' || 
      p.nome.toLowerCase().includes(searchQuery) ||
      (p.categoria && p.categoria.toLowerCase().includes(searchQuery)) ||
      (p.descricao && p.descricao.toLowerCase().includes(searchQuery));

    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #999;">
        <i class="fa-solid fa-bowl-food" style="font-size: 2.8rem; color: #e50914; margin-bottom: 1rem; opacity: 0.7;"></i>
        <h3 style="color: #fff; margin-bottom: 0.5rem; font-size: 1.3rem;">Nenhum prato encontrado</h3>
        <p style="font-size: 0.95rem;">Tente pesquisar por outro termo ou selecione a categoria "Todos".</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const isPromo = item.promocao || !!item.precoAntigo;
    const oldPriceHtml = item.precoAntigo ? `<span class="price-strikethrough">R$ ${item.precoAntigo.toFixed(2).replace('.', ',')}</span>` : '';
    const badgeHtml = isPromo ? `<span class="product-badge-promo">Promoção</span>` : '';

    return `
      <div class="product-card" data-id="${item.id}" data-category="${item.categoria}" onclick="goToProductPage(${item.id})">
        ${badgeHtml}
        <div class="product-img-box">
          <img src="${item.imagem}" alt="${item.nome}" class="product-thumb" onerror="this.src='prato-essencia.jpg'">
        </div>
        <div class="product-info-body">
          <h4 class="product-title">${item.nome}</h4>
          <p class="product-desc">${item.descricao || ''}</p>
          <div class="product-action-row">
            <div class="product-prices">
              <span class="price-main">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
              ${oldPriceHtml}
            </div>
            <button type="button" class="btn-buy-product" onclick="event.stopPropagation(); buyProduct(${item.id}, '${item.nome.replace(/'/g, "\\'")}', ${item.preco}, '${item.imagem}')">
              Comprar
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ==============================================================================
// MODAL DE DETALHES DO PRODUTO COM CONTAGEM E VALOR DINÂMICO REATIVO
// ==============================================================================
function openProductDetails(productId) {
  let item = cardapioProducts.find(p => p.id === productId);
  if (!item) {
    const fallbackList = getFallbackCardapioData();
    item = fallbackList.find(p => p.id === productId);
  }
  if (!item) return;

  currentDetailProduct = item;
  currentDetailQty = 1;

  // Galeria de imagens
  const galeria = (item.galeria && Array.isArray(item.galeria) && item.galeria.length > 0)
    ? item.galeria
    : [item.imagem, 'prato-essencia.jpg', 'galeria-3.jpg', 'galeria-1.jpg'];

  const mainImage = galeria[0] || item.imagem;

  const thumbsHtml = galeria.map((imgSrc, idx) => `
    <button type="button" class="p-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="selectDetailThumbnail('${imgSrc}', this)">
      <img src="${imgSrc}" alt="${item.nome}" onerror="this.src='${item.imagem}'">
    </button>
  `).join('');

  // Ingredientes
  const ingredientes = (item.ingredientes && Array.isArray(item.ingredientes) && item.ingredientes.length > 0)
    ? item.ingredientes
    : [
        'Salmão fresco selecionado de procedência nobre',
        'Arroz japonês especial (Shari) temperado com vinagre nobre',
        'Ingredientes frescos preparados na hora do pedido',
        'Finalização com molho artesanal e toque do sushiman'
      ];
  const ingredientesHtml = ingredientes.map(ing => `<li>${ing}</li>`).join('');

  // Avaliação e Destaque
  const avaliacao = item.avaliacao || 4.9;
  const avaliacoesQtd = item.avaliacoesQtd || 120;
  const destaqueTag = item.destaqueTag || (item.promocao ? 'PROMOÇÃO DA SEMANA' : 'ESPECIAL DA CASA');

  // Preço antigo
  const oldPriceHtml = item.precoAntigo
    ? `<span id="detailOldPrice" class="p-price-old">R$ ${item.precoAntigo.toFixed(2).replace('.', ',')}</span>`
    : '';

  // Produtos relacionados ("Você também pode gostar")
  const relatedItems = cardapioProducts
    .filter(p => p.id !== item.id)
    .slice(0, 4);

  const relatedHtml = relatedItems.map(rel => `
    <div class="p-related-card" onclick="openProductDetails(${rel.id})">
      <div class="p-related-img-box">
        <img src="${rel.imagem}" alt="${rel.nome}" onerror="this.src='prato-essencia.jpg'">
      </div>
      <div class="p-related-body">
        <h5 class="p-related-name">${rel.nome}</h5>
        <span class="p-related-price">R$ ${rel.preco.toFixed(2).replace('.', ',')}</span>
      </div>
    </div>
  `).join('');

  const modalContent = document.getElementById('productDetailsContent');
  if (!modalContent) return;

  modalContent.innerHTML = `
    <!-- Top Grid: Galeria + Detalhes / Especificações -->
    <div class="p-details-top-grid">
      <!-- Coluna Esquerda: Miniaturas e Foto Principal Grande -->
      <div class="p-gallery-col">
        <div class="p-thumbnails-strip">
          ${thumbsHtml}
        </div>
        <div class="p-main-img-box">
          <img id="detailMainImg" src="${mainImage}" alt="${item.nome}" class="p-main-img" onerror="this.src='prato-essencia.jpg'">
        </div>
      </div>

      <!-- Coluna Direita: Badges, Título, Estrelas, Descrição, Ficha Técnica -->
      <div class="p-info-col">
        <div>
          <span class="p-tag-badge">${destaqueTag}</span>
        </div>
        <h2 class="p-title">${item.nome}</h2>
        
        <div class="p-rating-row">
          <div class="p-stars">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <span class="p-rating-score">${avaliacao.toFixed(1)}</span>
          <span class="p-rating-count">(${avaliacoesQtd} avaliações)</span>
        </div>

        <p class="p-description">${item.descricao || 'Autêntica experiência gastronômica preparada com cortes nobres e ingredientes rigorosamente selecionados.'}</p>

        <!-- Ficha Técnica / Especificações e Ingredientes -->
        <div class="p-specs-block">
          <h4 class="p-specs-title">Ingredientes e Composição:</h4>
          <ul class="p-ingredients-list">
            ${ingredientesHtml}
          </ul>
          <div class="p-meta-specs">
            <p><strong>Porção:</strong> ${item.porcao || 'Porção padrão individual'}</p>
            <p><strong>Peso estimado:</strong> ${item.peso || 'Aprox. 240g'}</p>
            <p><strong>Categoria:</strong> ${item.categoria ? item.categoria.toUpperCase() : 'CULINÁRIA JAPONESA'}</p>
            <p><strong>Destaque:</strong> ${destaqueTag}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de Compra com Atualização do Valor em Tempo Real Conforme a Contagem -->
    <div class="p-buy-action-bar">
      <div class="p-price-box">
        <span id="detailCurrentPrice" class="p-price-current">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
        ${oldPriceHtml}
        <span id="detailUnitPriceTag" class="p-unit-tag" style="display: none; font-size: 0.85rem; color: #aaa; margin-left: 6px;"></span>
      </div>

      <div class="p-qty-picker">
        <span class="p-qty-label">Quantidade:</span>
        <div class="p-qty-controls">
          <button type="button" class="p-qty-btn" onclick="changeDetailQty(-1)" aria-label="Diminuir">-</button>
          <span class="p-qty-number" id="detailQtyDisplay">1</span>
          <button type="button" class="p-qty-btn" onclick="changeDetailQty(1)" aria-label="Aumentar">+</button>
        </div>
      </div>

      <button type="button" class="p-btn-add-cart" onclick="addCurrentDetailToCart()">
        <i class="fa-solid fa-cart-shopping"></i>
        <span>Adicionar ao carrinho</span>
      </button>

      <button type="button" class="p-btn-favorite" id="detailFavBtn" onclick="toggleFavorite(this)">
        <i class="fa-regular fa-heart"></i>
        <span>Favorito</span>
      </button>
    </div>

    <!-- Seção: Você também pode gostar -->
    <div class="p-related-section">
      <div class="p-related-header">
        <div>
          <h3 class="p-related-title">Você também pode gostar</h3>
          <div class="p-related-line"></div>
        </div>
        <a href="#catalogo" class="p-related-more-link" onclick="closeProductDetails()">Ver todo o cardápio &rarr;</a>
      </div>
      <div class="p-related-grid">
        ${relatedHtml}
      </div>
    </div>
  `;

  const modal = document.getElementById('modalProductDetails');
  if (modal) {
    modal.classList.add('open');
    modal.scrollTop = 0;
    const dialog = modal.querySelector('.modal-product-details-dialog');
    if (dialog) dialog.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }
}

// Fecha o modal de detalhes
function closeProductDetails() {
  const modal = document.getElementById('modalProductDetails');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Troca a foto principal ao clicar nas miniaturas
function selectDetailThumbnail(imgSrc, btnElement) {
  const mainImg = document.getElementById('detailMainImg');
  if (mainImg) {
    mainImg.src = imgSrc;
  }
  document.querySelectorAll('.p-thumb-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) {
    btnElement.classList.add('active');
  }
}

// Altera quantidade no modal e recalcula o valor dinamicamente em tempo real
function changeDetailQty(delta) {
  currentDetailQty = Math.max(1, currentDetailQty + delta);
  const display = document.getElementById('detailQtyDisplay');
  if (display) {
    display.textContent = currentDetailQty;
  }
  updateDetailPriceDisplay();
}

// Atualiza o valor monetário de acordo com a contagem adicionada
function updateDetailPriceDisplay() {
  if (!currentDetailProduct) return;
  const currentPriceEl = document.getElementById('detailCurrentPrice');
  const oldPriceEl = document.getElementById('detailOldPrice');
  const unitTagEl = document.getElementById('detailUnitPriceTag');

  const totalCurrent = currentDetailProduct.preco * currentDetailQty;
  if (currentPriceEl) {
    currentPriceEl.textContent = `R$ ${totalCurrent.toFixed(2).replace('.', ',')}`;
  }

  if (oldPriceEl && currentDetailProduct.precoAntigo) {
    const totalOld = currentDetailProduct.precoAntigo * currentDetailQty;
    oldPriceEl.textContent = `R$ ${totalOld.toFixed(2).replace('.', ',')}`;
  }

  if (unitTagEl) {
    if (currentDetailQty > 1) {
      unitTagEl.textContent = `(R$ ${currentDetailProduct.preco.toFixed(2).replace('.', ',')} cada)`;
      unitTagEl.style.display = 'inline-block';
    } else {
      unitTagEl.style.display = 'none';
    }
  }
}

// Adiciona o produto do modal ao carrinho
function addCurrentDetailToCart() {
  if (!currentDetailProduct) return;

  const item = currentDetailProduct;
  const qtd = currentDetailQty || 1;

  // Sincroniza com o carrinho global unificado (app.js)
  if (typeof window.addToCart === 'function') {
    window.addToCart(item, qtd, true);
  } else {
    let currentCart = JSON.parse(localStorage.getItem('sushi_cart') || '[]');
    const existing = currentCart.find(i => String(i.id) === String(item.id));
    if (existing) {
      existing.quantidade = (parseInt(existing.quantidade, 10) || 1) + qtd;
    } else {
      currentCart.push({
        id: item.id,
        nome: item.nome,
        preco: parseFloat(item.preco) || 0,
        imagem: item.imagem || 'bannercapainicial.png',
        detalhes: item.detalhes || item.descricao || '',
        quantidade: qtd
      });
    }
    localStorage.setItem('sushi_cart', JSON.stringify(currentCart));
    if (window.AppState) window.AppState.cart = currentCart;
    if (typeof updateCartBadges === 'function') updateCartBadges();
    showFloatingToast(`+${qtd}x "${item.nome}" adicionado à sacola!`, 'success');
    if (typeof openCart === 'function') openCart();
  }

  updateCartBadge();
  closeProductDetails();
}

// Botão de Favorito
function toggleFavorite(btn) {
  if (!btn) return;
  const isFav = btn.classList.toggle('active');
  const icon = btn.querySelector('i');
  if (icon) {
    if (isFav) {
      icon.className = 'fa-solid fa-heart';
      showFloatingToast('Salvo nos seus favoritos!', 'success');
    } else {
      icon.className = 'fa-regular fa-heart';
      showFloatingToast('Removido dos favoritos.', 'info');
    }
  }
}

// ==============================================================================
// AÇÕES DO CARRINHO E COMPRA RÁPIDA
// ==============================================================================
function buyProduct(id, nome, preco, imagem) {
  const productObj = {
    id,
    nome,
    preco: typeof preco === 'number' ? preco : (parseFloat(preco) || 0),
    imagem: imagem || 'bannercapainicial.png'
  };

  if (typeof window.addToCart === 'function') {
    window.addToCart(productObj, 1, true);
    return;
  }

  // Fallback seguro
  let currentCart = JSON.parse(localStorage.getItem('sushi_cart') || '[]');
  const existing = currentCart.find(i => String(i.id) === String(id));
  if (existing) {
    existing.quantidade = (parseInt(existing.quantidade, 10) || 1) + 1;
  } else {
    currentCart.push({ ...productObj, quantidade: 1 });
  }
  localStorage.setItem('sushi_cart', JSON.stringify(currentCart));
  if (window.AppState) window.AppState.cart = currentCart;
  if (typeof updateCartBadges === 'function') updateCartBadges();
  updateCartBadge();
  showFloatingToast(`"${nome}" adicionado à sua sacola!`, 'success');
  if (typeof openCart === 'function') openCart();
}

// Ação de Compra de Combos da Seção Especial
function buyCombo(id, nome, preco, imagem) {
  buyProduct(id, nome, preco, imagem);
}

// Atualiza o contador de itens no carrinho da página
function updateCartBadge() {
  const badge = document.getElementById('cartCountBadge');
  if (!badge) return;
  const currentCart = JSON.parse(localStorage.getItem('sushi_cart') || '[]');
  const total = currentCart.reduce((sum, item) => sum + (item.quantidade || item.qtd || 1), 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'inline-flex' : 'none';
}

// Atualiza a contagem de itens em cada categoria dinamicamente do banco de dados
function updateCategoryCounts() {
  const countTodos = document.getElementById('count-todos');
  if (countTodos) {
    countTodos.textContent = cardapioProducts.length;
  }

  const cats = ['sushis', 'temakis', 'entradas', 'combinados', 'sobremesas', 'bebidas'];
  cats.forEach(cat => {
    const el = document.getElementById(`count-${cat}`);
    if (el) {
      const count = cardapioProducts.filter(p => normalizeCategory(p.categoria) === cat).length;
      el.textContent = count;
    }
  });
}

// Scroll suave para o catálogo
function scrollToCatalog() {
  const section = document.getElementById('catalogo');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

// Toast de feedback
function showFloatingToast(msg, type = 'info') {
  if (typeof showToast === 'function') {
    showToast(msg, type);
    return;
  }

  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// Dados de Fallback caso o servidor esteja offline
function getFallbackCardapioData() {
  return [
    { 
      id: 1, 
      nome: "Salmão Especial", 
      categoria: "sushis", 
      preco: 52.99, 
      precoAntigo: 62.99, 
      promocao: true, 
      destaqueTag: "ESPECIAL DA CASA",
      avaliacao: 4.9,
      avaliacoesQtd: 120,
      descricao: "Lâminas nobres de salmão fresco com cream cheese, cebolinha e molho tarê especial.", 
      imagem: "cardapio-salmao-especial.jpg",
      porcao: "8 unidades",
      peso: "250g",
      ingredientes: ["Salmão fresco selecionado", "Arroz japonês especial (Shari)", "Cream cheese cremoso", "Cebolinha picada fresca", "Gergelim tostado duplo"],
      galeria: ["cardapio-salmao-especial.jpg", "prato-essencia.jpg", "galeria-3.jpg", "galeria-1.jpg"]
    },
    { 
      id: 2, 
      nome: "Temaki Frito", 
      categoria: "temakis", 
      preco: 45.99, 
      precoAntigo: 55.99, 
      promocao: true, 
      destaqueTag: "MAIS PEDIDO",
      avaliacao: 4.8,
      avaliacoesQtd: 94,
      descricao: "Temaki empanado na farinha panko crocante, recheado com salmão grelhado e cream cheese.", 
      imagem: "cardapio-temaki-frito.jpg",
      porcao: "1 cone grande",
      peso: "220g",
      ingredientes: ["Alga nori crocante", "Salmão grelhado", "Farinha panko japonesa", "Cream cheese especial", "Molho tarê artesanal"],
      galeria: ["cardapio-temaki-frito.jpg", "prato-essencia.jpg", "galeria-3.jpg", "galeria-1.jpg"]
    },
    { 
      id: 3, 
      nome: "Temaki de Salmão", 
      categoria: "temakis", 
      preco: 39.99, 
      precoAntigo: 47.99, 
      promocao: true, 
      destaqueTag: "TRADICIONAL",
      avaliacao: 4.9,
      avaliacoesQtd: 112,
      descricao: "Alga nori crocante recheada com cubos generosos de salmão fresco, arroz temperado e cebolinha.", 
      imagem: "cardapio-temaki-salmao.jpg",
      porcao: "1 cone grande",
      peso: "200g",
      ingredientes: ["Alga nori fresca", "Cubos de salmão fresco", "Arroz japonês temperado", "Cebolinha picadinha"],
      galeria: ["cardapio-temaki-salmao.jpg", "prato-essencia.jpg", "galeria-3.jpg", "galeria-1.jpg"]
    },
    { 
      id: 4, 
      nome: "Temaki Atum", 
      categoria: "temakis", 
      preco: 33.95, 
      precoAntigo: 41.00, 
      promocao: true, 
      destaqueTag: "DESTAQUE DO CHEF",
      avaliacao: 4.7,
      avaliacoesQtd: 68,
      descricao: "Atum fresco selecionado em cubos com gergelim torrado e toque especial de azeite trufado.", 
      imagem: "cardapio-temaki-atum.jpg",
      porcao: "1 cone grande",
      peso: "200g",
      ingredientes: ["Alga nori", "Atum fresco em cubos", "Gergelim torrado", "Toque de azeite trufado", "Arroz japonês"],
      galeria: ["cardapio-temaki-atum.jpg", "prato-essencia.jpg", "galeria-3.jpg", "galeria-1.jpg"]
    },
    { 
      id: 5, 
      nome: "Yakisoba Carne", 
      categoria: "entradas", 
      preco: 39.95, 
      promocao: false, 
      destaqueTag: "PRATO QUENTE",
      avaliacao: 4.8,
      avaliacoesQtd: 85,
      descricao: "Macarrão oriental frito com tiras macias de carne bovina, legumes frescos e molho oriental autêntico.", 
      imagem: "cardapio-yakisoba.jpg",
      porcao: "Individual generosa",
      peso: "450g",
      ingredientes: ["Macarrão artesanal oriental", "Tiras nobres de carne bovina", "Brócolis, cenoura e acelga", "Molho shoyu especial"],
      galeria: ["cardapio-yakisoba.jpg", "prato-essencia.jpg", "galeria-3.jpg", "galeria-1.jpg"]
    },
    { 
      id: 6, 
      nome: "Harumaki", 
      categoria: "entradas", 
      preco: 40.00, 
      promocao: false, 
      destaqueTag: "CROCANTE",
      avaliacao: 4.6,
      avaliacoesQtd: 53,
      descricao: "Rolinhos primavera super crocantes recheados com legumes selecionados ou queijo derretido.", 
      imagem: "cardapio-harumaki.jpg",
      porcao: "4 unidades",
      peso: "200g",
      ingredientes: ["Massa crocante fininha", "Legumes frescos selecionados", "Acompanha molho agridoce"],
      galeria: ["cardapio-harumaki.jpg", "prato-essencia.jpg", "galeria-3.jpg", "galeria-1.jpg"]
    },
    { 
      id: 7, 
      nome: "Shimeji", 
      categoria: "entradas", 
      preco: 32.00, 
      promocao: false, 
      destaqueTag: "CLÁSSICO",
      avaliacao: 4.9,
      avaliacoesQtd: 140,
      descricao: "Cogumelos shimeji salteados na manteiga especial, shoyu nobre e finalizados com cebolinha fresca.", 
      imagem: "cardapio-shimeji.jpg",
      porcao: "Porção de entrada",
      peso: "180g",
      ingredientes: ["Cogumelos shimeji frescos", "Manteiga nobre", "Shoyu especial", "Cebolinha picada"],
      galeria: ["cardapio-shimeji.jpg", "prato-essencia.jpg", "galeria-3.jpg", "galeria-1.jpg"]
    },
    { 
      id: 8, 
      nome: "Sushi Atum", 
      categoria: "sushis", 
      preco: 32.90, 
      precoAntigo: 42.90, 
      promocao: true, 
      destaqueTag: "CORTE NOBRE",
      avaliacao: 4.8,
      avaliacoesQtd: 77,
      descricao: "Niguiris tradicionais com lâminas de atum fresco sobre arroz shari temperado com maestria.", 
      imagem: "cardapio-sushi-atum.jpg",
      porcao: "6 unidades",
      peso: "180g",
      ingredientes: ["Atum vermelho fresco", "Arroz shari temperado", "Toque sutil de wasabi"],
      galeria: ["cardapio-sushi-atum.jpg", "prato-essencia.jpg", "galeria-3.jpg", "galeria-1.jpg"]
    },
    { 
      id: 9, 
      nome: "Filadélfia", 
      categoria: "sushis", 
      preco: 33.99, 
      promocao: false, 
      destaqueTag: "O PREFERIDO",
      avaliacao: 4.9,
      avaliacoesQtd: 210,
      descricao: "Uramaki clássico com salmão fresco, cream cheese cremoso e envolto em gergelim tostado.", 
      imagem: "cardapio-filadelfia.jpg",
      porcao: "8 unidades",
      peso: "230g",
      ingredientes: ["Salmão fresco", "Cream cheese", "Gergelim tostado", "Arroz japonês", "Alga nori"],
      galeria: ["cardapio-filadelfia.jpg", "prato-essencia.jpg", "galeria-3.jpg", "galeria-1.jpg"]
    },
    { 
      id: 10, 
      nome: "Mochi Morango", 
      categoria: "sobremesas", 
      preco: 22.90, 
      promocao: false, 
      destaqueTag: "SOBREMESA TÍPICA",
      avaliacao: 4.9,
      avaliacoesQtd: 95,
      descricao: "Doce tradicional japonês feito com massa de arroz macia e recheado com morango fresco e pasta doce.", 
      imagem: "cardapio-mochi.jpg",
      porcao: "2 unidades",
      peso: "120g",
      ingredientes: ["Massa mochiko japonesa", "Morango fresco inteiro", "Recheio cremoso suave"],
      galeria: ["cardapio-mochi.jpg", "prato-essencia.jpg", "galeria-3.jpg", "galeria-1.jpg"]
    },
    { 
      id: 11, 
      nome: "Tempurá de Sorvete", 
      categoria: "sobremesas", 
      preco: 25.00, 
      promocao: false, 
      destaqueTag: "SOBREMESA ESPECIAL",
      avaliacao: 4.8,
      avaliacoesQtd: 62,
      descricao: "Bola de sorvete cremoso envolvida em massa crocante quente e frita rapidamente com calda de chocolate.", 
      imagem: "cardapio-tempura-sorvete.jpg",
      porcao: "1 porção com 2 metades",
      peso: "180g",
      ingredientes: ["Sorvete de creme", "Casquinha de tempurá crocante", "Calda artesanal de chocolate"],
      galeria: ["cardapio-tempura-sorvete.jpg", "prato-essencia.jpg", "galeria-3.jpg", "galeria-1.jpg"]
    }
  ];
}
