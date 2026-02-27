// cuenta.js
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const contenedor = document.getElementById('lista-compras');

    try {
        const respuesta = await fetch('/api/pagos/historial', {
            method: 'GET',
            headers: { 'x-auth-token': token }
        });

        const data = await respuesta.json();

        if (!data.success) {
            contenedor.innerHTML = '<div class="empty-state"><p>Error al cargar el historial.</p></div>';
            return;
        }

        const { ordenes = [], servicios = [] } = data;

        // ── Sin compras ──────────────────────────────────────────────
        if (ordenes.length === 0 && servicios.length === 0) {
            contenedor.innerHTML = `
                <div class="empty-state">
                    <img src="img/car.svg" alt="Vacío" style="width:80px;opacity:.3;margin-bottom:15px;">
                    <h3>Aún no tienes compras registradas</h3>
                    <p>Explora nuestros productos y servicios para consentir a tu mascota.</p>
                    <a href="Productos.html" class="btn-1" style="margin-top:15px;">Ver Catálogo</a>
                </div>`;
            return;
        }

        contenedor.innerHTML = '';

        // ── ÓRDENES DE PRODUCTOS ─────────────────────────────────────
        ordenes.forEach(orden => {
            const fecha = new Date(orden.fecha).toLocaleDateString('es-MX', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            // Filas de productos dentro del ticket
            const filasProductos = orden.productos.map(p => `
                <div class="ticket-row">
                    <span class="ticket-row-name">
                        <span class="ticket-qty">${p.cantidad}×</span>
                        ${p.nombreProducto}
                    </span>
                    <span class="ticket-row-price">$${p.total.toLocaleString('es-MX')} MXN</span>
                </div>
            `).join('');

            // Número de orden corto (últimos 8 chars o legacy)
            const numOrden = orden.ordenId
                ? `#${orden.ordenId}`
                : `#${new Date(orden.fecha).getTime().toString(36).toUpperCase()}`;

            const card = document.createElement('div');
            card.className = 'compra-box';
            card.innerHTML = `
                <div class="ticket-header">
                    <div class="ticket-header-left">
                        <i class="fa fa-shopping-bag" style="color:#0A8CEF;font-size:18px;"></i>
                        <div>
                            <span class="ticket-orden">Orden ${numOrden}</span>
                            <span class="ticket-fecha">${fecha}</span>
                        </div>
                    </div>
                    <span class="ticket-badge">${orden.productos.length} producto${orden.productos.length !== 1 ? 's' : ''}</span>
                </div>

                <div class="ticket-divider"></div>

                <div class="ticket-productos">
                    ${filasProductos}
                </div>

                <div class="ticket-divider"></div>

                <div class="ticket-total-row">
                    <span class="ticket-total-label">Total pagado</span>
                    <span class="ticket-total-monto">$${orden.totalOrden.toLocaleString('es-MX')} MXN</span>
                </div>

                <div class="estado-envio">
                    <i class="fa fa-truck"></i>
                    <span>Tu pedido se encuentra en camino 🐾</span>
                </div>
            `;
            contenedor.appendChild(card);
        });

        // ── SERVICIOS CONTRATADOS ────────────────────────────────────
        servicios.forEach(serv => {
            const fecha = new Date(serv.horaServicio || serv.fecha).toLocaleDateString('es-MX', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            const card = document.createElement('div');
            card.className = 'compra-box compra-servicio';
            card.innerHTML = `
                <div class="ticket-header">
                    <div class="ticket-header-left">
                        <i class="fa fa-scissors" style="color:#0A8CEF;font-size:18px;"></i>
                        <div>
                            <span class="ticket-orden">Servicio contratado</span>
                            <span class="ticket-fecha">${fecha}</span>
                        </div>
                    </div>
                </div>

                <div class="ticket-divider"></div>

                <div class="ticket-productos">
                    <div class="ticket-row">
                        <span class="ticket-row-name">${serv.tipoServicio || 'Estética canina'}</span>
                        <span class="ticket-row-price">$${(serv.precio || 0).toLocaleString('es-MX')} MXN</span>
                    </div>
                </div>

                <div class="ticket-divider"></div>

                <div class="ticket-total-row">
                    <span class="ticket-total-label">Total</span>
                    <span class="ticket-total-monto">$${(serv.precio || 0).toLocaleString('es-MX')} MXN</span>
                </div>

                <div class="estado-envio" style="background:#f0fff4;color:#1a7a3a;">
                    <i class="fa fa-check-circle" style="color:#28a745;"></i>
                    <span>Servicio registrado</span>
                </div>
            `;
            contenedor.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<div class="empty-state"><p>Ocurrió un error de conexión.</p></div>';
    }
});
