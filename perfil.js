// ==============================================================================
// SUSHI HOUSE - JAVASCRIPT DO PERFIL DE USUÁRIO ESTILO IFOOD (perfil.js)
// Clube de Fidelidade, Pontos de Desconto, Histórico com Fotos e Recompra
// ==============================================================================

let userProfileData = null;

// Catálogo de Cupons Resgatáveis por Pontos (Clube iFood)
const CLUB_REWARDS = [
  {
    id: 'cupom-10',
    titulo: 'R$ 10 OFF em Todo o Cardápio',
    descricao: 'Válido para pedidos a partir de R$ 50. Aplicável em sushis, temakis e combinados.',
    pontosNecessarios: 200,
    valorDesconto: 10.00,
    tipo: 'dinheiro',
    badgeClass: '',
    badgeText: 'R$ 10 OFF'
  },
  {
    id: 'cupom-20',
    titulo: 'R$ 20 OFF em Pedidos Especiais',
    descricao: 'Válido para pedidos acima de R$ 80. Economize em combos familiares e barcas.',
    pontosNecessarios: 380,
    valorDesconto: 20.00,
    tipo: 'dinheiro',
    badgeClass: '',
    badgeText: 'R$ 20 OFF'
  },
  {
    id: 'cupom-frete',
    titulo: 'Frete Grátis Sushi Express',
    descricao: 'Zere a taxa de entrega em qualquer pedido para Garça e região metropolitana.',
    pontosNecessarios: 250,
    valorDesconto: 7.00,
    tipo: 'frete',
    badgeClass: 'frete',
    badgeText: 'FRETE GRÁTIS'
  },
  {
    id: 'cupom-combo-50',
    titulo: 'Combo 20 Peças com 50% OFF',
    descricao: 'Resgate metade do valor do Super Combo da Semana com bebida inclusa.',
    pontosNecessarios: 550,
    valorDesconto: 27.45,
    tipo: 'combo',
    badgeClass: 'combo',
    badgeText: '50% OFF COMBO'
  },
  {
    id: 'cupom-harumaki',
    titulo: 'Porção de Harumaki Cortesia',
    descricao: 'Ganhe 4 rolinhos primavera quentinhos e crocantes adicionados ao seu pedido.',
    pontosNecessarios: 180,
    valorDesconto: 15.00,
    tipo: 'cortesia',
    badgeClass: 'combo',
    badgeText: 'CORTESIA'
  }
];

// Avatares Pré-definidos
const PRESET_AVATARS = [
  { nome: 'Chef Sushiman', url: 'chef-preparando.png' },
  { nome: 'Mestre da Tradição', url: 'chef-historia.png' },
  { nome: 'Cliente VIP Ouro', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  { nome: 'Gourmet Moderno', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
  { nome: 'Sushi Lover', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' },
  { nome: 'Minimalist Art', url: 'capalogin.png' },
  { nome: 'Samurai Spirit', url: 'homemsobre.png' },
  { nome: 'Especial da Casa', url: 'prato-essencia.jpg' },
  { nome: 'Super Combinado', url: 'comboshushihome.png' }
];

document.addEventListener('DOMContentLoaded', () => {
  initUserProfile();
});

// Inicializa perfil
function initUserProfile() {
  loadUserData();
  renderProfileHeader();
  renderClubSection();
  renderActiveCoupons();
  loadOrdersHistory();
  renderAddresses();
  renderWallet();
}

// Carrega dados do usuário (com defaults e persistência)
function loadUserData() {
  const storedUser = JSON.parse(localStorage.getItem('sushi_user') || 'null');

  if (storedUser) {
    userProfileData = storedUser;
  } else {
    // Perfil de demonstração autêntico
    userProfileData = {
      id: 101,
      nome: 'MARJORIE FERNANDES PEDROSO TALBERG',
      email: 'marjorietalberg1@gmail.com',
      telefone: '+5514999048475',
      endereco: 'Rua Barão do Rio Branco, 450 - Centro, Garça - SP',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      pontos: 1850,
      nivel: 'Ouro',
      saldoCarteira: 15.50,
      cupons: [
        {
          codigo: 'BEMVINDO10',
          titulo: 'R$ 10 OFF Primeira Compra',
          desconto: 10.00,
          validade: '31/12/2026'
        }
      ],
      enderecos: [
        {
          id: 1,
          tipo: 'Casa',
          icone: 'fa-house',
          rua: 'Rua Barão do Rio Branco, 450',
          bairro: 'Centro',
          cidade: 'Garça',
          uf: 'SP',
          cep: '17400-000',
          padrao: true
        },
        {
          id: 2,
          tipo: 'Trabalho',
          icone: 'fa-briefcase',
          rua: 'Av. Faustina, 210',
          bairro: 'Labienópolis',
          cidade: 'Garça',
          uf: 'SP',
          cep: '17400-000',
          padrao: false
        }
      ]
    };
    localStorage.setItem('sushi_user', JSON.stringify(userProfileData));
    AppState.currentUser = userProfileData;
  }

  // Garante que campos essenciais existam
  if (!userProfileData.pontos) userProfileData.pontos = 1850;
  if (!userProfileData.nivel) userProfileData.nivel = 'Ouro';
  if (!userProfileData.cupons) userProfileData.cupons = [];
  if (!userProfileData.saldoCarteira) userProfileData.saldoCarteira = 15.50;
  if (!userProfileData.avatar) userProfileData.avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
  if (!userProfileData.enderecos || userProfileData.enderecos.length === 0) {
    userProfileData.enderecos = [
      {
        id: 1,
        tipo: 'Casa',
        icone: 'fa-house',
        rua: userProfileData.endereco || 'Rua Barão do Rio Branco, 450 - Centro',
        bairro: 'Centro',
        cidade: 'Garça',
        uf: 'SP',
        cep: '17400-000',
        padrao: true
      }
    ];
  }
}

// Salva dados no localStorage
function saveUserData() {
  localStorage.setItem('sushi_user', JSON.stringify(userProfileData));
  AppState.currentUser = userProfileData;
  if (typeof updateUserNavUI === 'function') updateUserNavUI();
}

// Renderiza cabeçalho do perfil
function renderProfileHeader() {
  const avatarImg = document.getElementById('profileAvatarImg');
  const nameEl = document.getElementById('profileUserName');
  const emailEl = document.getElementById('profileUserEmail');
  const phoneEl = document.getElementById('profileUserPhone');
  const levelBadge = document.getElementById('profileLevelBadge');

  if (avatarImg) avatarImg.src = userProfileData.avatar;
  if (nameEl) nameEl.textContent = userProfileData.nome;
  if (emailEl) emailEl.textContent = userProfileData.email;
  if (phoneEl) phoneEl.textContent = userProfileData.telefone || '+5514999048475';
  if (levelBadge) levelBadge.innerHTML = `<i class="fa-solid fa-crown"></i> Nível ${userProfileData.nivel} • Clube Sushi`;

  // Estatísticas Rápidas
  const statPoints = document.getElementById('statPointsVal');
  const statWallet = document.getElementById('statWalletVal');
  const statCoupons = document.getElementById('statCouponsVal');

  if (statPoints) statPoints.textContent = `${userProfileData.pontos.toLocaleString('pt-BR')} Pts`;
  if (statWallet) statWallet.textContent = `R$ ${userProfileData.saldoCarteira.toFixed(2).replace('.', ',')}`;
  if (statCoupons) statCoupons.textContent = `${userProfileData.cupons.length} Disponíveis`;

  if (typeof updateUserNavUI === 'function') updateUserNavUI();
}

// Alterna abas do perfil
function switchProfileTab(tabName, btnElement) {
  document.querySelectorAll('.profile-tab-button').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.profile-tab-pane').forEach(pane => pane.classList.remove('active'));

  if (btnElement) btnElement.classList.add('active');
  const targetPane = document.getElementById(`tabPane-${tabName}`);
  if (targetPane) targetPane.classList.add('active');
}

// ==============================================================================
// CLUBE DE BENEFÍCIOS & PONTOS IFOOD
// ==============================================================================
function renderClubSection() {
  const clubPointsVal = document.getElementById('clubPointsCounterVal');
  const progressFill = document.getElementById('clubProgressFill');
  const levelTargetMsg = document.getElementById('clubLevelTargetMsg');

  if (clubPointsVal) clubPointsVal.textContent = userProfileData.pontos.toLocaleString('pt-BR');

  // Metas de Nível: Bronze (0 - 500) | Prata (501 - 1500) | Ouro (1501 - 3000) | Diamante (3000+)
  const metaDiamante = 3000;
  const currentPts = userProfileData.pontos;
  const progressPercent = Math.min(100, (currentPts / metaDiamante) * 100);

  if (progressFill) progressFill.style.width = `${progressPercent.toFixed(1)}%`;
  if (levelTargetMsg) {
    if (currentPts >= metaDiamante) {
      levelTargetMsg.textContent = '🎉 Você atingiu o Nível Máximo Diamante!';
    } else {
      const faltam = metaDiamante - currentPts;
      levelTargetMsg.textContent = `Faltam ${faltam.toLocaleString('pt-BR')} pontos para você desbloquear o Nível Diamante!`;
    }
  }

  // Renderiza catálogo de cupons
  const catalogGrid = document.getElementById('couponsCatalogGrid');
  if (!catalogGrid) return;

  catalogGrid.innerHTML = CLUB_REWARDS.map(reward => {
    const podeResgatar = userProfileData.pontos >= reward.pontosNecessarios;
    return `
      <div class="coupon-reward-card">
        <div class="coupon-cutout-left"></div>
        <div class="coupon-cutout-right"></div>
        
        <div>
          <span class="coupon-badge-value ${reward.badgeClass}">${reward.badgeText}</span>
          <h4 class="coupon-title">${reward.titulo}</h4>
          <p class="coupon-desc">${reward.descricao}</p>
        </div>

        <div class="coupon-action-row">
          <div class="coupon-cost-tag">
            <i class="fa-solid fa-coins"></i>
            <span>${reward.pontosNecessarios} Pontos</span>
          </div>
          <button type="button" 
                  class="btn-redeem-coupon" 
                  onclick="redeemClubCoupon('${reward.id}')"
                  ${podeResgatar ? '' : 'disabled title="Pontos insuficientes"'}>
            ${podeResgatar ? 'Resgatar' : 'Pontos Insuficientes'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Resgata cupom de desconto usando pontos
function redeemClubCoupon(rewardId) {
  const reward = CLUB_REWARDS.find(r => r.id === rewardId);
  if (!reward) return;

  if (userProfileData.pontos < reward.pontosNecessarios) {
    showToast(`Você precisa de ${reward.pontosNecessarios} pontos para este cupom.`, 'error');
    return;
  }

  // Deduz pontos
  userProfileData.pontos -= reward.pontosNecessarios;

  // Cria cupom ativo
  const randomCode = 'CLUB-' + Math.random().toString(36).substring(2, 7).toUpperCase();
  const novoCupom = {
    codigo: randomCode,
    titulo: reward.titulo,
    desconto: reward.valorDesconto,
    tipo: reward.tipo,
    validade: '30 dias'
  };

  userProfileData.cupons.push(novoCupom);
  saveUserData();

  renderProfileHeader();
  renderClubSection();
  renderActiveCoupons();

  showToast(`🎉 Cupom ${randomCode} resgatado com sucesso!`, 'success');
}

// Renderiza cupons ativos do usuário
function renderActiveCoupons() {
  const container = document.getElementById('activeCouponsGrid');
  if (!container) return;

  if (!userProfileData.cupons || userProfileData.cupons.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #777;">
        <i class="fa-solid fa-ticket" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
        <p>Você não possui nenhum cupom ativo no momento.</p>
        <small>Use seus pontos no catálogo acima para resgatar descontos incríveis!</small>
      </div>
    `;
    return;
  }

  container.innerHTML = userProfileData.cupons.map((coupon, idx) => `
    <div class="my-active-coupon-card">
      <div class="active-coupon-info">
        <h5>${coupon.titulo}</h5>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="active-coupon-code-pill">${coupon.codigo}</span>
          <small style="color: #888;">Validade: ${coupon.validade || '30 dias'}</small>
        </div>
      </div>
      <div>
        <button type="button" class="btn-use-coupon-cart" onclick="applyCouponToCart('${coupon.codigo}', ${coupon.desconto})">
          <i class="fa-solid fa-cart-arrow-down"></i> Usar na Sacola
        </button>
      </div>
    </div>
  `).join('');
}

// Aplica cupom resgatado no carrinho
function applyCouponToCart(codigo, valorDesconto) {
  AppState.appliedCoupon = { codigo, valorDesconto };
  showToast(`Cupom ${codigo} aplicado para o seu próximo pedido!`, 'success');
  if (typeof openCart === 'function') {
    openCart();
  } else {
    window.location.href = 'cardapio.html';
  }
}

// ==============================================================================
// HISTÓRICO DE PEDIDOS COM FOTOS REAIS (ESTILO IFOOD)
// ==============================================================================
async function loadOrdersHistory() {
  const container = document.getElementById('ordersHistoryContainer');
  if (!container) return;

  let pedidos = [];

  try {
    const res = await fetch('/api/pedidos');
    const json = await res.json();
    if (json.sucesso && Array.isArray(json.dados) && json.dados.length > 0) {
      pedidos = json.dados;
    } else {
      pedidos = getFallbackOrders();
    }
  } catch (err) {
    console.warn('Backend indisponível, usando pedidos locais:', err);
    pedidos = getFallbackOrders();
  }

  const statOrders = document.getElementById('statOrdersVal');
  if (statOrders) statOrders.textContent = `${pedidos.length} Pedidos`;

  container.innerHTML = pedidos.map(order => {
    // Formata status
    const statusClass = (order.status || '').toLowerCase().includes('entreg') ? 'entregue'
      : (order.status || '').toLowerCase().includes('prepar') ? 'preparo' : 'entrega';

    // Monta miniaturas dos itens com fotos reais
    const items = order.itens || [];
    const thumbnailsHtml = items.slice(0, 4).map(item => {
      const img = getDishImageByName(item.nome || '');
      return `<img src="${img}" alt="${item.nome}" class="order-dish-photo" onerror="this.src='prato-essencia.jpg'" title="${item.nome}">`;
    }).join('');

    const descText = items.map(i => `${i.quantidade || 1}x ${i.nome}`).join(', ') || 'Peças especiais orientais';
    const totalFormatado = (typeof order.total === 'number') ? `R$ ${order.total.toFixed(2).replace('.', ',')}` : 'R$ 78,90';

    return `
      <div class="order-card-ifood">
        <div class="order-card-header">
          <div class="order-meta-left">
            <span class="order-id-badge">${order.id || '#PED-1029'}</span>
            <span class="order-date-text">• ${formatOrderDate(order.data)}</span>
          </div>
          <div>
            <span class="order-status-badge ${statusClass}">
              <i class="fa-solid fa-circle-dot" style="font-size: 0.6rem; margin-right: 4px;"></i>
              ${order.status || 'Entregue'}
            </span>
          </div>
        </div>

        <div class="order-items-preview-row">
          <div class="order-dishes-strip">
            ${thumbnailsHtml}
            <div class="order-dishes-desc">
              <strong>${descText}</strong>
              <span>${items.length} item(ns) • Pago via ${order.formaPagamento || 'PIX'}</span>
            </div>
          </div>

          <div style="text-align: right;">
            <span style="font-size: 0.8rem; color: #888;">Total do Pedido</span>
            <div style="font-size: 1.25rem; font-weight: 800; color: #fff;">${totalFormatado}</div>
          </div>
        </div>

        <div class="order-card-actions">
          <button type="button" class="btn-view-order-receipt" onclick="viewOrderReceiptDetails('${order.id}')">
            <i class="fa-regular fa-file-lines"></i> Ver Detalhes
          </button>
          <button type="button" class="btn-repeat-order" onclick="repeatOrder('${order.id}')">
            <i class="fa-solid fa-arrow-rotate-right"></i> Pedir Novamente
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Associa imagens de alta qualidade aos nomes dos pratos
function getDishImageByName(name) {
  const norm = name.toLowerCase();
  if (norm.includes('yakisoba')) return 'cardapio-yakisoba.jpg';
  if (norm.includes('temaki frito')) return 'cardapio-temaki-frito.jpg';
  if (norm.includes('temaki')) return 'cardapio-temaki-salmao.jpg';
  if (norm.includes('hot roll')) return 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600&auto=format&fit=crop&q=80';
  if (norm.includes('filad')) return 'cardapio-filadelfia.jpg';
  if (norm.includes('harumaki')) return 'cardapio-harumaki.jpg';
  if (norm.includes('shimeji')) return 'cardapio-shimeji.jpg';
  if (norm.includes('salmão') || norm.includes('sashimi')) return 'cardapio-salmao-especial.jpg';
  if (norm.includes('combo')) return 'combo-1.jpg';
  return 'prato-essencia.jpg';
}

// Pedir Novamente estilo iFood (Recarrega itens direto no carrinho e abre)
function repeatOrder(orderId) {
  showToast('Itens adicionados à sua sacola!', 'success');
  
  // Adiciona combo clássico padrão no carrinho
  if (typeof AppState !== 'undefined') {
    AppState.cart.push({
      id: 7,
      nome: "Super Combo Semana (20 Peças + Bebida)",
      categoria: "combinados",
      preco: 54.90,
      quantidade: 1,
      imagem: "combosespeciaisbanner.png"
    });
    saveCart();
    updateCartBadges();
    if (typeof openCart === 'function') openCart();
  }
}

// Ver detalhes do comprovante
function viewOrderReceiptDetails(orderId) {
  showToast(`Exibindo detalhes do pedido ${orderId}`, 'info');
}

// Formatação amigável de data
function formatOrderDate(dateString) {
  if (!dateString) return 'Hoje';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return 'Data recente';
  }
}

// Fallback de pedidos com fotos
function getFallbackOrders() {
  return [
    {
      id: "PED-604014",
      data: new Date().toISOString(),
      status: "Entregue",
      formaPagamento: "PIX",
      itens: [
        { id: 5, nome: "Yakisoba Carne", quantidade: 2, precoUnitario: 39.95 },
        { id: 2, nome: "Temaki Frito Especial", quantidade: 1, precoUnitario: 45.99 }
      ],
      total: 125.89
    },
    {
      id: "PED-492108",
      data: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: "Entregue",
      formaPagamento: "Cartão de Crédito",
      itens: [
        { id: 7, nome: "Super Combo Semana (20 Peças)", quantidade: 1, precoUnitario: 54.90 },
        { id: 3, nome: "Hot Roll Crocante", quantidade: 1, precoUnitario: 29.90 }
      ],
      total: 84.80
    }
  ];
}

// ==============================================================================
// ENDEREÇOS SALVOS (ESTILO IFOOD)
// ==============================================================================
function renderAddresses() {
  const container = document.getElementById('addressesGrid');
  if (!container) return;

  container.innerHTML = userProfileData.enderecos.map(addr => `
    <div class="address-item-card ${addr.padrao ? 'is-default' : ''}">
      <div>
        <div class="address-header-row">
          <div class="address-tag-icon">
            <i class="fa-solid ${addr.icone || 'fa-location-dot'} text-highlight"></i>
            <span>${addr.tipo}</span>
          </div>
          ${addr.padrao ? '<span class="badge-default-address">Principal</span>' : ''}
        </div>
        <div class="address-text-body" style="margin-top: 10px;">
          <strong>${addr.rua}</strong><br>
          <span>${addr.bairro} • ${addr.cidade} - ${addr.uf}</span><br>
          <small style="color: #888;">CEP: ${addr.cep}</small>
        </div>
      </div>

      <div class="address-actions-row">
        ${!addr.padrao ? `<button type="button" class="btn-set-default-addr" onclick="setDefaultAddress(${addr.id})"><i class="fa-solid fa-check"></i> Tornar Principal</button>` : '<span style="color:#22c55e; font-size:0.8rem; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Endereço Ativo</span>'}
        <button type="button" class="btn-del-address" onclick="deleteAddress(${addr.id})" title="Remover"><i class="fa-regular fa-trash-can"></i></button>
      </div>
    </div>
  `).join('');
}

function setDefaultAddress(id) {
  userProfileData.enderecos.forEach(a => a.padrao = (a.id === id));
  saveUserData();
  renderAddresses();
  showToast('Endereço principal atualizado!', 'success');
}

function deleteAddress(id) {
  if (userProfileData.enderecos.length <= 1) {
    showToast('Você deve manter pelo menos um endereço cadastrado.', 'info');
    return;
  }
  userProfileData.enderecos = userProfileData.enderecos.filter(a => a.id !== id);
  saveUserData();
  renderAddresses();
  showToast('Endereço removido.', 'info');
}

// Modal de adicionar endereço com CEP automático
function openNewAddressModal() {
  const modal = document.getElementById('modalNewAddress');
  if (modal) modal.classList.add('open');
}

function closeNewAddressModal() {
  const modal = document.getElementById('modalNewAddress');
  if (modal) modal.classList.remove('open');
}

async function handleAddressCepLookup(input) {
  const clean = input.value.replace(/\D/g, '');
  if (clean.length === 8) {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        document.getElementById('newAddrStreet').value = data.logradouro || '';
        document.getElementById('newAddrDistrict').value = data.bairro || '';
        document.getElementById('newAddrCity').value = data.localidade || '';
        document.getElementById('newAddrState').value = data.uf || '';
        document.getElementById('newAddrNumber').focus();
      }
    } catch (e) {
      console.warn('Erro ao buscar CEP:', e);
    }
  }
}

function saveNewAddressSubmit(e) {
  e.preventDefault();
  const tipo = document.getElementById('newAddrType').value;
  const cep = document.getElementById('newAddrCep').value;
  const rua = document.getElementById('newAddrStreet').value;
  const num = document.getElementById('newAddrNumber').value;
  const bairro = document.getElementById('newAddrDistrict').value;
  const cidade = document.getElementById('newAddrCity').value;
  const uf = document.getElementById('newAddrState').value;

  const novoAddr = {
    id: Date.now(),
    tipo,
    icone: tipo === 'Casa' ? 'fa-house' : tipo === 'Trabalho' ? 'fa-briefcase' : 'fa-location-dot',
    rua: `${rua}, ${num}`,
    bairro,
    cidade,
    uf,
    cep,
    padrao: false
  };

  userProfileData.enderecos.push(novoAddr);
  saveUserData();
  renderAddresses();
  closeNewAddressModal();
  showToast('Novo endereço salvo com sucesso!', 'success');
}

// ==============================================================================
// CARTEIRA DIGITAL (SUSHIPAY)
// ==============================================================================
function renderWallet() {
  const walletVal = document.getElementById('walletBalanceValue');
  if (walletVal) walletVal.textContent = `R$ ${userProfileData.saldoCarteira.toFixed(2).replace('.', ',')}`;
}

// ==============================================================================
// MODAL SELETOR DE AVATAR (TROCAR FOTO DE PERFIL)
// ==============================================================================
function openAvatarModal() {
  const modal = document.getElementById('modalAvatarPicker');
  const grid = document.getElementById('avatarPresetsGrid');
  if (!modal || !grid) return;

  grid.innerHTML = PRESET_AVATARS.map(avatar => `
    <button type="button" class="avatar-preset-btn ${userProfileData.avatar === avatar.url ? 'selected' : ''}" onclick="selectPresetAvatar('${avatar.url}', this)">
      <img src="${avatar.url}" alt="${avatar.nome}">
      <span>${avatar.nome}</span>
    </button>
  `).join('');

  modal.classList.add('open');
}

// Abre o seletor nativo de arquivos do computador/celular
function triggerFileInput() {
  const fileInput = document.getElementById('avatarFileInput');
  if (fileInput) fileInput.click();
}

// Manipula o arquivo selecionado diretamente do computador do usuário
function handleAvatarFileUpload(input) {
  const file = input.files && input.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Por favor, selecione um arquivo de imagem válido (PNG, JPG, JPEG, WEBP).', 'error');
    return;
  }

  // Limite razoável de 10MB
  if (file.size > 10 * 1024 * 1024) {
    showToast('A imagem é muito grande. Escolha uma foto com até 10MB.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64Image = e.target.result;
    userProfileData.avatar = base64Image;
    saveUserData();
    renderProfileHeader();
    closeAvatarModal();
    showToast('🎉 Foto de perfil atualizada com sucesso dos seus arquivos!', 'success');
  };
  reader.onerror = function(err) {
    console.error('Erro ao ler arquivo de imagem:', err);
    showToast('Erro ao carregar a imagem dos arquivos.', 'error');
  };
  reader.readAsDataURL(file);
}

function closeAvatarModal() {
  const modal = document.getElementById('modalAvatarPicker');
  if (modal) modal.classList.remove('open');
}

function selectPresetAvatar(url, btnElement) {
  document.querySelectorAll('.avatar-preset-btn').forEach(b => b.classList.remove('selected'));
  btnElement.classList.add('selected');
  userProfileData.avatar = url;
  saveUserData();
  renderProfileHeader();
  closeAvatarModal();
  showToast('Foto de perfil atualizada com sucesso!', 'success');
}

function applyCustomAvatarUrl() {
  const input = document.getElementById('customAvatarUrlInput');
  if (input && input.value.trim()) {
    userProfileData.avatar = input.value.trim();
    saveUserData();
    renderProfileHeader();
    closeAvatarModal();
    showToast('Nova imagem aplicada ao seu perfil!', 'success');
  }
}

// Modal Editar Perfil (Nome e Telefone)
function openEditProfileModal() {
  const modal = document.getElementById('modalEditProfile');
  if (!modal) return;
  document.getElementById('editProfileName').value = userProfileData.nome;
  document.getElementById('editProfilePhone').value = userProfileData.telefone || '';
  modal.classList.add('open');
}

function closeEditProfileModal() {
  const modal = document.getElementById('modalEditProfile');
  if (modal) modal.classList.remove('open');
}

function saveEditProfileSubmit(e) {
  e.preventDefault();
  const novoNome = document.getElementById('editProfileName').value.trim();
  const novoTel = document.getElementById('editProfilePhone').value.trim();

  if (novoNome) userProfileData.nome = novoNome;
  if (novoTel) userProfileData.telefone = novoTel;

  saveUserData();
  renderProfileHeader();
  closeEditProfileModal();
  showToast('Informações atualizadas com sucesso!', 'success');
}
