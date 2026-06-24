
const cart = JSON.parse(localStorage.getItem("agg_cart")) || [];

function saveCart(){
  localStorage.setItem("agg_cart", JSON.stringify(cart));
}

function addToCart(name, price){
  const existing = cart.find(item => item.name === name);

  if(existing){
    existing.qty += 1;
  } else {
    cart.push({
      name,
      price,
      qty:1
    });
  }

  saveCart();
  renderCart();
}

function removeFromCart(index){
  cart.splice(index,1);
  saveCart();
  renderCart();
}

function updateQuantity(index, change){
  cart[index].qty += change;

  if(cart[index].qty <= 0){
    removeFromCart(index);
    return;
  }

  saveCart();
  renderCart();
}

function toggleCart(){
  document.getElementById("cartDrawer").classList.toggle("active");
  document.getElementById("cartOverlay").classList.toggle("active");
}

function renderCart(){
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  const cartSummary = document.getElementById("cartSummaryList");

  if(!cartItems) return;

  cartItems.innerHTML = "";
  cartSummary.innerHTML = "";

  let total = 0;
  let totalQty = 0;

  cart.forEach((item,index)=>{
    total += item.price * item.qty;
    totalQty += item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <h4>${item.name}</h4>
        <p>Rp ${item.price.toLocaleString()}</p>

        <div class="cart-controls">
          <button onclick="updateQuantity(${index}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateQuantity(${index}, 1)">+</button>
          <button onclick="removeFromCart(${index})">🗑</button>
        </div>
      </div>
    `;

    cartSummary.innerHTML += `
      <div class="summary-row">
        <span>${item.name} x${item.qty}</span>
        <span>Rp ${(item.price * item.qty).toLocaleString()}</span>
      </div>
    `;
  });

  cartCount.textContent = totalQty;
  cartTotal.textContent = "Rp " + total.toLocaleString();
}

function scrollToCheckout(){
  toggleCart();
  document.getElementById("order").scrollIntoView({
    behavior:"smooth"
  });
}

renderCart();

/* UPDATED WHATSAPP MESSAGE */
document.getElementById("orderForm")?.addEventListener("submit", function(e){
  e.preventDefault();

  const name = document.getElementById("buyerName").value;
  const address = document.getElementById("buyerAddress").value;
  const notes = document.getElementById("orderNotes").value;

  let total = 0;

  let message = `*Ancient Gaming Gear - Pemesanan Baru*\n\n`;
  message += `Nama: ${name}\n`;
  message += `Alamat: ${address}\n\n`;
  message += `*Detail Pesanan:*\n`;

  cart.forEach(item=>{
    const subtotal = item.price * item.qty;
    total += subtotal;

    message += `- ${item.name} x${item.qty} = Rp ${subtotal.toLocaleString()}\n`;
  });

  message += `\n*TOTAL:* Rp ${total.toLocaleString()}\n\n`;

  if(notes){
    message += `Catatan: ${notes}\n`;
  }

  const url = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});
