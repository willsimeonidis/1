/* --------------------------------------------------
   PARTICLES.JS — VISUAL EFFECTS ENGINE
   Handles:
   - Explosions
   - Sparks
   - Smoke bursts
   - Electric flashes
   - TNT boom effects
-------------------------------------------------- */

let fxParticles = []; // visual-only particles

/* --------------------------------------------------
   CREATE FX PARTICLE
-------------------------------------------------- */
function spawnFX(x, y, color, size = 4, life = 40) {
  fxParticles.push({
    x,
    y,
    vx: rand(-2, 2),
    vy: rand(-2, 2),
    size,
    color,
    life
  });
}

/* --------------------------------------------------
   EXPLOSION EFFECT
-------------------------------------------------- */
function explosion(x, y) {
  for (let i = 0; i < 40; i++) {
    spawnFX(x, y, "#ff6600", rand(3, 6), rand(20, 50));
  }

  // Add smoke
  for (let i = 0; i < 20; i++) {
    spawnFX(x, y, "rgba(200,200,200,0.4)", rand(4, 8), rand(40, 80));
  }
}

/* --------------------------------------------------
   ELECTRIC SPARK EFFECT
-------------------------------------------------- */
function electricFlash(x, y) {
  for (let i = 0; i < 20; i++) {
    spawnFX(x, y, "#ffff00", rand(2, 4), rand(10, 20));
  }
}

/* --------------------------------------------------
   SMOKE PUFF
-------------------------------------------------- */
function smokePuff(x, y) {
  for (let i = 0; i < 15; i++) {
    spawnFX(x, y, "rgba(180,180,180,0.3)", rand(4, 7), rand(30, 60));
  }
}

/* --------------------------------------------------
   UPDATE FX PARTICLES
-------------------------------------------------- */
function updateFX() {
  for (let p of fxParticles) {
    p.life--;
    p.x += p.vx;
    p.y += p.vy;

    // Smoke rises
    if (p.color.includes("rgba")) {
      p.vy -= 0.05;
    }
  }

  // Remove dead particles
  fxParticles = fxParticles.filter(p => p.life > 0);
}

/* --------------------------------------------------
   RENDER FX PARTICLES
-------------------------------------------------- */
function renderFX(ctx) {
  for (let p of fxParticles) {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
}

/* --------------------------------------------------
   HOOK INTO MAIN ENGINE
-------------------------------------------------- */
function fxLoop(ctx) {
  updateFX();
  renderFX(ctx);
}
