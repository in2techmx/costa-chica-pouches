// Estado del producto seleccionado
let selectedProduct = {
  sku: "MOLE-300G",
  size: "300 g",
  price: 145,
  qty: 1
};

const cart = [];

// Elementos DOM
const sizeButtons = document.querySelectorAll(".size-btn");
const selectedTitle = document.getElementById("selectedTitle");
const selectedYield = document.getElementById("selectedYield");
const selectedDesc = document.getElementById("selectedDesc");
const qtyValue = document.getElementById("qtyValue");
const btnTotal = document.getElementById("btnTotal");
const qtyMinus = document.getElementById("qtyMinus");
const qtyPlus = document.getElementById("qtyPlus");
const addToCartBtn = document.getElementById("addToCartBtn");

const cartTrigger = document.getElementById("cartTrigger");
const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const closeCart = document.getElementById("closeCart");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const checkoutBtn = document.getElementById("checkoutBtn");

function updateProductUI() {
  qtyValue.textContent = selectedProduct.qty;
  btnTotal.textContent = `$${selectedProduct.price * selectedProduct.qty} MXN`;
}

sizeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    sizeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    selectedProduct.sku = btn.dataset.sku;
    selectedProduct.size = btn.dataset.size;
    selectedProduct.price = Number(btn.dataset.price);

    selectedTitle.textContent = `Pouch ${selectedProduct.size}`;
    selectedYield.textContent = btn.dataset.yield;
    selectedDesc.textContent = btn.dataset.desc;
    updateProductUI();
  });
});

qtyMinus.addEventListener("click", () => {
  if (selectedProduct.qty > 1) {
    selectedProduct.qty -= 1;
    updateProductUI();
  }
});

qtyPlus.addEventListener("click", () => {
  selectedProduct.qty += 1;
  updateProductUI();
});

function openCart() {
  cartDrawer.classList.add("open");
  cartBackdrop.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  cartBackdrop.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function renderCart() {
  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  cartCountEl.textContent = totalCount;
  cartSubtotalEl.textContent = `$${subtotal} MXN`;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty-cart">Tu carrito está vacío.</p>`;
    return;
  }

  cartItemsEl.innerHTML = cart
    .map(
      (item, idx) => `
      <div class="cart-item">
        <div>
          <strong>Mole Costeño (${item.size})</strong>
          <div style="font-size:0.82rem;color:#b5a69b;">${item.qty} × $${item.price} MXN</div>
        </div>
        <div style="text-align:right;">
          <div><strong>$${item.qty * item.price} MXN</strong></div>
          <button type="button" data-remove="${idx}">Eliminar</button>
        </div>
      </div>
    `
    )
    .join("");

  cartItemsEl.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      cart.splice(Number(btn.dataset.remove), 1);
      renderCart();
    });
  });
}

addToCartBtn.addEventListener("click", () => {
  const existing = cart.find((i) => i.sku === selectedProduct.sku);
  if (existing) {
    existing.qty += selectedProduct.qty;
  } else {
    cart.push({ ...selectedProduct });
  }
  renderCart();
  openCart();
});

cartTrigger.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartDrawer);
cartBackdrop.addEventListener("click", closeCartDrawer);

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  alert("Pedido registrado en modo demostración. Conecta aquí tu pasarela de pago (Stripe / MercadoPago / Shopify).");
});

// Efecto 3D Tilt y Spotlight Magnético (Vanguard Web Craft)
document.querySelectorAll(".tile").forEach((tile) => {
  tile.addEventListener("mousemove", (e) => {
    const rect = tile.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    tile.style.setProperty("--mouse-x", `${x}px`);
    tile.style.setProperty("--mouse-y", `${y}px`);

    const deltaX = (x - rect.width / 2) / (rect.width / 2);
    const deltaY = (y - rect.height / 2) / (rect.height / 2);
    const rotX = (-(deltaY * 5)).toFixed(2);
    const rotY = (deltaX * 5).toFixed(2);

    tile.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
  });

  tile.addEventListener("mouseleave", () => {
    tile.style.transform = "";
  });
});
