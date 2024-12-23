const el = (sel, par) => (par || document).querySelector(sel);
const els = (sel, par) => (par || document).querySelectorAll(sel);
const elNew = (tag, prop) => Object.assign(document.createElement(tag), prop);

const mod = (n, m) => (n % m + m) % m;

const carousel = (elCarousel) => {

  const animation = 500;
  const pause = 5000;

  const elCarouselSlider = el(".carousel-slider", elCarousel); 
  const elsSlides = els(".carousel-slide", elCarouselSlider);
  const elsBtns = [];

  let itv;
  let tot = elsSlides.length;
  let c = 0;

  if (tot < 2) return;

  const anim = (ms = animation) => {
    const cMod = mod(c, tot);
    elCarouselSlider.style.transitionDuration = `${ms}ms`;
    elCarouselSlider.style.transform = `translateX(${(-c - 1) * 100}%)`;
    elsSlides.forEach((elSlide, i) => elSlide.classList.toggle("is-active", cMod === i));
    elsBtns.forEach((elBtn, i) => elBtn.classList.toggle("is-active", cMod === i));
  };

  const prev = () => {
    if (c <= -1) return;
    c -= 1;
    anim();
  };

  const next = () => {
    if (c >= tot) return;
    c += 1;
    anim();
  };

  const goto = (index) => {
    c = index;
    anim();
  };

  const play = () => { 
    itv = setInterval(next, pause + animation);
  };

  const stop = () => {
    clearInterval(itv);
  };

  const elPrev = elNew("div", {
    className: "carousel-prev",
    innerHTML: `<svg class="prev-icon" xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#FFFFFF"><path d="m480-320 56-56-64-64h168v-80H472l64-64-56-56-160 160 160 160Zm0 240q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>`,
    onclick: () => prev(),
  });

  const elNext = elNew("div", {
    className: "carousel-next",
    innerHTML: `<svg class="next-icon" xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#FFFFFF"><path d="m480-320 160-160-160-160-56 56 64 64H320v80h168l-64 64 56 56Zm0 240q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>`,
    onclick: () => next(),
  });


  const elNavigation = elNew("div", {
    className: "carousel-navigation",
  });


  for (let i = 0; i < tot; i++) {
    const elBtn = elNew("button", {
      type: "button",
      className: "carousel-bullet",
      onclick: () => goto(i)
    });
    elsBtns.push(elBtn);
  }


  elCarouselSlider.addEventListener("transitionend", () => {
    if (c <= -1) c = tot - 1; 
    if (c >= tot) c = 0; 
    anim(0); 
  });


  elCarousel.addEventListener("pointerenter", () => stop());
  elCarousel.addEventListener("pointerleave", () => play());

  elNavigation.append(...elsBtns);
  elCarousel.append(elPrev, elNext, elNavigation);

  elCarouselSlider.prepend(elsSlides[tot - 1].cloneNode(true));
  elCarouselSlider.append(elsSlides[0].cloneNode(true));

  // Initial slide
  anim(0);

  // Start autoplay
  play();
};

els(".carousel").forEach(carousel);