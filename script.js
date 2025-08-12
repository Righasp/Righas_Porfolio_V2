document.addEventListener('DOMContentLoaded', () => {
    const hello = document.getElementById("hello");
    const boxes = document.querySelectorAll(".glass-container:not(#hello)");
    const background = document.querySelector(".background");
    const signatureContainer = document.getElementById("signature");
    const svg = document.querySelector("#signature-svg");
    const paths = signatureContainer ? signatureContainer.querySelectorAll("path") : [];

    // If we have paths inside the inline SVG, prepare them for animation
    if (paths.length) {
        // set initial dash values
        paths.forEach((path, i) => {
            try {
                const L = path.getTotalLength();
                path.style.strokeDasharray = L;
                path.style.strokeDashoffset = L;
                path.style.stroke = path.style.stroke || getComputedStyle(path).stroke || "#f5c842";
                path.style.fill = "none";
                // set transition with a small stagger so the stroke looks natural
                const duration = 5000; // duration for each path
                const stagger = 200;   // ms between each path start
                path.style.transition = `stroke-dashoffset ${duration}ms ease ${i * stagger}ms`;
            } catch (err) {
                // some browsers might have problems; ignore if so
                console.warn("path length error", err);
            }
        });
    }

    // Show signature and start drawing + show Hello together
    requestAnimationFrame(() => {
        if (signatureContainer) signatureContainer.classList.add('show');
        // small timeout to ensure styles applied and transition will take effect
        setTimeout(() => {
            paths.forEach(path => {
                path.style.strokeDashoffset = '0';
            });
        }, 80);

        // show hello immediately so signature animates behind it
        setTimeout(() => {
            if (hello) hello.classList.add("show");
        }, 120);
    });

    // timing: how long signature animation runs (approx)
    const signatureAnimationDuration = 2800 + (paths.length * 300); // ms
    const holdAfterSignature = 1000; // keep Hello visible after signature finishes

    // After a while, fade-out Hello and reveal the rest of the page
    setTimeout(() => {
        if (hello) hello.classList.add("fade-out");
        // remove hello and signature (cleanup) then reveal boxes
        setTimeout(() => {
            if (hello) hello.remove();
            if (signatureContainer) signatureContainer.remove();
            boxes.forEach((box, index) => {
                setTimeout(() => {
                    box.classList.add("show");
                }, index * 300);
            });
        }, 800);
    }, signatureAnimationDuration + holdAfterSignature);

    // Animate gradient on page load (slow movement to target)
    background.style.transition = "background-position 4s ease";
    setTimeout(() => {
        background.style.backgroundPosition = "40% 40%";
    }, 500);

    // After initial, make gradient responsive to scroll
    setTimeout(() => {
        background.style.transition = "background-position 150ms linear";
    }, 4200);

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

    // initial gradient pos
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
});

window.addEventListener('load', () => {
    const sig = document.querySelector('.signature-container');
    sig.classList.add('show');
});
