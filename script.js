// script.js
document.addEventListener('DOMContentLoaded', () => {
    const achievementImages = document.querySelectorAll('.achievement-img');
    const background = document.querySelector(".background");
    let currentIndex = 0;

    // Show achievement images in a cycle
    function showNextImage() {
        achievementImages.forEach(img => img.classList.remove('active'));
        achievementImages[currentIndex].classList.add('active');
        currentIndex = (currentIndex + 1) % achievementImages.length;
    }

    // Start the image cycle
    showNextImage();
    setInterval(showNextImage, 3000);

    // Animate gradient on page load
    background.style.transition = "background-position 4s ease";
    setTimeout(() => {
        background.style.backgroundPosition = "40% 40%";
    }, 500);

    
    // Scroll-controlled gradient movement
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

    // initial gradient pos
    updateGradientOnScroll();

    // Smooth scroll and active section tracking
    const header = document.querySelector('.main-header');
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('section');
    const headerHeight = header.offsetHeight;

    function updateActiveSection() {
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                const id = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(id)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveSection);
    document.addEventListener('DOMContentLoaded', updateActiveSection);

    // Smooth scroll with header offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Project modal functionality
    const projectTiles = document.querySelectorAll('.project-tile');
    const projectModal = document.querySelector('.project-modal');
    const modalContent = projectModal.querySelector('.project-modal-content');
    const modalImg = modalContent.querySelector('.modal-img');
    const modalTitle = modalContent.querySelector('.modal-title');
    const modalBrief = modalContent.querySelector('.modal-brief');
    const modalDetails = modalContent.querySelector('.modal-details');
    const closeModal = modalContent.querySelector('.close-modal');

    // Project details data
    const projectDetails = {
        1: {
            title: "32 Bit RISCV CPU",
            // brief: "Designed a 32-bit RISC-V CPU which can process all 32 instructions. Major modules include Data Memory, Instruction Memory, Register file and logic solver.",
            details: "Designed a 32-bit RISC-V CPU which can process all 32 instructions in RV32I instruction set. Instructions from Instr_mem is fed into the CPU core which decodes the instructions and routes the data from instr to different appropriate modules like ALU, register file and extenderes. Major modules include Data Memory, Instruction Memory, Register file and logic solver. Working of the CPU is tested with a custom testbench code. The entire project is programmed using Verilog HDL. Future Scope: Making pipelined machine for all the 32 instructions. Tech Stack: Quartus Prime, Vivado, ModelSim, Waves. Project Outcome: CPU Design, Verilog HDL, Testbench, Simulation, Digital Design, Computer Architecture, RISC-V Instruction Set Architecture (ISA)",
        },
        2: {
            title: "32X8 SRAM Memory Array design",
            // brief: "Real-time signal processing using FPGA",
            details: "Designed a 256 Bit SRAM Memory model in Cadence Virtuoso. The fabric of 32X8 bit cells hold the total of 32 ASCII characters. Each bit cell consists of 6 n/pMOS. Operations and states of the cells are controlled by a Word Line(WL), Bit Line(QB) and Bit line Bar(QBB). Each column is connected to Sense Amplifiers(SA) for reading latched values. Data is taken out one byte at a time, 32 times. Design is tested by writing 32-byte ASCII letters and read back after 10 clocks. Future scopes: Integrate this SRAM memory model with the 32-Bit RISC machine and hopefully create a full-fledged working chip. Tech Stack: Cadence, VMWare. Project Outcome: Memory Architecture, Memory Design, Working of storage space, Scalling of storage space"
        },
        // 3: {
        //     title: "IoT Home Automation",
        //     brief: "Smart home system with IoT integration",
        //     details: "Built a smart home automation system using IoT protocols for seamless device communication. Integrated sensors and actuators with a central microcontroller hub, enabling remote control via a mobile app. Implemented MQTT for efficient data transfer and ensured system security."
        // },
        // 4: {
        //     title: "Embedded System Design",
        //     brief: "Microcontroller-based sensor network",
        //     details: "Developed a sensor network using microcontrollers for environmental monitoring. Designed custom PCB layouts and programmed firmware in C to collect and process sensor data. The system was optimized for low power consumption and reliable data transmission."
        // },
        // 5: {
        //     title: "ASIC Verification",
        //     brief: "UVM-based verification of ASIC modules",
        //     details: "Performed functional verification of ASIC modules using the Universal Verification Methodology (UVM). Developed testbenches in SystemVerilog and created comprehensive test plans to ensure design reliability. Achieved high coverage metrics and identified critical bugs."
        // },
        // 6: {
        //     title: "Wireless Communication",
        //     brief: "Bluetooth-based data transfer system",
        //     details: "Designed a Bluetooth-based wireless communication system for reliable data transfer between devices. Implemented firmware for Bluetooth Low Energy (BLE) modules and developed a user interface for data visualization. Optimized for low latency and high data integrity."
        // }
    };

    projectTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            const projectId = tile.getAttribute('data-project');
            const project = projectDetails[projectId];
            
            // Reset scroll position before showing
            modalContent.scrollTop = 0;
            
            modalImg.src = tile.querySelector('.project-img').src;
            modalTitle.textContent = project.title;
            modalBrief.textContent = project.brief;
            // Clear existing content
            modalDetails.innerHTML = '';
            
            // Split and process sections
            const sections = project.details.split(/(Future Scopes?:|Tech Stacks?:|Project Outcomes?:)/i);
            const mainDescription = sections[0].trim();
            const sectionContents = [];
            
            // Group sections with their content
            for (let i = 1; i < sections.length; i += 2) {
                const title = sections[i].replace(/:/g, '').trim();
                const content = sections[i+1].trim();
                if (content) {
                    sectionContents.push({
                        title: title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(),
                        items: content.split(/[,.] /).filter(item => item.trim())
                    });
                }
            }

            // Add main description
            const desc = document.createElement('p');
            desc.textContent = mainDescription;
            modalDetails.appendChild(desc);

            // Add each section dynamically
            sectionContents.forEach(({title, items}) => {
                const sectionDiv = document.createElement('div');
                sectionDiv.innerHTML = `
                    <h4>${title}</h4>
                    <ul>
                        ${items.map(item => `<li>${item.replace(/\.$/, '')}</li>`).join('')}
                    </ul>
                `;
                modalDetails.appendChild(sectionDiv);
            });
            
            projectModal.style.display = 'flex';
        });
    });

    closeModal.addEventListener('click', () => {
        projectModal.style.display = 'none';
    });

    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.style.display = 'none';
        }
    });
});
