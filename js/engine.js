/* --------------------------------------------------
   ENGINE.JS — GLOBAL UTILITIES + PAGE NAVIGATION
   Works with:
   - physics.js        (Physics Sandbox)
   - ai.js             (Creature AI World)
   - weather.js        (Universe Generator)
   - tools.js          (Super Tools Mode)
-------------------------------------------------- */

/* --------------------------------------------------
   NAVIGATION
-------------------------------------------------- */
function goToPage(path) {
  window.location.href = path;
}

/* --------------------------------------------------
   GLOBAL UTILS
   Shared by weather.js, tools.js, chaos.js, etc.
-------------------------------------------------- */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/* --------------------------------------------------
   MODE START WRAPPERS
   These are here so your engine can "start" modes
   if you ever want to hook into them later.
   Right now, physics.js / ai.js / weather.js / tools.js
   already use DOMContentLoaded internally, so these
   are safe no-ops.
-------------------------------------------------- */
function startPhysicsSandbox() {
  // Physics Sandbox is already initialized in physics.js
  // This wrapper exists so your engine.js can call it
  // later if you want more control.
}

function startCreatureAI() {
  // Creature AI World is already initialized in ai.js
}

function startUniverse() {
  // Universe Generator is already initialized in weather.js
}

function startTools() {
  // Super Tools Mode is already initialized in tools.js
}

/* --------------------------------------------------
   PAGE DETECTION
   This block makes sure your engine knows which
   mode page is currently active.
-------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

  // Physics Sandbox
  if (document.getElementById("sandbox-canvas")) {
    startPhysicsSandbox();
  }

  // Creature AI World
  if (document.getElementById("creature-canvas")) {
    startCreatureAI();
  }

  // Universe Generator
  if (document.getElementById("universe-canvas")) {
    startUniverse();
  }

  // Super Tools Mode
  if (document.getElementById("tools-canvas")) {
    startTools();
  }

  // If you ever re-add Chaos Mode:
  // if (document.getElementById("chaos-canvas")) {
  //   startChaos();
  // }
});
