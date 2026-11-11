// ==============================================================================
// SUSHI HOUSE - JAVASCRIPT PRINCIPAL (FRONTEND SPA & CONSUMO DE API REST)
// Disciplina: IHC e Técnicas Avançadas de Prog Web e Mobile
// ==============================================================================

const API_BASE = ''; // Endereço relativo ao mesmo servidor Node.js

// Estado Global da Aplicação
const AppState = {
  produtos: [
    {
      id: 1,
      nome: "Sashimi Salmão Prime",
      categoria: "sashimi",
      preco: 36.90,
      descricao: "Fatias nobres de salmão fresco, macias e com corte tradicional japonês.",
      destaque: false,
      imagem: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      nome: "Uramaki Filadélfia Especial",
      categoria: "uramaki",
      preco: 28.90,
      descricao: "Arroz por fora, salmão fresco, cream cheese cremoso e gergelim tostado.",
      destaque: false,
      imagem: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      nome: "Hot Roll Crocante",
      categoria: "hot-roll",
      preco: 29.90,
      descricao: "Sushi empanado e frito na hora, salmão, cream cheese e molho tarê especial.",
      destaque: false,
      imagem: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 4,
      nome: "Combo especial House",
      categoria: "combinados",
      preco: 32.90,
      descricao: "Seleção clássica do sushiman com sashimis, niguiris e uramakis variados.",
      destaque: true,
      imagem: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 5,
      nome: "Combo Temaki",
      categoria: "combinados",
      preco: 32.90,
      descricao: "1 Temaki de salmão completo crocante + 4 hot rolls + 4 uramakis.",
      destaque: true,
      imagem: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: 6,
      nome: "Salmão especial",
      categoria: "sashimi",
      preco: 22.90,
      descricao: "Lâminas de salmão seladas com azeite trufado, flor de sal e raspas de limão siciliano.",
      destaque: true,
      imagem: "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=600&auto=format&fit=crop&q=80"
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
      imagem: "combosespeciaisbanner.png"
    },
    {
      id: 8,
      nome: "Temaki Salmão com Cream Cheese",
      categoria: "uramaki",
      preco: 24.90,
      descricao: "Cone de alga crocante generosamente recheado com cubos de salmão e cream cheese.",
      destaque: false,
      imagem: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=600&auto=format&fit=crop&q=80"
    }
  ],
  cart: JSON.parse(localStorage.getItem('sushi_cart') || '[]'),
  currentUser: JSON.parse(localStorage.getItem('sushi_user') || 'null'),
  activeCategory: 'todos',
  searchQuery: '',
  deliveryFee: 7.00,
  cepData: {
    cep: '17400-000',
    logradouro: 'Rua Barão do Rio Branco',
    bairro: 'Centro',
    localidade: 'Garça',
    uf: 'SP',
    taxa: 7.00,
    prazo: '30 a 45 min'
  },
  appliedCoupon: null
};

// Exporta globalmente para compatibilidade total entre páginas e scripts
window.AppState = AppState;

// ==============================================================================
// INICIALIZAÇÃO
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initViewSwitcher();
  initAuthUI();
  updateCartBadges();
  loadProductsFromBackend();
  loadFaqFromBackend();
  loadTestimonialsFromBackend();
  checkBackendHealth();
});

// Verifica se o backend Node.js está online
async function checkBackendHealth() {
  const statusEl = document.getElementById('backendStatus');
  if (!statusEl) return;
  try {
    const res = await fetch(`${API_BASE}/api/produtos`);
    if (res.ok) {
      statusEl.innerHTML = `<i class="fa-solid fa-circle-dot"></i> Backend Node.js Online`;
      statusEl.style.borderColor = 'rgba(34, 197, 94, 0.4)';
    } else {
      throw new Error();
    }
  } catch (err) {
    statusEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Backend Offline (Inicie node server.js)`;
    statusEl.style.color = '#f87171';
    statusEl.style.borderColor = '#f87171';
  }
}

// ==============================================================================
// TELA 1 & CONTROLE IHC: ALTERNADOR DE VISUALIZAÇÃO (DESKTOP VS IPHONE MOCKUP)
// ==============================================================================
function initViewSwitcher() {
  const btnDesktop = document.getElementById('btnViewDesktop');
  const btnMobile = document.getElementById('btnViewMobile');

  if (btnDesktop && btnMobile) {
    btnDesktop.addEventListener('click', () => {
      document.body.classList.remove('view-mobile');
      document.body.classList.add('view-desktop');
      btnDesktop.classList.add('active');
      btnMobile.classList.remove('active');
      showToast('Visualização: Modo Tela Cheia Desktop / Web', 'info');
    });

    btnMobile.addEventListener('click', () => {
      document.body.classList.remove('view-desktop');
      document.body.classList.add('view-mobile');
      btnMobile.classList.add('active');
      btnDesktop.classList.remove('active');
      showToast('Visualização: Modo Wireframe Mobile (iPhone Frame)', 'info');
    });
  }
}

function navigateTo(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

function scrollToSection(sectionId) {
  navigateTo(sectionId);
}

function toggleMobileNav() {
  const drawer = document.getElementById('mobileNavDrawer');
  const toggleBtn = document.getElementById('mobileMenuToggle');

  // Remove backdrop legado se existir para não escurecer a tela
  const oldBackdrop = document.getElementById('mobileDrawerBackdrop');
  if (oldBackdrop) {
    oldBackdrop.remove();
  }

  if (drawer) {
    drawer.classList.toggle('open');
    const isOpen = drawer.classList.contains('open');

    if (toggleBtn) {
      toggleBtn.classList.toggle('active', isOpen);
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    }
  }
}

// Fechar menu mobile suspenso ao clicar fora
document.addEventListener('click', function(e) {
  const drawer = document.getElementById('mobileNavDrawer');
  const toggleBtn = document.getElementById('mobileMenuToggle');
  if (drawer && drawer.classList.contains('open')) {
    if (!drawer.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
      toggleMobileNav();
    }
  }
});

// ==============================================================================
// TELA 2: CARDÁPIO COMPLETO E PRODUTOS (BACKEND GET /api/produtos)
// ==============================================================================
async function loadProductsFromBackend() {
  try {
    const res = await fetch(`${API_BASE}/api/produtos`);
    const data = await res.json();
    if (data.sucesso && Array.isArray(data.dados)) {
      AppState.produtos = data.dados;
      renderFeaturedProducts(AppState.produtos);
      renderMenuGrid(AppState.produtos);
    }
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
  }
}

// Renderiza os pratos em destaque na Home carregados do Backend
function renderFeaturedProducts(products) {
  const container = document.getElementById('featuredProductsContainer');
  if (!container || !Array.isArray(products) || products.length === 0) return;

  // Prioriza pratos marcados com destaque === true pelo admin
  let featured = products.filter(p => p.destaque === true);
  if (featured.length === 0) {
    featured = products.slice(0, 4);
  } else if (featured.length < 4) {
    const others = products.filter(p => !p.destaque);
    featured = [...featured, ...others].slice(0, 4);
  } else {
    featured = featured.slice(0, 4);
  }

  container.innerHTML = featured.map((item, idx) => {
    const badgeText = item.destaqueTag || (item.promocao ? 'Promoção' : (idx === 0 ? 'Mais Pedido' : (idx === 1 ? "Chef's Choice" : (idx === 2 ? 'Super Fresco' : 'Especial'))));
    const badgeIcon = idx === 0 ? 'fa-star' : (idx === 1 ? 'fa-fire' : (idx === 2 ? 'fa-leaf' : 'fa-bolt'));
    const safeName = (item.nome || 'Prato Sushi House').replace(/'/g, "\\'");
    const imgUrl = item.imagem || 'bannercapainicial.png';
    const priceFormatted = (parseFloat(item.preco) || 0).toFixed(2).replace('.', ',');

    return `
      <div class="product-highlight-card" onclick="window.location.href='cardapio.html'">
        <span class="card-badge-floating"><i class="fa-solid ${badgeIcon}"></i> ${badgeText}</span>
        <div class="card-img-container">
          <img src="${imgUrl}" alt="${safeName}" class="card-img" onerror="this.src='bannercapainicial.png'">
        </div>
        <div class="card-body">
          <h4 class="card-title">${item.nome}</h4>
          <span class="card-price">A partir de <strong>R$ ${priceFormatted}</strong></span>
          <button type="button" class="btn-add-quick" onclick="event.stopPropagation(); quickAddToCart(${item.id}, true)">
            <i class="fa-solid fa-plus"></i> Adicionar
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function openMenuModal() {
  const modal = document.getElementById('modalMenu');
  if (modal) {
    modal.classList.add('open');
    renderMenuGrid(AppState.produtos);
  }
}

function closeMenuModal() {
  const modal = document.getElementById('modalMenu');
  if (modal) modal.classList.remove('open');
}

function filterMenuByCategory(category) {
  AppState.activeCategory = category;

  // Atualiza botões de chip
  const chips = document.querySelectorAll('#categoriesChips .chip');
  chips.forEach(chip => {
    if (chip.textContent.toLowerCase().includes(category) || (category === 'todos' && chip.textContent === 'Todos')) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  // Abre modal se ainda não estiver aberto
  openMenuModal();

  applyMenuFilters();
}

function handleMenuSearch(query) {
  AppState.searchQuery = query.trim().toLowerCase();
  applyMenuFilters();
}

function applyMenuFilters() {
  let filtered = AppState.produtos;

  if (AppState.activeCategory && AppState.activeCategory !== 'todos') {
    filtered = filtered.filter(p => p.categoria.toLowerCase() === AppState.activeCategory.toLowerCase());
  }

  if (AppState.searchQuery) {
    filtered = filtered.filter(p => 
      p.nome.toLowerCase().includes(AppState.searchQuery) ||
      p.descricao.toLowerCase().includes(AppState.searchQuery)
    );
  }

  renderMenuGrid(filtered);
}

function renderMenuGrid(items) {
  const container = document.getElementById('menuProductsGrid');
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 0; color: #888;">
        <i class="fa-solid fa-bowl-food" style="font-size: 2.5rem; margin-bottom: 12px; opacity: 0.5;"></i>
        <p>Nenhum prato encontrado para este filtro.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="menu-item-card">
      <img src="${item.imagem}" alt="${item.nome}" class="menu-item-thumb" onerror="this.src='bannercapainicial.png'">
      <div class="menu-item-info">
        <h4 class="menu-item-title">${item.nome}</h4>
        <p class="menu-item-desc">${item.descricao}</p>
        <div class="menu-item-bottom">
          <span class="menu-item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
          <button type="button" class="btn-add-quick" onclick="quickAddToCart(${item.id})">
            <i class="fa-solid fa-plus"></i> Adicionar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ==============================================================================
// TELA 3: CARRINHO E CHECKOUT ESTILO IFOOD (SINCRONIZAÇÃO COMPLETA)
// ==============================================================================

// Função centralizada e segura para adicionar itens à sacola
function addToCart(product, qty = 1, openDrawer = false) {
  if (!product) return;

  const prodId = product.id !== undefined ? product.id : (product.nome || Date.now());
  const prodNome = product.nome || 'Prato Sushi House';
  const prodPreco = typeof product.preco === 'number' ? product.preco : (parseFloat(product.preco) || 0);
  const prodImg = product.imagem || 'bannercapainicial.png';
  const prodDetalhes = product.detalhes || product.descricao || '';
  const addQty = Math.max(1, parseInt(qty, 10) || 1);

  // Recarrega do localStorage para garantir sincrono total
  let cart = [];
  try {
    const raw = JSON.parse(localStorage.getItem('sushi_cart') || '[]');
    cart = Array.isArray(raw) ? raw : [];
  } catch (e) {
    cart = [];
  }

  const existing = cart.find(item => String(item.id) === String(prodId));
  if (existing) {
    existing.quantidade = (parseInt(existing.quantidade, 10) || 1) + addQty;
    if (!existing.preco) existing.preco = prodPreco;
    if (!existing.imagem || existing.imagem === 'undefined') existing.imagem = prodImg;
  } else {
    cart.push({
      id: prodId,
      nome: prodNome,
      preco: prodPreco,
      imagem: prodImg,
      detalhes: prodDetalhes,
      categoria: product.categoria || '',
      quantidade: addQty
    });
  }

  AppState.cart = cart;
  saveCart();
  updateCartBadges();

  showToast(`“${prodNome}” adicionado à sacola!`, 'success');

  if (openDrawer) {
    openCart();
  }
}
window.addToCart = addToCart;

function quickAddToCart(productId, openDrawer = false) {
  let product = AppState.produtos.find(p => String(p.id) === String(productId));
  if (!product) {
    // Procura em sementes de pratos
    const defaultList = [
      { id: 1, nome: "Sashimi Salmão Prime", preco: 36.90, imagem: "bannercapainicial.png" },
      { id: 2, nome: "Uramaki Filadélfia Especial", preco: 28.90, imagem: "comboshushihome.png" },
      { id: 3, nome: "Hot Roll Crocante", preco: 29.90, imagem: "banercomboscardapiocelular.png" },
      { id: 4, nome: "Combo Especial House", preco: 32.90, imagem: "comboshushihome.png" },
      { id: 5, nome: "Combo Temaki Sabor", preco: 32.90, imagem: "banercomboscardapiocelular.png" },
      { id: 6, nome: "Salmão Especial Supremo", preco: 22.90, imagem: "bannercapainicial.png" },
      { id: 7, nome: "Super Combo Semana (20 Peças + Bebida)", preco: 54.90, imagem: "combosespeciaisbanner.png" },
      { id: 8, nome: "Temaki Salmão com Cream Cheese", preco: 24.90, imagem: "banercomboscardapiocelular.png" }
    ];
    product = defaultList.find(p => String(p.id) === String(productId));
  }
  if (!product) return;
  addToCart(product, 1, openDrawer);
}
window.quickAddToCart = quickAddToCart;

function saveCart() {
  localStorage.setItem('sushi_cart', JSON.stringify(AppState.cart));
}
window.saveCart = saveCart;

function updateCartBadges() {
  try {
    const raw = JSON.parse(localStorage.getItem('sushi_cart') || '[]');
    if (Array.isArray(raw)) AppState.cart = raw;
  } catch (e) {}

  const totalItems = AppState.cart.reduce((acc, item) => acc + (parseInt(item.quantidade, 10) || 1), 0);
  const headerBadge = document.getElementById('cartCountBadge');
  const bottomBadge = document.getElementById('bottomCartBadge');
  const mobileDrawerBadge = document.getElementById('mobileCartCountBadge');

  if (headerBadge) {
    headerBadge.textContent = totalItems;
    headerBadge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
  }
  if (bottomBadge) {
    bottomBadge.textContent = totalItems;
    bottomBadge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
  }
  if (mobileDrawerBadge) {
    mobileDrawerBadge.textContent = totalItems;
    mobileDrawerBadge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
  }

  // Compatibilidade com badges de páginas específicas
  if (typeof updateCartBadge === 'function' && updateCartBadge !== updateCartBadges) {
    try { updateCartBadge(); } catch(e) {}
  }
  if (typeof updateProductCartBadge === 'function') {
    try { updateProductCartBadge(); } catch(e) {}
  }
}
window.updateCartBadges = updateCartBadges;

function openCart() {
  const modal = document.getElementById('modalCart');
  if (modal) {
    // Sincroniza sempre o AppState com o localStorage
    try {
      const raw = JSON.parse(localStorage.getItem('sushi_cart') || '[]');
      AppState.cart = Array.isArray(raw) ? raw : [];
    } catch (e) {
      AppState.cart = [];
    }
    updateCartBadges();
    renderCartModal();
    prefillCheckoutForm();
    modal.classList.add('open');
  }
}
window.openCart = openCart;

function closeCart() {
  const modal = document.getElementById('modalCart');
  if (modal) modal.classList.remove('open');
}
window.closeCart = closeCart;

// Aplicação de Cupom de Desconto Estilo iFood
function applyCartCoupon() {
  const input = document.getElementById('cartCouponInput');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (!code) {
    showToast('Digite um código de cupom.', 'info');
    return;
  }

  if (code === 'SUSHI10' || code === 'BEMVINDO10') {
    AppState.appliedCoupon = { code, tipo: 'fixo', valor: 10.00, desc: 'R$ 10,00 OFF' };
    showToast(`Cupom ${code} aplicado! R$ 10,00 de desconto no pedido.`, 'success');
  } else if (code === 'PRIMEIRACOMPRA' || code === 'SUSHI5') {
    AppState.appliedCoupon = { code, tipo: 'porcentagem', valor: 0.10, desc: '10% OFF no pedido' };
    showToast(`Cupom ${code} aplicado! 10% de desconto no pedido.`, 'success');
  } else if (code === 'FRETENAFAIXA' || code === 'FRETEGRATIS') {
    AppState.appliedCoupon = { code, tipo: 'frete', valor: 0, desc: 'Frete Grátis Liberado' };
    showToast(`Cupom ${code} aplicado! Frete Grátis neste pedido.`, 'success');
  } else {
    showToast('Cupom inválido ou expirado. Tente SUSHI10 ou PRIMEIRACOMPRA.', 'error');
    return;
  }

  renderCartModal();
}
window.applyCartCoupon = applyCartCoupon;

function removeAppliedCoupon() {
  AppState.appliedCoupon = null;
  showToast('Cupom removido.', 'info');
  renderCartModal();
}
window.removeAppliedCoupon = removeAppliedCoupon;

function renderCartModal() {
  const listEl = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotal');
  const deliveryEl = document.getElementById('cartDelivery');
  const totalEl = document.getElementById('cartTotal');
  const btnSubmit = document.getElementById('btnSubmitOrder');
  const barFill = document.getElementById('freeShippingBarFill');
  const statusMsg = document.getElementById('freeShippingStatusMsg');
  const pixDiscountLine = document.getElementById('pixDiscountLine');
  const pixDiscountVal = document.getElementById('cartPixDiscount');
  const checkoutSection = document.getElementById('checkoutSection');
  const addMoreRow = document.getElementById('cartAddMoreRow');
  const utensilsCard = document.getElementById('cartUtensilsCard');
  const couponSection = document.getElementById('cartCouponSection');

  if (!listEl) return;

  // Sincroniza e higieniza sempre o carrinho do localStorage
  try {
    const raw = JSON.parse(localStorage.getItem('sushi_cart') || '[]');
    if (Array.isArray(raw)) {
      AppState.cart = raw.filter(i => i && (i.id !== undefined || i.nome)).map(item => ({
        id: item.id !== undefined ? item.id : (item.nome || Date.now()),
        nome: item.nome || 'Prato Sushi House',
        preco: typeof item.preco === 'number' ? item.preco : (parseFloat(item.preco) || 0),
        imagem: item.imagem || 'bannercapainicial.png',
        detalhes: item.detalhes || item.descricao || '',
        categoria: item.categoria || '',
        quantidade: Math.max(1, parseInt(item.quantidade || item.qtd || 1, 10))
      }));
    } else {
      AppState.cart = [];
    }
  } catch (e) {
    AppState.cart = [];
  }

  // 1. ESTADO DA SACOLA VAZIA (ESTILO IFOOD)
  if (AppState.cart.length === 0) {
    listEl.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-cart-icon">
          <i class="fa-solid fa-basket-shopping"></i>
        </div>
        <h4 class="empty-cart-title">Sua sacola está vazia</h4>
        <p class="empty-cart-desc">Adicione sashimis frescos, uramakis ou combos especiais para fazer seu pedido!</p>
        <a href="cardapio.html" class="btn-empty-cart-action" onclick="closeCart()">
          <i class="fa-solid fa-utensils"></i> Explorar Cardápio
        </a>
      </div>
    `;

    if (subtotalEl) subtotalEl.textContent = 'R$ 0,00';
    if (deliveryEl) deliveryEl.textContent = 'R$ 0,00';
    if (totalEl) totalEl.textContent = 'R$ 0,00';
    if (barFill) barFill.style.width = '0%';
    if (statusMsg) statusMsg.innerHTML = 'Adicione itens para calcular o frete grátis';
    if (pixDiscountLine) pixDiscountLine.style.display = 'none';

    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.style.opacity = '0.5';
      btnSubmit.style.cursor = 'not-allowed';
      btnSubmit.innerHTML = `<span>Sacola Vazia</span> <span>R$ 0,00</span>`;
    }

    if (checkoutSection) checkoutSection.style.opacity = '0.4';
    if (addMoreRow) addMoreRow.style.display = 'none';
    if (utensilsCard) utensilsCard.style.display = 'none';
    if (couponSection) couponSection.style.display = 'none';
    return;
  }

  // 2. ESTADO COM ITENS ADICIONADOS (SACOLA COMPLETA IFOOD)
  if (checkoutSection) checkoutSection.style.opacity = '1';
  if (addMoreRow) addMoreRow.style.display = 'block';
  if (utensilsCard) utensilsCard.style.display = 'flex';
  if (couponSection) couponSection.style.display = 'flex';

  let subtotal = 0;

  // Renderiza cada card de item estilo iFood
  listEl.innerHTML = AppState.cart.map(item => {
    const itemTotal = item.preco * item.quantidade;
    subtotal += itemTotal;
    const safeId = String(item.id).replace(/'/g, "\\'");
    const isSingle = item.quantidade === 1;

    return `
      <div class="cart-item-card" data-item-id="${item.id}">
        <div class="cart-item-left">
          <img src="${item.imagem}" alt="${item.nome}" class="cart-item-thumb" onerror="this.src='bannercapainicial.png'">
          <div class="cart-item-info">
            <h5 class="cart-item-title">${item.nome}</h5>
            ${item.detalhes ? `<p class="cart-item-desc">${item.detalhes}</p>` : ''}
            <div class="cart-item-pricing">
              <strong class="cart-item-total-price">R$ ${itemTotal.toFixed(2).replace('.', ',')}</strong>
              ${item.quantidade > 1 ? `<span class="cart-item-unit-price">(R$ ${item.preco.toFixed(2).replace('.', ',')} cada)</span>` : ''}
            </div>
          </div>
        </div>
        <div class="cart-item-stepper">
          ${isSingle 
            ? `<button type="button" class="btn-stepper btn-trash" onclick="changeCartQty('${safeId}', -1)" title="Remover da sacola"><i class="fa-regular fa-trash-can"></i></button>`
            : `<button type="button" class="btn-stepper" onclick="changeCartQty('${safeId}', -1)" title="Diminuir quantidade"><i class="fa-solid fa-minus"></i></button>`
          }
          <span class="stepper-val">${item.quantidade}</span>
          <button type="button" class="btn-stepper btn-plus" onclick="changeCartQty('${safeId}', 1)" title="Aumentar quantidade"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
    `;
  }).join('');

  // Regra de Frete Grátis acima de R$ 100,00 (Estilo iFood)
  const metaFreteGratis = 100.00;
  const isFreteGratisPorValor = subtotal >= metaFreteGratis;
  const isFreteGratisPorCupom = AppState.appliedCoupon && AppState.appliedCoupon.tipo === 'frete';
  const isFreteGratis = isFreteGratisPorValor || isFreteGratisPorCupom;

  const baseDeliveryFee = (AppState.cepData && typeof AppState.cepData.taxa === 'number') ? AppState.cepData.taxa : AppState.deliveryFee;
  const effectiveDeliveryFee = isFreteGratis ? 0.00 : baseDeliveryFee;

  // Atualiza barra de progresso do frete grátis
  if (barFill && statusMsg) {
    if (isFreteGratis) {
      barFill.style.width = '100%';
      barFill.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
      statusMsg.innerHTML = '<span style="color:#22c55e; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Parabéns! Você ganhou FRETE GRÁTIS neste pedido! 🎉</span>';
    } else {
      const percent = Math.min(100, Math.max(5, (subtotal / metaFreteGratis) * 100));
      const faltam = metaFreteGratis - subtotal;
      barFill.style.width = `${percent.toFixed(1)}%`;
      barFill.style.background = 'linear-gradient(90deg, #e50914, #ffb703, #22c55e)';
      statusMsg.innerHTML = `Faltam apenas <strong style="color:#fff;">R$ ${faltam.toFixed(2).replace('.', ',')}</strong> para você desbloquear <strong style="color:#22c55e;">Frete Grátis</strong>! 🍣`;
    }
  }

  // Verifica forma de pagamento para aplicar desconto PIX (5% OFF)
  const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');
  const isPix = paymentMethodInput ? paymentMethodInput.value === 'PIX' : true;
  let pixDiscount = 0;

  if (isPix) {
    pixDiscount = subtotal * 0.05;
    if (pixDiscountLine) pixDiscountLine.style.display = 'flex';
    if (pixDiscountVal) pixDiscountVal.textContent = `- R$ ${pixDiscount.toFixed(2).replace('.', ',')}`;
  } else {
    if (pixDiscountLine) pixDiscountLine.style.display = 'none';
  }

  // Desconto de Cupom
  let couponDiscount = 0;
  const couponLine = document.getElementById('couponDiscountLine');
  const couponValEl = document.getElementById('cartCouponDiscount');
  const couponFeedback = document.getElementById('appliedCouponFeedback');

  if (AppState.appliedCoupon) {
    if (AppState.appliedCoupon.tipo === 'fixo') {
      couponDiscount = Math.min(subtotal, AppState.appliedCoupon.valor);
    } else if (AppState.appliedCoupon.tipo === 'porcentagem') {
      couponDiscount = subtotal * AppState.appliedCoupon.valor;
    }

    if (couponLine) {
      couponLine.style.display = 'flex';
      if (couponValEl) couponValEl.textContent = `- R$ ${couponDiscount.toFixed(2).replace('.', ',')}`;
    }
    if (couponFeedback) {
      couponFeedback.style.display = 'flex';
      couponFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Cupom <strong>${AppState.appliedCoupon.code}</strong> ativo (${AppState.appliedCoupon.desc}) <button type="button" onclick="removeAppliedCoupon()" style="background:none; border:none; color:#ef4444; cursor:pointer; text-decoration:underline; font-size:0.75rem; margin-left:8px;">Remover</button>`;
    }
  } else {
    if (couponLine) couponLine.style.display = 'none';
    if (couponFeedback) couponFeedback.style.display = 'none';
  }

  const total = Math.max(0, subtotal - pixDiscount - couponDiscount + effectiveDeliveryFee);

  if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
  if (deliveryEl) {
    if (isFreteGratis) {
      deliveryEl.innerHTML = '<strong style="color: #22c55e;"><i class="fa-solid fa-gift"></i> GRÁTIS</strong>';
    } else {
      deliveryEl.textContent = `R$ ${effectiveDeliveryFee.toFixed(2).replace('.', ',')}`;
    }
  }
  if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;

  // Atualiza também tag de frete no card de CEP caso esteja visível
  const cepFeeEl = document.getElementById('cepDetectedFee');
  if (cepFeeEl) {
    if (isFreteGratis) {
      cepFeeEl.innerHTML = '<span style="color:#22c55e; font-weight:800;">GRÁTIS (Oferta iFood)</span>';
    } else {
      cepFeeEl.innerHTML = `R$ ${baseDeliveryFee.toFixed(2).replace('.', ',')}`;
    }
  }

  // Atualiza botão de confirmação com valor total estilo iFood
  if (btnSubmit) {
    btnSubmit.disabled = false;
    btnSubmit.style.opacity = '1';
    btnSubmit.style.cursor = 'pointer';
    btnSubmit.innerHTML = `
      <span>Confirmar e Fazer Pedido</span>
      <strong style="font-size: 1.05rem; background: rgba(0,0,0,0.3); padding: 4px 12px; border-radius: 20px;">R$ ${total.toFixed(2).replace('.', ',')}</strong>
      <i class="fa-solid fa-arrow-right"></i>
    `;
  }
}
window.renderCartModal = renderCartModal;

// Manipulador do input de CEP com máscara 00000-000
function handleCepInput(input) {
  let val = input.value.replace(/\D/g, '');
  if (val.length > 8) val = val.slice(0, 8);
  if (val.length > 5) {
    input.value = `${val.slice(0, 5)}-${val.slice(5)}`;
  } else {
    input.value = val;
  }

  if (val.length === 8) {
    consultarCepCart(input.value);
  }
}

// Botão rápido para preencher CEP de Garça ou Marília
function preencherCepRapido(cep) {
  const cartInput = document.getElementById('cartCepInput');
  const prodInput = document.getElementById('prodCepInput');
  if (cartInput) cartInput.value = cep;
  if (prodInput) prodInput.value = cep;
  consultarCepCart(cep);
}

// Consulta de CEP real via ViaCEP com fallback local para Garça / SP
async function consultarCepCart(customCep) {
  const cartInput = document.getElementById('cartCepInput');
  const prodInput = document.getElementById('prodCepInput');
  const cepRaw = customCep || (cartInput ? cartInput.value : '') || (prodInput ? prodInput.value : '');
  const cleanCep = cepRaw.replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    showToast('Digite um CEP válido com 8 dígitos (ex: 17400-000).', 'info');
    return;
  }

  const btnCalc = document.querySelector('.btn-calc-cep');
  if (btnCalc) {
    btnCalc.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
  }

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await res.json();

    if (data.erro) {
      showToast('CEP não encontrado nos Correios. Usando estimativa padrão.', 'info');
      aplicarResultadoCep({
        cep: cleanCep,
        logradouro: 'Endereço Local',
        bairro: 'Centro',
        localidade: 'Garça',
        uf: 'SP',
        taxa: 7.00,
        prazo: '30 a 45 min'
      });
      return;
    }

    // Calcula taxa e prazo conforme a localidade
    let taxa = 7.00;
    let prazo = '30 a 45 min';

    const localidadeNorm = (data.localidade || '').toLowerCase();
    const cepNum = parseInt(cleanCep, 10);

    if (localidadeNorm.includes('garça') || (cepNum >= 17400000 && cepNum <= 17409999)) {
      taxa = 7.00;
      prazo = '25 a 40 min';
    } else if (localidadeNorm.includes('marília') || (cepNum >= 17500000 && cepNum <= 17539999)) {
      taxa = 12.00;
      prazo = '40 a 55 min';
    } else if (data.uf === 'SP') {
      taxa = 14.90;
      prazo = '50 a 65 min';
    } else {
      taxa = 19.90;
      prazo = '60 a 80 min';
    }

    aplicarResultadoCep({
      cep: data.cep || cleanCep,
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      localidade: data.localidade || 'Garça',
      uf: data.uf || 'SP',
      taxa,
      prazo
    });

    showToast(`Entrega calculada para ${data.localidade} - ${data.uf}!`, 'success');

  } catch (err) {
    console.warn('Falha na consulta online de CEP. Aplicando estimativa local offline:', err);
    // Fallback inteligente para ambiente offline
    const isMarilia = cleanCep.startsWith('175');
    aplicarResultadoCep({
      cep: cleanCep,
      logradouro: isMarilia ? 'Avenida Sampaio Vidal' : 'Rua Barão do Rio Branco',
      bairro: 'Centro',
      localidade: isMarilia ? 'Marília' : 'Garça',
      uf: 'SP',
      taxa: isMarilia ? 12.00 : 7.00,
      prazo: isMarilia ? '40 a 55 min' : '30 a 45 min'
    });
    showToast('Previsão calculada com base na região!', 'info');
  } finally {
    if (btnCalc) {
      btnCalc.innerHTML = `<span>Calcular</span> <i class="fa-solid fa-arrow-right"></i>`;
    }
  }
}

// Aplica os dados do CEP encontrado na interface e recalcula
function aplicarResultadoCep(cepInfo) {
  AppState.cepData = cepInfo;
  AppState.deliveryFee = cepInfo.taxa;

  // Atualiza card de resultado no modal do carrinho
  const resultCard = document.getElementById('cartCepResultCard');
  const addressText = document.getElementById('cepDetectedAddress');
  const etaText = document.getElementById('cepDetectedEta');
  const feeTag = document.getElementById('cepDetectedFee');

  const formattedLocation = `${cepInfo.logradouro ? cepInfo.logradouro + ' - ' : ''}${cepInfo.bairro ? cepInfo.bairro + ', ' : ''}${cepInfo.localidade} - ${cepInfo.uf}`;

  if (addressText) addressText.textContent = formattedLocation;
  if (etaText) etaText.innerHTML = `<i class="fa-regular fa-clock"></i> Chega em ${cepInfo.prazo}`;
  if (feeTag) feeTag.textContent = `R$ ${cepInfo.taxa.toFixed(2).replace('.', ',')}`;
  if (resultCard) {
    resultCard.classList.add('active');
    resultCard.style.display = 'flex';
  }

  // Preenche automaticamente o campo de endereço de entrega para conveniência do usuário
  const orderAddressInput = document.getElementById('orderClientAddress');
  if (orderAddressInput && (!orderAddressInput.value || orderAddressInput.value.includes('Garça') || orderAddressInput.value.includes('Marília') || orderAddressInput.value.includes('Centro'))) {
    orderAddressInput.value = `${cepInfo.logradouro ? cepInfo.logradouro + ', Nº ' : ''}${cepInfo.bairro ? cepInfo.bairro + ' - ' : ''}${cepInfo.localidade} - ${cepInfo.uf}`;
  }

  // Se houver simulador na página de produto
  const prodCepResult = document.getElementById('prodCepResult');
  if (prodCepResult) {
    prodCepResult.style.display = 'block';
    prodCepResult.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong style="color:#fff;"><i class="fa-solid fa-truck-fast text-highlight"></i> ${cepInfo.localidade} - ${cepInfo.uf}</strong>
          <div style="color:#aaa; font-size:0.82rem; margin-top:2px;">Chega em ${cepInfo.prazo} • Entrega Expressa Sushi House</div>
        </div>
        <div>
          <span style="color:#22c55e; font-weight:800; font-size:0.95rem;">R$ ${cepInfo.taxa.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
    `;
  }

  renderCartModal();
}

// Alterna seleção visual e recálculo dos métodos de pagamento
function updatePaymentMethodSelection() {
  const cards = document.querySelectorAll('.payment-card');
  cards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio && radio.checked) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
  renderCartModal();
}

function changeCartQty(id, delta) {
  // Recarrega sempre do localStorage
  let cart = [];
  try {
    const raw = JSON.parse(localStorage.getItem('sushi_cart') || '[]');
    cart = Array.isArray(raw) ? raw : [];
  } catch (e) {
    cart = [];
  }

  const itemIndex = cart.findIndex(i => String(i.id) === String(id));
  if (itemIndex === -1) return;

  cart[itemIndex].quantidade = (parseInt(cart[itemIndex].quantidade, 10) || 1) + delta;

  if (cart[itemIndex].quantidade <= 0) {
    const removedName = cart[itemIndex].nome;
    cart.splice(itemIndex, 1);
    showToast(`“${removedName}” removido da sacola.`, 'info');
  }

  AppState.cart = cart;
  saveCart();
  updateCartBadges();
  renderCartModal();
}
window.changeCartQty = changeCartQty;

function clearCart() {
  if (AppState.cart.length === 0) return;
  if (confirm('Deseja realmente esvaziar a sua sacola?')) {
    AppState.cart = [];
    AppState.appliedCoupon = null;
    saveCart();
    updateCartBadges();
    renderCartModal();
    showToast('Sacola esvaziada.', 'info');
  }
}
window.clearCart = clearCart;

function prefillCheckoutForm() {
  if (AppState.currentUser) {
    const nameInput = document.getElementById('orderClientName');
    const phoneInput = document.getElementById('orderClientPhone');
    const addressInput = document.getElementById('orderClientAddress');

    if (nameInput && !nameInput.value) nameInput.value = AppState.currentUser.nome || '';
    if (phoneInput && !phoneInput.value) phoneInput.value = AppState.currentUser.telefone || '';
    if (addressInput && !addressInput.value) addressInput.value = AppState.currentUser.endereco || '';
  }
}

// Envia o pedido para o Backend via POST /api/pedidos
async function submitOrderToBackend() {
  if (AppState.cart.length === 0) {
    showToast('Adicione pelo menos um item ao carrinho.', 'error');
    return;
  }

  const nome = document.getElementById('orderClientName').value.trim();
  const telefone = document.getElementById('orderClientPhone').value.trim();
  const rua = document.getElementById('orderClientAddress').value.trim();
  const observacoes = document.getElementById('orderNotes').value.trim();
  const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');
  const formaPagamento = paymentMethodInput ? paymentMethodInput.value : 'PIX';

  if (!nome) {
    showToast('Por favor, informe o seu nome para entrega.', 'error');
    document.getElementById('orderClientName').focus();
    return;
  }

  if (!telefone) {
    showToast('Por favor, informe seu telefone/WhatsApp.', 'error');
    document.getElementById('orderClientPhone').focus();
    return;
  }

  if (!rua) {
    showToast('Por favor, digite o endereço completo de entrega.', 'error');
    document.getElementById('orderClientAddress').focus();
    return;
  }

  const payload = {
    itens: AppState.cart.map(i => ({ id: i.id, quantidade: i.quantidade })),
    cliente: { nome, telefone },
    endereco: { rua },
    formaPagamento,
    observacoes
  };

  const btnSubmit = document.getElementById('btnSubmitOrder');
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processando...`;

  try {
    const res = await fetch(`${API_BASE}/api/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok && data.sucesso) {
      // Esvazia carrinho e atualiza estado
      AppState.cart = [];
      saveCart();
      updateCartBadges();
      closeCart();

      // Exibe recibo retornado pelo backend
      showOrderSuccessReceipt(data.dados);
    } else {
      showToast(data.mensagem || 'Falha ao processar pedido.', 'error');
    }
  } catch (err) {
    console.warn('Backend indisponível no momento. Processando confirmação local (modo mockup/offline):', err);
    // Simula resposta idêntica do backend para demonstração no modo offline
    const fakeOrder = {
      id: 'PED-' + Date.now().toString().slice(-6),
      status: 'Recebido (Modo Local)',
      cliente: { nome, telefone },
      endereco: { rua },
      formaPagamento,
      itens: AppState.cart.map(i => ({ ...i, total: i.preco * i.quantidade })),
      total: AppState.cart.reduce((acc, i) => acc + (i.preco * i.quantidade), 0) + AppState.deliveryFee
    };
    AppState.cart = [];
    saveCart();
    updateCartBadges();
    closeCart();
    showOrderSuccessReceipt(fakeOrder);
    showToast('Pedido simulado com sucesso (modo visual/offline)!', 'success');
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = `<span>Finalizar Pedido</span> <i class="fa-solid fa-check"></i>`;
  }
}

function showOrderSuccessReceipt(order) {
  const receiptEl = document.getElementById('orderReceiptCard');
  if (receiptEl) {
    receiptEl.innerHTML = `
      <p><strong>Nº do Pedido:</strong> <span class="text-highlight">${order.id}</span></p>
      <p><strong>Status:</strong> <span class="badge-academic" style="background:#22c55e;">${order.status}</span></p>
      <p><strong>Cliente:</strong> ${order.cliente.nome} (${order.cliente.telefone})</p>
      <p><strong>Endereço:</strong> ${order.endereco.rua}</p>
      <p><strong>Pagamento:</strong> ${order.formaPagamento}</p>
      <hr style="border:0; border-top:1px solid #333; margin:10px 0;">
      <p><strong>Itens:</strong></p>
      <ul style="padding-left:18px; color:#bbb; font-size:0.8rem; margin:6px 0;">
        ${order.itens.map(i => `<li>${i.quantidade}x ${i.nome} - R$ ${i.total.toFixed(2).replace('.', ',')}</li>`).join('')}
      </ul>
      <p style="font-size:0.95rem; margin-top:8px;"><strong>Total Pago:</strong> <strong class="text-highlight">R$ ${order.total.toFixed(2).replace('.', ',')}</strong></p>
    `;
  }

  const modal = document.getElementById('modalOrderSuccess');
  if (modal) modal.classList.add('open');
}

function closeOrderSuccessModal() {
  const modal = document.getElementById('modalOrderSuccess');
  if (modal) modal.classList.remove('open');
}

// ==============================================================================
// TELA 4: AUTENTICAÇÃO (LOGIN & REGISTRO) - BACKEND POST /api/auth
// ==============================================================================
function initAuthUI() {
  updateUserNavUI();
}

function openAuthModal(initialTab = 'login') {
  window.location.href = `login.html?tab=${initialTab}`;
}

function closeAuthModal() {
  const modal = document.getElementById('modalAuth');
  if (modal) modal.classList.remove('open');
}

function switchAuthTab(tab) {
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegBtn = document.getElementById('tabRegisterBtn');
  const formLogin = document.getElementById('formLogin');
  const formReg = document.getElementById('formRegister');
  const profileView = document.getElementById('userProfileView');

  if (profileView) profileView.style.display = 'none';

  if (tab === 'login') {
    tabLoginBtn?.classList.add('active');
    tabRegBtn?.classList.remove('active');
    formLogin?.classList.add('active');
    formReg?.classList.remove('active');
  } else {
    tabRegBtn?.classList.add('active');
    tabLoginBtn?.classList.remove('active');
    formReg?.classList.add('active');
    formLogin?.classList.remove('active');
  }
}

function showProfileView() {
  const formLogin = document.getElementById('formLogin');
  const formReg = document.getElementById('formRegister');
  const profileView = document.getElementById('userProfileView');
  const tabs = document.querySelector('.auth-tabs');

  if (formLogin) formLogin.classList.remove('active');
  if (formReg) formReg.classList.remove('active');
  if (tabs) tabs.style.display = 'none';

  if (profileView && AppState.currentUser) {
    profileView.style.display = 'flex';
    document.getElementById('profName').textContent = AppState.currentUser.nome;
    document.getElementById('profEmail').textContent = AppState.currentUser.email;
    document.getElementById('profPhone').textContent = AppState.currentUser.telefone || 'Não cadastrado';
    document.getElementById('profAddress').textContent = AppState.currentUser.endereco || 'Não cadastrado';
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginPassword').value.trim();

  const btn = document.getElementById('btnLoginSubmit');
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Autenticando...`;

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const data = await res.json();

    if (res.ok && data.sucesso) {
      AppState.currentUser = data.dados;
      localStorage.setItem('sushi_user', JSON.stringify(AppState.currentUser));
      updateUserNavUI();
      closeAuthModal();

      if (data.dados.role === 'admin' || (data.dados.email && data.dados.email.toLowerCase() === 'admin@gmail.com')) {
        showToast('Login de Administrador confirmado! Redirecionando...', 'success');
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 600);
        return;
      }

      showToast(`Bem-vindo de volta, ${data.dados.nome}!`, 'success');
    } else {
      showToast(data.mensagem || 'Credenciais inválidas.', 'error');
    }
  } catch (err) {
    console.warn('Backend indisponível. Realizando autenticação simulada:', err);
    if (email && senha) {
      const isAdmin = email.toLowerCase() === 'admin@gmail.com';
      AppState.currentUser = {
        id: isAdmin ? 99 : 1,
        nome: isAdmin ? 'Administrador Sushi House' : email.split('@')[0].toUpperCase(),
        email: email,
        role: isAdmin ? 'admin' : 'cliente',
        telefone: '(14) 99876-5432',
        endereco: 'Garça - SP'
      };
      localStorage.setItem('sushi_user', JSON.stringify(AppState.currentUser));
      updateUserNavUI();
      closeAuthModal();
      if (isAdmin) {
        showToast('Login de Administrador confirmado! Abrindo painel...', 'success');
        setTimeout(() => { window.location.href = 'admin.html'; }, 600);
        return;
      }
      showToast(`Bem-vindo, ${AppState.currentUser.nome}!`, 'success');
    }
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span>Entrar no Sushi House</span> <i class="fa-solid fa-arrow-right-to-bracket"></i>`;
  }
}

function toggleAdminPinModal() {
  const box = document.getElementById('modalAdminPinBox');
  if (!box) return;
  box.style.display = box.style.display === 'none' ? 'block' : 'none';
  if (box.style.display === 'block') {
    const input = document.getElementById('modalAdminPinInput');
    if (input) input.focus();
  }
}

async function entrarComoAdminModal() {
  const pinInput = document.getElementById('modalAdminPinInput');
  const pin = (pinInput ? pinInput.value.trim() : '') || '123456';
  const btn = document.getElementById('btnModalAdminPinSubmit');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Entrando...`;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha: pin })
    });
    const data = await res.json();
    if (res.ok && data.sucesso) {
      AppState.currentUser = data.dados;
      localStorage.setItem('sushi_user', JSON.stringify(data.dados));
      closeAuthModal();
      showToast('Acesso de Administrador confirmado! Redirecionando...', 'success');
      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 500);
    } else {
      showToast(data.mensagem || 'Senha padrão de administrador incorreta.', 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>Entrar Admin</span> <i class="fa-solid fa-arrow-right"></i>`;
      }
    }
  } catch (err) {
    if (pin === '123456') {
      const adminUser = {
        id: 99,
        nome: 'Administrador Sushi House',
        email: 'admin@gmail.com',
        role: 'admin'
      };
      AppState.currentUser = adminUser;
      localStorage.setItem('sushi_user', JSON.stringify(adminUser));
      closeAuthModal();
      showToast('Acesso de Administrador confirmado! Redirecionando...', 'success');
      setTimeout(() => { window.location.href = 'admin.html'; }, 500);
    } else {
      showToast('Falha na conexão com o servidor.', 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>Entrar Admin</span> <i class="fa-solid fa-arrow-right"></i>`;
      }
    }
  }
}

async function handleRegisterSubmit(e) {
  e.preventDefault();
  const nome = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const telefone = document.getElementById('regPhone').value.trim();
  const senha = document.getElementById('regPassword').value.trim();

  const btn = document.getElementById('btnRegisterSubmit');
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Cadastrando...`;

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, telefone, senha })
    });
    const data = await res.json();

    if (res.ok && data.sucesso) {
      AppState.currentUser = data.dados;
      localStorage.setItem('sushi_user', JSON.stringify(AppState.currentUser));
      updateUserNavUI();
      closeAuthModal();
      showToast(`Conta criada com sucesso! Bem-vindo, ${data.dados.nome}!`, 'success');
    } else {
      showToast(data.mensagem || 'Erro ao realizar cadastro.', 'error');
    }
  } catch (err) {
    console.error('Erro de registro:', err);
    showToast('Falha na comunicação com o servidor.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span>Finalizar Cadastro</span> <i class="fa-solid fa-user-plus"></i>`;
  }
}

function handleLogout() {
  AppState.currentUser = null;
  localStorage.removeItem('sushi_user');
  updateUserNavUI();
  closeAuthModal();
  showToast('Você saiu da sua conta.', 'info');
}

function updateUserNavUI() {
  const zone = document.getElementById('userAuthZone');
  const mobileZone = document.getElementById('mobileAuthActions');

  if (AppState.currentUser) {
    const isAdmin = AppState.currentUser.role === 'admin' || AppState.currentUser.email === 'admin@gmail.com';
    const adminPill = isAdmin ? `
      <a href="admin.html" class="btn-auth-solid admin-pill-btn" style="background: #ffb703; color: #000; text-decoration: none; padding: 0.45rem 0.85rem; font-size: 0.8rem; font-weight: 800; border-radius: 50px;">
        <i class="fa-solid fa-crown"></i> <span>Painel Admin</span>
      </a>
    ` : '';

    const userAvatar = AppState.currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
    const userPontos = AppState.currentUser.pontos || 1850;

    const userButtonHtml = `
      ${adminPill}
      <a href="perfil.html" class="btn-auth-outline user-pill-btn" style="border-color: #22c55e; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;" title="Ver Meu Perfil & Pontos iFood">
        <img src="${userAvatar}" alt="Avatar" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1px solid #22c55e;" onerror="this.src='prato-essencia.jpg'">
        <span class="user-greeting-name">Olá, ${AppState.currentUser.nome.split(' ')[0]}</span>
        <span class="user-points-badge" style="background: rgba(255,183,3,0.18); color: #ffb703; font-size: 0.72rem; font-weight: 800; padding: 2px 7px; border-radius: 50px; display: inline-flex; align-items: center; gap: 4px;">
          <i class="fa-solid fa-coins"></i> ${userPontos}
        </span>
      </a>
      <button type="button" class="btn-auth-outline btn-logout-header" onclick="handleLogout()" title="Sair da Conta" style="padding: 0.45rem 0.7rem;">
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
      </button>
    `;
    if (zone) zone.innerHTML = userButtonHtml;
    if (mobileZone) {
      mobileZone.innerHTML = `
        <div class="mobile-user-card">
          <img src="${userAvatar}" alt="Avatar" class="mobile-user-avatar">
          <div class="mobile-user-info">
            <strong>${AppState.currentUser.nome}</strong>
            <small>${AppState.currentUser.email}</small>
            <div class="mobile-user-pts">
              <i class="fa-solid fa-coins"></i> ${userPontos} Pontos Sushi Club
            </div>
          </div>
        </div>
        ${isAdmin ? `<a href="admin.html" class="mobile-nav-link" style="color: #ffb703; font-weight: 700;"><i class="fa-solid fa-crown"></i> <span>Painel do Administrador</span></a>` : ''}
        <a href="perfil.html" class="btn-auth-solid w-100" style="text-align: center; text-decoration: none; margin-top: 4px;">
          <i class="fa-solid fa-user-check"></i> Ver Meu Perfil & Pontos
        </a>
        <button type="button" class="btn-auth-outline w-100" onclick="handleLogout(); toggleMobileNav();" style="margin-top: 4px;">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Sair da Conta
        </button>
      `;
    }
  } else {
    const defaultButtons = `
      <button type="button" class="btn-auth-outline" onclick="openAuthModal('login')">Login</button>
      <button type="button" class="btn-auth-solid" onclick="openAuthModal('register')">Cadastrar</button>
    `;
    if (zone) zone.innerHTML = defaultButtons;
    if (mobileZone) {
      mobileZone.innerHTML = `
        <button type="button" class="btn-auth-solid w-100" onclick="openAuthModal('login'); toggleMobileNav();" style="margin-bottom: 6px;">
          <i class="fa-solid fa-right-to-bracket"></i> Entrar na Conta
        </button>
        <button type="button" class="btn-auth-outline w-100" onclick="openAuthModal('register'); toggleMobileNav();">
          <i class="fa-solid fa-user-plus"></i> Criar Nova Conta
        </button>
      `;
    }
  }
}

// ==============================================================================
// TELA 5: SOBRE NÓS
// ==============================================================================
function openAboutModal() {
  const modal = document.getElementById('modalAbout');
  if (modal) modal.classList.add('open');
}

function closeAboutModal() {
  const modal = document.getElementById('modalAbout');
  if (modal) modal.classList.remove('open');
}

// ==============================================================================
// FAQ & AVALIAÇÕES (BACKEND GET /api/faq & /api/avaliacoes)
// ==============================================================================
async function loadFaqFromBackend() {
  try {
    const res = await fetch(`${API_BASE}/api/faq`);
    const data = await res.json();
    if (data.sucesso && Array.isArray(data.dados)) {
      renderFaqAccordion(data.dados);
    }
  } catch (err) {
    console.error('Erro ao carregar FAQ:', err);
  }
}

function renderFaqAccordion(faqList) {
  const container = document.getElementById('faqAccordionContainer');
  if (!container || !faqList.length) return;

  container.innerHTML = faqList.map((item, index) => `
    <div class="faq-item ${index === 0 ? 'active' : ''}">
      <button type="button" class="faq-question" onclick="toggleFaq(this)">
        <span>${item.pergunta}</span>
        <i class="fa-solid fa-chevron-down faq-icon"></i>
      </button>
      <div class="faq-answer">
        <p>${item.resposta}</p>
      </div>
    </div>
  `).join('');
}

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  if (item) {
    item.classList.toggle('active');
  }
}

let currentTestimonialIndex = 0;
let totalTestimonialCards = 6;
let testimonialAutoPlayInterval = null;

async function loadTestimonialsFromBackend() {
  try {
    const res = await fetch(`${API_BASE}/api/avaliacoes`);
    const data = await res.json();
    if (data.sucesso && Array.isArray(data.dados)) {
      renderTestimonials(data.dados);
    }
  } catch (err) {
    console.error('Erro ao carregar depoimentos:', err);
    // Fallback com 6 pessoas se a requisição falhar
    renderTestimonials([
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
    ]);
  }
}

function renderTestimonials(avaliacoes) {
  const track = document.getElementById('testimonialsContainer');
  const dotsContainer = document.getElementById('carouselDots');
  if (!track || !avaliacoes.length) return;

  totalTestimonialCards = avaliacoes.length;

  track.innerHTML = avaliacoes.map(item => `
    <div class="testimonial-card">
      <span class="testimonial-quote-icon">“</span>
      <div class="testimonial-user">
        <img src="${item.foto}" alt="${item.nome}" class="user-avatar" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=140'">
        <div class="user-meta">
          <h4 class="user-name">${item.nome}</h4>
          <span class="user-verified-badge"><i class="fa-solid fa-circle-check"></i> Cliente Verificado</span>
          <div class="stars">
            ${Array.from({ length: item.estrelas }).map(() => `<i class="fa-solid fa-star"></i>`).join('')}
          </div>
        </div>
      </div>
      <p class="testimonial-text">“${item.comentario}”</p>
    </div>
  `).join('');

  if (dotsContainer) {
    dotsContainer.innerHTML = avaliacoes.map((_, i) => `
      <button type="button" class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="goToTestimonialSlide(${i})" aria-label="Ir para depoimento ${i + 1}"></button>
    `).join('');
  }

  updateCarouselPosition();
  initTestimonialAutoPlay();
}

function slideTestimonials(direction) {
  const visibleCards = getVisibleCardsCount();
  const maxIndex = Math.max(0, totalTestimonialCards - visibleCards);

  currentTestimonialIndex += direction;
  if (currentTestimonialIndex > maxIndex) {
    currentTestimonialIndex = 0;
  } else if (currentTestimonialIndex < 0) {
    currentTestimonialIndex = maxIndex;
  }

  updateCarouselPosition();
}

function goToTestimonialSlide(index) {
  const visibleCards = getVisibleCardsCount();
  const maxIndex = Math.max(0, totalTestimonialCards - visibleCards);
  currentTestimonialIndex = Math.min(Math.max(0, index), maxIndex);
  updateCarouselPosition();
}

function getVisibleCardsCount() {
  const width = window.innerWidth;
  if (width <= 600) return 1;
  if (width <= 992) return 2;
  return 3;
}

function updateCarouselPosition() {
  const track = document.getElementById('testimonialsContainer');
  const cards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.carousel-dot');

  if (!track || !cards.length) return;

  const cardWidth = cards[0].offsetWidth;
  const gap = 20; // 20px gap no flex
  const moveAmount = currentTestimonialIndex * (cardWidth + gap);

  track.style.transform = `translateX(-${moveAmount}px)`;

  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentTestimonialIndex);
  });
}

function initTestimonialAutoPlay() {
  if (testimonialAutoPlayInterval) clearInterval(testimonialAutoPlayInterval);

  testimonialAutoPlayInterval = setInterval(() => {
    slideTestimonials(1);
  }, 4500);

  const wrapper = document.querySelector('.carousel-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => clearInterval(testimonialAutoPlayInterval));
    wrapper.addEventListener('mouseleave', () => {
      clearInterval(testimonialAutoPlayInterval);
      testimonialAutoPlayInterval = setInterval(() => slideTestimonials(1), 4500);
    });
  }
}

window.addEventListener('resize', () => {
  updateCarouselPosition();
});

// ==============================================================================
// TOAST NOTIFICATIONS
// ==============================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = '<i class="fa-solid fa-info-circle"></i>';
  if (type === 'success') icon = '<i class="fa-solid fa-circle-check" style="color: #4ade80;"></i>';
  if (type === 'error') icon = '<i class="fa-solid fa-circle-exclamation" style="color: #f87171;"></i>';

  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
