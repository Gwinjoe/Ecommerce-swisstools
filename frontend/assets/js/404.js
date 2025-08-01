import { gsap } from "gsap";

document.addEventListener("DOMContentLoaded", () => {
    // Animate title
    gsap.fromTo(
        ".error-title",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)" }
    );

    // Animate message and submessage
    gsap.fromTo(
        [".error-message", ".error-submessage"],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.2, delay: 0.3 }
    );

    // Animate button
    gsap.fromTo(
        ".btn-home",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.6 }
    );

    // Animate social icons
    gsap.fromTo(
        ".social-icon",
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out", stagger: 0.1, delay: 0.8 }
    );
});