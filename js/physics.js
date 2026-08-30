/* --------------------------------------------------
   PHYSICS.JS — CORE PHYSICS ENGINE FOR SANDBOX
   Handles:
   - Gravity
   - Movement
   - Sand falling
   - Water flowing
   - Lava cooling
   - Smoke rising
   - Electricity spreading
-------------------------------------------------- */

const GRID_SIZE = 3;          // pixel size of each particle
const GRAVITY = 0.4;          // downward force
const MAX_PARTICLES = 20000;  // safety limit

let particles = [];           // all active particles
let sandboxCanvas, ctx;

/* --------------------------------------------------
   INIT
-------------------------------------------------- */
function initPhysics(canvas) {
  sandboxCanvas = canvas;
  ctx = canvas.getContext("2d");

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  requestAnimationFrame(physicsLoop);
}

/* --------------------------------------------------
   RESIZE CANVAS
-------------------------------------------------- */
function resizeCanvas() {
  sandboxCanvas.width = window.innerWidth - 220; // minus tools panel
  sandboxCanvas.height = window.innerHeight - 140; // minus header
}

/* --------------------------------------------------
   CREATE PARTICLE
-------------------------------------------------- */
function createParticle(x, y, type) {
  if (particles.length >= MAX_PARTICLES) return;

  particles.push({
    x,
    y,
    vx: 0,
    vy: 0,
    type,
    life: 0
  });
}

/* --------------------------------------------------
   PHYSICS LOOP
-------------------------------------------------- */
function physicsLoop() {
  updateParticles();
  renderParticles();
  requestAnimationFrame(physicsLoop);
}

/* --------------------------------------------------
   UPDATE PARTICLES
-------------------------------------------------- */
function updateParticles() {
  for (let p of particles) {
    p.life++;

    switch (p.type) {
      case "sand": updateSand(p); break;
      case "water": updateWater(p); break;
      case "lava": updateLava(p); break;
      case "smoke": updateSmoke(p); break;
      case "electric": updateElectric(p); break;
    }

    // Apply velocity
    p.x += p.vx;
    p.y += p.vy;

    // Keep inside canvas
    p.x = clamp(p.x, 0, sandboxCanvas.width);
    p.y = clamp(p.y, 0, sandboxCanvas.height);
  }
}

/* --------------------------------------------------
   SAND BEHAVIOR
-------------------------------------------------- */
function updateSand(p) {
  p.vy += GRAVITY;

  // Try falling straight down
  if (!isSolid(p.x, p.y + GRID_SIZE)) return;

  // Try diagonals
  if (!isSolid(p.x - GRID_SIZE, p.y + GRID_SIZE)) {
    p.x -= GRID_SIZE;
    return;
  }
  if (!isSolid(p.x + GRID_SIZE, p.y + GRID_SIZE)) {
    p.x += GRID_SIZE;
    return;
  }

  // Sand settles
  p.vy = 0;
}

/* --------------------------------------------------
   WATER BEHAVIOR
-------------------------------------------------- */
function updateWater(p) {
  p.vy += GRAVITY * 0.5;

  // Down
  if (!isSolid(p.x, p.y + GRID_SIZE)) return;

  // Spread left/right
  if (Math.random() < 0.5) {
    if (!isSolid(p.x - GRID_SIZE, p.y)) p.x -= GRID_SIZE;
    else if (!isSolid(p.x + GRID_SIZE, p.y)) p.x += GRID_SIZE;
  } else {
    if (!isSolid(p.x + GRID_SIZE, p.y)) p.x += GRID_SIZE;
    else if (!isSolid(p.x - GRID_SIZE, p.y)) p.x -= GRID_SIZE;
  }

  p.vy = 0;
}

/* --------------------------------------------------
   LAVA BEHAVIOR
-------------------------------------------------- */
function updateLava(p) {
  p.vy += GRAVITY * 0.3;

  // Lava cools into rock
  if (p.life > 600) p.type = "sand";

  if (!isSolid(p.x, p.y + GRID_SIZE)) return;

  p.vy = 0;
}

/* --------------------------------------------------
   SMOKE BEHAVIOR
-------------------------------------------------- */
function updateSmoke(p) {
  p.vy -= 0.2; // rises

  // Drift left/right
  p.vx += rand(-0.1, 0.1);

  // Fade out
  if (p.life > 300) {
    p.type = "dead";
  }
}

/* --------------------------------------------------
   ELECTRICITY BEHAVIOR
-------------------------------------------------- */
function updateElectric(p) {
  // Random fast movement
  p.vx = rand(-3, 3);
  p.vy = rand(-3, 3);

  // Short life
  if (p.life > 40) p.type = "dead";
}

/* --------------------------------------------------
   CHECK IF POSITION IS SOLID
-------------------------------------------------- */
function isSolid(x, y) {
  return particles.some(p =>
    Math.abs(p.x - x) < GRID_SIZE &&
    Math.abs(p.y - y) < GRID_SIZE &&
    p.type !== "water" &&
    p.type !== "smoke" &&
    p.type !== "electric"
  );
}

/* --------------------------------------------------
   RENDER PARTICLES
-------------------------------------------------- */
function renderParticles() {
  ctx.clearRect(0, 0, sandboxCanvas.width, sandboxCanvas.height);

  for (let p of particles) {
    switch (p.type) {
      case "sand": ctx.fillStyle = "#c2b280"; break;
      case "water": ctx.fillStyle = "#4aa3ff"; break;
      case "lava": ctx.fillStyle = "#ff4500"; break;
      case "smoke": ctx.fillStyle = "rgba(200,200,200,0.4)"; break;
      case "electric": ctx.fillStyle = "#ffff00"; break;
      default: continue;
    }

    ctx.fillRect(p.x, p.y, GRID_SIZE, GRID_SIZE);
  }
}
