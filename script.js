/**
 * MerkaLatina Colombia — script.js
 * Menú móvil, header dinámico, carrusel hero, buscador y carrito de compras.
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initHeaderScroll();
  initHeroSwiper();
  initSearch();
  initCart();
  initScrollReveal();
});

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
/* Carrito de compras (persistido en localStorage)                     */
/* ------------------------------------------------------------------ */
const CART_STORAGE_KEY = "merkalatina:cart";

function initCart() {
  const cartCountEl = document.querySelector("[data-cart-count]");
  const addButtons = document.querySelectorAll("[data-add-to-cart]");

  const readCart = () => {
    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  };

  const writeCart = (items) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    updateCartBadge(items);
  };

  const updateCartBadge = (items) => {
    if (!cartCountEl) return;
    const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = String(totalUnits);
  };

  addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-product-name]");
      if (!card) return;

      const name = card.dataset.productName;
      const price = Number(card.dataset.productPrice || 0);
      const items = readCart();
      const existing = items.find((item) => item.name === name);

      if (existing) {
        existing.quantity += 1;
      } else {
        items.push({ name, price, quantity: 1 });
      }

      writeCart(items);

      // Retroalimentación visual breve en el botón
      const originalText = button.textContent;
      button.textContent = "Agregado ✓";
      button.disabled = true;
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 900);
    });
  });

  updateCartBadge(readCart());
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