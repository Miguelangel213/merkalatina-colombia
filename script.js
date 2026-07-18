/**
 * MerkaLatina Colombia — script.js
 * Menú móvil, header dinámico, carrusel hero, buscador y carrito de compras.
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initHeaderScroll();
  initHeroSwiper();
  initSearch();
  initScrollReveal();
  initProducts().finally(initCart);
});

/* ------------------------------------------------------------------ */
/* Catalogo de productos (cargado desde data/productos.json)           */
/* ------------------------------------------------------------------ */
async function initProducts() {
  const grid = document.querySelector("[data-product-grid]");
  if (!grid) return;

  const currencyFormatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  });

  try {
    const response = await fetch("data/productos.json");
    if (!response.ok) throw new Error("No se pudo cargar el catalogo");
    const products = await response.json();

    grid.innerHTML = products
      .map((product) => {
        const badgeClass = product.badge === "-20%" ? "product-badge product-badge-offer" : "product-badge";
        const badgeHtml = product.badge
          ? `<span class="${badgeClass}">${product.badge}</span>`
          : "";

        return `
          <article class="product-card" data-product-name="${product.name}" data-product-price="${product.price}">
            ${badgeHtml}
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-body">
              <h3>${product.name}</h3>
              <p class="product-price">${currencyFormatter.format(product.price)}</p>
              <button type="button" class="product-add" data-add-to-cart>Agregar al carrito</button>
            </div>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    grid.innerHTML = `
      <p class="products-loading">
        No pudimos cargar el catalogo. Si estas viendo el sitio abriendo el archivo
        directamente (file://), usa un servidor local (ej. la extension Live Server
        de VS Code) o publica el sitio; los navegadores bloquean la carga de
        productos.json cuando se abre el HTML directamente.
      </p>
    `;
    console.error(error);
  }
}

/* ------------------------------------------------------------------ */
/* Menú móvil                                                          */
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
    const isOpen = !navigation.classList.contains("is-open");
    setOpen(isOpen);
  });

  // Cierra el menú al elegir una opción (evita quedar "atascado" en móvil)
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  // Cierra al hacer clic fuera del menú
  document.addEventListener("click", (event) => {
    const clickedInside =
      navigation.contains(event.target) || menuToggle.contains(event.target);
    if (!clickedInside) setOpen(false);
  });

  // Cierra con la tecla Escape (accesibilidad)
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  // Si el usuario agranda la ventana, evita que el menú quede abierto
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
    const query = input.value.trim();
    if (!query) return;

    // Filtra las tarjetas de producto visibles en la página por nombre
    const cards = document.querySelectorAll("[data-product-name]");
    if (!cards.length) return;

    const normalized = query.toLowerCase();
    let anyMatch = false;

    cards.forEach((card) => {
      const name = card.dataset.productName.toLowerCase();
      const matches = name.includes(normalized);
      card.style.display = matches ? "" : "none";
      if (matches) anyMatch = true;
    });

    const emptyState = document.querySelector("[data-products-empty]");
    if (emptyState) emptyState.hidden = anyMatch;

    document
      .getElementById("productos")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/* ------------------------------------------------------------------ */
/* Carrito de compras (panel lateral + checkout por WhatsApp)          */
/* ------------------------------------------------------------------ */
const CART_STORAGE_KEY = "merkalatina:cart";

// Cambia este numero por el WhatsApp real del negocio (formato: codigo pais + numero, sin +)
const WHATSAPP_NUMBER = "573000000000";

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

  const currencyFormatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  });

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
    if (cartTotalEl) cartTotalEl.textContent = currencyFormatter.format(totalPrice);

    const isEmpty = items.length === 0;
    if (cartEmptyEl) cartEmptyEl.hidden = !isEmpty;
    if (cartFooterEl) cartFooterEl.hidden = isEmpty;

    cartItemsEl.innerHTML = "";
    items.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <img src="${item.image}" alt="" class="cart-item-image">
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">${currencyFormatter.format(item.price)}</p>
          <div class="cart-item-qty">
            <button type="button" class="qty-btn" data-qty-decrease="${index}" aria-label="Quitar una unidad">−</button>
            <span>${item.quantity}</span>
            <button type="button" class="qty-btn" data-qty-increase="${index}" aria-label="Agregar una unidad">+</button>
          </div>
        </div>
        <button type="button" class="cart-item-remove" data-remove-item="${index}" aria-label="Eliminar ${item.name}">
          <i class="fa-solid fa-trash" aria-hidden="true"></i>
        </button>
      `;
      cartItemsEl.appendChild(li);
    });
  };

  // Delegacion de eventos para +/- y eliminar (los botones se recrean en cada render)
  cartItemsEl.addEventListener("click", (event) => {
    const items = readCart();

    const increaseBtn = event.target.closest("[data-qty-increase]");
    const decreaseBtn = event.target.closest("[data-qty-decrease]");
    const removeBtn = event.target.closest("[data-remove-item]");

    if (increaseBtn) {
      const idx = Number(increaseBtn.dataset.qtyIncrease);
      items[idx].quantity += 1;
      writeCart(items);
    } else if (decreaseBtn) {
      const idx = Number(decreaseBtn.dataset.qtyDecrease);
      items[idx].quantity -= 1;
      if (items[idx].quantity <= 0) items.splice(idx, 1);
      writeCart(items);
    } else if (removeBtn) {
      const idx = Number(removeBtn.dataset.removeItem);
      items.splice(idx, 1);
      writeCart(items);
    }
  });

  // Agregar producto desde las tarjetas (delegado: las tarjetas se generan
  // dinamicamente desde productos.json, asi que un listener por boton no sirve)
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
    button.textContent = "Agregado ✓";
    button.disabled = true;
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 900);
  });

  /* --- Abrir / cerrar el panel --- */
  const openDrawer = () => {
    cartDrawer.classList.add("is-open");
    cartOverlay.hidden = false;
    requestAnimationFrame(() => cartOverlay.classList.add("is-visible"));
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    cartDrawer.classList.remove("is-open");
    cartOverlay.classList.remove("is-visible");
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    showCartView();
    setTimeout(() => {
      if (!cartDrawer.classList.contains("is-open")) cartOverlay.hidden = true;
    }, 300);
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

  /* --- Alternar entre vista de carrito y formulario de checkout --- */
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

  openCheckoutBtn?.addEventListener("click", showCheckoutView);
  checkoutBackBtn?.addEventListener("click", showCartView);

  /* --- Envio del pedido por WhatsApp --- */
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
        (item) =>
          `• ${item.name} x${item.quantity} — ${currencyFormatter.format(item.price * item.quantity)}`
      ),
      "",
      `Total: ${currencyFormatter.format(total)}`,
      "",
      `Nombre: ${nombre}`,
      `Telefono: ${telefono}`,
      `Ciudad: ${ciudad}`,
      `Direccion: ${direccion}`
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
/* Animación de aparición al hacer scroll (respeta reduced-motion)     */
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