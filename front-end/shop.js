document.addEventListener("DOMContentLoaded", () => {
  // const STORAGE = "doggie_cart_shop_v1"; // Ya no se usa aquí, se usa en script.js
  const PRODUCTOS_STORAGE = "doggie_productos_v1";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const grid = $("#grid");
  const search = $("#search");
  const sort = $("#sort");
  const catChips = $("#catChips");
  const cartCount = $("#cartCount");
  const modal = $("#modal");
  const modalClose = $("#modalClose");
  const modalX = $("#modalX");
  const mImg = $("#mImg");
  const mThumbs = $("#mThumbs");
  const mTitle = $("#mTitle");
  const mDesc = $("#mDesc");
  const mPrice = $("#mPrice");
  const mCat = $("#mCat");
  const mAdd = $("#mAdd");
  const mBuy = $("#mBuy");
  const mSimilar = $("#mSimilar");

  let selectedCat = "all";
  let currentProduct = null;

  // ================================================
  // VERIFICAR SI ES ADMIN
  // ================================================
  const esAdmin = localStorage.getItem('doggie_role') === 'admin';


  // ================================================
  // MANEJO DE PRODUCTOS (base + API)
  // ================================================
  
  // Función para obtener productos desde la API
  async function getProductosAPI() {
    try {
      const res = await fetch('/api/productos');
      if (!res.ok) throw new Error('Error al obtener productos del servidor');
      const data = await res.json();
      return Array.isArray(data) ? data : (data.productos || []);
    } catch (error) {
      console.warn("Error de API:", error);
      return []; 
    }
  }

  async function getTodosLosProductos() {
    const productosAPI = await getProductosAPI();
    
    // Mapeamos los productos que vienen de MongoDB
    const productosFormateados = productosAPI.map(p => ({
      id: p._id || p.id, // Aquí toma el ID real de Mongo
      title: p.title,
      price: p.price,
      cat: p.cat,
      tags: p.tags,
      desc: p.desc,
      img: p.img
    }));
    
    return productosFormateados;
  }

  // ================================================
  // RENDERIZAR GRID DE PRODUCTOS
  // ================================================
  async function renderGrid() {
    if (!grid) return;
    
    // Indicador de carga simple
    grid.innerHTML = '<div style="width:100%; text-align:center; padding:20px;">Cargando productos...</div>';

    const productos = await getTodosLosProductos();

    grid.innerHTML = productos.map(p => `
      <article class="card"
        data-id="${p.id}"
        data-title="${p.title}"
        data-price="${p.price}"
        data-cat="${p.cat}"
        data-tags="${p.tags || ''}"
        data-desc="${p.desc || ''}"
        data-img="${p.img || 'img/pla1.png'}">
        <div class="card-img">
          <img src="${p.img || 'img/pla1.png'}" alt="${p.title}" onerror="this.src='img/pla1.png'">
          <div class="card-actions">
            <button class="btn btn-ghost btnView" type="button">Ver</button>
            <button class="btn btnAdd" type="button">Agregar</button>
          </div>
        </div>
        <div class="card-body">
          <h3>${p.title}</h3>
          <div class="card-meta">
            <span class="pill">${p.cat}</span>
            <span class="price">$${p.price} MXN</span>
          </div>
          ${esAdmin ? `
          <div class="admin-actions" style="display:flex; gap:8px; margin-top:10px;">
            <button class="btn-admin-edit" data-id="${p.id}"
              style="flex:1; background:#f0ad00; color:#fff; border:none; border-radius:8px; padding:6px; font-weight:700; cursor:pointer;">
              Editar
            </button>
            <button class="btn-admin-delete" data-id="${p.id}"
              style="flex:1; background:#ff4d4d; color:#fff; border:none; border-radius:8px; padding:6px; font-weight:700; cursor:pointer;">
              Borrar
            </button>
          </div>` : ''}
        </div>
      </article>
    `).join("");

    applyFilters();
    bindAdminButtons();
  }

 // ================================================
  // BOTÓN AGREGAR PRODUCTO (solo admin)
  // ================================================
  if (esAdmin) {
    const shopTop = $(".shop-products-top");
    
    // Todo debe ir dentro de este if
    if (shopTop) {
      
      // 1. Botón Agregar (El normal)
      const btnAgregar = document.createElement('button');
      btnAgregar.innerHTML = 'Agregar Producto';
      btnAgregar.style.cssText = `
        background: linear-gradient(90deg, #0D47A1, #1976D2);
        color: white; border: none; border-radius: 10px;
        padding: 10px 20px; font-weight: 800; font-size: 14px;
        cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        margin-top: 8px;
      `;
      btnAgregar.addEventListener('click', () => abrirModalAdmin(null));
      shopTop.appendChild(btnAgregar);
      
    } 
  }


  // ================================================
  // MODAL CRUD ADMIN
  // ================================================
  function abrirModalAdmin(producto) {
    const esEdicion = producto !== null;

    // Crear modal si no existe
    let adminModal = $("#adminModal");
    if (adminModal) adminModal.remove();

    adminModal = document.createElement('div');
    adminModal.id = "adminModal";
    adminModal.style.cssText = `
      position: fixed; inset: 0; z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
    `;

    adminModal.innerHTML = `
      <div style="background:#fff; border-radius:18px; padding:32px; width:90%; max-width:500px;
                  box-shadow:0 20px 60px rgba(0,0,0,0.3); position:relative; max-height:90vh; overflow-y:auto;">
        <button id="cerrarAdminModal" style="position:absolute;top:16px;right:16px;background:none;
          border:none;font-size:22px;cursor:pointer;color:#888;">✕</button>

        <h3 style="margin-bottom:20px; color:#0D47A1; font-size:20px;">
          ${esEdicion ? 'Editar Producto' : 'Agregar Producto'}
        </h3>

        <div style="display:flex; flex-direction:column; gap:14px;">
          <div>
            <label style="font-weight:700; font-size:13px; color:#555;">Nombre del producto *</label>
            <input id="admin-title" type="text" value="${producto?.title || ''}" placeholder="Ej. Shampoo Premium"
              style="width:100%; padding:10px; border:1px solid #ddd; border-radius:8px; margin-top:4px; font-size:14px; box-sizing:border-box;">
          </div>

          <div>
            <label style="font-weight:700; font-size:13px; color:#555;">Precio (MXN) *</label>
            <input id="admin-price" type="number" value="${producto?.price || ''}" placeholder="Ej. 299"
              style="width:100%; padding:10px; border:1px solid #ddd; border-radius:8px; margin-top:4px; font-size:14px; box-sizing:border-box;">
          </div>

          <div>
            <label style="font-weight:700; font-size:13px; color:#555;">Categoría *</label>
            <select id="admin-cat"
              style="width:100%; padding:10px; border:1px solid #ddd; border-radius:8px; margin-top:4px; font-size:14px; box-sizing:border-box;">
              <option value="cuidado" ${producto?.cat === 'cuidado' ? 'selected' : ''}>Cuidado</option>
              <option value="accesorios" ${producto?.cat === 'accesorios' ? 'selected' : ''}>Accesorios</option>
              <option value="juguetes" ${producto?.cat === 'juguetes' ? 'selected' : ''}>Juguetes</option>
              <option value="farmacia" ${producto?.cat === 'farmacia' ? 'selected' : ''}>Farmacia</option>
            </select>
          </div>

          <div>
            <label style="font-weight:700; font-size:13px; color:#555;">Descripción</label>
            <textarea id="admin-desc" placeholder="Descripción del producto..."
              style="width:100%; padding:10px; border:1px solid #ddd; border-radius:8px; margin-top:4px; font-size:14px; box-sizing:border-box; resize:vertical; min-height:80px;">${producto?.desc || ''}</textarea>
          </div>

          <div>
            <label style="font-weight:700; font-size:13px; color:#555;">Tags (separados por coma)</label>
            <input id="admin-tags" type="text" value="${producto?.tags || ''}" placeholder="Ej. cuidado,higiene,perro"
              style="width:100%; padding:10px; border:1px solid #ddd; border-radius:8px; margin-top:4px; font-size:14px; box-sizing:border-box;">
          </div>

          <div>
            <label style="font-weight:700; font-size:13px; color:#555;">URL de imagen</label>
            <input id="admin-img" type="text" value="${producto?.img || 'img/pla1.png'}" placeholder="img/producto.png"
              style="width:100%; padding:10px; border:1px solid #ddd; border-radius:8px; margin-top:4px; font-size:14px; box-sizing:border-box;">
          </div>

          <button id="btnGuardarAdmin"
            style="background:linear-gradient(90deg,#0D47A1,#1976D2); color:white; border:none;
                   border-radius:10px; padding:13px; font-size:16px; font-weight:800; cursor:pointer;
                   margin-top:6px; box-shadow:0 4px 12px rgba(0,0,0,0.2);">
            ${esEdicion ? 'Guardar Cambios' : 'Agregar Producto'}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(adminModal);

    // Cerrar
    $("#cerrarAdminModal").addEventListener('click', () => adminModal.remove());
    adminModal.addEventListener('click', (e) => { if (e.target === adminModal) adminModal.remove(); });

    // Guardar
    $("#btnGuardarAdmin").addEventListener('click', async () => {
      const title = $("#admin-title").value.trim();
      const price = $("#admin-price").value.trim();
      const cat = $("#admin-cat").value;
      const desc = $("#admin-desc").value.trim();
      const tags = $("#admin-tags").value.trim();
      const img = $("#admin-img").value.trim() || 'img/pla1.png';

      if (!title || !price) {
        alert("El nombre y el precio son obligatorios.");
        return;
      }

      const token = localStorage.getItem('token');
      const datos = { title, price: Number(price), cat, desc, tags, img };

      try {
        let respuesta;
        if (esEdicion) {
          // PUT al servidor
          respuesta = await fetch(`/api/productos/${producto.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify(datos)
          });
        } else {
          // POST al servidor
          respuesta = await fetch('/api/productos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify(datos)
          });
        }

        if (respuesta.ok) {
          const result = await respuesta.json();
          // Guardar también en localStorage como respaldo (opcional, si se desea).
          // Pero aquí solo actualizamos el grid.
          adminModal.remove();
          await renderGrid();
          alert(esEdicion ? "✅ Producto actualizado." : "✅ Producto agregado.");
        } else {
          const err = await respuesta.json();
          alert("Error: " + (err.msg || err.error || "No se pudo guardar"));
        }
      } catch (error) {
        // Sin conexión: guardar en localStorage como fallback
        console.error(error);
        const getLocal = () => { try { return JSON.parse(localStorage.getItem(PRODUCTOS_STORAGE) || "[]"); } catch { return []; } };
        const setLocal = (items) => localStorage.setItem(PRODUCTOS_STORAGE, JSON.stringify(items));

        const productosAdmin = getLocal();
        if (esEdicion) {
          const idx = productosAdmin.findIndex(p => p.id === producto.id);
          if (idx !== -1) productosAdmin[idx] = { ...productosAdmin[idx], ...datos };
        } else {
          productosAdmin.push({ id: 'local_' + Date.now(), ...datos });
        }
        setLocal(productosAdmin);
        adminModal.remove();
        await renderGrid();
        alert(esEdicion ? "⚠️ Sin conexión. Guardado localmente." : "⚠️ Sin conexión. Agregado localmente.");
      }
    });
  }

  // ================================================
  // BOTONES EDITAR / BORRAR en cada card
  // ================================================
  function bindAdminButtons() {
    if (!esAdmin) return;

    $$(".btn-admin-edit").forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const todos = await getTodosLosProductos();
        const producto = todos.find(p => p.id === id);
        if (producto) abrirModalAdmin(producto);
      });
    });

    $$(".btn-admin-delete").forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (!confirm("¿Seguro que quieres eliminar este producto?")) return;

        const token = localStorage.getItem('token');

        try {
          const respuesta = await fetch(`/api/productos/${id}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': token }
          });
          
          if (respuesta.ok) {
             await renderGrid();
             alert("🗑️ Producto eliminado.");
          } else {
             const err = await respuesta.json();
             alert("Error al eliminar en servidor: " + (err.msg || err.error));
          }

        } catch (error) {
          // Fallback offline
          console.error(error);
          const getLocal = () => { try { return JSON.parse(localStorage.getItem(PRODUCTOS_STORAGE) || "[]"); } catch { return []; } };
          const setLocal = (items) => localStorage.setItem(PRODUCTOS_STORAGE, JSON.stringify(items));
          
          const productosAdmin = getLocal().filter(p => p.id !== id);
          setLocal(productosAdmin);
          await renderGrid();
          alert("🗑️ Producto eliminado localmente (sin conexión).");
        }
      });
    });
  }

  // ================================================
  // CARRITO (Usando funciones globales de script.js)
  // ================================================
  function addToCartFromCard(card) {
    const item = {
      id: card.dataset.id,
      title: card.dataset.title,
      price: card.dataset.price,
      img: card.dataset.img
    };
    const cart = window.getCart();
    cart.push(item);
    window.setCart(cart);
    alert("Producto agregado al carrito.");
  }

  // ================================================
  // MODAL DE PRODUCTO (ver detalle)
  // ================================================
  function openModalFromCard(card) {
    currentProduct = {
      id: card.dataset.id,
      title: card.dataset.title,
      price: card.dataset.price,
      cat: card.dataset.cat,
      desc: card.dataset.desc,
      tags: tagsOf(card.dataset.tags),
      img: card.dataset.img,
      img2: card.dataset.img2 || card.dataset.img,
      img3: card.dataset.img3 || card.dataset.img
    };

    if (!modal) return;

    mTitle.textContent = currentProduct.title;
    mDesc.textContent = currentProduct.desc || "Sin descripción por el momento.";
    mPrice.textContent = moneyMXN(currentProduct.price);
    mCat.textContent = currentProduct.cat;

    const imgs = [currentProduct.img, currentProduct.img2, currentProduct.img3];
    mImg.src = imgs[0];

    mThumbs.innerHTML = imgs.map((src) => `
      <button class="thumb" type="button">
        <img src="${src}" alt="Miniatura">
      </button>
    `).join("");

    $$(".thumb", mThumbs).forEach((btn, idx) => {
      btn.addEventListener("click", () => { mImg.src = imgs[idx]; });
    });

    renderSimilarProducts();
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    currentProduct = null;
  }

  function renderSimilarProducts() {
    if (!currentProduct || !mSimilar) return;
    const cards = $$(".card");
    const sim = cards
      .filter(c => c.dataset.id !== currentProduct.id)
      .map(c => ({
        id: c.dataset.id, title: c.dataset.title,
        price: c.dataset.price, img: c.dataset.img,
        tags: tagsOf(c.dataset.tags)
      }))
      .filter(p => p.tags.some(t => currentProduct.tags.includes(t)))
      .slice(0, 4);

    mSimilar.innerHTML = sim.length ? sim.map(p => `
      <button class="sim" type="button" data-open="${p.id}">
        <img src="${p.img}" alt="${p.title}">
        <div class="sim-t">${p.title}</div>
        <div class="sim-p">${moneyMXN(p.price)}</div>
      </button>
    `).join("") : `<div class="empty">Sin productos similares.</div>`;
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalX) modalX.addEventListener("click", closeModal);

  if (mAdd) {
    mAdd.addEventListener("click", () => {
      if (!currentProduct) return;
      const cart = window.getCart();
      cart.push({ id: currentProduct.id, title: currentProduct.title, price: currentProduct.price, img: currentProduct.img });
      window.setCart(cart);
      alert("Agregado al carrito.");
    });
  }

  if (mBuy) {
    mBuy.addEventListener("click", async () => {
      if (!currentProduct) return;
      
      // 1. Obtener el token del usuario
      const token = localStorage.getItem('token');
      
      // 2. Validar que haya iniciado sesión
      if (!token) {
        alert("Debes iniciar sesión para poder comprar.");
        window.location.href = "login.html"; 
        return;
      }

      const cantidad = parseInt(document.getElementById("mQty")?.value || 1);

      const items = [{
        id: currentProduct.id,
        title: currentProduct.title,
        price: currentProduct.price,
        cantidad: cantidad
      }];

      try {
        // 3. Apuntar a la nueva ruta y enviar el token en los headers
        const respuesta = await fetch('/api/pagos/crear-sesion-stripe', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-auth-token': token // <-- Aquí enviamos el token para el authMiddleware
          },
          body: JSON.stringify({ items })
        });

        if (respuesta.ok) {
          const data = await respuesta.json();
          localStorage.setItem('compra_pendiente', JSON.stringify(items));
          window.location.href = data.url;
        } else {
          // Capturar el error del backend si el token falla o hay otro problema
          const errorData = await respuesta.json();
          alert("Error al iniciar el pago: " + (errorData.error || errorData.msg || "Desconocido"));
        }
      } catch (error) {
        alert("Error de conexión.");
      }
    });
  }

  // Click en similar
  document.addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-open]");
    if (!openBtn) return;
    const id = openBtn.getAttribute("data-open");
    const card = document.querySelector(`.card[data-id="${id}"]`);
    if (card) openModalFromCard(card);
  });

  // ================================================
  // FILTROS
  // ================================================
  function tagsOf(str) {
    return String(str || "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
  }

  function normalizeText(str) {
    return String(str || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function scoreMatch(text, query) {
    const t = normalizeText(text);
    const q = normalizeText(query).trim();
    if (!q) return 1;
    return q.split(/\s+/).filter(Boolean).reduce((s, tok) => s + (t.includes(tok) ? 1 : 0), 0);
  }

  function applyFilters() {
    const q = search ? search.value : "";
    const cards = $$(".card");

    let scored = cards.map(card => {
      const cat = (card.dataset.cat || "").toLowerCase();
      const okCat = selectedCat === "all" || cat === selectedCat;
      const text = `${card.dataset.title} ${card.dataset.tags} ${card.dataset.desc}`;
      const score = scoreMatch(text, q);
      return { card, ok: okCat && (!q.trim() || score > 0), score };
    });

    let visible = scored.filter(x => x.ok);
    const mode = sort ? sort.value : "featured";

    if (mode === "featured" && q.trim()) visible.sort((a, b) => b.score - a.score);
    if (mode === "az") visible.sort((a, b) => (a.card.dataset.title || "").localeCompare(b.card.dataset.title || ""));
    if (mode === "priceLow") visible.sort((a, b) => Number(a.card.dataset.price || 0) - Number(b.card.dataset.price || 0));
    if (mode === "priceHigh") visible.sort((a, b) => Number(b.card.dataset.price || 0) - Number(a.card.dataset.price || 0));

    cards.forEach(c => (c.style.display = "none"));
    visible.forEach(x => (x.card.style.display = ""));
    if (grid) visible.forEach(x => grid.appendChild(x.card));
  }

  if (catChips) {
    $$(".chip", catChips).forEach(chip => {
      chip.addEventListener("click", () => {
        $$(".chip", catChips).forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        selectedCat = chip.dataset.cat || "all";
        applyFilters();
      });
    });
  }

  if (search) search.addEventListener("input", applyFilters);
  if (sort) sort.addEventListener("change", applyFilters);

  // Click en cards (Ver / Agregar)
  if (grid) {
    grid.addEventListener("click", (e) => {
      if (e.target.closest(".btn-admin-edit") || e.target.closest(".btn-admin-delete")) return;
      const viewBtn = e.target.closest(".btnView");
      const addBtn = e.target.closest(".btnAdd");
      if (!viewBtn && !addBtn) return;
      const card = e.target.closest(".card");
      if (!card) return;
      if (viewBtn) openModalFromCard(card);
      if (addBtn) addToCartFromCard(card);
    });
  }

  // ================================================
  // INICIALIZAR
  // ================================================
  // updateBadge(); // Ya se hace en script.js
  renderGrid(); // renderiza productos base + admin
});
