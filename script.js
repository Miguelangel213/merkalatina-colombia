/**
 * MerkaLatina Colombia - script.js
 * Menu movil, header dinamico, carrusel, paginas de categoria, buscador y carrito.
 */

const CATEGORY_DEFINITIONS = [
  {
    slug: "hogar",
    label: "Hogar",
    kicker: "Hogar y estilo",
    title: "Todo para renovar tu hogar.",
    description: "Soluciones prácticas para cocina, orden, decoración y bienestar en casa.",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1800&q=85"
  },
  {
    slug: "salud-belleza",
    label: "Salud y belleza",
    kicker: "Cuidado diario",
    title: "Bienestar, belleza y cuidado personal.",
    description: "Productos seleccionados para verte bien, sentirte mejor y cuidar tu rutina.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1800&q=85"
  },
  {
    slug: "infantil",
    label: "Infantil",
    kicker: "Para los pequeños",
    title: "Productos para niños y bebés.",
    description: "Encuentra opciones prácticas para juego, cuidado, ropa y vida familiar.",
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1800&q=85"
  },
  {
    slug: "mascotas",
    label: "Mascotas",
    kicker: "Amigos de casa",
    title: "Accesorios y bienestar para mascotas.",
    description: "Todo lo esencial para cuidar, consentir y acompañar a tus mascotas.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1800&q=85"
  },
  {
    slug: "tecnologia",
    label: "Tecnología",
    kicker: "Tecnología premium",
    title: "Tecnología para trabajar y disfrutar.",
    description: "Dispositivos, accesorios y gadgets elegidos para tu día a día.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1800&q=85"
  },
  {
    slug: "vestuario-hombre",
    label: "Vestuario hombre",
    kicker: "Moda hombre",
    title: "Prendas para todos los días.",
    description: "Básicos, favoritos de temporada y piezas cómodas para vestir mejor.",
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=1800&q=85"
  },
  {
    slug: "vestuario-mujer",
    label: "Vestuario mujer",
    kicker: "Moda mujer",
    title: "Estilo versátil para cada plan.",
    description: "Ropa, accesorios y favoritos para construir looks con facilidad.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1800&q=85"
  },
  {
    slug: "calzado",
    label: "Calzado",
    kicker: "Pisadas con estilo",
    title: "Calzado para moverte cómodo.",
    description: "Opciones urbanas, casuales y deportivas para completar tu outfit.",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1800&q=85"
  },
  {
    slug: "vehiculos",
    label: "Vehículos",
    kicker: "Movilidad y cuidado",
    title: "Accesorios para vehículos.",
    description: "Productos útiles para mantenimiento, viajes y comodidad en carretera.",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=85"
  },
  {
    slug: "electrodomesticos",
    label: "Electrodomésticos",
    kicker: "Casa eficiente",
    title: "Electrodomésticos para tu rutina.",
    description: "Equipos y soluciones para ahorrar tiempo y hacer más fácil cada tarea.",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=1800&q=85"
  },
  {
    slug: "deportes",
    label: "Deportes",
    kicker: "Entrena mejor",
    title: "Equipo para moverte con energía.",
    description: "Accesorios, ropa y productos para entrenar en casa o al aire libre.",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1800&q=85"
  },
  {
    slug: "herramientas",
    label: "Herramientas",
    kicker: "Hazlo fácil",
    title: "Herramientas para reparar y crear.",
    description: "Aliados prácticos para arreglos, proyectos y mantenimiento del hogar.",
    image: "https://images.unsplash.com/photo-1581147036324-c1c9a3c7c78d?auto=format&fit=crop&w=1800&q=85"
  },
  {
    slug: "temporada",
    label: "Temporada",
    kicker: "Ofertas de temporada",
    title: "Favoritos para el momento.",
    description: "Productos destacados para fechas especiales, promociones y novedades.",
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1800&q=85"
  }
];

const CATEGORY_BY_SLUG = new Map(
  CATEGORY_DEFINITIONS.map((category) => [category.slug, category])
);

const CART_STORAGE_KEY = "merkalatina:cart";
const WHATSAPP_NUMBER = "573044151020";

document.addEventListener("DOMContentLoaded", () => {
  renderCategoryPageShell();
  initMobileMenu();
  initHeaderScroll();
  initHeroSwiper();
  initSearch();
  initScrollReveal();
  initProducts().finally(() => {
    initCart();
  });
});

/* ------------------------------------------------------------------ */
/* Utilidades generales                                                */
/* ------------------------------------------------------------------ */
function getBasePath() {
  return document.body.dataset.basePath || "";
}

function getHomeUrl() {
  return getBasePath() ? "../index.html" : "index.html";
}

function getCategoryUrl(slug) {
  return getBasePath() ? `${slug}.html` : `pages/${slug}.html`;
}

function getCatalogUrl() {
  return `${getBasePath()}data/productos.json`;
}

function resolveAssetPath(path) {
  if (!path) return "";
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:") || path.startsWith("/")) {
    return path;
  }
  return `${getBasePath()}${path}`;
}

function getCategoryBySlug(slug) {
  return CATEGORY_BY_SLUG.get(slug) || null;
}

function formatCOP(value) {
  const amount = Number(value) || 0;
  return `$ ${amount.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return entities[character];
  });
}

function setProductsEmpty(isVisible, message) {
  const emptyState = document.querySelector("[data-products-empty]");
  if (!emptyState) return;
  if (message) emptyState.textContent = message;
  emptyState.hidden = !isVisible;
}

/* ------------------------------------------------------------------ */
/* Shell reutilizable para paginas de categoria                         */
/* ------------------------------------------------------------------ */
function renderCategoryPageShell() {
  const mount = document.querySelector("[data-category-shell]");
  if (!mount) return;

  const slug = document.body.dataset.category || "hogar";
  const category = getCategoryBySlug(slug) || CATEGORY_DEFINITIONS[0];
  const footerLinks = [
    ["tecnologia", "Tecnología"],
    ["hogar", "Hogar"],
    ["vestuario-mujer", "Moda mujer"],
    ["salud-belleza", "Belleza"],
    ["deportes", "Deportes"]
  ].map(([linkSlug, label]) => (
    `<a href="${getCategoryUrl(linkSlug)}">${label}</a>`
  )).join("");

  document.title = `${category.label} | MerkaLatina Colombia`;

  mount.innerHTML = `
    <header class="site-header" data-header>
      <div class="header-main">
        <a class="brand" href="${getHomeUrl()}" aria-label="Ir al inicio de MerkaLatina Colombia">
          <img class="brand-logo" src="${resolveAssetPath("assets/images/icons/logo-transparent.png")}" alt="MerkaLatina Colombia">
          <span class="brand-wordmark"><span class="brand-merka">MERKA</span><span class="brand-latina">LATINA</span></span>
        </a>

        <button class="menu-toggle" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="primary-navigation" data-menu-toggle>
          <i class="fa-solid fa-bars"></i>
        </button>

        <nav class="primary-nav" id="primary-navigation" aria-label="Menú principal" data-navigation></nav>

        <form class="header-search" role="search" aria-label="Buscar productos">
          <label class="sr-only" for="site-search">Buscar productos</label>
          <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          <input id="site-search" type="search" placeholder="Buscar en ${escapeHTML(category.label)}">
          <button type="submit" aria-label="Buscar">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </form>

        <div class="header-actions" role="group" aria-label="Acciones de usuario">
          <span class="header-flag" role="img" aria-label="Colombia" title="Colombia">
            <img src="https://flagcdn.com/w40/co.png" srcset="https://flagcdn.com/w80/co.png 2x" alt="Bandera de Colombia">
          </span>
          <a class="header-action" href="#" aria-label="Mi cuenta">
            <img class="action-icon" src="${resolveAssetPath("assets/images/icons/hero1.png")}" alt="">
            <span>Cuenta</span>
          </a>
          <button type="button" class="header-action cart-action" data-cart-open aria-label="Abrir carrito de compras" aria-haspopup="dialog">
            <img class="action-icon" src="${resolveAssetPath("assets/images/icons/hero2.png")}" alt="">
            <span>Carrito</span>
            <strong data-cart-count>0</strong>
          </button>
        </div>
      </div>
    </header>

    <main class="category-main">
      <section class="category-hero" style="background-image: url('${category.image}')" aria-label="${escapeHTML(category.label)}">
        <div class="category-hero-overlay"></div>
        <div class="category-hero-content">
          <span class="hero-kicker">${escapeHTML(category.kicker)}</span>
          <h1>${escapeHTML(category.title)}</h1>
          <p>${escapeHTML(category.description)}</p>
          <a class="hero-button" href="#catalogo">
            Ver productos
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </section>

      <section class="trust-strip" aria-label="Beneficios de comprar en MerkaLatina">
        <ul class="trust-list">
          <li class="trust-item">
            <i class="fa-solid fa-truck-fast" aria-hidden="true"></i>
            <div>
              <strong>Envío a toda Colombia</strong>
              <span>2 a 5 días hábiles</span>
            </div>
          </li>
          <li class="trust-item">
            <i class="fa-solid fa-hand-holding-dollar" aria-hidden="true"></i>
            <div>
              <strong>Pago contra entrega</strong>
              <span>Paga cuando recibes</span>
            </div>
          </li>
          <li class="trust-item">
            <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
            <div>
              <strong>Garantía de cambio</strong>
              <span>8 días para devoluciones</span>
            </div>
          </li>
          <li class="trust-item">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
            <div>
              <strong>Soporte por WhatsApp</strong>
              <span>Respuesta el mismo día</span>
            </div>
          </li>
        </ul>
      </section>

      <section class="products category-products" id="catalogo" aria-label="Productos de ${escapeHTML(category.label)}" data-product-section data-reveal>
        <div class="section-heading">
          <span class="section-kicker">${escapeHTML(category.label)}</span>
          <h2>Productos de ${escapeHTML(category.label)}</h2>
        </div>

        <p class="products-empty" data-products-empty hidden>
          No hay productos disponibles en esta categoría por ahora.
        </p>

        <div class="product-grid" data-product-grid data-product-mode="category" data-category="${escapeHTML(category.slug)}">
          <p class="products-loading" data-products-loading>Cargando productos...</p>
        </div>
      </section>

      <section class="cta-band" id="carrito" aria-label="Contacto y novedades" data-reveal>
        <div class="cta-content">
          <h2>Recibe ofertas antes que nadie</h2>
          <p>Escríbenos por WhatsApp para asesoría personalizada o déjanos tu correo para enterarte de las promociones.</p>
        </div>
        <div class="cta-actions">
          <a class="cta-whatsapp" href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
            Escribir por WhatsApp
          </a>
          <form class="cta-newsletter">
            <label class="sr-only" for="newsletter-email">Correo electrónico</label>
            <input id="newsletter-email" type="email" placeholder="tu@correo.com" required>
            <button type="submit">Suscribirme</button>
          </form>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <img class="brand-logo footer-logo" src="${resolveAssetPath("assets/images/icons/logo-transparent.png")}" alt="MerkaLatina Colombia">
          <p>Marketplace colombiano de tecnología, hogar, moda, belleza y deportes.</p>
          <div class="footer-social">
            <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
            <a href="https://wa.me/${WHATSAPP_NUMBER}" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
            <a href="#" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
          </div>
        </div>

        <nav class="footer-column" aria-label="Categorías">
          <h3>Categorías</h3>
          ${footerLinks}
        </nav>

        <nav class="footer-column" aria-label="Ayuda">
          <h3>Ayuda</h3>
          <a href="${getBasePath()}pages/quienes-somos.html">Quiénes somos</a>
          <a href="#">Estado de mi pedido</a>
          <a href="#">Cambios y devoluciones</a>
          <a href="#">Medios de pago</a>
          <a href="#">Preguntas frecuentes</a>
        </nav>

        <div class="footer-column">
          <h3>Pagos aceptados</h3>
          <div class="footer-payments" role="img" aria-label="Métodos de pago aceptados">
            <i class="fa-brands fa-cc-visa" aria-hidden="true"></i>
            <i class="fa-brands fa-cc-mastercard" aria-hidden="true"></i>
            <i class="fa-solid fa-money-bill-wave" aria-hidden="true"></i>
            <i class="fa-solid fa-truck" aria-hidden="true"></i>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 MerkaLatina Colombia. Todos los derechos reservados.</p>
      </div>
    </footer>

    <div class="cart-overlay" data-cart-overlay hidden></div>

    <aside class="cart-drawer" data-cart-drawer inert aria-label="Carrito de compras">
      <div class="cart-drawer-header">
        <h2><i class="fa-solid fa-bag-shopping" aria-hidden="true"></i> Tu carrito</h2>
        <button type="button" class="cart-close" data-cart-close aria-label="Cerrar carrito">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="cart-drawer-body" data-cart-view>
        <ul class="cart-items" data-cart-items></ul>
        <p class="cart-empty" data-cart-empty hidden>
          Tu carrito está vacío. Explora las <a href="${getCategoryUrl("hogar")}" data-cart-close-link>categorías</a>.
        </p>
      </div>

      <div class="cart-drawer-footer" data-cart-footer hidden>
        <div class="cart-total-row">
          <span>Total</span>
          <strong data-cart-total>$ 0</strong>
        </div>
        <button type="button" class="cart-checkout-btn" data-open-checkout>
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Finalizar por WhatsApp
        </button>
      </div>

      <form class="checkout-form" data-checkout-form hidden novalidate>
        <button type="button" class="checkout-back" data-checkout-back>
          <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Volver al carrito
        </button>
        <h3>Datos de entrega</h3>

        <label class="checkout-field">
          Nombre completo
          <input type="text" name="nombre" autocomplete="name" required>
        </label>
        <label class="checkout-field">
          Teléfono / WhatsApp
          <input type="tel" name="telefono" autocomplete="tel" pattern="[0-9]{10}" maxlength="10" placeholder="3001234567" title="Ingresa 10 dígitos, sin espacios ni guiones" required>
        </label>
        <label class="checkout-field">
          Ciudad
          <input type="text" name="ciudad" autocomplete="address-level2" required>
        </label>
        <label class="checkout-field">
          Dirección completa
          <input type="text" name="direccion" autocomplete="address-line1" required>
        </label>
        <label class="checkout-field">
          Notas para la entrega (opcional)
          <textarea name="notas" rows="2"></textarea>
        </label>

        <p class="checkout-note">
          Pagas en efectivo cuando recibes tu pedido. Al enviar, se abrirá WhatsApp con el resumen para confirmar.
        </p>

        <button type="submit" class="checkout-submit">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Enviar pedido por WhatsApp
        </button>
      </form>
    </aside>
  `;
}

/* ------------------------------------------------------------------ */
/* Catalogo de productos                                               */
/* ------------------------------------------------------------------ */
async function initProducts() {
  const grid = document.querySelector("[data-product-grid]");
  if (!grid) return;

  try {
    const response = await fetch(getCatalogUrl());
    if (!response.ok) throw new Error("No se pudo cargar el catalogo");

    const products = await response.json();
    const selectedProducts = selectProductsForCurrentPage(products, grid);
    renderProducts(grid, selectedProducts);
  } catch (error) {
    grid.innerHTML = `
      <p class="products-loading">
        No pudimos cargar el catálogo. Usa un servidor local o publica el sitio para permitir la carga de productos.json.
      </p>
    `;
    console.error(error);
  }
}

function selectProductsForCurrentPage(products, grid) {
  const mode = grid.dataset.productMode || "recommended";
  const category = grid.dataset.category || document.body.dataset.category || "";

  if (mode === "category" && category) {
    return products.filter((product) => product.category === category);
  }

  const recommended = products.filter(
    (product) => product.featured === true || product.recommended === true
  );

  return (recommended.length ? recommended : products).slice(0, 8);
}

function renderProducts(grid, products) {
  if (!products.length) {
    grid.innerHTML = "";
    setProductsEmpty(true, "No hay productos disponibles en esta categoría por ahora.");
    return;
  }

  setProductsEmpty(false);

  grid.innerHTML = products
    .map((product) => {
      const category = getCategoryBySlug(product.category);
      const categoryLabel = category?.label || product.category || "";
      const badgeText = product.badge || (product.oldPrice ? "Oferta" : "");
      const badgeHtml = badgeText
        ? `<span class="product-badge${badgeText.includes("%") ? " product-badge-offer" : ""}">${escapeHTML(badgeText)}</span>`
        : "";
      const searchText = [
        product.name,
        product.description,
        categoryLabel
      ].filter(Boolean).join(" ");

      return `
        <article class="product-card" data-product-name="${escapeHTML(product.name)}" data-product-price="${Number(product.price) || 0}" data-product-category="${escapeHTML(product.category || "")}" data-product-search="${escapeHTML(searchText)}">
          ${badgeHtml}
          <img src="${escapeHTML(resolveAssetPath(product.image))}" alt="${escapeHTML(product.name)}" loading="lazy">
          <div class="product-body">
            <h3>${escapeHTML(product.name)}</h3>
            <p class="product-price">${formatCOP(product.price)}</p>
            <button type="button" class="product-add" data-add-to-cart>Agregar al carrito</button>
          </div>
        </article>
      `;
    })
    .join("");

  const searchInput = document.getElementById("site-search");
  const currentQuery = searchInput?.value.trim();
  if (currentQuery) applyProductSearch(currentQuery);
}

/* ------------------------------------------------------------------ */
/* Menu movil                                                          */
/* ------------------------------------------------------------------ */
function initMobileMenu() {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-navigation]");
  if (!menuToggle || !navigation) return;

  const icon = menuToggle.querySelector("i");

  const setOpen = (isOpen) => {
    navigation.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    if (icon) {
      icon.classList.toggle("fa-bars", !isOpen);
      icon.classList.toggle("fa-xmark", isOpen);
    }
  };

  menuToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!navigation.classList.contains("is-open"));
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("click", (event) => {
    const clickedInside = navigation.contains(event.target) || menuToggle.contains(event.target);
    if (!clickedInside) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1120) setOpen(false);
  });
}

/* ------------------------------------------------------------------ */
/* Header que cambia de estilo al hacer scroll                         */
/* ------------------------------------------------------------------ */
function initHeaderScroll() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  let ticking = false;

  const updateHeaderState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 80);
    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateHeaderState);
      ticking = true;
    }
  };

  updateHeaderState();
  window.addEventListener("scroll", requestTick, { passive: true });
}

/* ------------------------------------------------------------------ */
/* Carrusel principal (Swiper)                                         */
/* ------------------------------------------------------------------ */
function initHeroSwiper() {
  const heroSwiperElement = document.querySelector("[data-hero-swiper]");
  if (!heroSwiperElement || typeof window.Swiper === "undefined") return;

  new Swiper(heroSwiperElement, {
    loop: true,
    speed: 850,
    effect: "slide",
    autoplay: {
      delay: 4200,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    navigation: {
      nextEl: ".hero-nav-next",
      prevEl: ".hero-nav-prev"
    },
    keyboard: {
      enabled: true
    },
    a11y: {
      enabled: true,
      prevSlideMessage: "Banner anterior",
      nextSlideMessage: "Banner siguiente"
    }
  });
}

/* ------------------------------------------------------------------ */
/* Buscador del header                                                  */
/* ------------------------------------------------------------------ */
function initSearch() {
  const form = document.querySelector(".header-search");
  const input = document.getElementById("site-search");
  if (!form || !input) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    applyProductSearch(input.value.trim());
    document
      .querySelector("[data-product-section]")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  input.addEventListener("input", () => {
    if (!input.value.trim()) applyProductSearch("");
  });
}

function applyProductSearch(query) {
  const cards = document.querySelectorAll("[data-product-name]");
  const normalizedQuery = normalizeText(query);

  if (!cards.length) {
    setProductsEmpty(true, "No hay productos disponibles en esta categoría por ahora.");
    return false;
  }

  if (!normalizedQuery) {
    cards.forEach((card) => {
      card.style.display = "";
    });
    setProductsEmpty(false);
    return true;
  }

  let anyMatch = false;

  cards.forEach((card) => {
    const text = normalizeText(card.dataset.productSearch || card.dataset.productName);
    const matches = text.includes(normalizedQuery);
    card.style.display = matches ? "" : "none";
    if (matches) anyMatch = true;
  });

  setProductsEmpty(!anyMatch, "No encontramos productos relacionados con tu búsqueda.");
  return anyMatch;
}

/* ------------------------------------------------------------------ */
/* Carrito de compras                                                   */
/* ------------------------------------------------------------------ */
function initCart() {
  const cartCountEl = document.querySelector("[data-cart-count]");
  const cartOpenBtn = document.querySelector("[data-cart-open]");
  const cartCloseBtn = document.querySelector("[data-cart-close]");
  const cartOverlay = document.querySelector("[data-cart-overlay]");
  const cartDrawer = document.querySelector("[data-cart-drawer]");
  const cartItemsEl = document.querySelector("[data-cart-items]");
  const cartEmptyEl = document.querySelector("[data-cart-empty]");
  const cartFooterEl = document.querySelector("[data-cart-footer]");
  const cartTotalEl = document.querySelector("[data-cart-total]");
  const openCheckoutBtn = document.querySelector("[data-open-checkout]");
  const checkoutForm = document.querySelector("[data-checkout-form]");
  const checkoutBackBtn = document.querySelector("[data-checkout-back]");
  const cartView = document.querySelector("[data-cart-view]");
  const productGrid = document.querySelector("[data-product-grid]");

  if (!cartDrawer || !cartItemsEl) return;

  const setDrawerA11yState = (isOpen) => {
    cartDrawer.toggleAttribute("inert", !isOpen);
    cartDrawer.setAttribute("aria-hidden", String(!isOpen));
  };

  setDrawerA11yState(false);

  const readCart = () => {
    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  };

  const writeCart = (items) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    render(items);
  };

  const render = (items) => {
    const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    if (cartCountEl) cartCountEl.textContent = String(totalUnits);
    if (cartTotalEl) cartTotalEl.textContent = formatCOP(totalPrice);

    const isEmpty = items.length === 0;
    if (cartEmptyEl) cartEmptyEl.hidden = !isEmpty;
    if (cartFooterEl) cartFooterEl.hidden = isEmpty;

    cartItemsEl.innerHTML = "";
    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <img src="${escapeHTML(item.image)}" alt="" class="cart-item-image">
        <div class="cart-item-info">
          <p class="cart-item-name">${escapeHTML(item.name)}</p>
          <p class="cart-item-price">${formatCOP(item.price)}</p>
          <div class="cart-item-qty">
            <button type="button" class="qty-btn" data-qty-decrease="${index}" aria-label="Quitar una unidad">-</button>
            <span>${item.quantity}</span>
            <button type="button" class="qty-btn" data-qty-increase="${index}" aria-label="Agregar una unidad">+</button>
          </div>
        </div>
        <button type="button" class="cart-item-remove" data-remove-item="${index}" aria-label="Eliminar ${escapeHTML(item.name)}">
          <i class="fa-solid fa-trash" aria-hidden="true"></i>
        </button>
      `;
      cartItemsEl.appendChild(li);
    });
  };

  cartItemsEl.addEventListener("click", (event) => {
    const items = readCart();
    const increaseBtn = event.target.closest("[data-qty-increase]");
    const decreaseBtn = event.target.closest("[data-qty-decrease]");
    const removeBtn = event.target.closest("[data-remove-item]");

    if (increaseBtn) {
      const index = Number(increaseBtn.dataset.qtyIncrease);
      if (!items[index]) return;
      items[index].quantity += 1;
      writeCart(items);
    } else if (decreaseBtn) {
      const index = Number(decreaseBtn.dataset.qtyDecrease);
      if (!items[index]) return;
      items[index].quantity -= 1;
      if (items[index].quantity <= 0) items.splice(index, 1);
      writeCart(items);
    } else if (removeBtn) {
      const index = Number(removeBtn.dataset.removeItem);
      if (!items[index]) return;
      items.splice(index, 1);
      writeCart(items);
    }
  });

  productGrid?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add-to-cart]");
    if (!button) return;

    const card = button.closest("[data-product-name]");
    if (!card) return;

    const name = card.dataset.productName;
    const price = Number(card.dataset.productPrice || 0);
    const image = card.querySelector("img")?.src || "";
    const items = readCart();
    const existing = items.find((item) => item.name === name);

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ name, price, image, quantity: 1 });
    }

    writeCart(items);

    const originalText = button.textContent;
    button.textContent = "Agregado";
    button.disabled = true;
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 900);
  });

  const openDrawer = () => {
    cartDrawer.classList.add("is-open");
    cartOverlay.hidden = false;
    requestAnimationFrame(() => cartOverlay.classList.add("is-visible"));
    setDrawerA11yState(true);
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    cartDrawer.classList.remove("is-open");
    cartOverlay.classList.remove("is-visible");
    setDrawerA11yState(false);
    document.body.style.overflow = "";
    showCartView();
    setTimeout(() => {
      if (!cartDrawer.classList.contains("is-open")) cartOverlay.hidden = true;
    }, 300);
  };

  const showCheckoutView = () => {
    cartView.hidden = true;
    cartFooterEl.hidden = true;
    checkoutForm.hidden = false;
  };

  const showCartView = () => {
    cartView.hidden = false;
    checkoutForm.hidden = true;
    const items = readCart();
    if (cartFooterEl) cartFooterEl.hidden = items.length === 0;
  };

  cartOpenBtn?.addEventListener("click", openDrawer);
  cartCloseBtn?.addEventListener("click", closeDrawer);
  cartOverlay?.addEventListener("click", closeDrawer);
  document.querySelector("[data-cart-close-link]")?.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && cartDrawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });

  openCheckoutBtn?.addEventListener("click", showCheckoutView);
  checkoutBackBtn?.addEventListener("click", showCartView);

  checkoutForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const items = readCart();
    if (!items.length) return;

    const formData = new FormData(checkoutForm);
    const nombre = formData.get("nombre")?.toString().trim();
    const telefono = formData.get("telefono")?.toString().trim();
    const ciudad = formData.get("ciudad")?.toString().trim();
    const direccion = formData.get("direccion")?.toString().trim();
    const notas = formData.get("notas")?.toString().trim();

    if (!nombre || !telefono || !ciudad || !direccion) return;

    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const lines = [
      "Hola, quiero confirmar este pedido de MerkaLatina Colombia:",
      "",
      ...items.map(
        (item) => `- ${item.name} x${item.quantity} - ${formatCOP(item.price * item.quantity)}`
      ),
      "",
      `Total: ${formatCOP(total)}`,
      "",
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono}`,
      `Ciudad: ${ciudad}`,
      `Dirección: ${direccion}`
    ];

    if (notas) lines.push(`Notas: ${notas}`);
    lines.push("", "Pago contra entrega.");

    const message = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank", "noopener");

    writeCart([]);
    checkoutForm.reset();
    closeDrawer();
  });

  render(readCart());
}

/* ------------------------------------------------------------------ */
/* Animacion de aparicion al hacer scroll                              */
/* ------------------------------------------------------------------ */
function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}
