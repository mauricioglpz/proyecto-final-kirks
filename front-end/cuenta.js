document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    
    // Redirigir si no ha iniciado sesión
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
            contenedor.innerHTML = ''; // Limpiar el "Cargando..."
            
            if (data.productos.length === 0 && data.servicios.length === 0) {
                contenedor.innerHTML = '<p>Aún no has realizado ninguna compra.</p>';
                return;
            }

            // Renderizar Productos
            data.productos.forEach(prod => {
                const fecha = new Date(prod.fecha).toLocaleDateString('es-MX');
                const card = document.createElement('div');
                card.className = 'compra-card';
                card.innerHTML = `
                    <h3>${prod.nombreProducto}</h3>
                    <p><strong>Cantidad:</strong> ${prod.cantidad}</p>
                    <p><strong>Total pagado:</strong> $${prod.total} MXN</p>
                    <p><strong>Fecha de compra:</strong> ${fecha}</p>
                    <p class="estado-envio">🚚 El producto se encuentra en envío</p>
                `;
                contenedor.appendChild(card);
            });

            // Si quieres renderizar los servicios contratados, puedes hacerlo aquí con un bucle similar
            
        } else {
            contenedor.innerHTML = '<p>Error al cargar el historial.</p>';
        }
    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<p>Ocurrió un error de conexión.</p>';
    }
});