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
  // PRODUCTOS BASE (los que ya estaban en el HTML)
const PRODUCTOS_BASE = [
  // ===== CUIDADO (25) =====
 { id:"p001", title:"Shampoo FreshCare", price:"189", cat:"cuidado", tags:"cuidado,shampoo,piel sensible", desc:"Limpieza suave para piel sensible, deja el pelaje brillante.", img:"img/pla1.png" },
  { id:"p002", title:"Tableta Anti-Pulgas NexGard", price:"199", cat:"farmacia", tags:"cuidado,medicina,farmacia", desc:"Suaviza y facilita el cepillado, ideal para pelo medio y largo.", img:"img/pla2.png" },
  { id:"p003", title:"Spray Desenredante Pro", price:"159", cat:"cuidado", tags:"cuidado,spray,desenredante,peine", desc:"Ayuda a deshacer nudos sin maltratar el pelaje.", img:"img2/Spray-desenredante.png" },
  { id:"p004", title:"Perfume Nube Cítrica", price:"149", cat:"cuidado", tags:"cuidado,perfume,aroma,fresco", desc:"Aroma fresco y ligero para después del baño.", img:"img2/Perfumecoco.png" },
  { id:"p005", title:"Espuma Baño Seco", price:"179", cat:"cuidado", tags:"cuidado,baño seco,limpieza,sin enjuague", desc:"Limpieza rápida sin enjuague, perfecta para viajes.", img:"img2/5.png" },
  { id:"p006", title:"Toallitas Hipoalergénicas", price:"99", cat:"cuidado", tags:"cuidado,toallitas,higiene,patitas", desc:"Para patitas y pelaje, sin alcohol y uso diario.", img:"img2/6.png" },
  { id:"p007", title:"Bálsamo Almohadillas", price:"129", cat:"cuidado", tags:"cuidado,bálsamo,almohadillas,hidratación", desc:"Hidrata y protege almohadillas resecas y agrietadas.", img:"img2/7.png" },
  { id:"p008", title:"Limpia Oídos Suave", price:"119", cat:"cuidado", tags:"cuidado,oídos,higiene,limpieza", desc:"Apoyo de limpieza externa sin irritación.", img:"img2/8.png" },
  { id:"p009", title:"Gel Dental Menta", price:"139", cat:"cuidado", tags:"cuidado,dental,higiene,aliento", desc:"Apoyo de higiene bucal con cepillado regular.", img:"img2/9.png" },
  { id:"p010", title:"Cepillo Doble Cara", price:"149", cat:"cuidado", tags:"cuidado,cepillo,peinado,cepillado", desc:"Cerdas mixtas para pelo corto y medio, peinado cómodo.", img:"img2/10.png" },
  { id:"p011", title:"Peine Antinudos Metal", price:"159", cat:"cuidado", tags:"cuidado,peine,antinudos,metal", desc:"Puntas redondeadas para desenredar sin lastimar.", img:"img2/11.png" },
  { id:"p012", title:"Cortaúñas Seguridad", price:"129", cat:"cuidado", tags:"cuidado,uñas,corte,seguridad", desc:"Corte preciso con mejor control para recorte seguro.", img:"img2/12.png" },
  { id:"p013", title:"Talco Desodorante", price:"109", cat:"cuidado", tags:"cuidado,desodorante,olor,frescura", desc:"Neutraliza olores y ayuda a mantener frescura.", img:"img2/13.png" },
  { id:"p014", title:"Spray Antiestático", price:"149", cat:"cuidado", tags:"cuidado,antiestático,frizz,brillo", desc:"Reduce frizz y electricidad estática en el pelaje.", img:"img2/14.png" },
  { id:"p015", title:"Guante Quitapelo", price:"99", cat:"cuidado", tags:"cuidado,guante,quitapelo,masaje", desc:"Remueve pelo suelto y masajea al mismo tiempo.", img:"img2/15.png" },
  { id:"p016", title:"Esponja de Baño Suave", price:"69", cat:"cuidado", tags:"cuidado,baño,esponja,espuma", desc:"Mejora la espuma del shampoo y cuida la piel.", img:"img2/16.png" },
  { id:"p017", title:"Crema Hidratante Nariz", price:"119", cat:"cuidado", tags:"cuidado,crema,nariz,hidratación", desc:"Apoyo para resequedad en nariz y zonas sensibles.", img:"img2/17.png" },
  { id:"p018", title:"Limpia Lágrimas", price:"129", cat:"cuidado", tags:"cuidado,ojos,limpieza,manchas", desc:"Ayuda a mantener el contorno de ojos limpio.", img:"img2/18.png" },
  { id:"p019", title:"Champú Herbal Refrescante", price:"189", cat:"cuidado", tags:"cuidado,shampoo,herbal,frescura", desc:"Fórmula herbal para un baño con aroma natural.", img:"img2/19.png" },
  { id:"p020", title:"Mousse Grooming Volumen", price:"169", cat:"cuidado", tags:"cuidado,mousse,grooming,volumen", desc:"Da forma y volumen ligero para acabado de estética.", img:"img2/20.png" },
  { id:"p021", title:"Aceite de Coco Groom", price:"149", cat:"cuidado", tags:"cuidado,aceite,coco,brillo", desc:"Brillo ligero y suavidad (aplicar poca cantidad).", img:"img2/21.png" },
  { id:"p022", title:"Suero Reparador Puntas", price:"179", cat:"cuidado", tags:"cuidado,suero,reparador,pelaje", desc:"Ayuda a reducir quiebre y puntas abiertas.", img:"img2/22.png" },
  { id:"p023", title:"Loción Calmante Post-Baño", price:"159", cat:"cuidado", tags:"cuidado,loción,calmante,post baño", desc:"Apoyo para piel sensible tras grooming.", img:"img2/23.png" },
  { id:"p024", title:"Protector Patitas Cera", price:"139", cat:"cuidado", tags:"cuidado,patitas,protección,cera", desc:"Capa ligera que protege patitas en paseos.", img:"img2/24.png" },
  { id:"p025", title:"Kit Cepillado Diario", price:"249", cat:"cuidado", tags:"cuidado,kit,cepillo,peine", desc:"Kit básico para mantener el pelaje en orden diario.", img:"img2/25.png" },

  // ===== ACCESORIOS (25) =====
  { id:"p026", title:"Collar Nylon Reflectante", price:"149", cat:"accesorios", tags:"accesorios,collar,reflectante,paseo", desc:"Mayor visibilidad en paseos nocturnos.", img:"img2/26.png" },
  { id:"p027", title:"Correa Antijalones", price:"199", cat:"accesorios", tags:"accesorios,correa,antijalones,control", desc:"Control extra con agarre cómodo.", img:"img2/27.png" },
  { id:"p028", title:"Arnés Pecho Acolchado", price:"249", cat:"accesorios", tags:"accesorios,arnés,acolchado,paseo", desc:"Distribuye presión para paseos largos.", img:"img2/28.png" },
  { id:"p029", title:"Placa ID Premium", price:"89", cat:"accesorios", tags:"accesorios,placa,id,seguridad", desc:"Placa ligera para datos de contacto.", img:"img2/29.png" },
  { id:"p030", title:"Bandana Estilo Doggie", price:"79", cat:"accesorios", tags:"accesorios,bandana,ropa,estilo", desc:"Accesorio suave para look diario.", img:"img2/30.png" },
  { id:"p031", title:"Suéter Térmico Ligero", price:"199", cat:"accesorios", tags:"accesorios,ropa,suéter,invierno", desc:"Para clima fresco sin perder movilidad.", img:"img2/31.png" },
  { id:"p032", title:"Impermeable Plegable", price:"229", cat:"accesorios", tags:"accesorios,ropa,impermeable,lluvia", desc:"Protege de la lluvia y se guarda fácil.", img:"img2/32.png" },
  { id:"p033", title:"Cinturón Manos Libres", price:"279", cat:"accesorios", tags:"accesorios,runner,correa,manos libres", desc:"Ideal para correr con correa amortiguada.", img:"img2/33.png" },
  { id:"p034", title:"Comedero Acero Inox", price:"139", cat:"accesorios", tags:"accesorios,comedero,acero,higiene", desc:"Resistente y fácil de limpiar.", img:"img2/34.png" },
  { id:"p035", title:"Bebedero Antiderrame", price:"159", cat:"accesorios", tags:"accesorios,bebedero,antiderrame,casa", desc:"Menos salpicaduras, más orden.", img:"img2/35.png" },
  { id:"p036", title:"Dispensador Bolsitas", price:"59", cat:"accesorios", tags:"accesorios,paseo,bolsitas,dispensador", desc:"Compacto para paseos, con gancho.", img:"img2/36.png" },
  { id:"p037", title:"Porta Premios Entreno", price:"119", cat:"accesorios", tags:"accesorios,entrenamiento,premios,bolsa", desc:"Bolsa práctica para snacks de entrenamiento.", img:"img2/37.png" },
  { id:"p038", title:"Cama Donut Suave", price:"399", cat:"accesorios", tags:"accesorios,cama,descanso,confort", desc:"Acolchado circular para máximo confort.", img:"img2/38.png" },
  { id:"p039", title:"Tapete Enfriante", price:"299", cat:"accesorios", tags:"accesorios,enfriante,verano,descanso", desc:"Apoyo para regular temperatura en días calurosos.", img:"img2/39.png" },
  { id:"p040", title:"Transportadora Compacta", price:"599", cat:"accesorios", tags:"accesorios,viaje,transportadora,seguridad", desc:"Para trayectos cortos con ventilación lateral.", img:"img2/40.png" },
  { id:"p041", title:"Collar Martingale", price:"169", cat:"accesorios", tags:"accesorios,collar,martingale,ajuste", desc:"Mejor ajuste para perritos que se zafan.", img:"img2/41.png" },
  { id:"p042", title:"Arnés Antiescape", price:"289", cat:"accesorios", tags:"accesorios,arnés,antiescape,seguro", desc:"Doble ajuste para mayor seguridad en paseos.", img:"img2/42.png" },
  { id:"p043", title:"Correa Extensible 5m", price:"229", cat:"accesorios", tags:"accesorios,correa,extensible,parque", desc:"Libertad controlada para parques.", img:"img2/43.png" },
  { id:"p044", title:"Botitas Antideslizantes", price:"199", cat:"accesorios", tags:"accesorios,botas,patitas,antideslizante", desc:"Protegen patitas y mejoran tracción.", img:"img2/44.png" },
  { id:"p045", title:"Mochila Porta Mascota", price:"449", cat:"accesorios", tags:"accesorios,mochila,viaje,pequeños", desc:"Para perritos pequeños, soporte cómodo.", img:"img2/45.png" },
  { id:"p046", title:"Funda Auto Asiento", price:"329", cat:"accesorios", tags:"accesorios,auto,protector,asiento", desc:"Protege el coche de pelo y suciedad.", img:"img2/46.png" },
  { id:"p047", title:"Collar con Luz LED", price:"189", cat:"accesorios", tags:"accesorios,collar,led,noche", desc:"Visibilidad extra para paseos nocturnos.", img:"img2/47.png" },
  { id:"p048", title:"Plato Lento Antiansiedad", price:"149", cat:"accesorios", tags:"accesorios,comedero,lento,ansiedad", desc:"Ayuda a comer más lento y con calma.", img:"img2/48.png" },
  { id:"p049", title:"Tapete Olfativo", price:"279", cat:"accesorios", tags:"accesorios,olfato,enriquecimiento,mental", desc:"Juego de olfato para snacks y enfoque.", img:"img2/49.png" },
  { id:"p050", title:"Kit Paseo Urbano", price:"349", cat:"accesorios", tags:"accesorios,kit,correa,collar", desc:".Kit práctico para paseo diario (básico). ", img: "img2/50.png" },

  // ===== JUGUETES (25) =====
  { id:"p051", title:"Pelota Rebotadora Pro", price:"99", cat:"juguetes", tags:"juguetes,pelota,rebote,juego", desc:"Rebote irregular para más diversión.", img:"img2/51.png" },
  { id:"p052", title:"Mordedera Caucho Duro", price:"129", cat:"juguetes", tags:"juguetes,mordedera,caucho,resistente", desc:"Resistente para mordida intensa.", img:"img2/52.png" },
  { id:"p053", title:"Cuerda Doble Nudo", price:"89", cat:"juguetes", tags:"juguetes,cuerda,jalón,resistencia", desc:"Perfecta para jalones y juego en pareja.", img:"img2/53.png" },
  { id:"p054", title:"Peluche Chillón Suave", price:"109", cat:"juguetes", tags:"juguetes,peluche,chillón,pequeños", desc:"Sonido suave, ideal para perritos pequeños.", img:"img2/54.png" },
  { id:"p055", title:"Disco Volador Flexible", price:"119", cat:"juguetes", tags:"juguetes,disco,frisbee,parque", desc:"Material suave para juegos en parque.", img:"img2/55.png" },
  { id:"p056", title:"Juguete Rellenable Snacks", price:"149", cat:"juguetes", tags:"juguetes,rellenable,enriquecimiento,ansiedad", desc:"Rellénalo con premios para entretener más.", img:"img2/56.png" },
  { id:"p057", title:"Puzzle Inteligencia Nivel 1", price:"189", cat:"juguetes", tags:"juguetes,puzzle,inteligencia,mental", desc:".Estimula la mente con recompensas.", img: "img2/57.png" },
  { id:"p058", title:"Puzzle Inteligencia Nivel 2 ", price: "229 ", cat: "juguetes ", tags: "juguetes,puzzle,reto,inteligencia ", desc: "Más reto para perritos curiosos. ", img: "img2/58.png" },
  { id:"p059", title:"Lanzador de Pelotas", price:"169", cat:"juguetes", tags:"juguetes,lanzador,pelota,energía", desc:"Mayor alcance para quemar energía.", img:"img2/59.png" },
  { id:"p060", title:"Aro Dental Texturizado", price:"99", cat:"juguetes", tags:"juguetes,dental,mordida,encías", desc:"Textura para masaje de encías (juego supervisado).", img:"img2/60.png" },
  { id:"p061", title:"Bola Interactiva Rodante", price:"199", cat:"juguetes", tags:"juguetes,interactivo,energía,solo", desc:"Se mueve para mantenerlo activo.", img:"img2/61.png" },
  { id:"p062", title:"Pato Flotante", price:"89", cat:"juguetes", tags:"juguetes,agua,flotante,verano", desc:"Para juegos con agua y alberca.", img:"img2/62.png" },
  { id:"p063", title:"Hueso Nylon Pro", price:"139", cat:"juguetes", tags:"juguetes,hueso,nylon,duradero", desc:"Durable para mordida constante.", img:"img2/63.png" },
  { id:"p064", title:"Pelota con Premios", price:"159", cat:"juguetes", tags:"juguetes,premios,interactivo,olfato", desc:"Suelta snacks mientras rueda.", img:"img2/64.png" },
  { id: "p065 ", title: "Cuerda Dental ", price: "99 ", cat: "juguetes ", tags: "juguetes,dental,cuerda,higiene ", desc: ".Apoyo de limpieza mecánica durante el juego.", img: "img2/65.png" },
  { id: "p066 ", title: "Peluche Reforzado ", price: "149 ", cat: "juguetes ", tags: "juguetes,peluche,reforzado,duradero ", desc: "Costuras reforzadas para más duración. ", img: "img2/66.png" },
  { id: "p067 ", title: "Mordedera Anillos ", price: "109 ", cat: "juguetes ", tags: "juguetes,mordedera,agarre,anillos ", desc: "Diseño de anillos para mejor agarre. ", img: "img2/67.png" },
  { id: "p068 ", title: "Dispenser Rompecabezas ", price: "219 ", cat: "juguetes ", tags: "juguetes,rompecabezas,mental,olfato ", desc: "Activa concentración y olfato con premios. ", img: "img2/68.png" },
  { id:"p069", title:"Set Mini Pelotas", price:"129", cat:"juguetes", tags:"juguetes,set,pelotas,variado", desc:"Variedad para juegos diarios.", img:"img2/69.png" },
  { id:"p070", title:"Boomerang Mascota", price:"119", cat:"juguetes", tags:"juguetes,parque,boomerang,juego", desc:"Para juegos al aire libre (supervisado).", img:"img2/70.png" },
  { id:"p071", title:"Tira de Entrenamiento", price:"99", cat:"juguetes", tags:"juguetes,entrenamiento,obediencia,juego", desc:"Ideal para juego guiado y obediencia.", img:"img2/71.png" },
  { id:"p072", title:"Ratón de Tela Cachorro", price:"69", cat:"juguetes", tags:"juguetes,cachorro,suave,tela", desc:"Juego suave para cachorros.", img:"img2/72.png" },
  { id:"p073", title:"Mordedera Sabor Tocino", price:"139", cat:"juguetes", tags:"juguetes,mordedera,sabor,atracción", desc:"Aroma atractivo para motivación.", img:"img2/73.png" },
  { id:"p074", title:"Cubo Sonoro", price:"89", cat:"juguetes", tags:"juguetes,sonoro,estimulación,curiosidad", desc:"Sonidos leves que atraen atención.", img:"img2/74.png" },
  { id:"p075", title:"Pelota con Luz Suave", price:"149", cat:"juguetes", tags:"juguetes,bola,luz,noche", desc:"Luz suave para jugar con poca luz.", img:"img2/75.png" },

  // ===== FARMACIA (25) =====
  { id:"p076", title:"Vitaminas Piel & Pelo", price:"249", cat:"farmacia", tags:"farmacia,vitaminas,piel,pelo", desc:"Apoyo general para piel y pelaje (uso regular).", img:"img2/76.png" },
  { id:"p077", title:"Omega 3 Mascotas", price:"279", cat:"farmacia", tags:"farmacia,omega 3,brillo,apoyo", desc:"Apoyo nutricional para brillo y bienestar general.", img:"img2/77.png" },
  { id:"p078", title:"Probióticos Digestivos", price:"259", cat:"farmacia", tags:"farmacia,probióticos,digestión,apoyo", desc:"Apoyo digestivo general (consulta indicaciones).", img:"img2/78.png" },
  { id:"p079", title:"Pasta Multivitamínica", price:"229", cat:"farmacia", tags:"farmacia,multivitamínico,energía,apoyo", desc:"Apoyo nutricional para rutina diaria.", img:"img2/79.png" },
  { id:"p080", title:"Suplemento Articulaciones", price:"299", cat:"farmacia", tags:"farmacia,articulaciones,glucosamina,apoyo", desc:"Apoyo para movilidad y articulaciones.", img:"img2/80.png" },
  { id:"p081", title:"Bálsamo Calmante Piel", price:"169", cat:"farmacia", tags:"farmacia,calmante,piel,externo", desc:"Apoyo externo para piel irritada (uso tópico).", img:"img2/81.png" },
  { id:"p082", title:"Spray Antiséptico Suave", price:"159", cat:"farmacia", tags:"farmacia,antiséptico,spray,externo", desc:".Apoyo de higiene externa (uso tópico). ", img: "img2/82.png" },
  { id:"p083", title:"Solución Ocular Suave", price:"149", cat:"farmacia", tags:"farmacia,ojos,limpieza,externo", desc:"Apoyo para limpieza externa del contorno ocular.", img:"img2/83.png" },
  { id:"p084", title:"Suero Rehidratante", price:"179", cat:"farmacia", tags:"farmacia,rehidratación,apoyo,bienestar", desc:"Apoyo general en días de calor y actividad.", img:"img2/84.png" },
  { id:"p085", title:"Electrolitos Mascotas", price:"189", cat:"farmacia", tags:"farmacia,electrolitos,calor,apoyo", desc:"Apoyo para hidratación en temporadas calurosas.", img:"img2/85.png" },
  { id:"p086", title:"Suplemento Calmante", price:"269", cat:"farmacia", tags:"farmacia,calmante,estrés,apoyo", desc:"Apoyo para momentos de estrés (ruidos, viajes).", img:"img2/86.png" },
  { id:"p087", title:"Gotas Higiene Oídos", price:"139", cat:"farmacia", tags:"farmacia,oídos,higiene,externo", desc:"Apoyo de limpieza externa de oídos.", img:"img2/87.png" },
  { id:"p088", title:"Spray Anti-Picazón", price:"159", cat:"farmacia", tags:"farmacia,picazón,externo,calmante", desc:".Apoyo externo para picazón ocasional.", img: "img2/88.png" },
  { id: "p089 ", title: "Jarabe Energía Suave ", price: "219 ", cat: "farmacia ", tags: "farmacia,energía,apoyo,diario ", desc: ".Apoyo de energía para rutina diaria (según indicación). ", img: "img2/89.png" },
  { id: "p090 ", title: "Pasta Dental Enzimática ", price: "199 ", cat: "farmacia ", tags: "farmacia,dental,higiene,aliento ", desc: "Apoyo dental con cepillado frecuente. ", img: "img2/90.png" },
  { id: "p091 ", title: "Suplemento Cachorro ", price: "279 ", cat: "farmacia ", tags: "farmacia,cachorro,crecimiento,apoyo ", desc: "Apoyo nutricional para crecimiento. ", img: "img2/91.png" },
  { id: "p092 ", title: "Suplemento Senior ", price: "299 ", cat: "farmacia ", tags: "farmacia,senior,bienestar,apoyo ", desc: "Apoyo general para perritos senior. ", img: "img2/92.png" },
  { id:"p093", title:"Gel Cicatrizante Suave", price:"179", cat:"farmacia", tags:"farmacia,gel,externo,apoyo", desc:"Apoyo tópico para cuidado externo.", img:"img2/93.png" },
  { id:"p094", title:"Crema Humectante Piel", price:"169", cat:"farmacia", tags:"farmacia,humectante,piel,externo", desc:"Apoyo de hidratación para piel reseca.", img:"img2/94.png" },
  { id:"p095", title:"Spray Refrescante Verano", price:"149", cat:"farmacia", tags:"farmacia,verano,refrescante,apoyo", desc:"Apoyo de frescura en días calurosos.", img:"img2/95.png" },
  { id:"p096", title:"Suplemento Pelaje Brillo", price:"259", cat:"farmacia", tags:"farmacia,pelaje,brillo,apoyo", desc:"Apoyo nutricional para brillo y suavidad.", img:"img2/96.png" },
  { id:"p097", title:"Gomitas Multivitamínicas", price:"229", cat:"farmacia", tags:"farmacia,gomitas,vitaminas,apoyo", desc:"Apoyo multivitamínico en formato práctico.", img:"img2/97.png" },
  { id:"p098", title:"Apoyo Inmunidad", price:"289", cat:"farmacia", tags:"farmacia,inmunidad,apoyo,bienestar", desc:"Apoyo general para bienestar.", img:"img2/98.png" },
  { id:"p099", title:"Suplemento Digestión Ligera", price:"249", cat:"farmacia", tags:"farmacia,digestión,apoyo,diario", desc:".Apoyo digestivo ligero para rutina. ", img: "img2/99.png" },
  { id: "p100 ", title: "Kit Bienestar Diario ", price: "349 ", cat: "farmacia ", tags: "farmacia,kit,bienestar,apoyo ", desc: "Kit básico de apoyo para bienestar general. ", img: "img2/100.png" }
  ];

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
    // Mapear los productos de la API
    const productosFormateados = productosAPI.map(p => ({
      id: p._id || p.id,
      title: p.title,
      price: p.price,
      cat: p.cat,
      tags: p.tags,
      desc: p.desc,
      img: p.img
    }));
    return [...PRODUCTOS_BASE, ...productosFormateados];
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
              ✏️ Editar
            </button>
            <button class="btn-admin-delete" data-id="${p.id}"
              style="flex:1; background:#ff4d4d; color:#fff; border:none; border-radius:8px; padding:6px; font-weight:700; cursor:pointer;">
              🗑️ Borrar
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
    if (shopTop) {
      const btnAgregar = document.createElement('button');
      btnAgregar.innerHTML = '➕ Agregar Producto';
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
          ${esEdicion ? '✏️ Editar Producto' : '➕ Agregar Producto'}
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
            ${esEdicion ? '💾 Guardar Cambios' : '➕ Agregar Producto'}
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