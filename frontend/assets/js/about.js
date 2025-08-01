import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    // Update footer year
    document.getElementById("year").textContent = new Date().getFullYear();

    // CTA section animation
    gsap.from(".cta-section", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out"
    });

    // Hero section animations
    gsap.from(".hero-content", {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: "power3.out"
    });

    gsap.from(".hero-icons i", {
        opacity: 0,
        scale: 0,
        duration: 1,
        stagger: 0.2,
        ease: "elastic.out(1, 0.5)",
        delay: 0.5
    });

    gsap.to(".hero-icons i", {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: "none"
    });

    // Story section 3D tilt animation
    gsap.from(".story-content", {
        opacity: 0,
        rotationX: 20,
        y: 50,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".about-story",
            start: "top 80%"
        }
    });

    // Offer section animation
    gsap.from(".offer-item", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".offer-grid",
            start: "top 80%"
        }
    });

    gsap.from(".offer-item i", {
        scale: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: ".offer-grid",
            start: "top 80%"
        }
    });

    // Why Choose Us section animation
    gsap.from(".why-choose-item", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".why-choose-grid",
            start: "top 80%"
        }
    });

    gsap.from(".why-choose-item i", {
        scale: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: ".why-choose-grid",
            start: "top 80%"
        }
    });

    // Ingco section animation
    gsap.from(".about-ingco", {
        opacity: 0,
        rotationX: 20,
        y: 50,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".about-ingco",
            start: "top 80%"
        }
    });

    // Mission section animation
    gsap.from(".mission-item", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".mission-grid",
            start: "top 80%"
        }
    });

    gsap.from(".mission-item i", {
        scale: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: ".mission-grid",
            start: "top 80%"
        }
    });

    // Team section animation
    gsap.from(".team-member", {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".team-grid",
            start: "top 80%"
        }
    });

    // Testimonials section animation
    gsap.from(".testimonials-slider", {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: ".about-testimonials",
            start: "top 80%"
        }
    });

    // Particle animations for all sections
    document.querySelectorAll(".particle").forEach((particle, index) => {
        gsap.to(particle, {
            x: () => Math.random() * 100 - 50,
            y: () => Math.random() * 100 - 50,
            opacity: 0.2,
            duration: 5 + Math.random() * 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.5
        });
    });

    // Swiper for testimonials
    new Swiper(".testimonials-slider", {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },
        breakpoints: {
            768: {
                slidesPerView: 2
            }
        }
    });

    // Scroll to top button
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = "block";
        } else {
            scrollTopBtn.style.display = "none";
        }
    });
});