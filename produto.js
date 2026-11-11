// ==============================================================================
// SUSHI HOUSE - PÁGINA DEDICADA DO PRODUTO (produto.js)
// Estilo Mercado Livre com Galeria, Ficha Técnica e Valor Dinâmico por Contagem
// ==============================================================================

let currentProduct = null;
let currentQty = 1;
let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
  initProductPage();
});

async function initProductPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id') || '1', 10);

  try {
    const res = await fetch('/api/produtos');
    const json = await res.json();
    if (json.sucesso && Array.isArray(json.dados)) {
      allProducts = json.dados;
    } else {
      allProducts = getFallbackProducts();
    }
  } catch (err) {
    console.warn('Backend offline, utilizando dados locais:', err);
    allProducts = getFallbackProducts();
  }

  currentProduct = allProducts.find(p => p.id === productId) || allProducts[0];
  currentQty = 1;

  renderProductDetails(currentProduct);
  updateProductCartBadge();
}

// Renderiza a tela de detalhes do produto
function renderProductDetails(item) {
  if (!item) return;

  // Atualiza título da aba e breadcrumbs
  document.title = `${item.nome} | Sushi House - Sabor do Oriente`;

  const breadCat = document.getElementById('breadCategory');
  const breadTitle = document.getElementById('breadTitle');
  if (breadCat) breadCat.textContent = item.categoria ? item.categoria.toUpperCase() : 'PRATOS';
  if (breadTitle) breadTitle.textContent = item.nome;

  // Galeria de Fotos
  const galeria = (item.galeria && Array.isArray(item.galeria) && item.galeria.length > 0)
    ? item.galeria
    : [item.imagem, 'prato-essencia.jpg', 'galeria-3.jpg', 'galeria-1.jpg'];

  const mainImg = galeria[0] || item.imagem;

  const thumbsHtml = galeria.map((imgSrc, idx) => `
    <button type="button" class="p-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="selectProductThumbnail('${imgSrc}', this)">
      <img src="${imgSrc}" alt="${item.nome}" onerror="this.src='${item.imagem}'">
    </button>
  `).join('');

  // Ingredientes
  const ingredientes = (item.ingredientes && Array.isArray(item.ingredientes) && item.ingredientes.length > 0)
    ? item.ingredientes
    : [
        'Salmão nobre fresco selecionado diariamente',
        'Arroz japonês especial (Shari) com tempero autêntico',
        'Ingredientes rigorosamente selecionados com garantia de qualidade',
        'Toque exclusivo do sushiman e apresentação sofisticada'
      ];
  const ingredientesHtml = ingredientes.map(ing => `<li>${ing}</li>`).join('');

  // Avaliação e Destaques
  const avaliacao = item.avaliacao || 4.9;
  const avaliacoesQtd = item.avaliacoesQtd || 120;
  const destaqueTag = item.destaqueTag || (item.promocao ? 'PROMOÇÃO DA SEMANA' : 'ESPECIAL DA CASA');

  // Preço e Economia
  const initialCurrentPrice = (item.preco * currentQty).toFixed(2).replace('.', ',');
  const initialOldPrice = item.precoAntigo ? (item.precoAntigo * currentQty).toFixed(2).replace('.', ',') : null;
  const initialSavings = item.precoAntigo ? ((item.precoAntigo - item.preco) * currentQty).toFixed(2).replace('.', ',') : null;

  // Produtos recomendados
  const related = allProducts.filter(p => p.id !== item.id).slice(0, 4);
  const relatedHtml = related.map(rel => `
    <div class="p-related-card" onclick="window.location.href='produto.html?id=${rel.id}'">
      <div class="p-related-img-box">
        <img src="${rel.imagem}" alt="${rel.nome}" onerror="this.src='prato-essencia.jpg'">
      </div>
      <div class="p-related-body">
        <h5 class="p-related-name">${rel.nome}</h5>
        <span class="p-related-price">R$ ${rel.preco.toFixed(2).replace('.', ',')}</span>
      </div>
    </div>
  `).join('');

  const container = document.getElementById('productPageContent');
  if (!container) return;

  container.innerHTML = `
    <!-- Top Grid: Galeria + Detalhes / Especificações -->
    <div class="p-details-top-grid">
      <!-- Coluna Esquerda: Miniaturas e Foto Grande -->
      <div class="p-gallery-col">
        <div class="p-thumbnails-strip">
          ${thumbsHtml}
        </div>
        <div class="p-main-img-box">
          <img id="prodMainImg" src="${mainImg}" alt="${item.nome}" class="p-main-img" onerror="this.src='prato-essencia.jpg'">
        </div>
      </div>

      <!-- Coluna Direita: Informações e Ficha Técnica -->
      <div class="p-info-col">
        <div>
          <span class="p-tag-badge">${destaqueTag}</span>
        </div>
        <h1 class="p-title">${item.nome}</h1>
        
        <div class="p-rating-row">
          <div class="p-stars">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
          </div>
          <span class="p-rating-score">${avaliacao.toFixed(1)}</span>
          <span class="p-rating-count">(${avaliacoesQtd} avaliações de clientes)</span>
        </div>

        <p class="p-description">${item.descricao || 'Prato artesanal preparado na hora com cortes nobres e ingredientes frescos de alta gastronomia oriental.'}</p>

        <!-- Ficha Técnica / Especificações e Ingredientes -->
        <div class="p-specs-block">
          <h4 class="p-specs-title">Ingredientes e Composição:</h4>
          <ul class="p-ingredients-list">
            ${ingredientesHtml}
          </ul>
          <div class="p-meta-specs">
            <p><strong>Porção:</strong> ${item.porcao || 'Porção padrão individual'}</p>
            <p><strong>Peso estimado:</strong> ${item.peso || 'Aprox. 240g'}</p>
            <p><strong>Categoria:</strong> ${item.categoria ? item.categoria.toUpperCase() : 'ORIENTAL'}</p>
            <p><strong>Destaque:</strong> ${destaqueTag}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de Compra Reativa com Contagem e Recálculo Automático do Valor -->
    <div class="p-buy-action-bar">
      <div class="p-price-box" style="flex-direction: column; align-items: flex-start; gap: 4px;">
        <div style="display: flex; align-items: baseline; gap: 10px;">
          <span id="prodTotalPrice" class="p-price-current">R$ ${initialCurrentPrice}</span>
          ${item.precoAntigo ? `<span id="prodTotalOldPrice" class="p-price-old">R$ ${initialOldPrice}</span>` : ''}
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span id="prodUnitPriceTag" class="p-unit-tag" style="display: none;"></span>
          ${item.precoAntigo ? `<span id="prodSavingsBadge" class="p-savings-badge">Economize R$ ${initialSavings}</span>` : ''}
        </div>
      </div>

      <!-- Seletor de Quantidade Interativo -->
      <div class="p-qty-picker">
        <span class="p-qty-label">Quantidade:</span>
        <div class="p-qty-controls">
          <button type="button" class="p-qty-btn" onclick="changeProductQty(-1)" aria-label="Diminuir">-</button>
          <span class="p-qty-number" id="prodQtyDisplay">${currentQty}</span>
          <button type="button" class="p-qty-btn" onclick="changeProductQty(1)" aria-label="Aumentar">+</button>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        <button type="button" class="p-btn-add-cart" onclick="addProductToCart(false)">
          <i class="fa-solid fa-cart-shopping"></i>
          <span>Adicionar ao carrinho</span>
        </button>

        <button type="button" class="p-btn-buy-now" onclick="addProductToCart(true)">
          <i class="fa-solid fa-bolt"></i>
          <span>Comprar agora</span>
        </button>

        <button type="button" class="p-btn-favorite" id="prodFavBtn" onclick="toggleProductFavorite(this)">
          <i class="fa-regular fa-heart"></i>
          <span>Favorito</span>
        </button>
      </div>
    </div>

    <!-- Bloco de Simulação de Frete e Prazo Estilo Mercado Livre / iFood -->
    <div class="p-shipping-simulator-box" style="margin-top: 1.8rem; background: #141414; border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 1.5rem 1.8rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <i class="fa-solid fa-truck-fast" style="color: #e50914; font-size: 1.2rem;"></i>
          <div>
            <h4 style="margin: 0; font-size: 0.98rem; font-weight: 700; color: #fff;">Calcular Frete e Prazo de Entrega</h4>
            <small style="color: #888;">Simulação rápida com previsão real para Garça e região</small>
          </div>
        </div>
        <span style="background: rgba(34, 197, 94, 0.15); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.3); font-size: 0.78rem; font-weight: 700; padding: 4px 10px; border-radius: 50px;">
          <i class="fa-solid fa-gift"></i> Frete Grátis acima de R$ 100
        </span>
      </div>

      <div class="cep-input-row" style="max-width: 480px; margin-bottom: 10px;">
        <div class="cep-input-wrap">
          <i class="fa-solid fa-location-dot"></i>
          <input type="text" id="prodCepInput" placeholder="Digite seu CEP (ex: 17400-000)" maxlength="9" oninput="handleCepInput(this)" onkeydown="if(event.key==='Enter'){event.preventDefault();consultarCepCart();}">
        </div>
        <button type="button" class="btn-calc-cep" onclick="consultarCepCart()">
          <span>Calcular</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 8px;">
        <button type="button" class="btn-use-quick-cep" onclick="preencherCepRapido('17400-000')">
          <i class="fa-solid fa-bolt"></i> Usar Garça - SP (17400-000)
        </button>
        <button type="button" class="btn-use-quick-cep" onclick="preencherCepRapido('17500-000')">
          <i class="fa-solid fa-location-arrow"></i> Marília - SP (17500-000)
        </button>
      </div>

      <div id="prodCepResult" style="display: none; margin-top: 12px; background: rgba(34, 197, 94, 0.08); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 12px; padding: 12px 16px;"></div>
    </div>

    <!-- Seção de Recomendações: Você também pode gostar -->
    <div class="p-related-section">
      <div class="p-related-header">
        <div>
          <h3 class="p-related-title">Você também pode gostar</h3>
          <div class="p-related-line"></div>
        </div>
        <a href="cardapio.html" class="p-related-more-link">Ver todo o cardápio &rarr;</a>
      </div>
      <div class="p-related-grid">
        ${relatedHtml}
      </div>
    </div>
  `;
}

// Troca foto principal ao clicar nas miniaturas
function selectProductThumbnail(imgSrc, btn) {
  const mainImg = document.getElementById('prodMainImg');
  if (mainImg) {
    mainImg.src = imgSrc;
  }
  document.querySelectorAll('.p-thumb-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// Altera quantidade e RECALCULA o valor em tempo real
function changeProductQty(delta) {
  currentQty = Math.max(1, currentQty + delta);
  
  // Atualiza número na tela
  const display = document.getElementById('prodQtyDisplay');
  if (display) {
    display.textContent = currentQty;
  }

  // Recalcula valor total
  updateProductLivePrice();
}

// Recalcula preços com base na quantidade selecionada
function updateProductLivePrice() {
  if (!currentProduct) return;

  const totalCurrent = currentProduct.preco * currentQty;
  const totalPriceEl = document.getElementById('prodTotalPrice');
  if (totalPriceEl) {
    totalPriceEl.textContent = `R$ ${totalCurrent.toFixed(2).replace('.', ',')}`;
  }

  const oldPriceEl = document.getElementById('prodTotalOldPrice');
  const savingsEl = document.getElementById('prodSavingsBadge');
  if (currentProduct.precoAntigo) {
    const totalOld = currentProduct.precoAntigo * currentQty;
    if (oldPriceEl) {
      oldPriceEl.textContent = `R$ ${totalOld.toFixed(2).replace('.', ',')}`;
    }
    if (savingsEl) {
      const savings = totalOld - totalCurrent;
      savingsEl.textContent = `Economize R$ ${savings.toFixed(2).replace('.', ',')}`;
      savingsEl.style.display = 'inline-block';
    }
  }

  const unitTagEl = document.getElementById('prodUnitPriceTag');
  if (unitTagEl) {
    if (currentQty > 1) {
      unitTagEl.textContent = `(R$ ${currentProduct.preco.toFixed(2).replace('.', ',')} cada)`;
      unitTagEl.style.display = 'inline-block';
    } else {
      unitTagEl.style.display = 'none';
    }
  }
}

// Adiciona ao carrinho sincronizado com AppState e LocalStorage
function addProductToCart(openCheckout = false) {
  if (!currentProduct) return;

  const item = currentProduct;
  const qtd = currentQty || 1;

  if (typeof window.addToCart === 'function') {
    window.addToCart(item, qtd, openCheckout);
    return;
  }

  let currentCart = JSON.parse(localStorage.getItem('sushi_cart') || '[]');
  const existing = currentCart.find(i => String(i.id) === String(item.id));
  if (existing) {
    existing.quantidade = (parseInt(existing.quantidade, 10) || 1) + qtd;
  } else {
    currentCart.push({
      id: item.id,
      nome: item.nome,
      preco: typeof item.preco === 'number' ? item.preco : (parseFloat(item.preco) || 0),
      imagem: item.imagem || 'bannercapainicial.png',
      detalhes: item.detalhes || item.descricao || '',
      quantidade: qtd
    });
  }
  localStorage.setItem('sushi_cart', JSON.stringify(currentCart));
  if (window.AppState) window.AppState.cart = currentCart;
  if (typeof updateCartBadges === 'function') updateCartBadges();
  showFloatingToast(`+${qtd}x "${item.nome}" adicionado à sacola!`, 'success');
  updateProductCartBadge();

  if (openCheckout) {
    if (typeof openCart === 'function') openCart();
  }
}

// Favorito
function toggleProductFavorite(btn) {
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

// Atualiza o contador de itens no carrinho
function updateProductCartBadge() {
  const badge = document.getElementById('cartCountBadge');
  if (!badge) return;
  const currentCart = JSON.parse(localStorage.getItem('sushi_cart') || '[]');
  const total = currentCart.reduce((sum, item) => sum + (item.quantidade || item.qtd || 1), 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'inline-flex' : 'none';
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

// Fallback de produtos
function getFallbackProducts() {
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
