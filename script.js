document.addEventListener('DOMContentLoaded', () => {
    const hello = document.getElementById("hello");
    const boxes = document.querySelectorAll(".glass-container:not(#hello)");
    const background = document.querySelector(".background");
    const signatureContainer = document.getElementById("signature");
    const svg = document.querySelector("#signature-svg");
    const paths = signatureContainer ? signatureContainer.querySelectorAll("path") : [];

    // Signature animation
    if (paths.length) {
        paths.forEach((path, i) => {
            try {
                const L = path.getTotalLength();
                path.style.strokeDasharray = L;
                path.style.strokeDashoffset = L;
                path.style.stroke = path.style.stroke || getComputedStyle(path).stroke || "#f5c842";
                path.style.fill = "none";
                const duration = 2000;
                const stagger = 200;
                path.style.transition = `stroke-dashoffset ${duration}ms ease ${i * stagger}ms`;
            } catch (err) {
                console.warn("path length error", err);
            }
        });
    }

    requestAnimationFrame(() => {
        if (signatureContainer) signatureContainer.classList.add('show');
        setTimeout(() => {
            paths.forEach(path => path.style.strokeDashoffset = '0');
        }, 80);
        setTimeout(() => { if (hello) hello.classList.add("show"); }, 120);
    });

    const signatureAnimationDuration = 1500 + (paths.length * 300);
    const holdAfterSignature = 100;

    setTimeout(() => {
        if (hello) hello.classList.add("fade-out");
        setTimeout(() => {
            if (hello) hello.remove();
            if (signatureContainer) signatureContainer.remove();
            boxes.forEach((box, index) => {
                setTimeout(() => box.classList.add("show"), index * 300);
            });
        }, 800);
    }, signatureAnimationDuration + holdAfterSignature);

    // Gradient background
    background.style.transition = "background-position 4s ease";
    setTimeout(() => { background.style.backgroundPosition = "40% 40%"; }, 500);
    setTimeout(() => { background.style.transition = "background-position 150ms linear"; }, 4200);

    let ticking = false;
    function updateGradientOnScroll() {
        const docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        const winH = window.innerHeight;
        const maxScroll = Math.max(0, docH - winH);
        let scrollPercent = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        scrollPercent = Math.min(1, Math.max(0, scrollPercent));
        const targetX = 40 + scrollPercent * 5;
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
    updateGradientOnScroll();

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetID = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetID);
            if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // -------- PROJECT MODAL (from Lean) --------
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.createElement('div');
    modal.classList.add('project-modal');
    modal.innerHTML = `
        <div class="project-modal-content">
            <span class="close-modal">&times;</span>
            <h3 class="modal-title"></h3>
            <p class="modal-details"></p>
        </div>`;
    document.body.appendChild(modal);

    const modalContent = modal.querySelector('.project-modal-content');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDetails = modal.querySelector('.modal-details');
    const closeModal = modal.querySelector('.close-modal');

    const projectDetails = {
        "32 Bit RISC-V CPU": "Designed a 32-bit RISC-V CPU implementing all 32 RV32I instructions. Major modules: Data Memory, Instruction Memory, Register file, ALU, logic solver. Verified with custom testbench. Future Scope: Pipelined implementation.",
        "32x8 SRAM Memory Array": "Designed a 256-bit SRAM Memory in Cadence Virtuoso. Each cell is 6T, arranged 32x8. Verified read/write of 32 ASCII characters. Future Scope: Integration with RISC-V CPU.",
        "Other Projects": "• Custom Transmission Gate D-FF in Cadence <br> • Drone with Arduino Nano flight controller <br> • 2N2222 FM Transmitter at 101 MHz, 12m range <br> • Aragog Spider Bot with 6 DoF"
    };

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').innerText.trim();
            modalTitle.textContent = title;
            modalDetails.innerHTML = projectDetails[title] || card.querySelector('p,ul')?.innerHTML || "";
            modal.style.display = 'flex';
        });
    });

    closeModal.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
});



    // -------- ACHIEVEMENT MODAL --------
    const achievementCards = document.querySelectorAll('.achievement-card');

    const achModal = document.createElement('div');
    achModal.classList.add('project-modal');
    achModal.innerHTML = `
        <div class="project-modal-content">
            <span class="close-modal">&times;</span>
            <h3 class="modal-title"></h3>
            <p class="modal-details"></p>
        </div>`;
    document.body.appendChild(achModal);

    const achModalTitle = achModal.querySelector('.modal-title');
    const achModalDetails = achModal.querySelector('.modal-details');
    const achCloseModal = achModal.querySelector('.close-modal');

    achievementCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.dataset.title || card.querySelector('h3').innerText;
            const details = card.dataset.details || card.querySelector('p').innerText;
            achModalTitle.textContent = title;
            achModalDetails.innerHTML = details;
            achModal.style.display = 'flex';
        });
    });

    achCloseModal.addEventListener('click', () => achModal.style.display = 'none');
    achModal.addEventListener('click', e => { if (e.target === achModal) achModal.style.display = 'none'; });


        // -------- ACHIEVEMENTS IMAGE CYCLER --------
        const achievementImages = document.querySelectorAll('.achievement-img');
        let currentAchIndex = 0;
    
        function showNextAchievement() {
            achievementImages.forEach(img => img.classList.remove('active'));
            achievementImages[currentAchIndex].classList.add('active');
            currentAchIndex = (currentAchIndex + 1) % achievementImages.length;
        }
    
        if (achievementImages.length > 0) {
            showNextAchievement();
            setInterval(showNextAchievement, 3000); // change every 3s
        }

        