// ==========================================================================
// Versatile Fitness - Interactive Logic, Store & Tools
// ==========================================================================

// Product Catalog Data
const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Apex Pure Whey Isolate',
    category: 'supplements',
    price: 54.99,
    tag: 'Best Seller',
    icon: '🥛',
    desc: '27g ultra-filtered whey protein per scoop, 0g sugar, enhanced with digestive enzymes.'
  },
  {
    id: 'prod-2',
    name: 'Recharge BCAA & Electrolytes',
    category: 'supplements',
    price: 34.99,
    tag: 'Hydration',
    icon: '⚡',
    desc: 'Clinical 2:1:1 ratio with coconut water powder and pink Himalayan sea salt.'
  },
  {
    id: 'prod-3',
    name: 'Pro-Grip Resistance Bands',
    category: 'gear',
    price: 28.50,
    tag: 'Equipment',
    icon: '🏋️',
    desc: 'Heavy-duty non-slip fabric loop bands (Set of 3 with light, medium, heavy tension).'
  },
  {
    id: 'prod-4',
    name: 'Insulated Stealth Shaker 800ml',
    category: 'gear',
    price: 22.00,
    tag: 'Accessories',
    icon: '🥤',
    desc: 'Double-wall stainless steel, leak-proof magnetic flip cap, keeps drinks cold 24h.'
  },
  {
    id: 'prod-5',
    name: 'NitroFocus Pre-Workout Powder',
    category: 'supplements',
    price: 44.99,
    tag: 'High Stims',
    icon: '🔥',
    desc: 'Beta-alanine, L-Citrulline Malate, and Lion\'s Mane for intense tunnel-vision drive.'
  },
  {
    id: 'prod-6',
    name: 'Versatile Heavyweight Hoodie',
    category: 'gear',
    price: 68.00,
    tag: 'Apparel',
    icon: '👕',
    desc: 'Oversized drop-shoulder French terry cotton with embroidered silicone crest.'
  }
];

// Shopping Cart State
let cart = [];

// Initialize DOM
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  initFilterButtons();
  initBMICalculator();
  initCartDrawer();
  initHeaderScroll();
});

// Render Products to Grid
function renderProducts(category) {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const filtered = category === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === category);

  container.innerHTML = filtered.map(item => `
    <div class="product-card glow-border" data-id="${item.id}">
      <div class="product-thumb">
        <span class="product-tag">${item.tag}</span>
        ${item.icon}
      </div>
      <div class="product-details">
        <span class="product-category">${item.category}</span>
        <h3 class="product-name">${item.name}</h3>
        <p class="product-desc">${item.desc}</p>
        <div class="product-footer">
          <span class="product-price">$${item.price.toFixed(2)}</span>
          <button class="btn btn-outline btn-sm" onclick="addToCart('${item.id}')">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Filter buttons interaction
function initFilterButtons() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');
      renderProducts(cat);
    });
  });
}

// BMI & Calorie Calculator
function initBMICalculator() {
  const form = document.getElementById('bmi-calc-form');
  const resultBox = document.getElementById('calc-result');
  const bmiScore = document.getElementById('bmi-score');
  const bmiStatus = document.getElementById('bmi-status');
  const calorieCount = document.getElementById('calorie-count');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const h = parseFloat(document.getElementById('calc-height').value) / 100; // in meters
    const w = parseFloat(document.getElementById('calc-weight').value); // in kg
    const age = parseInt(document.getElementById('calc-age').value);
    const goal = document.getElementById('calc-goal').value;

    if (!h || !w) return;

    const bmi = (w / (h * h)).toFixed(1);
    bmiScore.textContent = bmi;

    let statusText = '';
    if (bmi < 18.5) {
      statusText = 'Underweight: Focus on calorie surplus and strength building.';
    } else if (bmi < 24.9) {
      statusText = 'Normal healthy range: Optimized for lean muscle & performance.';
    } else if (bmi < 29.9) {
      statusText = 'Overweight: Great opportunity for body recomposition and HIIT.';
    } else {
      statusText = 'High body mass: Recommended supervised low-impact conditioning.';
    }
    bmiStatus.textContent = statusText;

    // Approximate BMR & TDEE
    const bmr = 10 * w + 6.25 * (h * 100) - 5 * age + 5;
    let tdee = bmr * 1.55; // moderate training activity

    if (goal === 'lean') {
      tdee *= 0.85; // 15% deficit
    } else if (goal === 'hypertrophy') {
      tdee *= 1.15; // 15% surplus
    }

    calorieCount.textContent = `${Math.round(tdee).toLocaleString()} kcal/day`;
    resultBox.style.display = 'block';
  });
}

// Shopping Cart Functions
function initCartDrawer() {
  const cartBtn = document.getElementById('cart-btn');
  const closeBtn = document.getElementById('close-cart-btn');
  const overlay = document.getElementById('cart-drawer-overlay');

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);
}

function openCart() {
  document.getElementById('cart-drawer').classList.add('active');
  document.getElementById('cart-drawer-overlay').classList.add('active');
}

function closeCart() {
  document.getElementById('cart-drawer').classList.remove('active');
  document.getElementById('cart-drawer-overlay').classList.remove('active');
}

function addToCart(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...prod, qty: 1 });
  }

  updateCartUI();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

function updateCartUI() {
  const countBadge = document.getElementById('cart-count');
  const itemsContainer = document.getElementById('cart-drawer-items');
  const subtotalElem = document.getElementById('cart-subtotal');

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (countBadge) countBadge.textContent = totalQty;
  if (subtotalElem) subtotalElem.textContent = `$${totalAmount.toFixed(2)}`;

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is currently empty.</div>';
    return;
  }

  itemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div style="font-size: 1.5rem;">${item.icon}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.qty}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</button>
    </div>
  `).join('');
}

function handleCheckout() {
  if (cart.length === 0) {
    alert('Please add products to your cart before proceeding.');
    return;
  }
  closeCart();
  openModal(`
    <h3 style="margin-bottom: 1rem; color: #2eea99;">Order Confirmation Demo</h3>
    <p style="color: #9ba7b8; margin-bottom: 1.5rem;">
      Thank you for testing the Versatile Fitness checkout flow!
    </p>
    <div style="background: #1d2332; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
      <strong>Order Total: $${cart.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2)}</strong>
      <p style="font-size: 0.85rem; color: #687588; margin-top: 0.3rem;">Instant confirmation will be simulated for demo purposes.</p>
    </div>
    <button class="btn btn-primary w-full" onclick="cart = []; updateCartUI(); closeModal();">Complete Demo Order</button>
  `);
}

// Modal handling
function openModal(contentHtml) {
  const modal = document.getElementById('generic-modal');
  const body = document.getElementById('modal-body-content');
  if (!modal || !body) return;
  body.innerHTML = contentHtml;
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('generic-modal');
  if (modal) modal.style.display = 'none';
}

function openBooking(programName) {
  openModal(`
    <h3 style="margin-bottom: 0.5rem; color: #2eea99;">Book Trial Session</h3>
    <h4 style="margin-bottom: 1rem;">${programName}</h4>
    <p style="color: #9ba7b8; font-size: 0.9rem; margin-bottom: 1.25rem;">
      Experience this protocol with a master trainer at Versatile Fitness. Complimentary for first-time visitors.
    </p>
    <form onsubmit="handleBookingSubmit(event, '${programName}')" style="display: flex; flex-direction: column; gap: 0.85rem;">
      <div class="input-group">
        <label>Select Date:</label>
        <input type="date" required value="${new Date().toISOString().split('T')[0]}">
      </div>
      <div class="input-group">
        <label>Time Slot:</label>
        <select required>
          <option>07:00 AM - Morning Prime</option>
          <option>12:00 PM - Midday Sprint</option>
          <option>05:30 PM - Peak Energy</option>
          <option>07:00 PM - Evening Power</option>
        </select>
      </div>
      <div class="input-group">
        <label>Your Name:</label>
        <input type="text" placeholder="Alex Morgan" required>
      </div>
      <button type="submit" class="btn btn-primary w-full mt-2">Confirm Reservation</button>
    </form>
  `);
}

function handleBookingSubmit(e, programName) {
  e.preventDefault();
  closeModal();
  alert(`Success! Your trial reservation for "${programName}" is confirmed. Check your email for gym entrance instructions.`);
}

function openJoinModal(tierName, price) {
  openModal(`
    <h3 style="color: #2eea99; margin-bottom: 0.25rem;">Activate Membership</h3>
    <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">${tierName} (${price})</div>
    <p style="color: #9ba7b8; font-size: 0.9rem; margin-bottom: 1.5rem;">
      Includes 7-day no-risk trial, biometric scan access, and full facility privileges.
    </p>
    <form onsubmit="handleJoinSubmit(event, '${tierName}')" style="display: flex; flex-direction: column; gap: 0.85rem;">
      <div class="input-group">
        <label>Full Name:</label>
        <input type="text" placeholder="Sarah Connor" required>
      </div>
      <div class="input-group">
        <label>Email Address:</label>
        <input type="email" placeholder="sarah@fitness.com" required>
      </div>
      <button type="submit" class="btn btn-primary w-full mt-2">Activate 7-Day Free Trial</button>
    </form>
  `);
}

function handleJoinSubmit(e, tierName) {
  e.preventDefault();
  closeModal();
  alert(`Welcome to Versatile Fitness! Your 7-day trial for ${tierName} has been activated.`);
}

function handleContactSubmit(e) {
  e.preventDefault();
  alert('Thank you! Your complimentary gym evaluation pass has been generated. Our team will contact you shortly.');
  document.getElementById('contact-form').reset();
}

function handleNewsletter(e) {
  e.preventDefault();
  alert('Thank you for subscribing to The Versatile Pulse weekly newsletter!');
  document.getElementById('newsletter-email').value = '';
}

function initHeaderScroll() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.7)';
      header.style.background = 'rgba(10, 12, 16, 0.95)';
    } else {
      header.style.boxShadow = 'none';
      header.style.background = 'rgba(10, 12, 16, 0.85)';
    }
  });
}
