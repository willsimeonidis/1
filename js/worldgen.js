/* --------------------------------------------------
   WORLDGEN.JS — BUILDER WORLD ENGINE
   Handles:
   - World grid
   - Block placement
   - Erasing
   - Clearing
   - Drawing blocks
   - Mouse input
-------------------------------------------------- */

const TILE_SIZE = 20;
let world = [];
let builderCanvas, bctx;
let currentBlock = "grass";
let builderMouseDown = false;

/* --------------------------------------------------
   INIT BUILDER WORLD
-------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  builderCanvas = document.getElementById("builder-canvas");
  bctx = builderCanvas.getContext("2d");

  resizeBuilderCanvas();
  window.addEventListener("resize", resizeBuilderCanvas);

  initWorld();
  initBuilderTools();
  initBuilderMouse();

  builderLoop();
});

/* --------------------------------------------------
   RESIZE CANVAS
-------------------------------------------------- */
function resizeBuilderCanvas() {
  builderCanvas.width = window.innerWidth - 220;
  builderCanvas.height = window.innerHeight - 140;
}

/* --------------------------------------------------
   CREATE EMPTY WORLD GRID
-------------------------------------------------- */
function initWorld() {
  const cols = Math.floor(builderCanvas.width / TILE_SIZE);
  const rows = Math.floor(builderCanvas.height / TILE_SIZE);

  world = [];

  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      row.push("empty");
    }
    world.push(row);
  }
}

/* --------------------------------------------------
   TOOL BUTTONS
-------------------------------------------------- */
function initBuilderTools() {
  const buttons = document.querySelectorAll(".block-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const block = btn.dataset.block;

      if (block === "clear") {
        initWorld();
        return;
      }

      currentBlock = block;
    });
  });
}

/* --------------------------------------------------
   MOUSE INPUT
-------------------------------------------------- */
function initBuilderMouse() {
  builderCanvas.addEventListener("mousedown", e => {
    builderMouseDown = true;
    placeBlockAtMouse(e);
  });

  builderCanvas.addEventListener("mouseup", () => {
    builderMouseDown = false;
  });

  builderCanvas.addEventListener("mousemove", e => {
    if (builderMouseDown) placeBlockAtMouse(e);
  });
}

/* --------------------------------------------------
   PLACE BLOCK AT MOUSE POSITION
-------------------------------------------------- */
function placeBlockAtMouse(e) {
  const rect = builderCanvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
  const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

  if (!world[y] || !world[y][x]) return;

  if (currentBlock === "erase") {
    world[y][x] = "empty";
  } else {
    world[y][x] = currentBlock;
  }
}

/* --------------------------------------------------
   DRAW WORLD
-------------------------------------------------- */
function drawWorld() {
  for (let y = 0; y < world.length; y++) {
    for (let x = 0; x < world[y].length; x++) {
      const block = world[y][x];

      switch (block) {
        case "grass": bctx.fillStyle = "#3cb043"; break;
        case "dirt": bctx.fillStyle = "#8b4513"; break;
        case "stone": bctx.fillStyle = "#888"; break;
        case "water": bctx.fillStyle = "#4aa3ff"; break;
        case "wood": bctx.fillStyle = "#b5651d"; break;
        case "sand": bctx.fillStyle = "#e4d28c"; break;
        default:
          bctx.fillStyle = "#111";
      }

      bctx.fillRect(
        x * TILE_SIZE,
        y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
      );
    }
  }
}

/* --------------------------------------------------
   MAIN LOOP
-------------------------------------------------- */
function builderLoop() {
  drawWorld();
  requestAnimationFrame(builderLoop);
}
