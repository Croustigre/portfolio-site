/* Portfolio — behaviour layer. No dependencies.
   1. Proportional scaling between 768 and 1279 px (refines the CSS vw rule
      using clientWidth so the scrollbar never causes horizontal overflow).
   2. Header turns solid once the hero is scrolled past.
   3. Projects: hovering a list item slides its image in (right→left when the
      hovered project is below the current one, left→right when above).
   4. Projects / extracurricular items open a detail sheet (overlay).
*/
(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Always open on the hero -------------------------------------- */
  // Browsers restore the previous scroll position on reload, and a URL left
  // with #projects (from the "View my projects" button) jumps to that section.
  // Both are cancelled so every page load starts at the top, on the hero.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  // On iPhone and iPad the page scrolls inside <body> (see styles.css).
  const toTop = () => { window.scrollTo(0, 0); document.body.scrollTop = 0; };
  toTop();
  window.addEventListener("load", toTop);
  window.addEventListener("pageshow", (e) => { if (e.persisted) toTop(); });

  /* ---------- 0. Hero name: both lines share the same left and right edge -- */
  // "ESTEBAN" and "LOUBERE" have different natural widths. Each line gets its
  // own letter-spacing so both reach the same width (the average of the two
  // at the base tracking), i.e. E/L align on the left and N/E on the right.
  // Values are set in em, so they stay valid when the layout scales.
  const heroName = document.getElementById("hero-name");
  const nameLines = heroName ? Array.from(heroName.querySelectorAll(".hero-name__line")) : [];
  const MIN_TRACKING = -0.025;   // em
  function justifyHeroName() {
    if (nameLines.length < 2) return;
    const cs = getComputedStyle(heroName);
    const fontSize = parseFloat(cs.fontSize);
    const base = parseFloat(cs.letterSpacing) || 0;          // px, e.g. -5 at 100px
    nameLines.forEach((l) => { l.style.letterSpacing = "0px"; });
    const advance = nameLines.map((l) => l.getBoundingClientRect().width);
    const gaps = nameLines.map((l) => Math.max(1, l.textContent.trim().length - 1));
    const visible = advance.map((a, i) => a + gaps[i] * base);
    // Never track a line tighter than MIN_TRACKING: below that, the heavy
    // letters of the wider line (ESTEBAN) touch. The other line is opened up
    // instead, so both edges still align.
    const minPx = MIN_TRACKING * fontSize;
    const average = visible.reduce((sum, v) => sum + v, 0) / visible.length;
    const floor = Math.max(...advance.map((a, i) => a + gaps[i] * minPx));
    const target = Math.max(average, floor);
    nameLines.forEach((l, i) => {
      const ls = (target - advance[i]) / gaps[i];
      l.style.letterSpacing = (ls / fontSize).toFixed(4) + "em";
    });
  }
  if (heroName) {
    justifyHeroName();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(justifyHeroName);
  }

  /* ---------- 1. Scaling ------------------------------------------------- */
  // The 1280 × 832 frame is scaled to fit the viewport (same proportions as
  // the Figma frame in full screen). Uses clientWidth so a scrollbar never
  // causes horizontal overflow. Below 768 px the mobile layout takes over.
  // Height used for the scale: the "small" viewport height (100svh), i.e. the
  // height with the browser toolbar shown. On iPad and iPhone the toolbar
  // retracts while scrolling, which changes innerHeight; scaling on it made the
  // whole page jump. 100svh does not change while scrolling.
  const svhProbe = document.createElement("div");
  svhProbe.setAttribute("aria-hidden", "true");
  svhProbe.style.cssText = "position:fixed;top:0;left:0;width:0;height:100vh;height:100svh;visibility:hidden;pointer-events:none;";
  document.body.appendChild(svhProbe);
  function stableHeight() {
    return svhProbe.offsetHeight || window.innerHeight;
  }
  const isComputer = window.matchMedia("(hover: hover) and (pointer: fine)");
  function applyScale() {
    const root = document.documentElement;
    // body.clientWidth excludes a reserved scrollbar gutter, so the frame
    // stays centred when scrollbars are always shown.
    const w = Math.min(root.clientWidth, document.body.clientWidth || root.clientWidth);
    const h = stableHeight();
    if (w >= 768) {
      let scale = Math.min(w / 128, h / 83.2);
      // Computer only (mouse or trackpad): when the height limits the scale,
      // enlarge everything so the sheet gains 1 grid square (4rem) on each
      // side, as on iPad. Never wider than the 1280 frame (60 px gutters).
      if (isComputer.matches) {
        const visible = w / scale;                 // window width in rem
        scale = Math.min(w / 128, w / Math.max(128, visible - 8));
      }
      // Floor of 6.5 px for very short windows, but never wider than the
      // window: below 832 px wide (iPad portrait) the frame used to overflow
      // on the right and the page was off-centre.
      scale = Math.min(w / 128, Math.max(6.5, scale));
      root.style.fontSize = scale.toFixed(3) + "px";
      // The enlarged frame can be taller than the window: the hero is then cut
      // to the window height, its content moving up so its bottom stays visible.
      if (isComputer.matches && 83.2 * scale > h + 0.5) root.style.setProperty("--hero-h", h + "px");
      else root.style.removeProperty("--hero-h");
      // Background grid anchored on the sheet: 29 squares across its real
      // (pixel-rounded) width, first line on its left edge. Both edges then
      // sit on a grid line and the margins are symmetric.
      const sheet = document.querySelector("#projects .sheet");
      if (sheet) {
        const r = sheet.getBoundingClientRect();
        const size = (r.width - 1) / 29;   // last line on the 1 px right border
        root.style.setProperty("--grid-size", size.toFixed(4) + "px");
        root.style.setProperty("--grid-x", (((r.left % size) + size) % size).toFixed(3) + "px");
      }
    } else {
      root.style.fontSize = "";
      root.style.removeProperty("--hero-h");
      root.style.removeProperty("--grid-size");
      root.style.removeProperty("--grid-x");
    }
  }
  applyScale();
  window.addEventListener("resize", applyScale);
  window.addEventListener("orientationchange", applyScale);

  /* ---------- 2. Header state (scroll-linked) ---------------------------- */
  // Over the hero only "[ Resume ]" is shown. The liquid-glass band and the
  // logo fade in progressively while the bottom of the hero travels through
  // the last 30 % of its height, and are fully present once the next section
  // reaches the top of the viewport.
  const header = document.querySelector(".site-header");
  const hero = document.getElementById("home");
  if (header && hero) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = hero.getBoundingClientRect();
      const range = Math.max(1, rect.height * 0.3);
      const p = Math.min(1, Math.max(0, (range - rect.bottom) / range));
      header.style.setProperty("--p", p.toFixed(3));
      header.classList.toggle("is-solid", p > 0.001);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.body.addEventListener("scroll", onScroll, { passive: true });   // iPhone / iPad
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ---------- 3. Projects: list + sliding visual ------------------------- */
  const list = document.getElementById("project-list");
  const visual = document.getElementById("project-visual");
  const links = list ? Array.from(list.querySelectorAll(".project-link")) : [];
  let currentIndex = -1;

  function buildVisual(link) {
    const item = document.createElement("div");
    item.className = "project-visual__item";
    const src = link.dataset.image;
    if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      item.appendChild(img);
      if (link.dataset.credit) {
        const credit = document.createElement("span");
        credit.className = "project-visual__credit";
        credit.textContent = link.dataset.credit;
        item.appendChild(credit);
      }
    } else {
      const label = document.createElement("span");
      label.className = "project-visual__label";
      label.textContent = link.querySelector("strong").textContent + " — image";
      item.appendChild(label);
    }
    return item;
  }

  function setActive(index) {
    if (!visual || index === currentIndex || !links[index]) return;
    const direction = index > currentIndex ? 1 : -1; // 1 = new image comes from the right
    const previousIndex = currentIndex;
    currentIndex = index;

    links.forEach((l, i) => l.classList.toggle("is-active", i === index));

    // Drop any item still animating out so quick hovers never stack up.
    visual.querySelectorAll(".project-visual__item:not(.is-current)").forEach((n) => n.remove());

    const current = visual.querySelector(".project-visual__item.is-current");
    const next = buildVisual(links[index]);

    if (!current || previousIndex === -1 || reducedMotion.matches) {
      if (current) current.remove();
      next.classList.add("is-current");
      visual.appendChild(next);
      return;
    }

    next.style.transform = `translateX(${direction > 0 ? 100 : -100}%)`;
    visual.appendChild(next);
    void next.offsetWidth; // force a reflow so the transition starts from the offset

    next.classList.add("is-current");
    next.style.transform = "translateX(0)";
    current.classList.remove("is-current");
    current.style.transform = `translateX(${direction > 0 ? -100 : 100}%)`;
    current.addEventListener("transitionend", () => current.remove(), { once: true });
  }

  // Phone: one thumbnail per project, shown as a 2-column grid of cards
  // (hidden on desktop by CSS, where the large hover visual is used instead).
  links.forEach((link) => {
    if (!link.dataset.image) return;
    const fig = document.createElement("span");
    fig.className = "project-card__img";
    const img = document.createElement("img");
    img.src = link.dataset.image;
    img.alt = "";
    img.loading = "lazy";
    fig.appendChild(img);
    if (link.dataset.credit) {
      const credit = document.createElement("span");
      credit.className = "project-card__credit";
      credit.textContent = link.dataset.credit;
      fig.appendChild(credit);
    }
    link.prepend(fig);
  });

  links.forEach((link, i) => {
    link.addEventListener("mouseenter", () => setActive(i));
    link.addEventListener("focus", () => setActive(i));
    link.addEventListener("click", () => {
      setActive(i);
      openOverlay(link.parentElement.querySelector(".project-detail"), link);
    });
  });
  if (links.length) setActive(0); // mock default: Project 1 active

  /* ---------- 4. Overlay ------------------------------------------------- */
  const overlay = document.getElementById("overlay");
  const overlayContent = document.getElementById("overlay-content");
  const overlayClose = document.getElementById("overlay-close");
  let lastTrigger = null;

  function openOverlay(detail, trigger) {
    if (!overlay || !detail) return;
    lastTrigger = trigger || document.activeElement;
    overlayContent.innerHTML = detail.innerHTML;
    const title = overlayContent.querySelector(".detail__title");
    if (title) title.id = "overlay-title";
    overlay.classList.add("is-open");
    document.body.classList.add("has-overlay");
    // Reset scroll only once the panel is displayed: browsers ignore scrollTop
    // on a display:none element, so the previous sheet's position would persist.
    overlayContent.scrollTop = 0;
    overlayClose.focus({ preventScroll: true });
    requestAnimationFrame(() => { overlayContent.scrollTop = 0; });
  }

  function closeOverlay() {
    if (!overlay || !overlay.classList.contains("is-open")) return;
    overlayContent.scrollTop = 0;
    overlay.classList.remove("is-open");
    document.body.classList.remove("has-overlay");
    overlayContent.innerHTML = "";
    if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus();
    lastTrigger = null;
  }

  if (overlay) {
    overlayClose.addEventListener("click", closeOverlay);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeOverlay(); // click outside the panel
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeOverlay();
    });
    // Keep keyboard focus inside the dialog while it is open.
    overlay.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const focusable = overlay.querySelectorAll(
        'button, [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  // Extracurricular: the whole text cell is clickable; the button inside the
  // heading gives keyboard users the same entry point.
  document.querySelectorAll(".ext-cell--text").forEach((cell) => {
    const btn = cell.querySelector(".ext-link");
    cell.addEventListener("click", () => {
      openOverlay(cell.querySelector(".ext-detail"), btn);
    });
  });
})();
