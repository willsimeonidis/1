/* --------------------------------------------------
   AI.JS — CREATURE BRAIN ENGINE
   Handles:
   - Creature objects
   - Movement
   - Hunger
   - Personality
   - Danger detection
   - Food + danger objects
   - Rendering
-------------------------------------------------- */

let creatures = [];
let worldObjects = []; // food, danger
let creatureCanvas, cctx;
let creatureMouseDown = false;
let currentSpawn = "slime";

/* --------------------------------------------------
   INIT CREATURE WORLD
-------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  creatureCanvas = document.getElementById("creature-canvas");
  cctx = creatureCanvas.getContext("2d");

  resizeCreatureCanvas();
  window.addEventListener("resize", resizeCreatureCanvas);

  initCreatureTools();
  initCreatureMouse();

  creatureLoop();
});

/* --------------------------------------------------
   RESIZE CANVAS
-------------------------------------------------- */
function resizeCreatureCanvas() {
  creatureCanvas.width = window.innerWidth - 220;
  creatureCanvas.height = window.innerHeight - 140;
}

/* --------------------------------------------------
   CREATURE TYPES
-------------------------------------------------- */
const CREATURE_TYPES = {
  slime: { color: "#00ff88", speed: 1.2, hungerRate: 0.02 },
  fire: { color: "#ff4500", speed: 1.6, hungerRate: 0.03 },
  water: { color: "#4aa3ff", speed: 1.1, hungerRate: 0.015 },
  rock: { color: "#888", speed: 0.7, hungerRate: 0.01 },
  ice: { color: "#aaf", speed: 1.0, hungerRate: 0.02 }
};

/* --------------------------------------------------
   SPAWN CREATURE
-------------------------------------------------- */
function spawnCreature(x, y, type) {
  const t = CREATURE_TYPES[type];

  creatures.push({
    x,
    y,
    vx: 0,
    vy: 0,
    type,
    color: t.color,
    hunger: 100,
    personality: rand(-1, 1), // -1 shy, +1 bold
    speed: t.speed,
    hungerRate: t.hungerRate
  });
}

/* --------------------------------------------------
   SPAWN WORLD OBJECTS
-------------------------------------------------- */
function spawnFood(x, y) {
  worldObjects.push({ x, y, type: "food", color: "#00ff00" });
}

function spawnDanger(x, y) {
  worldObjects.push({ x, y, type: "danger", color: "#ff0000" });
}

/* --------------------------------------------------
   TOOL BUTTONS
-------------------------------------------------- */
function initCreatureTools() {
  const buttons = document.querySelectorAll(".creature-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;

      if (type === "clear") {
        creatures = [];
        worldObjects = [];
        return;
      }

      currentSpawn = type;
    });
  });
}

/* --------------------------------------------------
   MOUSE INPUT
-------------------------------------------------- */
function initCreatureMouse() {
  creatureCanvas.addEventListener("mousedown", e => {
    creatureMouseDown = true;
    spawnAtMouse(e);
  });

  creatureCanvas.addEventListener("mouseup", () => {
    creatureMouseDown = false;
  });

  creatureCanvas.addEventListener("mousemove", e => {
    if (creatureMouseDown) spawnAtMouse(e);
  });
}

/* --------------------------------------------------
   SPAWN AT MOUSE
-------------------------------------------------- */
function spawnAtMouse(e) {
  const rect = creatureCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (currentSpawn === "food") return spawnFood(x, y);
  if (currentSpawn === "danger") return spawnDanger(x, y);

  spawnCreature(x, y, currentSpawn);
}

/* --------------------------------------------------
   UPDATE CREATURES
-------------------------------------------------- */
function updateCreatures() {
  for (let c of creatures) {
    c.hunger -= c.hungerRate;

    // If starving, move faster
    let speed = c.speed + (c.hunger < 40 ? 0.5 : 0);

    // Find nearest object
    let target = findNearestObject(c);

    if (target) {
      let dx = target.x - c.x;
      let dy = target.y - c.y;
      let dist = Math.hypot(dx, dy);

      if (dist < 10) {
        // Eat food
        if (target.type === "food") {
          c.hunger = 100;
          worldObjects = worldObjects.filter(o => o !== target);
        }

        // Danger hurts
        if (target.type === "danger") {
          c.hunger -= 20;
        }
      } else {
        // Move toward or away depending on personality
        let direction = target.type === "danger" ? -1 : 1;
        c.vx = (dx / dist) * speed * direction;
        c.vy = (dy / dist) * speed * direction;
      }
    } else {
      // Wander randomly
      c.vx += rand(-0.2, 0.2);
      c.vy += rand(-0.2, 0.2);
    }

    // Apply movement
    c.x += c.vx;
    c.y += c.vy;

    // Keep inside canvas
    c.x = clamp(c.x, 0, creatureCanvas.width);
    c.y = clamp(c.y, 0, creatureCanvas.height);
  }

  // Remove dead creatures
  creatures = creatures.filter(c => c.hunger > 0);
}

/* --------------------------------------------------
   FIND NEAREST OBJECT
-------------------------------------------------- */
function findNearestObject(creature) {
  let nearest = null;
  let bestDist = Infinity;

  for (let o of worldObjects) {
    let dx = o.x - creature.x;
    let dy = o.y - creature.y;
    let dist = Math.hypot(dx, dy);

    if (dist < bestDist) {
      bestDist = dist;
      nearest = o;
    }
  }

  return nearest;
}

/* --------------------------------------------------
   RENDER CREATURES
-------------------------------------------------- */
function renderCreatures() {
  cctx.clearRect(0, 0, creatureCanvas.width, creatureCanvas.height);

  // Draw world objects
  for (let o of worldObjects) {
    cctx.fillStyle = o.color;
    cctx.fillRect(o.x - 5, o.y - 5, 10, 10);
  }

  // Draw creatures
  for (let c of creatures) {
    cctx.fillStyle = c.color;
    cctx.beginPath();
    cctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
    cctx.fill();

    // Hunger bar
    cctx.fillStyle = "#fff";
    cctx.fillRect(c.x - 10, c.y - 18, 20, 3);
    cctx.fillStyle = "#0f0";
    cctx.fillRect(c.x - 10, c.y - 18, (c.hunger / 100) * 20, 3);
  }
}

/* --------------------------------------------------
   MAIN LOOP
-------------------------------------------------- */
function creatureLoop() {
  updateCreatures();
  renderCreatures();
  requestAnimationFrame(creatureLoop);
}
