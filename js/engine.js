/* --------------------------------------------------
   ENGINE.JS — GLOBAL UTILITIES + PAGE DETECTION
   Works with:
   - physics.js        (Physics Sandbox)
   - ai.js             (Creature AI World)
   - weather.js        (Universe Generator)
   - tools.js          (Tools Mode)
-------------------------------------------------- */

/* --------------------------------------------------
   NAVIGATION
-------------------------------------------------- */
function goToPage(path) {
    window.location.href = path;
}

/* --------------------------------------------------
   GLOBAL UTILS
-------------------------------------------------- */
function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/* --------------------------------------------------
   MODE START WRAPPERS
   These DO NOT start anything by themselves.
   They exist ONLY so page detection never breaks.
-------------------------------------------------- */
function startPhysicsSandbox() {
    // physics.js already starts itself
}

function startCreatureAI() {
    // ai.js already starts itself
}

function startUniverse() {
    // weather.js already starts itself
}

function startTools() {
    // tools.js already starts itself
}

/* --------------------------------------------------
   PAGE DETECTION
   This ensures engine.js never breaks any page.
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

    // Tools Mode
    if (document.getElementById("tools-canvas")) {
        startTools();
    }

});
