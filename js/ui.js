/* --------------------------------------------------
   UI.JS — GLOBAL USER INTERFACE CONTROLS
   Applies to ALL pages in the Super Website
-------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  fadeInPage();
  enhanceMenuCards();
});

/* --------------------------------------------------
   PAGE FADE-IN EFFECT
-------------------------------------------------- */
function fadeInPage() {
  const body = document.body;
  body.style.opacity = 0;
  body.style.transition = "opacity 0.8s ease";

  requestAnimationFrame(() => {
    body.style.opacity = 1;
  });
}

/* --------------------------------------------------
   MENU CARD INTERACTION EFFECTS
-------------------------------------------------- */
function enhanceMenuCards() {
  const cards = document.querySelectorAll(".menu-card");

  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("hovered");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("hovered");
    });

    card.addEventListener("click", () => {
      playClickFlash(card);
    });
  });
}

/* --------------------------------------------------
   CLICK FLASH EFFECT
-------------------------------------------------- */
function playClickFlash(card) {
  const flash = document.createElement("div");
  flash.className = "click-flash";

  flash.style.position = "absolute";
  flash.style.inset = "0";
  flash.style.borderRadius = "inherit";
  flash.style.background = "rgba(255,255,255,0.15)";
  flash.style.pointerEvents = "none";
  flash.style.animation = "flashOut 0.4s ease forwards";

  card.style.position = "relative";
  card.appendChild(flash);

  setTimeout(() => flash.remove(), 400);
}

/* --------------------------------------------------
   GLOBAL UTILITY FUNCTIONS
-------------------------------------------------- */

/* Smooth page navigation */
function goToPage(url) {
  document.body.style.opacity = 0;
  setTimeout(() => {
    window.location.href = url;
  }, 300);
}

/* Random helper */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* Clamp helper */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
