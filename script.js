/* MerkaLatina Colombia — sitio estático, catálogo y pedidos por WhatsApp. */
const CATEGORY_DEFINITIONS = [
  { slug: "hogar", label: "Hogar", kicker: "Hogar y estilo", title: "Dale nuevas ideas a tu hogar.", description: "Soluciones prácticas para cocina, orden, decoración y bienestar en casa.", image: "assets/images/categories/hogar.jpg" },
  { slug: "cocina", label: "Cocina", kicker: "Sabor y practicidad", title: "Todo para tu cocina y tus comidas.", description: "Termos, loncheras y utensilios para llevar y disfrutar tus comidas y bebidas.", image: "assets/images/categories/cocina.jpg" },
  { slug: "salud-belleza", label: "Salud y belleza", kicker: "Cuidado diario", title: "Un momento para cuidarte.", description: "Productos para tu rutina de bienestar, belleza y cuidado personal.", image: "assets/images/categories/salud-belleza.jpg" },
  { slug: "infantil", label: "Infantil", kicker: "Para los pequeños", title: "Para jugar, crecer y descubrir.", description: "Opciones para niños y bebés, pensadas para la vida en familia.", image: "assets/images/categories/infantil.jpg" },
  { slug: "mascotas", label: "Mascotas", kicker: "Amigos de casa", title: "Ellos también merecen lo mejor.", description: "Accesorios y productos para cuidar y consentir a tus mascotas.", image: "assets/images/categories/mascotas.jpg" },
  { slug: "tecnologia", label: "Tecnología", kicker: "Conectado a lo que importa", title: "Tecnología para todos tus planes.", description: "Dispositivos, accesorios y gadgets para el trabajo y el tiempo libre.", image: "assets/images/categories/tecnologia.jpg" },
  { slug: "vestuario-hombre", label: "Moda hombre", kicker: "Moda hombre", title: "Vístete para cada momento.", description: "Básicos y prendas cómodas para el estilo de todos los días.", image: "assets/images/categories/vestuario-hombre.jpg" },
  { slug: "vestuario-mujer", label: "Moda mujer", kicker: "Moda mujer", title: "Tu estilo, todos los días.", description: "Prendas y accesorios versátiles para combinar a tu manera.", image: "assets/images/categories/vestuario-mujer.jpg" },
  { slug: "calzado", label: "Calzado", kicker: "Cada paso cuenta", title: "Encuentra tu próximo par.", description: "Calzado casual, urbano y deportivo para moverte con comodidad.", image: "assets/images/categories/calzado.jpg" },
  { slug: "vehiculos", label: "Vehículos", kicker: "Listo para salir", title: "Accesorios para el camino.", description: "Productos útiles para mantenimiento, viajes y comodidad en carretera.", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80" },
  { slug: "electrodomesticos", label: "Electrodomésticos", kicker: "Rutinas más fáciles", title: "Tu casa, más práctica.", description: "Electrodomésticos para ahorrar tiempo en el día a día.", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1400&q=80" },
  { slug: "deportes", label: "Deportes", kicker: "Activa tus planes", title: "Muévete a tu manera.", description: "Equipo y accesorios para entrenar dentro o fuera de casa.", image: "assets/images/categories/deportes.jpg" },
  { slug: "herramientas", label: "Herramientas", kicker: "Manos a la obra", title: "Para reparar y crear.", description: "Herramientas útiles para tus proyectos y arreglos en casa.", image: "https://images.unsplash.com/photo-1581147036324-c1c9a3c7c78d?auto=format&fit=crop&w=1400&q=80" },
  { slug: "temporada", label: "Temporada", kicker: "Para la ocasión", title: "Detalles para cada temporada.", description: "Ideas para celebraciones, fechas especiales y nuevos comienzos.", image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1400&q=80" }
];

const CATEGORY_BY_SLUG = new Map(CATEGORY_DEFINITIONS.map((category) => [category.slug, category]));
const FEATURED_CATEGORIES = ["hogar", "cocina", "tecnologia", "salud-belleza", "calzado", "vestuario-mujer"];
const WHATSAPP_NUMBER = "573044151020";
// Reemplaza "#" por el enlace real de cada red social.
const SOCIAL_LINKS = [
  { label: "Facebook de MerkaLatina", icon: "fa-brands fa-facebook-f", url: "#" },
  { label: "YouTube de MerkaLatina", icon: "fa-brands fa-youtube", url: "#" },
  { label: "Instagram de MerkaLatina", icon: "fa-brands fa-instagram", url: "#" }
];
const CART_STORAGE_KEY = "merkalatina:cart";
const catalogState = { mode: "featured", query: "", sort: "default" };
let catalogProducts = [];
let cartMemory = null;
let toastTimeout;

function getBasePath() { return document.body.dataset.basePath || ""; }
function getHomeUrl() { return `${getBasePath()}index.html`; }
function getAboutUrl() { return `${getBasePath()}pages/quienes-somos.html`; }
function getCategoryUrl(slug) { return `${getBasePath()}pages/${slug}.html`; }
function resolveAssetPath(path) {
  if (!path) return "";
  return /^(https?:)?\/\//.test(path) || path.startsWith("data:") || path.startsWith("/") ? path : `${getBasePath()}${path}`;
}
function formatCOP(value) { return `$ ${Number(value).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`; }
function normalizeText(value) { return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
function findProduct(id) { return catalogProducts.find((product) => String(product.id) === String(id)); }

function renderHeader() {
  const category = document.body.dataset.category || "";
  const isHome = document.body.dataset.page === "home";
  const navLink = (url, label, active = false) => `<a href="${url}"${active ? ' class="is-active" aria-current="page"' : ""}>${label}</a>`;
  return `
    <header class="site-header" data-header>
      <div class="announcement"><div class="container announcement-inner"><span><i class="fa-solid fa-truck-fast" aria-hidden="true"></i> Envío GRATIS · Pago contra entrega · Pide por WhatsApp</span><a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer">¿Necesitas ayuda? <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></div></div>
      <div class="container header-main">
        <button class="menu-toggle" type="button" data-menu-toggle aria-label="Abrir menú" aria-expanded="false" aria-controls="primary-navigation"><i class="fa-solid fa-bars" aria-hidden="true"></i></button>
        <a class="brand" href="${getHomeUrl()}" aria-label="MerkaLatina Colombia, ir al inicio"><img src="${resolveAssetPath("assets/images/icons/logo-header.png")}" width="283" height="420" alt=""><span class="brand-text"><strong>merka<span>latina</span></strong><small>COLOMBIA</small></span></a>
        <form class="header-search" role="search" data-search-form><label class="sr-only" for="site-search">Buscar productos en toda la tienda</label><i class="fa-solid fa-magnifying-glass search-icon" aria-hidden="true"></i><input id="site-search" name="q" type="search" placeholder="¿Qué estás buscando hoy?" maxlength="100" autocomplete="off"><button type="submit"><span>Buscar</span><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button></form>
        <div class="header-actions"><span class="country-flag" title="Colombia" role="img" aria-label="Bandera de Colombia"><img src="${resolveAssetPath("assets/images/colombia-flag.svg")}" alt="" width="34" height="34"></span><a class="header-help" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" aria-label="Ayuda por WhatsApp"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span>Ayuda</span></a><button class="cart-trigger" type="button" data-cart-open aria-haspopup="dialog" aria-controls="cart-drawer" aria-label="Abrir carrito"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i><span>Mi carrito</span><strong data-cart-count>0</strong></button></div>
      </div>
      <div class="header-nav-wrap"><nav class="container primary-nav" id="primary-navigation" aria-label="Navegación principal" data-navigation>
        ${navLink(getHomeUrl(), "Inicio", isHome)}
        ${navLink(`${getHomeUrl()}#categorias`, "Categorías")}
        ${navLink(getCategoryUrl("tecnologia"), "Tecnología", category === "tecnologia")}
        ${navLink(getCategoryUrl("hogar"), "Hogar", category === "hogar")}
        ${navLink(getCategoryUrl("cocina"), "Cocina", category === "cocina")}
        ${navLink(getCategoryUrl("calzado"), "Calzado", category === "calzado")}
        ${navLink(getCategoryUrl("vestuario-mujer"), "Moda", category === "vestuario-mujer")}
        ${navLink(getCategoryUrl("salud-belleza"), "Belleza", category === "salud-belleza")}
        ${navLink(getCategoryUrl("deportes"), "Deportes", category === "deportes")}
        ${navLink(getAboutUrl(), "Quiénes somos", document.body.dataset.page === "about")}
      </nav></div>
    </header>`;
}

function renderFooter() {
  return `<footer class="site-footer"><div class="container footer-grid">
    <div class="footer-intro"><a class="brand footer-brand" href="${getHomeUrl()}" aria-label="MerkaLatina Colombia, ir al inicio"><img src="${resolveAssetPath("assets/images/icons/logo-small.png")}" width="38" height="56" alt=""><span class="brand-text"><strong>merka<span>latina</span></strong><small>COLOMBIA</small></span></a><p>Productos para tu casa, tu estilo y tu día a día. Descubre, elige y confirma tu pedido con nosotros.</p><div class="social-links" aria-label="Redes sociales">${SOCIAL_LINKS.map((item) => `<a href="${item.url}"${item.url === "#" ? "" : ' target="_blank" rel="noopener noreferrer"'} aria-label="${item.label}"><i class="${item.icon}" aria-hidden="true"></i></a>`).join("")}</div></div>
    <nav class="footer-column" aria-label="Explora"><h2>Explora</h2><a href="${getHomeUrl()}#productos">Todos los productos</a><a href="${getHomeUrl()}#categorias">Categorías</a><a href="${getCategoryUrl("tecnologia")}">Tecnología</a><a href="${getCategoryUrl("hogar")}">Hogar</a><a href="${getCategoryUrl("cocina")}">Cocina</a><a href="${getCategoryUrl("calzado")}">Calzado</a><a href="${getCategoryUrl("vestuario-mujer")}">Moda mujer</a></nav>
    <nav class="footer-column" aria-label="MerkaLatina"><h2>MerkaLatina</h2><a href="${getAboutUrl()}">Quiénes somos</a><a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer">Hablar por WhatsApp</a><a href="${getHomeUrl()}#como-comprar">Cómo comprar</a></nav>
    <div class="footer-column footer-contact"><h2>Compra con tranquilidad</h2><p>Tu pedido se prepara por WhatsApp. Confirmamos contigo disponibilidad, entrega y pago antes de finalizar.</p><a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Escríbenos</a></div>
    </div><div class="footer-bottom"><div class="container"><span>© 2026 MerkaLatina Colombia</span><span>Hecho para comprar a tu manera.</span></div></div></footer>`;
}

function renderCartShell() {
  return `<div class="cart-overlay" data-cart-overlay hidden></div>
    <aside class="cart-drawer" id="cart-drawer" data-cart-drawer role="dialog" aria-modal="true" aria-labelledby="cart-title" aria-hidden="true" inert>
      <div class="cart-drawer-header"><div><small>MERKALATINA COLOMBIA</small><h2 id="cart-title">Tu carrito <span data-cart-title-count>(0)</span></h2></div><button class="icon-button" type="button" data-cart-close aria-label="Cerrar carrito"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div>
      <div class="cart-drawer-body" data-cart-view><div class="cart-empty" data-cart-empty hidden><span class="cart-empty-icon"><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i></span><h3>Tu carrito está esperando</h3><p>Explora el catálogo y agrega los productos que te gusten.</p><a class="button button-primary" href="${getHomeUrl()}#productos" data-cart-close-link>Ver productos</a></div><ul class="cart-items" data-cart-items></ul><div class="cart-upsell" data-cart-upsell hidden></div></div>
      <div class="cart-drawer-footer" data-cart-footer hidden><div class="shipping-meter" data-shipping-meter></div><div class="cart-total-row"><span>Subtotal estimado</span><strong data-cart-total>$ 0</strong></div><p>Envío y disponibilidad por confirmar por WhatsApp.</p><button class="button button-primary cart-checkout-btn" type="button" data-open-checkout>Continuar pedido <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button></div>
      <form class="checkout-form" data-checkout-form hidden><button class="checkout-back" type="button" data-checkout-back><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Volver al carrito</button><h3>Datos para tu pedido</h3><p class="checkout-intro">Solo usaremos estos datos para preparar el mensaje que enviarás por WhatsApp.</p>
        <label class="checkout-field">Nombre completo <input name="nombre" type="text" autocomplete="name" maxlength="80" required placeholder="Tu nombre"></label>
        <label class="checkout-field">Teléfono / WhatsApp <input name="telefono" type="tel" autocomplete="tel" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" title="Ingresa 10 dígitos, sin espacios ni guiones" placeholder="3001234567" required></label>
        <label class="checkout-field">Ciudad <input name="ciudad" type="text" autocomplete="address-level2" maxlength="80" required placeholder="Tu ciudad"></label>
        <label class="checkout-field">Dirección de entrega <input name="direccion" type="text" autocomplete="street-address" maxlength="150" required placeholder="Calle, número y detalles"></label>
        <label class="checkout-field">Notas (opcional) <textarea name="notas" rows="2" maxlength="300" placeholder="Algo que debamos saber"></textarea></label>
        <p class="checkout-note"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> Tu pedido no se envía automáticamente: se abrirá WhatsApp para que lo revises y lo confirmes. Tu carrito se conservará.</p>
        <button class="button button-primary checkout-submit" type="submit"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Abrir pedido en WhatsApp</button><a class="checkout-fallback" href="#" data-checkout-fallback target="_blank" rel="noopener noreferrer" hidden>¿No se abrió WhatsApp? Toca aquí</a>
      </form>
    </aside>
    <dialog class="product-dialog" data-product-dialog aria-labelledby="dialog-title"><button class="icon-button dialog-close" type="button" data-dialog-close aria-label="Cerrar detalles"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button><div data-dialog-content></div></dialog>
    <div class="toast" data-toast role="status" aria-live="polite" hidden></div>`;
}

function renderCategoryPageShell() {
  const mount = document.querySelector("[data-category-shell]");
  if (!mount) return;
  const category = CATEGORY_BY_SLUG.get(document.body.dataset.category) || CATEGORY_DEFINITIONS[0];
  document.title = `${category.label} | MerkaLatina Colombia`;
  mount.innerHTML = `<div data-site-header></div><main id="contenido" class="category-main">
    <section class="collection-hero" aria-labelledby="collection-title"><img class="collection-hero-image" src="${escapeHTML(resolveAssetPath(category.image))}" alt="" width="1400" height="700"><div class="container collection-hero-content"><nav class="breadcrumbs breadcrumbs-light" aria-label="Ruta de navegación"><a href="${getHomeUrl()}">Inicio</a><i class="fa-solid fa-chevron-right" aria-hidden="true"></i><span aria-current="page">${escapeHTML(category.label)}</span></nav><span class="eyebrow">COLECCIÓN / ${escapeHTML(category.kicker)}</span><h1 id="collection-title">${escapeHTML(category.title)}</h1><p>${escapeHTML(category.description)}</p><a class="button button-light" href="#catalogo">Ver productos <i class="fa-solid fa-arrow-down" aria-hidden="true"></i></a></div></section>
    <section class="benefits" aria-label="Así compras en MerkaLatina"><div class="container benefits-grid"><div class="benefit"><span class="benefit-icon"><i class="fa-solid fa-truck-fast" aria-hidden="true"></i></span><div><strong>Envío GRATIS</strong><span>Con pago contra entrega en Colombia</span></div></div><div class="benefit"><span class="benefit-icon"><i class="fa-solid fa-hand-holding-dollar" aria-hidden="true"></i></span><div><strong>Pago contra entrega</strong><span>Confirma los detalles al pedir</span></div></div><div class="benefit"><span class="benefit-icon"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></span><div><strong>Atención cercana</strong><span>Resolvemos tus dudas por WhatsApp</span></div></div></div></section>
    <section class="section catalog-section category-products" id="catalogo" aria-labelledby="category-products-title" data-product-section><div class="container"><div class="section-header"><div><span class="eyebrow">PARA TI</span><h2 id="category-products-title">${escapeHTML(category.label)}<span class="heading-accent">.</span></h2><p>Elige tus favoritos y agrégalos al carrito.</p></div><a class="section-link" href="${getHomeUrl()}#categorias">Otras categorías <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div><div class="catalog-toolbar catalog-toolbar-category"><label class="sort-control" for="catalog-sort">Ordenar por <select id="catalog-sort" data-product-sort><option value="default">Destacados</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option><option value="name">Nombre A-Z</option></select></label></div><div class="catalog-meta"><p data-results-label role="status" aria-live="polite">Cargando productos…</p></div><div class="product-grid" data-product-grid data-product-mode="category" data-category="${escapeHTML(category.slug)}"><p class="products-loading">Cargando productos…</p></div></div></section>
    <section class="section more-collections"><div class="container"><div class="section-header"><div><span class="eyebrow">SIGUE EXPLORANDO</span><h2>También te puede gustar<span class="heading-accent">.</span></h2></div></div><div class="category-more-links" data-other-collections></div></div></section>
    <section class="contact-band container" aria-labelledby="contact-title"><div class="contact-decor" aria-hidden="true"><i class="fa-brands fa-whatsapp"></i></div><div><span class="eyebrow">ESTAMOS PARA AYUDARTE</span><h2 id="contact-title">¿Alguna pregunta sobre un producto?</h2><p>Escríbenos y te ayudamos a confirmar todos los detalles.</p></div><a class="button button-light" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Hablar por WhatsApp</a></section>
  </main><div data-site-footer></div><div data-cart-shell></div>`;
}

function renderSharedShells() {
  const header = document.querySelector("[data-site-header]");
  const footer = document.querySelector("[data-site-footer]");
  const cart = document.querySelector("[data-cart-shell]");
  if (header) header.innerHTML = renderHeader();
  if (footer) footer.innerHTML = renderFooter();
  if (cart) cart.innerHTML = renderCartShell();
}

function renderCategories() {
  const featured = document.querySelector("[data-featured-categories]");
  const more = document.querySelector("[data-more-categories]");
  if (featured) featured.innerHTML = FEATURED_CATEGORIES.map((slug) => {
    const category = CATEGORY_BY_SLUG.get(slug);
    return `<a class="category-card" href="${getCategoryUrl(slug)}"><img src="${escapeHTML(resolveAssetPath(category.image.replace("w=1400", "w=700")))}" alt="" loading="lazy" width="420" height="500"><span class="category-card-content"><small>${escapeHTML(category.kicker)}</small><strong>${escapeHTML(category.label)}</strong></span><span class="category-card-arrow" aria-hidden="true"><i class="fa-solid fa-arrow-up-right-from-square"></i></span></a>`;
  }).join("");
  if (more) more.innerHTML = CATEGORY_DEFINITIONS.filter((category) => !FEATURED_CATEGORIES.includes(category.slug)).map((category) => `<a href="${getCategoryUrl(category.slug)}">${escapeHTML(category.label)} <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>`).join("");
  const other = document.querySelector("[data-other-collections]");
  if (other) other.innerHTML = CATEGORY_DEFINITIONS.filter((category) => category.slug !== document.body.dataset.category).slice(0, 8).map((category) => `<a href="${getCategoryUrl(category.slug)}">${escapeHTML(category.label)} <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>`).join("");
}

function initNavigation() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-navigation]");
  if (!toggle || !nav) return;
  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    toggle.querySelector("i").className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (event) => { if (event.target.closest("a")) setOpen(false); });
  document.addEventListener("click", (event) => { if (!nav.contains(event.target) && !toggle.contains(event.target)) setOpen(false); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setOpen(false); toggle.focus(); } });
  window.addEventListener("resize", () => { if (window.innerWidth > 800) setOpen(false); });
}

function initSearch() {
  const form = document.querySelector("[data-search-form]");
  const input = document.getElementById("site-search");
  if (!form || !input) return;
  const initialQuery = new URLSearchParams(window.location.search).get("q");
  if (document.body.dataset.page === "home" && initialQuery) {
    catalogState.query = initialQuery.trim().slice(0, 100);
    catalogState.mode = "all";
    input.value = catalogState.query;
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();
    if (!query) { input.focus(); return; }
    if (document.body.dataset.page !== "home") {
      window.location.href = `${getHomeUrl()}?q=${encodeURIComponent(query)}#productos`;
      return;
    }
    catalogState.query = query;
    catalogState.mode = "all";
    updateSearchUrl(query);
    renderCatalog();
    document.querySelector("[data-product-section]")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  input.addEventListener("search", () => { if (!input.value && catalogState.query) clearSearch(); });
  input.addEventListener("input", () => { if (!input.value && catalogState.query) clearSearch(); });
  document.querySelector("[data-clear-search]")?.addEventListener("click", () => { clearSearch(); input.focus(); });
}

function updateSearchUrl(query) {
  const url = new URL(window.location.href);
  if (query) url.searchParams.set("q", query);
  else url.searchParams.delete("q");
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}
function clearSearch() {
  catalogState.query = "";
  catalogState.mode = "featured";
  const input = document.getElementById("site-search");
  if (input) input.value = "";
  updateSearchUrl("");
  renderCatalog();
}

function initCatalogControls() {
  const filters = document.querySelector("[data-category-filters]");
  if (filters) {
    const options = [{ slug: "featured", label: "Destacados" }, { slug: "all", label: "Todos" }, ...CATEGORY_DEFINITIONS];
    filters.innerHTML = options.map((option) => `<button class="filter-chip" type="button" data-filter="${option.slug}" aria-pressed="false">${escapeHTML(option.label)}</button>`).join("");
    filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      if (catalogState.query) { catalogState.query = ""; document.getElementById("site-search").value = ""; updateSearchUrl(""); }
      catalogState.mode = button.dataset.filter;
      renderCatalog();
    });
  }
  document.querySelector("[data-product-sort]")?.addEventListener("change", (event) => { catalogState.sort = event.target.value; renderCatalog(); });
  document.querySelector("[data-show-all]")?.addEventListener("click", () => { catalogState.mode = "all"; renderCatalog(); });
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-reset-filters]")) {
      if (catalogState.query) { catalogState.query = ""; document.getElementById("site-search").value = ""; updateSearchUrl(""); }
      catalogState.mode = "all"; renderCatalog();
    }
    if (event.target.closest("[data-retry-catalog]")) loadProducts();
  });
}

async function loadProducts() {
  const grid = document.querySelector("[data-product-grid]");
  if (!grid) return;
  try {
    const response = await fetch(`${getBasePath()}data/productos.json`);
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
    const products = await response.json();
    if (!Array.isArray(products)) throw new Error("El catálogo no es una lista");
    catalogProducts = products.filter((product) => product.id != null && typeof product.name === "string" && Number.isFinite(Number(product.price)) && Number(product.price) >= 0 && CATEGORY_BY_SLUG.has(product.category));
    renderCatalog();
    renderCart(); // Actualiza precios y nombres del carrito con el catálogo vigente.
  } catch (error) {
    console.error("No se pudo cargar el catálogo:", error);
    const label = document.querySelector("[data-results-label]");
    if (label) label.textContent = "No se pudo cargar el catálogo.";
    grid.innerHTML = `<div class="empty-state"><i class="fa-solid fa-wifi" aria-hidden="true"></i><h3>No pudimos cargar los productos</h3><p>Revisa tu conexión e inténtalo de nuevo.</p><button class="button button-outline" type="button" data-retry-catalog>Reintentar</button></div>`;
  }
}

function renderCatalog() {
  const grid = document.querySelector("[data-product-grid]");
  if (!grid || !catalogProducts.length) return;
  const categorySlug = grid.dataset.category || "";
  let visible;
  if (categorySlug) {
    visible = catalogProducts.filter((product) => product.category === categorySlug);
  } else if (catalogState.query) {
    const query = normalizeText(catalogState.query);
    visible = catalogProducts.filter((product) => {
      const category = CATEGORY_BY_SLUG.get(product.category);
      return normalizeText([product.name, product.description, category?.label].join(" ")).includes(query);
    });
  } else if (catalogState.mode === "featured") {
    visible = catalogProducts.filter((product) => product.featured || product.recommended).slice(0, 8);
    if (!visible.length) visible = catalogProducts.slice(0, 8);
  } else if (catalogState.mode === "all") {
    visible = catalogProducts.slice();
  } else {
    visible = catalogProducts.filter((product) => product.category === catalogState.mode);
  }
  visible = [...visible];
  if (catalogState.sort === "price-asc") visible.sort((a, b) => a.price - b.price);
  if (catalogState.sort === "price-desc") visible.sort((a, b) => b.price - a.price);
  if (catalogState.sort === "name") visible.sort((a, b) => a.name.localeCompare(b.name, "es"));

  const label = document.querySelector("[data-results-label]");
  if (label) {
    const count = `${visible.length} ${visible.length === 1 ? "producto" : "productos"}`;
    if (catalogState.query) label.textContent = `${count} para “${catalogState.query}”`;
    else if (categorySlug) label.textContent = `${count} en ${CATEGORY_BY_SLUG.get(categorySlug)?.label || "esta categoría"}`;
    else if (catalogState.mode === "featured") label.textContent = `Nuestros favoritos · ${visible.length} de ${catalogProducts.length} productos`;
    else label.textContent = count;
  }
  const clear = document.querySelector("[data-clear-search]");
  if (clear) clear.hidden = !catalogState.query;
  const more = document.querySelector("[data-show-all]");
  if (more) { more.hidden = !!catalogState.query || catalogState.mode !== "featured"; more.innerHTML = `Ver los ${catalogProducts.length} productos <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>`; }
  document.querySelectorAll("[data-filter]").forEach((button) => {
    const active = !catalogState.query && button.dataset.filter === catalogState.mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (!visible.length) {
    grid.innerHTML = `<div class="empty-state"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><h3>No encontramos productos</h3><p>${catalogState.query ? "Prueba con otra palabra o explora el catálogo completo." : "Todavía no hay productos en esta selección."}</p>${categorySlug ? `<a class="button button-outline" href="${getHomeUrl()}#productos">Ver todo el catálogo</a>` : `<button class="button button-outline" type="button" data-reset-filters>Ver todos los productos</button>`}</div>`;
    return;
  }
  grid.innerHTML = visible.map(renderProductCard).join("");
}

function renderProductCard(product) {
  const category = CATEGORY_BY_SLUG.get(product.category);
  const oldPrice = Number(product.oldPrice);
  const hasDiscount = Number.isFinite(oldPrice) && oldPrice > product.price;
  const discount = hasDiscount ? Math.round((1 - product.price / oldPrice) * 100) : 0;
  return `<article class="product-card">
    <div class="product-media"><button type="button" data-product-details="${escapeHTML(product.id)}" aria-label="Ver detalles de ${escapeHTML(product.name)}"><img class="product-image" src="${escapeHTML(resolveAssetPath(product.image))}" alt="${escapeHTML(product.name)}" loading="lazy" decoding="async" width="420" height="420"></button>${discount ? `<span class="product-badge">-${discount}%</span>` : ""}${product.badge ? `<span class="product-tag">${escapeHTML(product.badge)}</span>` : ""}</div>
    <div class="product-body"><span class="product-category">${escapeHTML(category?.label || "")}</span><h3><button type="button" data-product-details="${escapeHTML(product.id)}">${escapeHTML(product.name)}</button></h3><p class="product-description">${escapeHTML(product.description || "")}</p><div class="product-prices"><strong>${formatCOP(product.price)}</strong>${hasDiscount ? `<del>${formatCOP(oldPrice)}</del>` : ""}</div>${hasDiscount ? `<p class="product-saving"><i class="fa-solid fa-tag" aria-hidden="true"></i> Ahorras ${formatCOP(oldPrice - product.price)}</p>` : ""}<button class="product-buy" type="button" data-buy-now="${escapeHTML(product.id)}"><i class="fa-solid fa-bolt" aria-hidden="true"></i> Comprar ahora</button><button class="product-add" type="button" data-add-to-cart="${escapeHTML(product.id)}"><i class="fa-solid fa-plus" aria-hidden="true"></i> Agregar al carrito</button><p class="product-trust"><i class="fa-solid fa-hand-holding-dollar" aria-hidden="true"></i> Pago contra entrega</p></div>
  </article>`;
}

function initProductDialog() {
  const dialog = document.querySelector("[data-product-dialog]");
  if (!dialog) return;
  let previousFocus = null;
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-product-details]");
    if (!trigger) return;
    const product = findProduct(trigger.dataset.productDetails);
    if (!product) return;
    previousFocus = trigger;
    const category = CATEGORY_BY_SLUG.get(product.category);
    const oldPrice = Number(product.oldPrice);
    const gallery = Array.isArray(product.images) ? product.images : [];
    const saving = oldPrice > product.price ? `<p class="product-saving"><i class="fa-solid fa-tag" aria-hidden="true"></i> Ahorras ${formatCOP(oldPrice - product.price)} frente al precio normal</p>` : "";
    const message = encodeURIComponent(`Hola, quisiera saber más sobre ${product.name} (${formatCOP(product.price)}). ¿Está disponible?`);
    dialog.querySelector("[data-dialog-content]").innerHTML = `<div class="detail-layout"><div class="detail-image"><div class="detail-main"><img class="product-image" data-detail-main src="${escapeHTML(resolveAssetPath(product.image))}" alt="${escapeHTML(product.name)}" width="600" height="600"></div>${gallery.length > 1 ? `<div class="detail-thumbs" role="group" aria-label="Más fotos">${gallery.map((item, index) => `<button type="button" class="detail-thumb${index === 0 ? " is-active" : ""}" data-gallery-src="${escapeHTML(resolveAssetPath(item.src))}" aria-label="Ver foto: ${escapeHTML(item.label || String(index + 1))}" title="${escapeHTML(item.label || "")}"><img src="${escapeHTML(resolveAssetPath(item.src))}" alt="" decoding="async" width="64" height="64"></button>`).join("")}</div>` : ""}</div><div class="detail-copy"><span class="eyebrow">${escapeHTML(category?.label || "")}</span><h2 id="dialog-title">${escapeHTML(product.name)}</h2><div class="product-prices"><strong>${formatCOP(product.price)}</strong>${oldPrice > product.price ? `<del>${formatCOP(oldPrice)}</del>` : ""}</div>${saving}<p>${escapeHTML(product.description || "")}</p><ul class="detail-trust"><li><i class="fa-solid fa-hand-holding-dollar" aria-hidden="true"></i> Pago contra entrega</li><li><i class="fa-solid fa-truck-fast" aria-hidden="true"></i> Envío gratis</li><li><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Atención por WhatsApp</li></ul><div class="detail-info"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> Envío y disponibilidad se confirman por WhatsApp.</div><button class="button button-primary button-buy" type="button" data-buy-now="${escapeHTML(product.id)}"><i class="fa-solid fa-bolt" aria-hidden="true"></i> Comprar ahora</button><button class="button button-outline" type="button" data-add-to-cart="${escapeHTML(product.id)}"><i class="fa-solid fa-plus" aria-hidden="true"></i> Agregar al carrito</button><a class="detail-whatsapp" href="https://wa.me/${WHATSAPP_NUMBER}?text=${message}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Preguntar por este producto</a></div></div>`;
    if (typeof dialog.showModal === "function") dialog.showModal();
  });
  dialog.addEventListener("click", (event) => {
    const thumb = event.target.closest("[data-gallery-src]");
    if (!thumb) return;
    dialog.querySelector("[data-detail-main]").src = thumb.dataset.gallerySrc;
    dialog.querySelectorAll(".detail-thumb").forEach((item) => item.classList.toggle("is-active", item === thumb));
  });
  dialog.querySelector("[data-dialog-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => previousFocus?.focus());
  document.addEventListener("error", (event) => {
    if (event.target.matches?.("img.product-image") && !event.target.dataset.fallback) {
      event.target.dataset.fallback = "true";
      event.target.src = resolveAssetPath("assets/images/product-placeholder.svg");
    } else if (event.target.matches?.("img.collection-hero-image, .category-card img")) {
      event.target.hidden = true; // Mejor un fondo neutro que una foto de otra categoría.
    }
  }, true);
}

function readCart() {
  try {
    const raw = cartMemory ?? JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw.filter((item) => item && (item.id != null || typeof item.name === "string") && Number.isFinite(Number(item.quantity)) && Number(item.quantity) > 0)
      .map((item) => {
        const product = catalogProducts.find((candidate) => String(candidate.id) === String(item.id) || candidate.name === item.name);
        if (product) return { id: product.id, name: product.name, price: Number(product.price), image: product.image, quantity: Math.min(99, Math.floor(Number(item.quantity))) };
        if (catalogProducts.length || typeof item.name !== "string" || !Number.isFinite(Number(item.price))) return null;
        return { id: item.id ?? item.name, name: item.name, price: Math.max(0, Number(item.price)), image: item.image || "", quantity: Math.min(99, Math.floor(Number(item.quantity))) };
      }).filter(Boolean);
  } catch { return []; }
}
function saveCart(items) {
  cartMemory = items;
  try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)); }
  catch { showToast("Tu carrito se conservará mientras mantengas abierta esta página."); }
  renderCart();
}
function addToCart(id, silent = false) {
  const product = findProduct(id);
  if (!product) return;
  const items = readCart();
  const existing = items.find((item) => String(item.id) === String(product.id));
  if (existing) existing.quantity = Math.min(99, existing.quantity + 1);
  else items.push({ id: product.id, name: product.name, price: Number(product.price), image: product.image, quantity: 1 });
  saveCart(items);
  if (!silent) showToast(`${product.name} se agregó al carrito.`, true);
}
function showToast(message, showCartButton = false) {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;
  clearTimeout(toastTimeout);
  toast.replaceChildren();
  const text = document.createElement("span"); text.textContent = message; toast.append(text);
  if (showCartButton) { const button = document.createElement("button"); button.type = "button"; button.textContent = "Ver carrito"; button.addEventListener("click", () => { toast.hidden = true; document.querySelector("[data-cart-open]")?.click(); }); toast.append(button); }
  toast.hidden = false;
  toastTimeout = setTimeout(() => { toast.hidden = true; }, 4500);
}

function renderCart() {
  const list = document.querySelector("[data-cart-items]");
  if (!list) return;
  const items = readCart();
  const totalUnits = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  document.querySelector("[data-cart-count]").textContent = String(totalUnits);
  document.querySelector("[data-cart-title-count]").textContent = `(${totalUnits})`;
  document.querySelector("[data-cart-total]").textContent = formatCOP(total);
  document.querySelector("[data-cart-empty]").hidden = items.length > 0;
  const checkout = document.querySelector("[data-checkout-form]");
  if (!items.length && !checkout.hidden) showCartView();
  document.querySelector("[data-cart-footer]").hidden = !items.length || !checkout.hidden;
  const meter = document.querySelector("[data-shipping-meter]");
  if (meter) meter.innerHTML = `<p class="is-done"><i class="fa-solid fa-truck-fast" aria-hidden="true"></i> <strong>Envío GRATIS</strong> y pago contra entrega en tu pedido</p>`;
  const upsell = document.querySelector("[data-cart-upsell]");
  if (upsell) {
    const inCart = new Set(items.map((item) => String(item.id)));
    const cats = new Set(items.map((item) => findProduct(item.id)?.category));
    const picks = items.length ? catalogProducts.filter((product) => !inCart.has(String(product.id)) && product.image && !product.image.endsWith("product-placeholder.svg")).sort((a, b) => (cats.has(b.category) - cats.has(a.category)) || (Number(!!b.featured) - Number(!!a.featured))).slice(0, 3) : [];
    upsell.hidden = !picks.length;
    upsell.innerHTML = picks.length ? `<h4>Completa tu pedido</h4>${picks.map((product) => `<div class="upsell-item"><img src="${escapeHTML(resolveAssetPath(product.image))}" alt="" width="52" height="52" loading="lazy"><div><strong>${escapeHTML(product.name)}</strong><span>${formatCOP(product.price)}</span></div><button type="button" data-add-to-cart="${escapeHTML(product.id)}" aria-label="Agregar ${escapeHTML(product.name)}"><i class="fa-solid fa-plus" aria-hidden="true"></i></button></div>`).join("")}` : "";
  }
  list.innerHTML = items.map((item) => `<li class="cart-item"><img class="cart-item-image" src="${escapeHTML(resolveAssetPath(item.image))}" alt="" width="74" height="74"><div class="cart-item-info"><strong>${escapeHTML(item.name)}</strong><span>${formatCOP(item.price)}</span><div class="cart-item-qty"><button type="button" data-qty-decrease="${escapeHTML(item.id)}" aria-label="Quitar una unidad de ${escapeHTML(item.name)}">−</button><span aria-label="${item.quantity} unidades">${item.quantity}</span><button type="button" data-qty-increase="${escapeHTML(item.id)}" aria-label="Agregar una unidad de ${escapeHTML(item.name)}">+</button></div></div><button class="cart-remove icon-button" type="button" data-remove-item="${escapeHTML(item.id)}" aria-label="Eliminar ${escapeHTML(item.name)}"><i class="fa-solid fa-trash-can" aria-hidden="true"></i></button></li>`).join("");
}
function showCartView() {
  document.querySelector("[data-cart-view]").hidden = false;
  document.querySelector("[data-checkout-form]").hidden = true;
  document.querySelector("[data-cart-footer]").hidden = readCart().length === 0;
  document.querySelector("[data-checkout-fallback]")?.setAttribute("hidden", "");
}

function initCart() {
  const drawer = document.querySelector("[data-cart-drawer]");
  const overlay = document.querySelector("[data-cart-overlay]");
  const checkoutForm = document.querySelector("[data-checkout-form]");
  if (!drawer || !overlay) return;
  const background = [...document.querySelectorAll("[data-site-header], main, [data-site-footer]")];
  let previousFocus = null;
  const open = () => {
    previousFocus = document.activeElement.closest?.("[data-toast]") ? document.querySelector("[data-cart-open]") : document.activeElement;
    drawer.inert = false;
    drawer.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
    background.forEach((element) => { element.inert = true; });
    document.body.classList.add("cart-is-open");
    requestAnimationFrame(() => { drawer.classList.add("is-open"); overlay.classList.add("is-visible"); });
    drawer.querySelector("[data-cart-close]").focus();
  };
  const close = () => {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    drawer.inert = true;
    drawer.setAttribute("aria-hidden", "true");
    background.forEach((element) => { element.inert = false; });
    document.body.classList.remove("cart-is-open");
    showCartView();
    setTimeout(() => { if (!drawer.classList.contains("is-open")) overlay.hidden = true; }, 300);
    previousFocus?.focus();
  };
  document.querySelector("[data-cart-open]")?.addEventListener("click", open);
  drawer.querySelector("[data-cart-close]").addEventListener("click", close);
  overlay.addEventListener("click", close);
  drawer.querySelector("[data-cart-close-link]")?.addEventListener("click", close);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer.classList.contains("is-open")) close();
    if (event.key !== "Tab" || !drawer.classList.contains("is-open")) return;
    const focusable = [...drawer.querySelectorAll('a[href], button:not([disabled]), input, textarea, select')].filter((element) => !element.closest("[hidden]") && !element.hidden);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.addEventListener("click", (event) => {
    const buy = event.target.closest("[data-buy-now]");
    if (buy) {
      const dialogEl = buy.closest("dialog"); if (dialogEl?.open) dialogEl.close();
      const items = readCart();
      if (!items.some((entry) => String(entry.id) === String(buy.dataset.buyNow))) addToCart(buy.dataset.buyNow, true);
      document.querySelector("[data-cart-open]")?.click();
      document.querySelector("[data-open-checkout]")?.click();
      return;
    }
    const add = event.target.closest("[data-add-to-cart]");
    if (add) { addToCart(add.dataset.addToCart); const dialog = add.closest("dialog"); if (dialog?.open) dialog.close(); }
    const action = event.target.closest("[data-qty-increase], [data-qty-decrease], [data-remove-item]");
    if (!action) return;
    const id = action.dataset.qtyIncrease ?? action.dataset.qtyDecrease ?? action.dataset.removeItem;
    const items = readCart();
    const item = items.find((entry) => String(entry.id) === String(id));
    if (!item) return;
    if (action.hasAttribute("data-qty-increase")) item.quantity = Math.min(99, item.quantity + 1);
    if (action.hasAttribute("data-qty-decrease")) item.quantity -= 1;
    saveCart(items.filter((entry) => entry.quantity > 0 && (action.hasAttribute("data-remove-item") ? String(entry.id) !== String(id) : true)));
  });
  drawer.querySelector("[data-open-checkout]").addEventListener("click", () => {
    document.querySelector("[data-cart-view]").hidden = true;
    document.querySelector("[data-cart-footer]").hidden = true;
    checkoutForm.hidden = false;
    checkoutForm.querySelector("input").focus();
  });
  drawer.querySelector("[data-checkout-back]").addEventListener("click", showCartView);
  checkoutForm.querySelectorAll("input[required]").forEach((input) => input.addEventListener("input", () => input.setCustomValidity("")));
  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const items = readCart();
    if (!items.length) { showCartView(); return; }
    for (const input of checkoutForm.querySelectorAll("input[required]")) {
      if (!input.value.trim()) { input.setCustomValidity("Completa este campo."); input.reportValidity(); return; }
    }
    if (!checkoutForm.reportValidity()) return;
    const fields = Object.fromEntries(new FormData(checkoutForm));
    const clean = (value) => String(value || "").trim().replace(/\s+/g, " ");
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const lines = ["Hola, quiero confirmar este pedido en MerkaLatina Colombia:", "", ...items.map((item) => `• ${item.name} x${item.quantity} — ${formatCOP(item.price * item.quantity)}`), "", `Subtotal estimado: ${formatCOP(total)}`, "Envío y disponibilidad por confirmar.", "", `Nombre: ${clean(fields.nombre)}`, `Teléfono: ${clean(fields.telefono)}`, `Ciudad: ${clean(fields.ciudad)}`, `Dirección: ${clean(fields.direccion)}`];
    if (clean(fields.notas)) lines.push(`Notas: ${clean(fields.notas)}`);
    lines.push("", "Quedo pendiente de la confirmación del pedido. Gracias.");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    const fallback = checkoutForm.querySelector("[data-checkout-fallback]");
    fallback.href = url;
    fallback.hidden = false;
    window.open(url, "_blank", "noopener,noreferrer");
    showToast("Revisa y envía el mensaje en WhatsApp. Tu carrito sigue guardado.");
  });
  window.addEventListener("storage", (event) => { if (event.key === CART_STORAGE_KEY) { cartMemory = null; renderCart(); } });
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCategoryPageShell();
  renderSharedShells();
  renderCategories();
  initNavigation();
  initSearch();
  initCatalogControls();
  initProductDialog();
  initCart();
  loadProducts();
});
