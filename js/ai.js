/* --------------------------------------------------
   AI.JS — FULLY WORKING CREATURE AI ENGINE
-------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("creature-canvas");
    const ctx = canvas.getContext("2d");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let creatures = [];
    let foods = [];
    let currentSpawn = "basic";

    /* --------------------------------------------------
       RESIZE
    -------------------------------------------------- */
    function resizeCanvas() {
        canvas.width = window.innerWidth - 220;
        canvas.height = window.innerHeight - 140;
    }

    /* --------------------------------------------------
       CREATURE SPAWNERS
    -------------------------------------------------- */
    function spawnCreature(x, y, type) {
        let speed = 1.2;
        let size = 12;

        if (type === "fast") speed = 2.5;
        if (type === "big") size = 22;

        creatures.push({
            x, y,
            vx: rand(-speed, speed),
            vy: rand(-speed, speed),
            size,
            hunger: 100,
            type,
            color: randomColor()
        });
    }

    function dropFood(x, y) {
        foods.push({
            x, y,
            size: 8,
            color: "yellow"
        });
    }

    /* --------------------------------------------------
       BUTTONS
    -------------------------------------------------- */
    document.querySelectorAll(".creature-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const spawn = btn.dataset.spawn;
            const action = btn.dataset.action;

            if (spawn) currentSpawn = spawn;
            if (action) handleAction(action);
        });
    });

    function handleAction(action) {
        if (action === "food") {
            // Drop food in center
            dropFood(canvas.width / 2, canvas.height / 2);
        }

        if (action === "scatter") {
            creatures.forEach(c => {
                c.vx = rand(-3, 3);
                c.vy = rand(-3, 3);
            });
        }

        if (action === "clear") {
            creatures = [];
            foods = [];
        }
    }

    /* --------------------------------------------------
       MOUSE
    -------------------------------------------------- */
    canvas.addEventListener("mousedown", e => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        spawnCreature(x, y, currentSpawn);
    });

    /* --------------------------------------------------
       UPDATE LOOP
    -------------------------------------------------- */
    function update() {

        // Creature movement + hunger
        for (let c of creatures) {

            c.hunger -= 0.05;
            if (c.hunger <= 0) c.color = "gray";

            // Seek food
            let nearestFood = null;
            let nearestDist = Infinity;

            for (let f of foods) {
                let dx = f.x - c.x;
                let dy = f.y - c.y;
                let d = Math.hypot(dx, dy);

                if (d < nearestDist) {
                    nearestDist = d;
                    nearestFood = f;
                }
            }

            if (nearestFood) {
                let dx = nearestFood.x - c.x;
                let dy = nearestFood.y - c.y;
                let d = Math.hypot(dx, dy);

                c.vx += dx / d * 0.05;
                c.vy += dy / d * 0.05;

                // Eat food
                if (d < c.size + nearestFood.size) {
                    c.hunger = 100;
                    foods.splice(foods.indexOf(nearestFood), 1);
                }
            }

            // Movement
            c.x += c.vx;
            c.y += c.vy;

            // Bounce off walls
            if (c.x < 0 || c.x > canvas.width) c.vx *= -1;
            if (c.y < 0 || c.y > canvas.height) c.vy *= -1;
        }
    }

    /* --------------------------------------------------
       RENDER LOOP
    -------------------------------------------------- */
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw foods
        for (let f of foods) {
            ctx.fillStyle = f.color;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw creatures
        for (let c of creatures) {
            ctx.fillStyle = c.color;
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /* --------------------------------------------------
       MAIN LOOP
    -------------------------------------------------- */
    function loop() {
        update();
        render();
        requestAnimationFrame(loop);
    }

    loop();

    /* --------------------------------------------------
       UTILS
    -------------------------------------------------- */
    function rand(a, b) {
        return Math.random() * (b - a) + a;
    }

    function randomColor() {
        return `hsl(${rand(0, 360)}, 80%, 50%)`;
    }
});
