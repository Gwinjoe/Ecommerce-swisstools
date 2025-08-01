import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Ken Burns Effect for Hero Image
gsap.to(".hero-image", {
    scale: 1.2,
    duration: 10,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
});

// Scroll Animations for Contact and Map Sections
document.querySelectorAll(".animate-fade").forEach((el) => {
    gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        }
    );
});

// Form Submission (Placeholder for future backend integration)
document.querySelector(".submit-btn").addEventListener("click", (e) => {
    e.preventDefault();
    const inputs = document.querySelectorAll(".form-container input, .form-container textarea");
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = "red";
        } else {
            input.style.borderColor = "#ddd";
        }
    });

    if (isValid) {
        gsap.to(".form-container", {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                alert("Message sent successfully!");
                inputs.forEach(input => (input.value = ""));
                gsap.to(".form-container", { opacity: 1, duration: 0.5 });
            }
        });
    } else {
        alert("Please fill out all fields.");
    }
});

// Particle Animation for Hero Background
const canvas = document.createElement("canvas");
canvas.id = "particle-canvas";
document.querySelector(".hero-section").appendChild(canvas);

const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = document.querySelector(".hero-section").offsetHeight;

const particles = [];
const particleCount = 50;

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 10 + 5;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(242, 140, 40, ${this.opacity})`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.closePath();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        this.draw();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => particle.update());
    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = document.querySelector(".hero-section").offsetHeight;
});