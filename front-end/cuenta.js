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
            headers: {
                'x-auth-token': token
            }
        });

        const data = await respuesta.json();

        if (data.success) {
            contenedor.innerHTML = ''; 
            
            if (data.productos.length === 0 && data.servicios.length === 0) {
                contenedor.innerHTML = `
                    <div class="empty-state">
                        <img src="img/car.svg" alt="Vacío" style="width: 80px; opacity: 0.3; margin-bottom: 15px;">
                        <h3>Aún no tienes compras registradas</h3>
                        <p>Explora nuestros productos y servicios para consentir a tu mascota.</p>
                        <a href="Productos.html" class="btn-1" style="margin-top: 15px;">Ver Catálogo</a>
                    </div>
                `;
                return;
            }

            data.productos.forEach(prod => {
                const fecha = new Date(prod.fecha).toLocaleDateString('es-MX', { 
                    year: 'numeric', month: 'long', day: 'numeric' 
                });
                
                const card = document.createElement('div');
                card.className = 'compra-box';
                card.innerHTML = `
                    <h3><i class="fa fa-shopping-bag" style="color: #0A8CEF;"></i> ${prod.nombreProducto}</h3>
                    <p><strong>Cantidad:</strong> <span>${prod.cantidad} un.</span></p>
                    <p><strong>Total pagado:</strong> <span class="total-destacado">$${prod.total} MXN</span></p>
                    <p><strong>Fecha:</strong> <span>${fecha}</span></p>
                    <div class="estado-envio">
                        <i class="fa fa-truck"></i> 
                        <span>Tu pedido se encuentra en camino</span>
                    </div>
                `;
                contenedor.appendChild(card);
            });

        } else {
            contenedor.innerHTML = '<div class="empty-state"><p>Error al cargar el historial.</p></div>';
        }
    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<div class="empty-state"><p>Ocurrió un error de conexión.</p></div>';
    }
});
