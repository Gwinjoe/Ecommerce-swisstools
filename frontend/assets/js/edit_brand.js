import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import showStatusModal from "./modal.js";

gsap.registerPlugin(ScrollTrigger);

// Sample category data (replace with actual data from your backend)
const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get('id');


const response = await fetch(`/api/brand/${categoryId}`);
const { result } = await response.json();


const category = result;
const menuToggle = document.querySelector(".menu-toggle");
const headerExtras = document.querySelector(".header-extras");
const themeToggleBtn = document.querySelector(".theme-toggle-btn");
const languageToggle = document.querySelector(".language-toggle");
const languageSelector = document.querySelector(".language-selector");
const notificationBtn = document.querySelector(".notification-btn");
const settingsBtn = document.querySelector(".settings-btn");
const userProfile = document.querySelector(".user-profile");
const scrollTopBtn = document.querySelector(".scroll-top-btn");
const yearSpan = document.querySelector(".year");
const newsletterForm = document.querySelector(".footer-newsletter");
const form = document.querySelector(".category-form");

// Set current year in footer
yearSpan.textContent = new Date().getFullYear();

// Header Animations
gsap.from(".sticky-header", {
  y: -100,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out",
  delay: 0.2
});

gsap.from(".logo", {
  x: -50,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out",
  delay: 0.4
});

gsap.from(".header-extras > *", {
  x: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: "power2.out",
  delay: 0.6
});

// Footer Animations
gsap.from(".footer-column", {
  y: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".site-footer",
    start: "top 80%",
    toggleActions: "play none none none"
  }
});

gsap.from(".footer-bottom", {
  y: 20,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".footer-bottom",
    start: "top 90%",
    toggleActions: "play none none none"
  }
});

// Scroll to Top Button
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

ScrollTrigger.create({
  trigger: document.body,
  start: "top -200",
  end: "bottom bottom",
  onUpdate: (self) => {
    scrollTopBtn.classList.toggle("active", self.progress > 0.1);
  }
});

// Menu Toggle
menuToggle.addEventListener("click", () => {
  headerExtras.classList.toggle("active");
  gsap.to(headerExtras, {
    height: headerExtras.classList.contains("active") ? "auto" : 0,
    opacity: headerExtras.classList.contains("active") ? 1 : 0,
    duration: 0.3,
    ease: "power2.out"
  });
});

// Theme Toggle
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeToggleBtn.querySelector("i").classList.toggle("fa-moon", !isDark);
  themeToggleBtn.querySelector("i").classList.toggle("fa-sun", isDark);
  document.documentElement.style.setProperty("--background-color", isDark ? "#1c1c1c" : "#e5e5e5");
  document.documentElement.style.setProperty("--card-bg", isDark ? "#2c2c2c" : "#fff");
  document.documentElement.style.setProperty("--text-color", isDark ? "#ccc" : "#333");
});

// Language Selector
languageToggle.addEventListener("click", () => {
  languageSelector.classList.toggle("active");
});

document.querySelectorAll(".language-options li").forEach(item => {
  item.addEventListener("click", () => {
    const lang = item.getAttribute("data-lang");
    console.log(`Language selected: ${lang}`); // Replace with actual language switch logic
    languageSelector.classList.remove("active");
  });
});

// Profile Dropdown
userProfile.addEventListener("click", () => {
  userProfile.classList.toggle("active");
});

// Notification Button
notificationBtn.addEventListener("click", () => {
  console.log("Notifications opened"); // Replace with actual notification logic
});

// Settings Button
settingsBtn.addEventListener("click", () => {
  console.log("Settings opened"); // Replace with actual settings logic
});

// Newsletter Subscription
newsletterForm.querySelector("button").addEventListener("click", () => {
  const email = newsletterForm.querySelector("input").value;
  if (email) {
    console.log(`Subscribed with email: ${email}`); // Replace with actual subscription logic
    newsletterForm.querySelector("input").value = "";
  }
});

// Close dropdowns when clicking outside
document.addEventListener("click", (e) => {
  if (!languageSelector.contains(e.target) && !languageToggle.contains(e.target)) {
    languageSelector.classList.remove("active");
  }
  if (!userProfile.contains(e.target)) {
    userProfile.classList.remove("active");
  }
});

// Load Category Details
function loadCategoryDetails() {
  try {
    if (category) {
      document.querySelector(".category-id").value = category._id;
      document.querySelector(".category-name").value = category.name;
      document.querySelector(".category-description").value = category.description || "";
    } else {
      document.querySelector(".category-form").innerHTML = "<p>Category not found.</p>";
    }

    gsap.from(".category-form", {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: "power2.out"
    });
  } catch (error) {
    console.error("Error loading category details:", error);
  }
}

// Form Submission
document.querySelector(".save-btn").addEventListener("click", async function() {
  try {
    const id = document.querySelector(".category-id").value;
    const name = document.querySelector(".category-name").value;
    const description = document.querySelector(".category-description").value;

    // Simulate updating category (replace with AJAX call to edit_category.html)
    console.log(`Category ${id} updated: ${name}, Description: ${description}`);
    const response = await fetch("/api/edit_brand", { method: "PUT", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, name, description }) });
    const result = await response.json();
    if (result.success) {
      showStatusModal("success");
    } else {
      showStatusModal("failed");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
});

// Initial Load
loadCategoryDetails();
