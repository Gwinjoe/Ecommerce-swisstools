import { gsap } from "gsap";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");
  const loginBtn = document.querySelector(".btn-primary");
  const emailLoginBtn = document.querySelector(".btn-email-login");
  const socialButtons = document.querySelectorAll(".btn-social");

  // Toggle email form visibility
  emailLoginBtn.addEventListener("click", () => {
    const isHidden = form.style.display === "none";
    form.style.display = isHidden ? "flex" : "none";
    gsap.to(form, {
      opacity: isHidden ? 1 : 0,
      height: isHidden ? "auto" : 0,
      duration: 0.5,
      ease: "power2.out"
    });
  });

  // Social login buttons (placeholder)
  socialButtons.forEach(button => {
    button.addEventListener("click", () => {
      const provider = button.classList.contains("btn-google") ? "Google" :
        button.classList.contains("btn-facebook") ? "Facebook" : "Twitter";
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          alert(`Login with ${provider} initiated!`); // Placeholder
        }
      });
    });
  });

  // Form validation
  loginBtn.addEventListener("click", (e) => {
    const inputs = form.querySelectorAll("input[required]");
    let isValid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        gsap.to(input, {
          borderColor: "#e63946",
          duration: 0.3,
          yoyo: true,
          repeat: 1
        });
      }
    });

    if (isValid) {
      gsap.to(loginBtn, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          alert("Login successful!"); // Placeholder
        }
      });
    } else {
      alert("Please fill in all required fields.");
    }
  });

  // Animate form and title on page load
  gsap.fromTo(".login-title",
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
  );

  gsap.fromTo(".login-form-container",
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.2 }
  );
});
