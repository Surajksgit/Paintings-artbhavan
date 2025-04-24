
// Loading Bar
document.addEventListener("DOMContentLoaded", function () {
    const bar = document.getElementById("loading-bar");

    // Animate loading progress
    bar.style.width = "30%";
    setTimeout(() => bar.style.width = "60%", 200);
    setTimeout(() => bar.style.width = "90%", 400);

    window.addEventListener("load", () => {
        bar.style.width = "100%";
        setTimeout(() => {
            bar.style.opacity = "0";
            setTimeout(() => {
                if (bar) bar.remove();
            }, 300);
        }, 300);
    });
});