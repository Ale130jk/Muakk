document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    // Definimos los colores solicitados
    const colors = ['#9c27b0', '#ff4b72', '#f06292', '#ba68c8', '#e91e63']; 
    const numberOfParticles = window.innerWidth < 768 ? 30 : 60; // Optimización para móviles

    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    class Particle {
        constructor() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.size = Math.random() * 8 + 5; // Corazones un poco más visibles
            this.speedY = Math.random() * 0.8 + 0.3; 
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.6 + 0.2;
            this.rotation = Math.random() * Math.PI; // Rotación inicial aleatoria
            this.rotationSpeed = Math.random() * 0.02 - 0.01;
        }

        // Función matemática para dibujar el corazón en el Canvas
        drawHeart(x, y, size) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(this.rotation);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            // Curvas de Bézier para formar el corazón
            ctx.bezierCurveTo(0, -size / 2, -size, -size / 2, -size, 0);
            ctx.bezierCurveTo(-size, size / 1.5, 0, size, 0, size * 1.3);
            ctx.bezierCurveTo(0, size, size, size / 1.5, size, 0);
            ctx.bezierCurveTo(size, -size / 2, 0, -size / 2, 0, 0);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            if (this.y > window.innerHeight + 20) {
                this.y = -20;
                this.x = Math.random() * window.innerWidth;
            }
        }

        draw() {
            this.drawHeart(this.x, this.y, this.size);
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    // --- Mantenemos la lógica de GSAP igual ---
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".glass-card", {
        y: 50, opacity: 0, duration: 1.5, ease: "power3.out"
    });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".reveal-section",
            start: "top 60%",
            end: "top 20%",
            scrub: 1, // Esto hace que el corazón aparezca al ritmo del scroll
        }
    });

    tl.to(".animated-heart", { opacity: 1, scale: 1.5, duration: 1 })
      .to(".reveal-text", { opacity: 1, y: 0, duration: 1 }, "-=0.5");
});
