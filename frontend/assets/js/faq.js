import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Parallax Effect for Hero Background
gsap.to(".faq-hero", {
    backgroundPosition: "50% 100%",
    ease: "none",
    scrollTrigger: {
        trigger: ".faq-hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// Scroll Animations for Hero, FAQ, CTA, and Chat Button
document.querySelectorAll(".faq-animate-slide").forEach((el) => {
    gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none",
                onEnter: () => el.classList.add("visible")
            }
        }
    );
});

// FAQ Accordion Toggle
document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains("active");

        // Close all other FAQs
        document.querySelectorAll(".faq-item").forEach((item) => {
            if (item !== faqItem) {
                item.classList.remove("active");
                gsap.to(item.querySelector(".faq-answer"), {
                    maxHeight: 0,
                    padding: "0 20px",
                    duration: 0.3,
                    ease: "power2.in"
                });
                item.querySelector(".faq-toggle").classList.remove("fa-chevron-up");
                item.querySelector(".faq-toggle").classList.add("fa-chevron-down");
            }
        });

        // Toggle current FAQ
        faqItem.classList.toggle("active");
        const answer = faqItem.querySelector(".faq-answer");
        const toggleIcon = question.querySelector(".faq-toggle");

        if (!isActive) {
            gsap.to(answer, {
                maxHeight: 200,
                padding: "15px 20px",
                duration: 0.3,
                ease: "power2.out"
            });
            toggleIcon.classList.remove("fa-chevron-down");
            toggleIcon.classList.add("fa-chevron-up");
        } else {
            gsap.to(answer, {
                maxHeight: 0,
                padding: "0 20px",
                duration: 0.3,
                ease: "power2.in"
            });
            toggleIcon.classList.remove("fa-chevron-up");
            toggleIcon.classList.add("fa-chevron-down");
        }
    });
});

// FAQ Search Functionality
document.querySelector("#faq-search").addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll(".faq-item").forEach((item) => {
        const question = item.querySelector(".faq-question h3").textContent.toLowerCase();
        const answer = item.querySelector(".faq-answer p").textContent.toLowerCase();
        if (searchTerm === "" || question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = "block";
            gsap.to(item, { opacity: 1, duration: 0.3 });
        } else {
            gsap.to(item, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    item.style.display = "none";
                }
            });
        }
    });
});

// FAQ Category Filters
document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const category = btn.getAttribute("data-category");
        document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        document.querySelectorAll(".faq-item").forEach((item) => {
            const itemCategory = item.getAttribute("data-category");
            if (category === "all" || itemCategory === category) {
                item.style.display = "block";
                gsap.to(item, { opacity: 1, duration: 0.3 });
            } else {
                gsap.to(item, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        item.style.display = "none";
                    }
                });
            }
        });
    });
});

// Sticky Search Bar
const searchBar = document.querySelector(".search-bar");
const faqSection = document.querySelector(".faq-section");
let isSticky = false;

ScrollTrigger.create({
    trigger: faqSection,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
        if (self.isActive && !isSticky) {
            searchBar.classList.add("sticky");
            isSticky = true;
            gsap.to(searchBar, { y: 0, duration: 0.3, ease: "power2.out" });
        } else if (!self.isActive && isSticky) {
            searchBar.classList.remove("sticky");
            isSticky = false;
            gsap.to(searchBar, { y: 0, duration: 0.3, ease: "power2.out" });
        }
    }
});

// Progress Bar
const progressFill = document.querySelector(".progress-fill");
ScrollTrigger.create({
    trigger: ".faq-list",
    start: "top 80%",
    end: "bottom bottom",
    onUpdate: (self) => {
        const progress = self.progress * 100;
        progressFill.style.width = `${progress}%`;
    }
});

// Live Chat Button (Placeholder)
document.querySelector(".chat-btn").addEventListener("click", () => {
    alert("Live chat is not yet implemented. Contact us via course the Contact page!");
});

// Particle Animations
const sections = [
    { canvasId: "hero-particles", section: ".faq-hero", particleColor: "rgba(242, 140, 40, 0.6)" }, // Orange to match --primary-color
    { canvasId: "faq-particles", section: ".faq-section", particleColor: "rgba(200, 200, 200, 0.5)" }, // Light gray to match --secondary-color
    { canvasId: "cta-particles", section: ".cta-section", particleColor: "rgba(180, 180, 180, 0.5)" } // Darker gray to match --background-color
];

sections.forEach(({ canvasId, section, particleColor }) => {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    const sectionEl = document.querySelector(section);
    canvas.width = window.innerWidth;
    canvas.height = sectionEl.offsetHeight;

    const particles = [];
    const particleCount = 30;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 8 + 4;
            this.speedX = Math.random() * 1.5 - 0.75;
            this.speedY = Math.random() * 1.5 - 0.75;
            this.opacity = Math.random() * 0.3 + 0.2;
        }

        draw() {
            ctx.beginPath();
            ctx.fillStyle = particleColor;
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
        canvas.height = sectionEl.offsetHeight;
    });

    // Update canvas height on scroll if section height changes
    ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: () => {
            canvas.height = sectionEl.offsetHeight;
        }
    });
});