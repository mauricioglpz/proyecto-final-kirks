const STORAGE = "doggie_cart_shop_v1";

// ================================================
// UTILIDADES GLOBALES
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
  document.dispatchEvent(new Event('carritoActualizado'));
};

window.updateBadge = function() {
  const badge = document.getElementById("cartCount");
  if (badge) {
    badge.textContent = window.getCart().length;
  }
};

// ================================================
// NOTICIAS (REDDIT API) Y CARRUSEL
// ================================================
async function cargarNoticiasPositivas() {
    const track = document.getElementById('noticias-track');
    if (!track) return;
    
    let data;
    const cacheKey = 'noticias_reddit_cache';
    const cacheTime = 'noticias_reddit_time';
    const ahora = Date.now();

    // Intentar cargar del cache
    const cacheVal = localStorage.getItem(cacheKey);
    const cacheT = localStorage.getItem(cacheTime);

    if (cacheVal && cacheT && (ahora - parseInt(cacheT) < 600000)) {
        data = JSON.parse(cacheVal);
    } else {
        try {
            // LLAMADA A TU PROPIA API (Para evitar el CORS de Vercel)
            const response = await fetch('/api/noticias-perrunas'); 
            if (!response.ok) throw new Error("Error en el servidor");
            
            data = await response.json();
            
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(cacheTime, ahora.toString());
        } catch (error) {
            console.error('Error al cargar noticias:', error);
            return; // Si falla, salimos para no romper el resto
        }
    }

    // Validar que la data tenga el formato de Reddit
    if (!data || !data.data || !data.data.children) return;

    let html = '';
    data.data.children.forEach(post => {
        const title = post.data.title;
        const link = "https://reddit.com" + post.data.permalink;
        let img = post.data.thumbnail;
        
        if (!img || img === 'self' || img === 'default' || !img.startsWith('http')) {
            img = 'img/b1.png'; 
        }

        html += `
            <div class="noticia-card">
                <img src="${img}" alt="Noticia">
                <h3 style="font-size: 15px; margin: 12px 0; color: #1D1E23; height: 45px; overflow: hidden;">${title}</h3>
                <a href="${link}" target="_blank" class="btn-3" style="font-size: 13px;">Leer noticia</a>
            </div>
        `;
    });

    track.innerHTML = html; 

    // Configuración del Movimiento del Carrusel
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const distanciaScroll = 320; 

    if(btnNext) btnNext.onclick = () => track.scrollBy({ left: distanciaScroll, behavior: 'smooth' });
    if(btnPrev) btnPrev.onclick = () => track.scrollBy({ left: -distanciaScroll, behavior: 'smooth' });
}

// ================================================
// INICIALIZACIÓN
// ================================================
document.addEventListener("DOMContentLoaded", () => {
  window.updateBadge();

  const userName = localStorage.getItem('doggie_user');
  const userLink = document.getElementById('userLink');
  const userText = document.getElementById('userText');
  const menuUsuario = document.getElementById('menu-usuario');
  const carritoBtn = document.getElementById('carrito-btn');

  if (userName && userText) {
    userText.innerText = "Hola, " + userName;
    if (userLink) userLink.href = "cuenta.html";
    if (carritoBtn) carritoBtn.style.display = 'flex';

    if (menuUsuario && !document.querySelector('.logout-button')) {
      const logoutBtn = document.createElement('a');
      logoutBtn.innerText = "Salir";
      logoutBtn.className = "logout-button";
      logoutBtn.style.marginLeft = "10px";
      logoutBtn.onclick = (e) => {
        e.preventDefault();
        if (confirm("¿Cerrar sesión?")) {
          localStorage.clear();
          window.location.href = "index.html";
        }
      };
      menuUsuario.appendChild(logoutBtn);
    }
  }

  cargarNoticiasPositivas();
});
