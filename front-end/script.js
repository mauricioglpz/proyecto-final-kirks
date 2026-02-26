const STORAGE = "doggie_cart_shop_v1";

// ================================================
// UTILIDADES GLOBALES (Disponibles inmediatamente)
// ================================================
window.moneyMXN = function(n) {
  const v = Number(n || 0);
  return "$" + v.toFixed(0) + " MXN";
};

window.getCart = function() {
  try { return JSON.parse(localStorage.getItem(STORAGE) || "[]"); }
  catch { return []; }
};

window.setCart = function(items) {
  localStorage.setItem(STORAGE, JSON.stringify(items));
  window.updateBadge();
  // Disparar evento para otros componentes (opcional pero útil)
  document.dispatchEvent(new Event('carritoActualizado'));
};

window.updateBadge = function() {
  const badge = document.getElementById("cartCount");
  if (badge) {
    badge.textContent = window.getCart().length;
  }
};

// ================================================
// INICIALIZACIÓN (Al cargar el DOM)
// ================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicializar badge
  window.updateBadge();

  // 2. Gestión de Sesión (Login/Logout)
  const userName = localStorage.getItem('doggie_user');
  const userLink = document.getElementById('userLink');
  const userText = document.getElementById('userText');
  const menuUsuario = document.getElementById('menu-usuario');
  const carritoBtn = document.getElementById('carrito-btn');
  const carritoWrapper = document.getElementById('carrito-wrapper'); // Para Productos.html que tiene wrapper

  if (userName && userText && menuUsuario) {
    if (userLink) {
      userLink.style.display = 'inline-block'; // Asegurarnos de que sea visible
      userText.innerText = "Mis Compras";
      userLink.href = "cuenta.html"; 
    }

    // Mostrar carrito si el usuario está logueado
    if (carritoBtn) carritoBtn.style.display = 'flex';

    // Mostrar carrito si el usuario está logueado
    if (carritoBtn) carritoBtn.style.display = 'flex';
    if (carritoWrapper) carritoWrapper.style.display = 'block';

    // Evitar duplicar el botón si ya existe
    if (!document.querySelector('.logout-button')) {
      const logoutBtn = document.createElement('a');
      logoutBtn.innerText = "Salir";
      logoutBtn.className = "logout-button";
      // Eliminamos estilos inline para que use header.css (botón rojo)
      
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        if (confirm("¿Quieres cerrar sesión?")) {
          localStorage.removeItem('doggie_user');
          localStorage.removeItem('token');
          localStorage.removeItem('doggie_role');
          window.location.reload();
        }
      };
      menuUsuario.appendChild(logoutBtn);
    }
  } else {
    // Si no hay usuario, asegurar que el carrito esté oculto
    if (carritoBtn) carritoBtn.style.display = 'none';
    if (carritoWrapper) carritoWrapper.style.display = 'none';
  }

  // 3. Listeners Globales
  // Escuchar cambios en localStorage (para sincronizar pestañas)
  window.addEventListener('storage', window.updateBadge);
  
  // Escuchar evento personalizado para actualizaciones sin recargar
  document.addEventListener('carritoActualizado', window.updateBadge);
});