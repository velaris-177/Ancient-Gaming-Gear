/* ==========================================================================
   ANCIENT GAMING GEAR - JAVASCRIPT INTERACTIVE LOGIC
   Handles: Product Selection, Price Calculations, and WhatsApp Redirect
   ========================================================================== */

// --- CONFIGURATION ---
// Ganti nomor ini dengan nomor WhatsApp Bisnis Anda (gunakan kode negara tanpa '+' atau '0' di depan)
// Contoh: 6281234567890 (62 adalah kode negara Indonesia)
const WHATSAPP_NUMBER = "6281770285550";

// --- DOM ELEMENTS ---
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

const orderForm = document.getElementById("orderForm");
const productSelect = document.getElementById("productSelect");
const orderQty = document.getElementById("orderQty");
const buyerName = document.getElementById("buyerName");
const buyerAddress = document.getElementById("buyerAddress");
const orderNotes = document.getElementById("orderNotes");

const summaryProductName = document.getElementById("summaryProductName");
const summaryProductPrice = document.getElementById("summaryProductPrice");
const summaryQty = document.getElementById("summaryQty");
const summaryTotal = document.getElementById("summaryTotal");

// --- MOBILE NAVIGATION ---
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });
}

// Close mobile menu when clicking nav links
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("active");
    navMenu.classList.remove("active");
    
    // Update active state
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// --- HELPER FUNCTION: FORMAT CURRENCY (IDR) ---
function formatIDR(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(amount);
}

// --- ORDER SUMMARY UPDATE LOGIC ---
function updateOrderSummary() {
  const selectedOption = productSelect.options[productSelect.selectedIndex];
  
  if (!selectedOption || selectedOption.value === "") {
    summaryProductName.textContent = "-";
    summaryProductPrice.textContent = "Rp 0";
    summaryQty.textContent = "0";
    summaryTotal.textContent = "Rp 0";
    return;
  }
  
  // Extract text and price
  const productName = selectedOption.text.split(" (Rp")[0];
  const price = parseInt(selectedOption.getAttribute("data-price"), 10) || 0;
  const qty = parseInt(orderQty.value, 10) || 1;
  const total = price * qty;
  
  // Update elements
  summaryProductName.textContent = productName;
  summaryProductPrice.textContent = formatIDR(price);
  summaryQty.textContent = qty;
  summaryTotal.textContent = formatIDR(total);
}

// Event Listeners for Summary
if (productSelect) {
  productSelect.addEventListener("change", updateOrderSummary);
}
if (orderQty) {
  orderQty.addEventListener("input", updateOrderSummary);
  orderQty.addEventListener("change", updateOrderSummary);
}

// --- FUNCTION: SELECT PRODUCT FROM CATALOG CARDS ---
window.selectProduct = function(productId) {
  if (!productSelect) return;
   
  window.open(url, "_blank");
  // Set value on select dropdown
  productSelect.value = productId;
  
  // Trigger update
  updateOrderSummary();
  
  // Smooth scroll to order section
  const orderSection = document.getElementById("order");
  if (orderSection) {
    orderSection.scrollIntoView({ behavior: "smooth" });
  }
  
  // Focus on name input for better UX
  if (buyerName) {
    setTimeout(() => {
      buyerName.focus();
    }, 800);
  }
};

// --- FORM SUBMIT & WHATSAPP REDIRECT ---
if (orderForm) {
  orderForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const selectedOption = productSelect.options[productSelect.selectedIndex];
    if (!selectedOption || selectedOption.value === "") {
      alert("Silakan pilih produk terlebih dahulu!");
      return;
    }
    
    // Get Form Data
    const name = buyerName.value.trim();
    const productName = selectedOption.text.split(" (Rp")[0];
    const price = parseInt(selectedOption.getAttribute("data-price"), 10) || 0;
    const qty = parseInt(orderQty.value, 10) || 1;
    const address = buyerAddress.value.trim();
    const notes = orderNotes.value.trim();
    const total = price * qty;
    
    // Format Message Text
    let message = `*Ancient Gaming Gear - Pemesanan Baru*\n`;
    message += `===============================\n\n`;
    message += `*Detail Pelanggan:*\n`;
    message += `• Nama Lengkap : ${name}\n`;
    message += `• Alamat Kirim  : ${address}\n\n`;
    message += `*Detail Pesanan:*\n`;
    message += `• Produk        : ${productName}\n`;
    message += `• Harga Satuan  : ${formatIDR(price)}\n`;
    message += `• Jumlah (Qty)  : ${qty} pcs\n\n`;
    
    if (notes) {
      message += `*Catatan Khusus:*\n`;
      message += `"${notes}"\n\n`;
    }
    
    message += `===============================\n`;
    message += `*TOTAL TAGIHAN: ${formatIDR(total)}*\n`;
    message += `===============================\n\n`;
    message += `Halo Admin Ancient Gaming Gear, saya ingin melakukan konfirmasi pembayaran untuk pesanan di atas. Mohon infokan instruksi pembayaran selanjutnya. Terima kasih!`;
    
    // Encode Message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Redirect User to WhatsApp
    window.open(whatsappUrl, "_blank");
  });
}
