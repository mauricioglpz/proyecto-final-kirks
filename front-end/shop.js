<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doggie Chic Studio - Carrito</title>

    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="BWap/style2.css">
    <link rel="stylesheet" href="header.css">

    <style>
        /* ===== Estilos Login/Usuario ===== */
        .logout-button {
            margin-left: 10px;
            padding: 3px 10px;
            background-color: #ff4d4d;
            color: white !important;
            border-radius: 15px;
            font-size: 11px;
            text-decoration: none;
            font-weight: bold;
            cursor: pointer;
        }
        .logout-button:hover { background-color: #cc0000; }
        #userText { font-weight: bold; color: #0A8CEF; }

        /* ===== Página del Carrito ===== */
        .carrito-page {
            padding: 40px 0 80px 0;
            min-height: 60vh;
        }

        .carrito-page h2 {
            margin-bottom: 10px;
        }

        .carrito-page > .container > p {
            margin-bottom: 30px;
        }

        /* Tabla del carrito */
        .carrito-tabla-wrapper {
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.10);
            overflow: hidden;
            margin-bottom: 30px;
        }

        .carrito-tabla {
            width: 100%;
            border-collapse: collapse;
        }

        .carrito-tabla thead {
            background: linear-gradient(90deg, #0D47A1 0%, #1565C0 45%, #1976D2 100%);
        }

        .carrito-tabla thead th {
            color: #fff !important;
            padding: 16px 20px;
            text-align: left;
            font-size: 15px;
            font-weight: 700;
        }

        .carrito-tabla tbody tr {
            border-bottom: 1px solid #f0f0f0;
            transition: background 0.2s;
        }

        .carrito-tabla tbody tr:last-child {
            border-bottom: none;
        }

        .carrito-tabla tbody tr:hover {
            background: #f5f7fa;
        }

        .carrito-tabla td {
            padding: 16px 20px;
            color: #1D1E23;
            font-size: 15px;
            vertical-align: middle;
        }

        .carrito-tabla td img {
            width: 65px;
            height: 65px;
            object-fit: cover;
            border-radius: 10px;
            border: 2px solid #e0e0e0;
        }

        .carrito-tabla .td-nombre {
            font-weight: 600;
        }

        .carrito-tabla .td-precio {
            color: #0A8CEF;
            font-weight: 700;
        }

        .carrito-tabla .td-subtotal {
            color: #076FBE;
            font-weight: 800;
        }

        /* Input de cantidad en la tabla */
        .qty-input {
            width: 60px;
            padding: 6px 8px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 15px;
            text-align: center;
        }

        /* Botón eliminar */
        .btn-eliminar {
            background-color: #ff4d4d;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 6px 14px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .btn-eliminar:hover { background-color: #cc0000; color: white; }

        /* Panel del resumen */
        .carrito-bottom {
            display: flex;
            justify-content: flex-end;
            gap: 20px;
            align-items: flex-start;
            flex-wrap: wrap;
        }

        .resumen-box {
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.10);
            padding: 28px 32px;
            min-width: 300px;
            border-top: 3px solid #0A8CEF;
        }

        .resumen-box h3 {
            font-size: 20px;
            color: #1D1E23;
            margin-bottom: 18px;
        }

        .resumen-fila {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 15px;
            color: #3A3D46;
        }

        .resumen-fila.total {
            border-top: 2px solid #e0e0e0;
            padding-top: 14px;
            margin-top: 6px;
            font-size: 18px;
            font-weight: 800;
            color: #0A8CEF;
        }

        .btn-comprar-ahora {
            display: block;
            width: 100%;
            background: linear-gradient(90deg, #0D47A1, #1976D2);
            color: #fff;
            text-align: center;
            padding: 13px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 800;
            margin-top: 18px;
            border: none;
            cursor: pointer;
            text-decoration: none;
            box-shadow: 0 5px 14px rgba(10,140,239,0.3);
            transition: all 0.2s;
        }
        .btn-comprar-ahora:hover {
            background: linear-gradient(90deg, #0A8CEF, #028DF1);
            transform: translateY(-2px);
            color: #fff;
        }

        .btn-vaciar {
            display: block;
            width: 100%;
            background: #fff;
            color: #ff4d4d;
            text-align: center;
            padding: 10px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 700;
            margin-top: 10px;
            border: 2px solid #ff4d4d;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s;
        }
        .btn-vaciar:hover {
            background: #ff4d4d;
            color: #fff;
        }

        /* Carrito vacío */
        .carrito-vacio {
            text-align: center;
            padding: 60px 20px;
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
        }
        .carrito-vacio img {
            width: 120px;
            opacity: 0.35;
            margin-bottom: 20px;
        }
        .carrito-vacio h3 {
            font-size: 24px;
            color: #1D1E23;
            margin-bottom: 10px;
        }
        .carrito-vacio p {
            color: #3A3D46;
            margin-bottom: 28px;
        }

        /* Responsive */
        @media (max-width: 911px) {
            .carrito-page {
                padding: 30px 20px 60px 20px;
            }

            .carrito-tabla thead th:nth-child(1),
            .carrito-tabla td:nth-child(1) {
                display: none; /* ocultar imagen en móvil */
            }

            .carrito-bottom {
                justify-content: center;
            }

            .resumen-box {
                width: 100%;
            }
        }
    </style>
</head>

<body>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">

    <a href="https://api.whatsapp.com/send?phone=8136254170&text=Hola, me gustaria Obtener más información"
        class="float pulse" target="_blank">
        <i class="fa fa-whatsapp my-float"></i>
    </a>

    <!-- ===== HEADER / NAVBAR ===== -->
    <header class="header">
        <img class="bg" src="img/bg.png" alt="">
        <div class="menu container">
            <!-- LOGO (IZQUIERDA) -->
            <a href="index.html" class="logo"><img src="img/Logo.png" alt="Doggie Chic Studio"></a>
            
            <input type="checkbox" id="menu">
            <label for="menu">
                <img src="img/menu.png" class="menu-icono" alt="menú">
            </label>
            
            <!-- LINKS (CENTRO) -->
            <nav class="navbar">
                <ul>
                    <li><a href="index.html">Inicio</a></li>
                    <li><a href="servicios.html">Servicios</a></li>
                    <li><a href="Productos.html">Productos</a></li>
                    <li><a href="Contacto.html">Contacto</a></li>
                </ul>
            </nav>
            
            <!-- LOGIN Y CARRITO (DERECHA) -->
            <div class="menu-actions">
                <!-- Login -->
                <div id="menu-usuario">
                    <a href="login.html" id="userLink">
                        <span id="userText">Cuenta</span>
                    </a>
                </div>
                
                <!-- Carrito (oculto por defecto) -->
                <a href="carrito.html" id="carrito-btn" style="display: none;">
                    <img src="img/car.svg" id="img-carrito" alt="carrito">
                    <span id="cartCount">0</span>
                </a>
            </div>
        </div>
    </header>

    <!-- ===== CONTENIDO DEL CARRITO ===== -->
    <section class="carrito-page">
        <div class="container">
            <h2>Tu Carrito</h2>
            <p>Revisa tus productos antes de continuar con la compra.</p>

            <!-- Se muestra si hay productos -->
            <div id="carritoConProductos" style="display:none;">
                <div class="carrito-tabla-wrapper">
                    <table class="carrito-tabla">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="carritoTbody"></tbody>
                    </table>
                </div>

                <div class="carrito-bottom">
                    <div class="resumen-box">
                        <h3>Resumen del pedido</h3>
                        <div class="resumen-fila">
                            <span>Productos (<span id="resumenCantidad">0</span>)</span>
                            <span id="resumenSubtotal">$0 MXN</span>
                        </div>
                        <div class="resumen-fila">
                            <span>Envío</span>
                            <span style="color:#28a745; font-weight:700;">Gratis</span>
                        </div>
                        <div class="resumen-fila total">
                            <span>Total</span>
                            <span id="resumenTotal">$0 MXN</span>
                        </div>
                        <button class="btn-comprar-ahora" id="btnComprarAhora">Comprar Ahora</button>
                        <button class="btn-vaciar" id="btnVaciarCarrito">Vaciar Carrito</button>
                    </div>
                </div>
            </div>

            <!-- Se muestra si está vacío -->
            <div id="carritoVacio" style="display:none;">
                <div class="carrito-vacio">
                    <img src="img/car.svg" alt="carrito vacío">
                    <h3>Tu carrito está vacío</h3>
                    <p>Agrega productos desde nuestra tienda para continuar.</p>
                    <a href="Productos.html" class="btn-1">Ver Productos</a>
                </div>
            </div>

        </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="footer">
        <div class="footer-content container">
            <div class="link">
                <h3>Servicios</h3>
                <ul>
                    <li><a href="Productos.html">Productos</a></li>
                    <li><a href="servicios.html">Estetica Canina</a></li>
                    <li><a href="servicios.html">Membresias</a></li>
                    <li><a href="servicios.html">Estancia rapida</a></li>
                    <li><a href="Productos.html">Medicamentos</a></li>
                </ul>
            </div>
            <div class="link">
                <h3>Atencion al cliente</h3>
                <ul>
                    <li><a href="https://qrfy.io/p/5DwiUyk5c3?utm_source=qrcode&utm_medium=link-list&utm_campaign=55688531">Ubicacion</a></li>
                    <li><a href="#">Adopciones</a></li>
                    <li><a href="https://qrfy.io/p/BjZ-8MTiiQ?utm_source=qrcode&utm_medium=social&utm_campaign=51020849">Contactos</a></li>
                    <li><a href="#">Términos y condiciones</a></li>
                </ul>
            </div>
            <div class="link">
                <h3>Ayuda e Informacion</h3>
                <ul>
                    <li><a href="#">Garantia Doggie Chic Studio</a></li>
                    <li><a href="#">Metodos de pago</a></li>
                    <li><a href="#">Facturación</a></li>
                    <li><a href="#">Copyright © 2026. Doggiechic.com</a></li>
                </ul>
            </div>
            <div class="link">
               <h3>Doggie Chic Studio</h3>
                <div class="descarga social-links">
                  <a href="https://www.facebook.com/p/Doggie-Chic-Studio-61572230048849/" target="_blank"><img src="img/store1.png" alt="FB"></a>
                  <a href="https://www.instagram.com/doggiechic_studio/" target="_blank"><img src="img/store2.png" alt="IG"></a>
                </div>
            </div>
        </div>
    </footer>

    <script src="script.js"></script>
    <script>
        // La función renderCarrito es específica de esta página
        function renderCarrito() {
            // Usamos las funciones globales definidas en script.js
            const cart = getCart(); 
            const conProductos = document.getElementById("carritoConProductos");
            const vacio = document.getElementById("carritoVacio");
            const tbody = document.getElementById("carritoTbody");

            if (!cart || !cart.length) {
                conProductos.style.display = "none";
                vacio.style.display = "block";
                return;
            }

            conProductos.style.display = "block";
            vacio.style.display = "none";

            // Agrupar por id para mostrar cantidades
            // Lógica específica de la vista de carrito
            const agrupado = {};
            cart.forEach((item, idx) => {
                // Aseguramos que item tenga id
                if (!item.id) return;
                
                if (!agrupado[item.id]) {
                    agrupado[item.id] = { ...item, indices: [idx] };
                } else {
                    agrupado[item.id].indices.push(idx);
                }
            });

            const grupos = Object.values(agrupado);

            tbody.innerHTML = grupos.map((item) => {
                const cantidad = item.indices.length;
                const subtotal = Number(item.price) * cantidad;
                return `
                    <tr>
                        <td><img src="${item.img}" alt="${item.title}"></td>
                        <td class="td-nombre">${item.title}</td>
                        <td class="td-precio">${moneyMXN(item.price)}</td>
                        <td>
                            <input type="number" class="qty-input" value="${cantidad}" min="1" data-id="${item.id}">
                        </td>
                        <td class="td-subtotal">${moneyMXN(subtotal)}</td>
                        <td><button class="btn-eliminar" data-delete="${item.id}">Eliminar</button></td>
                    </tr>
                `;
            }).join("");

            // Calcular totales
            const totalProductos = grupos.reduce((sum, item) => sum + item.indices.length, 0);
            const totalPrecio = grupos.reduce((sum, item) => sum + Number(item.price) * item.indices.length, 0);

            const elCant = document.getElementById("resumenCantidad");
            const elSub = document.getElementById("resumenSubtotal");
            const elTotal = document.getElementById("resumenTotal");

            if(elCant) elCant.textContent = totalProductos;
            if(elSub) elSub.textContent = moneyMXN(totalPrecio);
            if(elTotal) elTotal.textContent = moneyMXN(totalPrecio);

            // Eventos de cantidad (input change)
            document.querySelectorAll(".qty-input").forEach(input => {
                input.addEventListener("change", (e) => {
                    const id = e.target.dataset.id;
                    let nuevaCantidad = parseInt(e.target.value);
                    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) nuevaCantidad = 1;

                    let currentCart = getCart();
                    // Buscar el item base
                    const itemBase = currentCart.find(i => i.id === id);
                    if (!itemBase) return;

                    // Filtramos fuera todos los items con este ID
                    currentCart = currentCart.filter(i => i.id !== id);

                    // Re-agregamos la cantidad deseada
                    for (let x = 0; x < nuevaCantidad; x++) {
                        currentCart.push({ ...itemBase });
                    }
                    setCart(currentCart); // Esto actualizará badge y storage
                    renderCarrito();      // Re-renderizar tabla
                });
            });

            // Eventos de eliminar
            document.querySelectorAll(".btn-eliminar").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const id = e.target.dataset.delete;
                    const currentCart = getCart().filter(i => i.id !== id);
                    setCart(currentCart);
                    renderCarrito();
                });
            });
        }

        // Vaciar carrito
        const btnVaciar = document.getElementById("btnVaciarCarrito");
        if(btnVaciar) {
            btnVaciar.addEventListener("click", () => {
                if (confirm("¿Seguro que quieres vaciar el carrito?")) {
                    setCart([]);
                    renderCarrito();
                }
            });
        }

        // Comprar ahora
        const btnComprar = document.getElementById("btnComprarAhora");
        if(btnComprar) {
            btnComprar.addEventListener("click", async () => {
                const cart = getCart();
                if (!cart.length) return;

                // 1. Obtener el token del usuario
                const token = localStorage.getItem('token');
                
                // 2. Validar que haya iniciado sesión
                if (!token) {
                    alert("Debes iniciar sesión para procesar tu compra.");
                    window.location.href = "login.html"; 
                    return;
                }

                // Agrupar items para enviar al backend
                const agrupado = {};
                cart.forEach(item => {
                    if (!agrupado[item.id]) agrupado[item.id] = { ...item, cantidad: 1 };
                    else agrupado[item.id].cantidad++;
                });
                const items = Object.values(agrupado);

                try {
                    // 3. Apuntar a la nueva ruta y enviar el token
                    const respuesta = await fetch('/api/pagos/crear-sesion-stripe', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'x-auth-token': token // <-- Token para el authMiddleware
                        },
                        // Ya no enviamos "usuario" porque el backend lo saca seguro del token
                        body: JSON.stringify({ items }) 
                    });

                    if (respuesta.ok) {
                        const data = await respuesta.json();
                        localStorage.setItem('compra_pendiente', JSON.stringify(items));
                        // Vaciar el carrito localmente ANTES de ir a Stripe (Opcional, pero recomendado)
                        // setCart([]); 
                        window.location.href = data.url; 
                    } else {
                        const errorData = await respuesta.json();
                        alert("Error al iniciar el pago: " + (errorData.error || errorData.msg || "Desconocido"));
                    }
                } catch (error) {
                    console.error(error);
                    alert("Error de conexión al procesar el pago.");
                }
            });
        }
        
        // Inicialización al cargar
        document.addEventListener("DOMContentLoaded", () => {
            // El login/logout y el badge ya se manejan en script.js
            // Solo necesitamos renderizar la tabla del carrito
            renderCarrito();
        });
    </script>

</body>
</html>
