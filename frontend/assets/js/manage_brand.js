import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import showStatusModal from "./modal.js";

gsap.registerPlugin(ScrollTrigger);

// Sample categories data (replace with actual data from your backend)



const response = await fetch("/api/brands");
const { data } = await response.json();
const categories = data;

const tableBody = document.querySelector(".categories-table tbody");
const modal = document.querySelector(".modal");
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

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  if (modal.classList.contains("active") && !e.target.closest(".modal-content") && !e.target.closest(".delete-btn")) {
    closeModal();
  }
});

// Table Rendering
function renderTable(data) {
  try {
    tableBody.innerHTML = "";
    data.forEach(category => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${category._id}</td>
                <td>${category.name}</td>
                <td>${category.description || "No description"}</td>
                <td>
                    <a href="/admin/view_brand?id=${category._id}" class="action-link"><i class="fas fa-eye"></i></a>
                    <a href="/admin/edit_brand?id=${category._id}" class="action-link"><i class="fas fa-edit"></i></a>
                    <button class="action-btn delete-btn" data-id="${category._id}" data-name="${category.name}"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
      tableBody.appendChild(row);
    });

    gsap.from("tr", {
      opacity: 0,
      y: 10,
      stagger: 0.1,
      duration: 0.3
    });
  } catch (error) {
    console.error("Error rendering table:", error);
  }
}

// Event Delegation for Delete Button
tableBody.addEventListener("click", (e) => {
  const button = e.target.closest(".delete-btn");
  if (button) {
    const id = button.getAttribute("data-id");
    const name = button.getAttribute("data-name");
    openDeleteModal(id, name);
  }
});

// Event Delegation for Close Button
document.querySelector(".modal").addEventListener("click", (e) => {
  if (e.target.closest(".close-modal")) {
    closeModal();
  }
});

// Delete Confirmation Modal
function openDeleteModal(id, name) {
  try {
    const modalTitle = document.querySelector(".modal-title");
    const categoryName = document.querySelector(".category-name");
    const confirmButton = document.querySelector(".confirm-delete");

    modalTitle.innerHTML = `<i class="fas fa-trash-alt"></i> Confirm Deletion`;
    categoryName.textContent = name;
    confirmButton.setAttribute("data-id", id);

    modal.style.display = "flex";
    modal.classList.add("active");

    gsap.from(".modal-content", {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: "back.out(1.7)"
    });
  } catch (error) {
    console.error("Error opening delete modal:", error);
  }
}

function closeModal() {
  try {
    gsap.to(".modal-content", {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      ease: "back.in(1.7)",
      onComplete: () => {
        modal.classList.remove("active");
        modal.style.display = "none";
      }
    });
  } catch (error) {
    console.error("Error closing modal:", error);
  }
}

// Confirm Delete
document.querySelector(".confirm-delete").addEventListener("click", async (e) => {
  try {
    const id = e.target.getAttribute("data-id");
    const index = categories.findIndex(c => c._id == id);
    if (index !== -1) {
      categories.splice(index, 1);
      const response = await fetch(`/api/delete_brand/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (result.success) {
        showStatusModal("success");
      } else {
        showStatusModal("failed");
      }
      console.log(`Category ${id} deleted`); // Replace with AJAX call to delete_category.php
      renderTable(categories);
      closeModal();
    }
  } catch (error) {
    console.error("Error deleting category:", error);
  }
});

// Search & Sort
document.querySelector(".search-input").addEventListener("input", function() {
  try {
    const value = this.value.toLowerCase();
    const filtered = categories.filter(c => c.name.toLowerCase().includes(value));
    renderTable(filtered);
  } catch (error) {
    console.error("Error in search:", error);
  }
});

document.querySelector(".sort-select").addEventListener("change", function() {
  try {
    const val = this.value;
    if (val === "name") {
      categories.sort((a, b) => a.name.localeCompare(b.name));
    } else if (val === "id") {
      categories.sort((a, b) => a.id - b.id);
    }
    renderTable(categories);
  } catch (error) {
    console.error("Error in sort:", error);
  }
});

// Initial Render
renderTable(categories);
