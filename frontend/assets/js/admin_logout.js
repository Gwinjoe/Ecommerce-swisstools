import { gsap } from "gsap";

// Log script loading for debugging
console.log("logout.js loaded");

// Google Analytics event tracking function
function trackEvent(eventName, eventParams = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, eventParams);
  } else {
    console.warn("Google Analytics not loaded, event not tracked:", eventName, eventParams);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded fired");

  // Confirm logout button handler
  const confirmBtn = document.querySelector(".confirm-btn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      gsap.to(confirmBtn, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(confirmBtn, { scale: 1, duration: 0.1 });
          console.log("Logout confirmed");
          trackEvent("confirm_logout");
          // Redirect to login page (placeholder)
        }
      });
    });
  } else {
    console.error("Error: .confirm-btn not found");
  }

  // Cancel button handler
  const cancelBtn = document.querySelector(".cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      gsap.to(cancelBtn, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(cancelBtn, { scale: 1, duration: 0.1 });
          console.log("Logout cancelled");
          trackEvent("cancel_logout");
          // Redirect to dashboard
          window.location.href = "/admin";
        }
      });
    });
  } else {
    console.error("Error: .cancel-btn not found");
  }

  // Animate logout card
  const logoutCard = document.querySelector(".logout-card");
  if (logoutCard) {
    gsap.from(logoutCard, {
      opacity: 0,
      y: 50,
      duration: 0.7,
      ease: "power3.out"
    });
  } else {
    console.error("Error: .logout-card not found");
  }

  // Animate card elements
  const cardElements = document.querySelectorAll(".logout-card .logo, .logout-card h1, .logout-message, .logout-actions");
  if (cardElements.length) {
    gsap.from(cardElements, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.2
    });
  } else {
    console.error("Error: Logout card elements not found");
  }
});
