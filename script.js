(() => {
    const hello = document.getElementById("hello");
    const boxes = document.querySelectorAll(".glass-container:not(#hello)");
    const background = document.querySelector(".background");

    // Show "Hello!" box
    setTimeout(() => {
        if (hello) hello.classList.add("show");
    }, 300);

    // Animate gradient on page load (slow movement to target)
    background.style.transition = "background-position 4s ease";
    setTimeout(() => {
        background.style.backgroundPosition = "40% 40%"; // Brighter side ~40% top-left
    }, 500);

    // After gradient animation, make transitions quick for scroll effect
    setTimeout(() => {
        background.style.transition = "background-position 150ms linear";
    }, 4200);

    // Fade out "Hello!" and reveal boxes
    setTimeout(() => {
        if (hello) hello.classList.add("fade-out");
        setTimeout(() => {
            if (hello) hello.remove();
            boxes.forEach((box, index) => {
                setTimeout(() => {
                    box.classList.add("show");
                }, index * 300);
            });
        }, 800);
    }, 2500);

    // Scroll-controlled gradient movement
    let ticking = false;

    function updateGradientOnScroll() {
        const docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        const winH = window.innerHeight;
        const maxScroll = Math.max(0, docH - winH);

        let scrollPercent = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        scrollPercent = Math.min(1, Math.max(0, scrollPercent));

        const targetX = 40 + scrollPercent * 5; // small shift
        const targetY = 40 + scrollPercent * 5;
        background.style.backgroundPosition = `${targetX}% ${targetY}%`;

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateGradientOnScroll);
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Initial position
    updateGradientOnScroll();

    // Smooth scroll for internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetID = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetID);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
})();
