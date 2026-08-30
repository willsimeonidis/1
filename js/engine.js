/* --------------------------------------------------
   ENGINE.JS — MAIN SANDBOX ENGINE
   Connects:
   - Canvas
   - Physics engine
   - FX engine
   - Tools panel
   - Mouse input
-------------------------------------------------- */

let currentTool = "sand";
let canvas, ctx;
let mouseDown = false;

/* --------------------------------------------------
   INIT SANDBOX
-------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  canvas = document.getElementById("sandbox-canvas");
  ctx = canvas.getContext("2d");

  initPhysics(canvas);
  initTools();
  initMouse();

  sandboxLoop();
});

/* --------------------------------------------------
   TOOL BUTTONS
-------------------------------------------------- */
function initTools() {
  const buttons = document.querySelectorAll(".tool-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tool = btn.dataset.tool;

      if (tool === "clear") {
        particles = [];
        fxParticles = [];
        return;
      }

      currentTool = tool;
    });
  });
}

/* --------------------------------------------------
   MOUSE INPUT
-------------------------------------------------- */
function initMouse() {
  canvas.addEventListener("mousedown", e => {
    mouseDown = true;
    spawnAtMouse(e);
  });

  canvas.addEventListener("mouseup", () => {
    mouseDown = false;
  });

  canvas.addEventListener("mousemove", e => {
    if (mouseDown) spawnAtMouse(e);
  });
}

/* --------------------------------------------------
   SPAWN PARTICLES AT MOUSE
-------------------------------------------------- */
function spawnAtMouse(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  switch (currentTool) {
    case "sand":
    case "water":
    case "lava":
    case "smoke":
    case "electric":
      for (let i = 0; i < 4; i++) {
        createParticle(x + rand(-4, 4), y + rand(-4, 4), currentTool);
      }
      break;

    case "tnt":
      explosion(x, y);
      break;
  }
}

/* --------------------------------------------------
   MAIN LOOP
-------------------------------------------------- */
function sandboxLoop() {
  // Physics engine updates particles
  // FX engine updates visual effects
  // Both render onto the same canvas

  // Physics draws first
  renderParticles();

  // FX draws on top
  fxLoop(ctx);

  requestAnimationFrame(sandboxLoop);
}
