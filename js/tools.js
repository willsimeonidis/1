/* --------------------------------------------------
   TOOLS.JS — SUPER TOOLS ENGINE
   Handles:
   - Color picker
   - Gradient generator
   - Noise texture
   - Pattern maker
   - Shape drawing
   - Randomizers
-------------------------------------------------- */

let toolsCanvas, tctx;
let currentTool = "color";
let toolMouseDown = false;

/* --------------------------------------------------
   INIT TOOLS MODE
-------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  toolsCanvas = document.getElementById("tools-canvas");
  tctx = toolsCanvas.getContext("2d");

  resizeToolsCanvas();
  window.addEventListener("resize", resizeToolsCanvas);

  initToolsPanel();
  initToolsMouse();

  toolsLoop();
});

/* --------------------------------------------------
   RESIZE CANVAS
-------------------------------------------------- */
function resizeToolsCanvas() {
  toolsCanvas.width = window.innerWidth - 220;
  toolsCanvas.height = window.innerHeight - 140;
}

/* --------------------------------------------------
   TOOL BUTTONS
-------------------------------------------------- */
function initToolsPanel() {
  const buttons = document.querySelectorAll(".tool-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tool = btn.dataset.tool;

      if (tool === "clear") {
        clearToolsCanvas();
        return;
      }

      currentTool = tool;
    });
  });
}

/* --------------------------------------------------
   MOUSE INPUT
-------------------------------------------------- */
function initToolsMouse() {
  toolsCanvas.addEventListener("mousedown", e => {
    toolMouseDown = true;
    useToolAtMouse(e);
  });

  toolsCanvas.addEventListener("mouseup", () => {
    toolMouseDown = false;
  });

  toolsCanvas.addEventListener("mousemove", e => {
    if (toolMouseDown) useToolAtMouse(e);
  });
}

/* --------------------------------------------------
   TOOL ACTIONS
-------------------------------------------------- */
function useToolAtMouse(e) {
  const rect = toolsCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  switch (currentTool) {
    case "color": pickColor(x, y); break;
    case "gradient": drawGradient(x, y); break;
    case "noise": drawNoise(); break;
    case "pattern": drawPattern(x, y); break;

    case "circle": drawCircle(x, y); break;
    case "square": drawSquare(x, y); break;
    case "line": drawLine(x, y); break;

    case "randomColor": randomColorFill(); break;
    case "randomShape": randomShape(x, y); break;
  }
}

/* --------------------------------------------------
   COLOR PICKER
-------------------------------------------------- */
function pickColor(x, y) {
  const color = `hsl(${rand(0, 360)}, 80%, 50%)`;
  tctx.fillStyle = color;
  tctx.fillRect(x - 20, y - 20, 40, 40);
}

/* --------------------------------------------------
   GRADIENT MAKER
-------------------------------------------------- */
function drawGradient(x, y) {
  const grad = tctx.createLinearGradient(0, 0, toolsCanvas.width, toolsCanvas.height);
  grad.addColorStop(0, `hsl(${rand(0,360)}, 80%, 50%)`);
  grad.addColorStop(1, `hsl(${rand(0,360)}, 80%, 50%)`);

  tctx.fillStyle = grad;
  tctx.fillRect(0, 0, toolsCanvas.width, toolsCanvas.height);
}

/* --------------------------------------------------
   NOISE TEXTURE
-------------------------------------------------- */
function drawNoise() {
  const img = tctx.createImageData(toolsCanvas.width, toolsCanvas.height);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = rand(0, 255);
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  tctx.putImageData(img, 0, 0);
}

/* --------------------------------------------------
   PATTERN MAKER
-------------------------------------------------- */
function drawPattern(x, y) {
  for (let i = 0; i < 20; i++) {
    tctx.fillStyle = `hsl(${rand(0,360)}, 80%, 60%)`;
    tctx.fillRect(
      x + rand(-100, 100),
      y + rand(-100, 100),
      rand(10, 40),
      rand(10, 40)
    );
  }
}

/* --------------------------------------------------
   SHAPES
-------------------------------------------------- */
function drawCircle(x, y) {
  tctx.fillStyle = `hsl(${rand(0,360)}, 80%, 50%)`;
  tctx.beginPath();
  tctx.arc(x, y, rand(10, 40), 0, Math.PI * 2);
  tctx.fill();
}

function drawSquare(x, y) {
  tctx.fillStyle = `hsl(${rand(0,360)}, 80%, 50%)`;
  const size = rand(20, 60);
  tctx.fillRect(x - size/2, y - size/2, size, size);
}

let lastLineX = null;
let lastLineY = null;

function drawLine(x, y) {
  if (lastLineX === null) {
    lastLineX = x;
    lastLineY = y;
    return;
  }

  tctx.strokeStyle = `hsl(${rand(0,360)}, 80%, 50%)`;
  tctx.lineWidth = 4;
  tctx.beginPath();
  tctx.moveTo(lastLineX, lastLineY);
  tctx.lineTo(x, y);
  tctx.stroke();

  lastLineX = x;
  lastLineY = y;
}

/* --------------------------------------------------
   RANDOMIZERS
-------------------------------------------------- */
function randomColorFill() {
  tctx.fillStyle = `hsl(${rand(0,360)}, 80%, 50%)`;
  tctx.fillRect(0, 0, toolsCanvas.width, toolsCanvas.height);
}

function randomShape(x, y) {
  const r = Math.random();
  if (r < 0.33) drawCircle(x, y);
  else if (r < 0.66) drawSquare(x, y);
  else drawLine(x, y);
}

/* --------------------------------------------------
   CLEAR CANVAS
-------------------------------------------------- */
function clearToolsCanvas() {
  tctx.clearRect(0, 0, toolsCanvas.width, toolsCanvas.height);
  lastLineX = null;
  lastLineY = null;
}

/* --------------------------------------------------
   MAIN LOOP
-------------------------------------------------- */
function toolsLoop() {
  // Tools mode doesn't need constant animation,
  // but we keep the loop for future upgrades.
  requestAnimationFrame(toolsLoop);
}

/* --------------------------------------------------
   UTILS
-------------------------------------------------- */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}
