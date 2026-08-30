/* --------------------------------------------------
   WEATHER.JS — COSMIC AMBIENT ENGINE
   Handles:
   - Nebula drift
   - Star twinkle
   - Cosmic wind
   - Background noise
-------------------------------------------------- */

let stars = [];
let nebulae = [];
let cosmicZoom = 1;
let universeCanvas, uctx;

/* --------------------------------------------------
   INIT UNIVERSE WEATHER
-------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  universeCanvas = document.getElementById("universe-canvas");
  uctx = universeCanvas.getContext("2d");

  resizeUniverseCanvas();
  window.addEventListener("resize", resizeUniverseCanvas);

  initUniverseTools();
  universeLoop();
});

/* --------------------------------------------------
   RESIZE CANVAS
-------------------------------------------------- */
function resizeUniverseCanvas() {
  universeCanvas.width = window.innerWidth - 220;
  universeCanvas.height = window.innerHeight - 140;
}

/* --------------------------------------------------
   TOOL BUTTONS
-------------------------------------------------- */
function initUniverseTools() {
  const buttons = document.querySelectorAll(".universe-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;

      switch (action) {
        case "galaxy": generateGalaxy(); break;
        case "nebula": generateNebula(); break;
        case "stars": generateStarField(); break;
        case "planet": generatePlanet(); break;
        case "zoomIn": cosmicZoom *= 1.2; break;
        case "zoomOut": cosmicZoom /= 1.2; break;
        case "clear":
          stars = [];
          nebulae = [];
          break;
      }
    });
  });
}

/* --------------------------------------------------
   STAR FIELD GENERATION
-------------------------------------------------- */
function generateStarField() {
  for (let i = 0; i < 300; i++) {
    stars.push({
      x: rand(0, universeCanvas.width),
      y: rand(0, universeCanvas.height),
      brightness: rand(0.3, 1),
      twinkleSpeed: rand(0.01, 0.03)
    });
  }
}

/* --------------------------------------------------
   NEBULA GENERATION
-------------------------------------------------- */
function generateNebula() {
  nebulae.push({
    x: rand(0, universeCanvas.width),
    y: rand(0, universeCanvas.height),
    size: rand(200, 400),
    driftX: rand(-0.2, 0.2),
    driftY: rand(-0.2, 0.2),
    color: `rgba(${rand(100,255)}, ${rand(50,150)}, ${rand(150,255)}, 0.2)`
  });
}

/* --------------------------------------------------
   GALAXY GENERATION
-------------------------------------------------- */
function generateGalaxy() {
  const cx = universeCanvas.width / 2;
  const cy = universeCanvas.height / 2;

  for (let i = 0; i < 800; i++) {
    const angle = rand(0, Math.PI * 2);
    const radius = rand(10, 400);

    stars.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      brightness: rand(0.5, 1),
      twinkleSpeed: rand(0.01, 0.03)
    });
  }
}

/* --------------------------------------------------
   PLANET GENERATION
-------------------------------------------------- */
function generatePlanet() {
  const x = rand(100, universeCanvas.width - 100);
  const y = rand(100, universeCanvas.height - 100);
  const radius = rand(40, 80);

  nebulae.push({
    x,
    y,
    size: radius * 2,
    driftX: 0,
    driftY: 0,
    color: `rgba(${rand(50,200)}, ${rand(50,200)}, ${rand(50,200)}, 1)`
  });
}

/* --------------------------------------------------
   UPDATE COSMIC WEATHER
-------------------------------------------------- */
function updateUniverse() {
  // Twinkle stars
  for (let s of stars) {
    s.brightness += s.twinkleSpeed * (Math.random() > 0.5 ? 1 : -1);
    s.brightness = clamp(s.brightness, 0.2, 1);
  }

  // Drift nebulae
  for (let n of nebulae) {
    n.x += n.driftX;
    n.y += n.driftY;
  }
}

/* --------------------------------------------------
   RENDER UNIVERSE
-------------------------------------------------- */
function renderUniverse() {
  uctx.save();
  uctx.scale(cosmicZoom, cosmicZoom);

  uctx.clearRect(0, 0, universeCanvas.width, universeCanvas.height);

  // Nebulae
  for (let n of nebulae) {
    uctx.fillStyle = n.color;
    uctx.beginPath();
    uctx.arc(n.x, n.y, n.size / 2, 0, Math.PI * 2);
    uctx.fill();
  }

  // Stars
  for (let s of stars) {
    uctx.fillStyle = `rgba(255,255,255,${s.brightness})`;
    uctx.fillRect(s.x, s.y, 2, 2);
  }

  uctx.restore();
}

/* --------------------------------------------------
   MAIN LOOP
-------------------------------------------------- */
function universeLoop() {
  updateUniverse();
  renderUniverse();
  requestAnimationFrame(universeLoop);
}
