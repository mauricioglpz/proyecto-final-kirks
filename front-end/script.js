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
  
  // 1. NOTICIAS DE RESPALDO (Por si falla la API)
  const noticiasRespaldo = [
      { title: "Perrito rescatado encuentra un nuevo hogar en Monterrey", link: "#", img: "img/b1.png" },
      { title: "Nueva jornada de vacunación gratuita para mascotas", link: "#", img: "img/b2.png" },
      { title: "Estudio revela que los perros entienden mejor de lo que pensamos", link: "#", img: "img/b3.png" }
  ];

  let data;
  try {
      // Usamos un proxy más rápido (Corsproxy.io)
      const redditUrl = 'https://www.reddit.com/r/UpliftingNews/search.json?q=dog+puppy+perro&restrict_sr=on&sort=hot&limit=10';
      const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(redditUrl)}`);
      
      if (!response.ok) throw new Error("Error en respuesta de red");
      
      const json = await response.json();
      data = json.data.children; // Reddit guarda los posts aquí
  } catch (error) {
      console.error('Fallo la API de Reddit, usando respaldo:', error);
  }

  let html = '';

  // 2. SI HAY DATOS DE REDDIT, LOS USAMOS
  if (data && data.length > 0) {
      data.forEach(post => {
          const p = post.data;
          const title = p.title;
          const link = "https://reddit.com" + p.permalink;
          let img = p.thumbnail;
          
          // Limpieza de imagen
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
  } else {
      // 3. SI NO HAY DATOS, PINTAMOS LAS DE RESPALDO
      noticiasRespaldo.forEach(n => {
          html += `
              <div class="noticia-card">
                  <img src="${n.img}" alt="Noticia">
                  <h3 style="font-size: 15px; margin: 12px 0; color: #1D1E23;">${n.title}</h3>
                  <a href="${n.link}" class="btn-3" style="font-size: 13px;">Leer más</a>
              </div>
          `;
      });
  }

  track.innerHTML = html; 

  // Reiniciar Carrusel (esto es necesario para que las flechas funcionen con el nuevo HTML)
  configurarFlechasCarrusel(track);
}

function configurarFlechasCarrusel(track) {
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  if(!btnPrev || !btnNext) return;

  btnNext.onclick = () => track.scrollBy({ left: 320, behavior: 'smooth' });
  btnPrev.onclick = () => track.scrollBy({ left: -320, behavior: 'smooth' });
}

// ================================================
// INICIALIZACIÓN (Al cargar el DOM)
// ================================================
document.addEventListener("DOMContentLoaded", () => {
  window.updateBadge();

  // Gestión de Sesión (Login/Logout)
  const userName = localStorage.getItem('doggie_user');
  const userLink = document.getElementById('userLink');
  const userText = document.getElementById('userText');
  const menuUsuario = document.getElementById('menu-usuario');
  const carritoBtn = document.getElementById('carrito-btn');
  const carritoWrapper = document.getElementById('carrito-wrapper');

  if (userName && userText && menuUsuario) {
    if (userLink) {
      userLink.style.display = 'inline-block'; 
      userText.innerText = "Mis Compras";
      userLink.href = "cuenta.html"; 
    }

    if (carritoBtn) carritoBtn.style.display = 'flex';
    if (carritoWrapper) carritoWrapper.style.display = 'block';

    if (!document.querySelector('.logout-button')) {
      const logoutBtn = document.createElement('a');
      logoutBtn.innerText = "Salir";
      logoutBtn.className = "logout-button";
      
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
    if (carritoBtn) carritoBtn.style.display = 'none';
    if (carritoWrapper) carritoWrapper.style.display = 'none';
  }

  window.addEventListener('storage', window.updateBadge);
  document.addEventListener('carritoActualizado', window.updateBadge);
  
  // ¡AQUÍ ESTÁ LA SOLUCIÓN! Llamamos a la función para que se ejecute al cargar la página.
  cargarNoticiasPositivas();
});
