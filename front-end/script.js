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

    if (localStorage.getItem(cacheKey) && (ahora - localStorage.getItem(cacheTime) < 600000)) {
        data = JSON.parse(localStorage.getItem(cacheKey));
    } else {
       // Cambia esta parte dentro de cargarNoticiasPositivas()
       try {
        // Usamos el parámetro .json de Reddit pero con un truco de headers
        const url = 'https://www.reddit.com/r/UpliftingNews/search.json?q=dog+OR+puppy+OR+perro&restrict_sr=on&sort=hot&limit=10';
        
        // En la web (Vercel), necesitamos que Reddit no bloquee la petición
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                // Esto es clave: Reddit a veces bloquea peticiones sin User-Agent
                'User-Agent': 'DoggieChic/1.0.0'
            }
        });
    
        if (!response.ok) {
            // Si Reddit nos bloquea por CORS, usamos este puente de emergencia que SIEMPRE funciona
            const fallbackRes = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
            const fallbackData = await fallbackRes.json();
            data = JSON.parse(fallbackData.contents);
        } else {
            data = await response.json();
        }
    
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTime, ahora.toString());
    } catch (error) {
        console.error('Error al cargar noticias:', error);
        return;
    }

    let html = '';
    data.data.children.forEach(post => {
        const title = post.data.title;
        const link = "https://reddit.com" + post.data.permalink;
        let img = post.data.thumbnail;
        
        if (!img || img === 'self' || img === 'default') {
            img = 'img/b1.png'; 
        }

        html += `
            <div class="noticia-card">
                <img src="${img}" alt="Noticia">
                <h3 style="font-size: 15px; margin: 12px 0; color: #1D1E23;">${title}</h3>
                <a href="${link}" target="_blank" class="btn-3" style="font-size: 13px;">Leer noticia</a>
            </div>
        `;
    });

    track.innerHTML = html; 

    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const distanciaScroll = 320; 
    let autoScrollTimer;

    const moverDerecha = () => {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: distanciaScroll, behavior: 'smooth' });
        }
    };

    const moverIzquierda = () => {
        track.scrollBy({ left: -distanciaScroll, behavior: 'smooth' });
    };

    const reiniciarAutoScroll = () => {
        clearInterval(autoScrollTimer);
        autoScrollTimer = setInterval(moverDerecha, 5000);
    };

    if(btnNext) btnNext.addEventListener('click', () => { moverDerecha(); reiniciarAutoScroll(); });
    if(btnPrev) btnPrev.addEventListener('click', () => { moverIzquierda(); reiniciarAutoScroll(); });

    autoScrollTimer = setInterval(moverDerecha, 5000);
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
};
