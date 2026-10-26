/* =============================================================
  START HERE: EDIT YOUR PRODUCTS
  - name: product name shown on your site
  - price: numeric PHP price (no comma or peso sign)
  - image: replace the SVG with your own image in assets/
  - category: Home, Lifestyle, Stationery, or Apparel
  - color: background behind the product image
  - badge: optional label, such as "POPULAR" (or "")
============================================================= */
const PRODUCTS = [
  { id: 1, name: "Ceramic Brew Mug",      price: 690,  category: "Home",       image: "assets/mug.svg",     color: "#e5ece5", badge: "BESTSELLER" },
  { id: 2, name: "Everyday Canvas Tote",  price: 490,  category: "Lifestyle",  image: "assets/tote.svg",    color: "#f1e6da", badge: "" },
  { id: 3, name: "Warm Glow Table Lamp",  price: 1850, category: "Home",       image: "assets/lamp.svg",    color: "#e9e9d8", badge: "NEW" },
  { id: 4, name: "Daily Notes Journal",  price: 320,  category: "Stationery", image: "assets/journal.svg", color: "#e3e9e6", badge: "" },
  { id: 5, name: "Steel Water Bottle",   price: 780,  category: "Lifestyle",  image: "assets/bottle.svg",  color: "#e3e8ed", badge: "" },
  { id: 6, name: "Essential Hoodie",     price: 1390, category: "Apparel",    image: "assets/hoodie.svg",  color: "#f0e5df", badge: "FAVORITE" },
  { id: 7, name: "Mini Desk Planter",    price: 450,  category: "Home",       image: "assets/plant.svg",   color: "#e5eee0", badge: "" },
  { id: 8, name: "Calm Soy Wax Candle",  price: 590,  category: "Home",       image: "assets/candle.svg",  color: "#f1e6e1", badge: "" }
];

const pesos = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });
const $ = (selector) => document.querySelector(selector);
const productGrid = $("#productGrid");
const searchInput = $("#productSearch");
const filterButtons = [...document.querySelectorAll("[data-category]")];
let activeCategory = "All";

// Your cart is saved only in this browser. No order is sent anywhere.
function loadCart() {
  try {
    const value = JSON.parse(localStorage.getItem("loomLeafDemoCart") || "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([id, qty]) => PRODUCTS.some(p => p.id === Number(id)) && Number.isInteger(qty) && qty > 0 && qty <= 99));
  } catch { return {}; }
}
let cart = loadCart();
function saveCart() { try { localStorage.setItem("loomLeafDemoCart", JSON.stringify(cart)); } catch { /* storage might be disabled */ } }

function renderProducts() {
  const keyword = searchInput.value.trim().toLowerCase();
  const visible = PRODUCTS.filter((p) =>
    (activeCategory === "All" || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(keyword) || p.category.toLowerCase().includes(keyword))
  );
  $("#resultCount").textContent = `Showing ${visible.length} item${visible.length === 1 ? "" : "s"}`;
  productGrid.replaceChildren();
  if (!visible.length) {
    const empty = document.createElement("p");
    empty.className = "empty-results";
    empty.textContent = "No products found. Try another search or category.";
    productGrid.appendChild(empty);
    return;
  }
  for (const p of visible) {
    const card = document.createElement("article");
    card.className = "product-card";
    const art = document.createElement("div");
    art.className = "product-image";
    art.style.setProperty("--product-bg", p.color);
    if (p.badge) {
      const badge = document.createElement("span");
      badge.className = "product-badge";
      badge.textContent = p.badge;
      art.appendChild(badge);
    }
    const image = document.createElement("img");
    image.src = p.image;
    image.alt = p.name;
    image.loading = "lazy";
    art.appendChild(image);
    const details = document.createElement("div");
    details.className = "product-details";
    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = p.category;
    const title = document.createElement("h3");
    title.className = "product-name";
    title.textContent = p.name;
    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = pesos.format(p.price);
    const add = document.createElement("button");
    add.type = "button";
    add.className = "add-button";
    add.textContent = "Add to cart  +";
    add.setAttribute("aria-label", `Add ${p.name} to cart`);
    add.addEventListener("click", () => addToCart(p.id));
    details.append(category, title, price, add);
    card.append(art, details);
    productGrid.appendChild(card);
  }
}

function cartLines() { return Object.entries(cart).map(([id, qty]) => ({ product: PRODUCTS.find(p => p.id === Number(id)), qty })).filter(line => line.product); }
function itemCount() { return cartLines().reduce((total, line) => total + line.qty, 0); }
function cartTotal() { return cartLines().reduce((total, line) => total + line.product.price * line.qty, 0); }
function addToCart(id) {
  cart[id] = Math.min((cart[id] || 0) + 1, 99);
  saveCart(); renderCart(); showToast("Added to cart");
}
function updateQuantity(id, difference) {
  const next = (cart[id] || 0) + difference;
  if (next <= 0) delete cart[id]; else cart[id] = Math.min(next, 99);
  saveCart(); renderCart();
}
function removeItem(id) { delete cart[id]; saveCart(); renderCart(); showToast("Item removed"); }
function renderCart() {
  const count = itemCount();
  $("#cartCount").textContent = count;
  $("#openCart").setAttribute("aria-label", `Open shopping cart, ${count} items`);
  $("#drawerCount").textContent = `(${count})`;
  $("#subtotal").textContent = pesos.format(cartTotal());
  $("#checkoutButton").disabled = count === 0;
  const container = $("#cartItems");
  container.replaceChildren();
  if (!count) {
    const empty = document.createElement("div");
    empty.className = "cart-empty";
    empty.innerHTML = '<div class="empty-icon" aria-hidden="true">◌</div><strong>Your cart is empty.</strong><span>Good things are waiting in the shop.</span>';
    container.appendChild(empty);
    return;
  }
  for (const {product: p, qty} of cartLines()) {
    const line = document.createElement("div");
    line.className = "cart-line";
    const img = document.createElement("img");
    img.src = p.image; img.alt = p.name;
    const info = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = p.name;
    const price = document.createElement("div");
    price.className = "price"; price.textContent = pesos.format(p.price * qty);
    const actions = document.createElement("div");
    actions.className = "cart-line-actions";
    const quantity = document.createElement("div");
    quantity.className = "quantity-controls";
    const decrease = document.createElement("button");
    decrease.type = "button"; decrease.textContent = "−";
    decrease.setAttribute("aria-label", `Decrease ${p.name} quantity`);
    decrease.addEventListener("click", () => updateQuantity(p.id, -1));
    const amount = document.createElement("span"); amount.textContent = qty;
    const increase = document.createElement("button"); increase.type = "button"; increase.textContent = "+";
    increase.setAttribute("aria-label", `Increase ${p.name} quantity`);
    increase.disabled = qty >= 99;
    increase.addEventListener("click", () => updateQuantity(p.id, 1));
    quantity.append(decrease, amount, increase);
    const remove = document.createElement("button");
    remove.type = "button"; remove.className = "remove-item"; remove.textContent = "Remove";
    remove.addEventListener("click", () => removeItem(p.id));
    actions.append(quantity, remove);
    info.append(name, price, actions);
    line.append(img, info);
    container.appendChild(line);
  }
}

let previousFocus = null;
function lockPage() { document.body.style.overflow = "hidden"; }
function unlockPage() { document.body.style.overflow = ""; }
function openCart() {
  previousFocus = document.activeElement;
  $("#cartScrim").hidden = false;
  $("#cartDrawer").inert = false;
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  $("#cartDrawer").classList.add("open"); lockPage(); $("#closeCart").focus();
}
function closeCart({restoreFocus = true} = {}) {
  $("#cartDrawer").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  $("#cartDrawer").inert = true;
  $("#cartScrim").hidden = true;
  if (!$("#orderModal").classList.contains("open")) unlockPage();
  if (restoreFocus) previousFocus?.focus();
}
function openOrder() {
  if (!itemCount()) return;
  const lines = cartLines().map(({product: p, qty}) => `- ${p.name} x ${qty}: ${pesos.format(p.price * qty)}`);
  $("#orderSummary").value = ["ODDY — SAMPLE ORDER (NOT PLACED)", "", ...lines, "", `SUBTOTAL: ${pesos.format(cartTotal())}`, "", "Demo only. No payment or order has been processed."].join("\n");
  closeCart({restoreFocus:false});
  $("#orderScrim").hidden = false;
  $("#orderModal").inert = false;
  $("#orderModal").setAttribute("aria-hidden", "false");
  $("#orderModal").classList.add("open"); lockPage(); $("#closeOrder").focus();
}
function closeOrder({restoreFocus = true} = {}) {
  $("#orderModal").classList.remove("open");
  $("#orderModal").setAttribute("aria-hidden", "true");
  $("#orderModal").inert = true;
  $("#orderScrim").hidden = true; unlockPage();
  if (restoreFocus) $("#openCart").focus();
}
let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

// Events
filterButtons.forEach(button => button.addEventListener("click", () => {
  activeCategory = button.dataset.category;
  filterButtons.forEach(b => { const selected = b === button; b.classList.toggle("active", selected); b.setAttribute("aria-pressed", String(selected)); });
  renderProducts();
}));
searchInput.addEventListener("input", renderProducts);
$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#cartScrim").addEventListener("click", closeCart);
$("#continueShopping").addEventListener("click", closeCart);
$("#checkoutButton").addEventListener("click", openOrder);
$("#closeOrder").addEventListener("click", closeOrder);
$("#orderScrim").addEventListener("click", closeOrder);
$("#backToCart").addEventListener("click", () => { closeOrder({restoreFocus:false}); openCart(); });
$("#copyOrder").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText($("#orderSummary").value); showToast("Demo summary copied!"); }
  catch { $("#orderSummary").focus(); $("#orderSummary").select(); showToast("Select and copy the highlighted text."); }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { if ($("#orderModal").classList.contains("open")) closeOrder(); else if ($("#cartDrawer").classList.contains("open")) closeCart(); }
  // Keep keyboard focus inside whichever modal is open.
  if (e.key === "Tab") {
    const dialog = $("#orderModal").classList.contains("open") ? $("#orderModal") : $("#cartDrawer").classList.contains("open") ? $("#cartDrawer") : null;
    if (!dialog) return;
    const choices = [...dialog.querySelectorAll("button:not(:disabled), textarea, a[href]")].filter(el => el.getClientRects().length);
    if (!choices.length) return;
    const first = choices[0], last = choices[choices.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
$("#menuToggle").addEventListener("click", () => {
  const open = $("#siteNavigation").classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(open));
});
document.querySelectorAll("#siteNavigation a").forEach(a => a.addEventListener("click", () => {
  $("#siteNavigation").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded", "false");
}));
$("#copyrightYear").textContent = new Date().getFullYear();
renderProducts();
renderCart();
