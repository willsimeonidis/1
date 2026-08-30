/* --------------------------------------------------
   UI.JS — SHARED UI HELPERS + BUTTON EFFECTS
-------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

    /* --------------------------------------------------
       BUTTON CLICK EFFECT
    -------------------------------------------------- */
    document.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("mousedown", () => {
            btn.style.transform = "scale(0.95)";
        });

        btn.addEventListener("mouseup", () => {
            btn.style.transform = "scale(1)";
        });

        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "scale(1)";
        });
    });

    /* --------------------------------------------------
       BUTTON HOVER EFFECT
    -------------------------------------------------- */
    document.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("mouseover", () => {
            btn.style.filter = "brightness(1.15)";
        });

        btn.addEventListener("mouseout", () => {
            btn.style.filter = "brightness(1)";
        });
    });

    /* --------------------------------------------------
       PANEL TOGGLE (if any mode uses it)
    -------------------------------------------------- */
    const toggles = document.querySelectorAll("[data-toggle]");
    toggles.forEach(t => {
        t.addEventListener("click", () => {
            const target = document.getElementById(t.dataset.toggle);
            if (!target) return;

            const visible = target.style.display !== "none";
            target.style.display = visible ? "none" : "block";
        });
    });

});
