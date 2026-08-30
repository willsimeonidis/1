/* --------------------------------------------------
   PHYSICS.JS — FULLY WORKING PHYSICS SANDBOX ENGINE
-------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("sandbox-canvas");
    const ctx = canvas.getContext("2d");

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let objects = [];
    let gravityEnabled = true;

    /* --------------------------------------------------
       RESIZE
    -------------------------------------------------- */
    function resizeCanvas() {
        canvas.width = window.innerWidth - 220;
        canvas.height = window.innerHeight - 140;
    }

    /* --------------------------------------------------
       OBJECT SPAWNERS
    -------------------------------------------------- */
    function spawnBall(x, y) {
        objects.push({
            type: "ball",
            x, y,
            vx: 0,
            vy: 0,
            radius: 20,
            color: randomColor()
        });
    }

    function spawnBox(x, y) {
        objects.push({
            type: "box",
            x, y,
            vx: 0,
            vy: 0,
            size: 40,
            color: randomColor()
        });
    }

    function spawnBomb(x, y) {
        // Bomb = explosion particle burst
        for (let i = 0; i < 40; i++) {
            objects.push({
                type: "particle",
                x, y,
                vx: rand(-6, 6),
                vy: rand(-6, 6),
                life: rand(20, 60),
                color: randomColor()
            });
        }
    }

    /* --------------------------------------------------
       BUTTONS
    -------------------------------------------------- */
    document.querySelectorAll(".sandbox-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const spawn = btn.dataset.spawn;
            const action = btn.dataset.action;

            if (spawn) currentSpawn = spawn;
            if (action) handleAction(action);
        });
    });

    let currentSpawn = "ball";

    function handleAction(action) {
        if (action === "gravity") gravityEnabled = !gravityEnabled;
        if (action === "clear") objects = [];
    }

    /* --------------------------------------------------
       MOUSE
    -------------------------------------------------- */
    canvas.addEventListener("mousedown", e => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (currentSpawn === "ball") spawnBall(x, y);
        if (currentSpawn === "box") spawnBox(x, y);
        if (currentSpawn === "bomb") spawnBomb(x, y);
    });

    /* --------------------------------------------------
       UPDATE LOOP
    -------------------------------------------------- */
    function update() {
        for (let o of objects) {

            // Physics for balls + boxes
            if (o.type === "ball" || o.type === "box") {

                if (gravityEnabled) o.vy += 0.4;

                o.x += o.vx;
                o.y += o.vy;

                // Floor collision
                if (o.y > canvas.height - 5) {
                    o.y = canvas.height - 5;
                    o.vy *= -0.6;
                }

                // Wall collision
                if (o.x < 5 || o.x > canvas.width - 5) {
                    o.vx *= -0.6;
                }
            }

            // Explosion particles
            if (o.type === "particle") {
                o.x += o.vx;
                o.y += o.vy;
                o.life--;
            }
        }

        // Remove dead particles
        objects = objects.filter(o => o.type !== "particle" || o.life > 0);
    }

    /* --------------------------------------------------
       RENDER LOOP
    -------------------------------------------------- */
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let o of objects) {

            ctx.fillStyle = o.color;

            if (o.type === "ball") {
                ctx.beginPath();
                ctx.arc(o.x, o.y, o.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            if (o.type === "box") {
                ctx.fillRect(o.x - o.size / 2, o.y - o.size / 2, o.size, o.size);
            }

            if (o.type === "particle") {
                ctx.fillRect(o.x, o.y, 4, 4);
            }
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
