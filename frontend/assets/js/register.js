import { gsap } from "gsap";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".register-form");
  const registerBtn = document.querySelector(".btn-primary");
  const emailRegisterBtn = document.querySelector(".btn-email-register");
  const socialButtons = document.querySelectorAll(".btn-social");

  // Toggle email form visibility
  emailRegisterBtn.addEventListener("click", () => {
    const isHidden = form.style.display === "none";
    form.style.display = isHidden ? "flex" : "none";
    gsap.to(form, {
      opacity: isHidden ? 1 : 0,
      height: isHidden ? "auto" : 0,
      duration: 0.5,
      ease: "power2.out"
    });
  });

  // Social register buttons (placeholder)
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
          alert(`Register with ${provider} initiated!`); // Placeholder
        }
      });
    });
  });

  // Form validation
  registerBtn.addEventListener("click", (e) => {
    const inputs = form.querySelectorAll("input[required]");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
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

    if (password.value !== confirmPassword.value) {
      isValid = false;
      gsap.to([password, confirmPassword], {
        borderColor: "#e63946",
        duration: 0.3,
        yoyo: true,
        repeat: 1
      });
      alert("Passwords do not match!");
    }

    if (isValid) {
      gsap.to(registerBtn, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          alert("Registration successful!"); // Placeholder
        }
      });
    } else {
      alert("Please fill in all required fields.");
    }
  });

  // Animate form and title on page load
  gsap.fromTo(".register-title",
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
  );

  gsap.fromTo(".register-form-container",
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.2 }
  );
});
