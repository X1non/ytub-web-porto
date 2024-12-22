const el = (sel, par) => (par || document).querySelector(sel);
const els = (sel, par) => (par || document).querySelectorAll(sel);
const elNew = (tag, prop) => Object.assign(document.createElement(tag), prop);

// Helper functions:

const mod = (n, m) => (n % m + m) % m; // Q1: negative modulo solution, in which instance we need negative mods

// Task: Carousel:

const carousel = (elCarousel) => { // Q2: What's elCarousel?

  const animation = 500;
  const pause = 5000;
  // Or use something like: const animation = Math.abs(elCarousel.dataset.carouselAnimation ?? 500);

  // Q2b: I think its the slider, but why do we need to make a parameter of elCarousel?
  const elCarouselSlider = el(".carousel-slider", elCarousel); 
  const elsSlides = els(".carousel-slide", elCarouselSlider);
  const elsBtns = [];

  let itv; // Autoslide interval
  let tot = elsSlides.length; // Total slides
  let c = 0; // Q3: When does c adds up?

  if (tot < 2) return; // Not enough slides. Do nothing.

  // Methods:
  const anim = (ms = animation) => {
    const cMod = mod(c, tot);
    // Move slider
    elCarouselSlider.style.transitionDuration = `${ms}ms`;
    elCarouselSlider.style.transform = `translateX(${(-c - 1) * 100}%)`;
    // Handle active classes (slide and bullet)
    elsSlides.forEach((elSlide, i) => elSlide.classList.toggle("is-active", cMod === i));
    elsBtns.forEach((elBtn, i) => elBtn.classList.toggle("is-active", cMod === i));
  };

  // A3: These functions adds up c, I think is like its index of slides, which is going to be showed
  const prev = () => {
    // A1: This is the ocassion c will reach negative numbers, when reaching index 0
    // Q1b: But why can't we just stop on 0?
    // A1b: Ah, maybe to help achieving infinite slides. 
    // Using custom negative modulo, it help achieve the last index of slides
    // Example: when c == -1, it means we've passed index 0
    // Then, when there are 3 slides for ex (tot = 3), using custom negative mod: (-1 % 3 + 3) % 3,
    // it will equals 2 a.k.a the alst index of slides.
    if (c <= -1) return; // prevent blanks on fast prev-click 
    c -= 1;
    anim();
  };

  const next = () => {
    if (c >= tot) return; // prevent blanks on fast next-click
    c += 1;
    anim();
  };

  const goto = (index) => {
    c = index;
    anim();
  };

  // Q4: When does play and stop triggered?
  const play = () => { 
    itv = setInterval(next, pause + animation); // returns interval id
  };

  const stop = () => {
    clearInterval(itv); // stop the ongoing interval through obtained id
  };

  // Buttons:

  const elPrev = elNew("div", {
    className: "carousel-prev",
    innerHTML: `<svg class="prev-icon" xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#FFFFFF"><path d="m480-320 56-56-64-64h168v-80H472l64-64-56-56-160 160 160 160Zm0 240q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`,
    onclick: () => prev(),
  });

  const elNext = elNew("div", {
    className: "carousel-next",
    innerHTML: `<svg class="next-icon" xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#FFFFFF"><path d="m480-320 160-160-160-160-56 56 64 64H320v80h168l-64 64 56 56Zm0 240q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`,
    onclick: () => next(),
  });

  // Navigation:

  const elNavigation = elNew("div", {
    className: "carousel-navigation",
  });

  // Navigation bullets:

  for (let i = 0; i < tot; i++) {
    const elBtn = elNew("button", {
      type: "button",
      className: "carousel-bullet",
      onclick: () => goto(i)
    });
    elsBtns.push(elBtn);
  }


  // Events:

  // Infinite slide effect:
  elCarouselSlider.addEventListener("transitionend", () => {
    if (c <= -1) c = tot - 1; // Hint 1: sets index from 0 to last slides
    if (c >= tot) c = 0; // Hint 2: sets index from last slides to the first one
    anim(0); // quickly switch to "c" slide (with animation duration 0)
  });

  // Pause on pointer enter:
  elCarousel.addEventListener("pointerenter", () => stop()); // A4: Here is the event which makes slides play/stop
  elCarousel.addEventListener("pointerleave", () => play());

  // Init:

  // Insert UI elements:
  elNavigation.append(...elsBtns);
  elCarousel.append(elPrev, elNext, elNavigation);

  // Clone first and last slides (for "infinite" slider effect)
  elCarouselSlider.prepend(elsSlides[tot - 1].cloneNode(true));
  elCarouselSlider.append(elsSlides[0].cloneNode(true));

  // Initial slide
  anim(0);

  // Start autoplay
  play();
};

// A2: Maybe this. For each implemented carousel, add the infinetly slides carousel function.
// Allows to use multiple carousels on the same page:
els(".carousel").forEach(carousel);