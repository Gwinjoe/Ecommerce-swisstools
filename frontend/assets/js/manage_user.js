import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import showStatusModal from "./modal.js"

gsap.registerPlugin(ScrollTrigger);

const response = await fetch("/api/users");
const { data } = await response.json();
const users = data;

const tableBody = document.getElementById("userTableBody");
const modal = document.getElementById("userModal");
const yearSpan = document.querySelector(".year");
const menuToggle = document.querySelector(".menu-toggle");
const headerExtras = document.querySelector(".header-extras");
const themeToggleBtn = document.querySelector(".theme-toggle-btn");
const languageToggle = document.querySelector(".language-toggle");
const languageSelector = document.querySelector(".language-selector");
const notificationBtn = document.querySelector(".notification-btn");
const settingsBtn = document.querySelector(".settings-btn");
const userProfile = document.querySelector(".user-profile");
const scrollTopBtn = document.querySelector(".scroll-top-btn");
const newsletterForm = document.querySelector(".footer-newsletter");

let isModalAnimating = false;

// Set current year in footer
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Header Animations
gsap.from(".sticky-header", { y: -100, opacity: 0, duration: 0.8, ease: "power2.out", delay: 0.2 });
gsap.from(".logo", { x: -50, opacity: 0, duration: 0.8, ease: "power2.out", delay: 0.4 });
gsap.from(".header-extras > *", { x: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.6 });

// Footer Animations
gsap.from(".footer-column", {
  y: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2,
  ease: "power2.out",
  scrollTrigger: { trigger: ".site-footer", start: "top 80%", toggleActions: "play none none none" }
});
gsap.from(".footer-bottom", {
  y: 20,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out",
  scrollTrigger: { trigger: ".footer-bottom", start: "top 90%", toggleActions: "play none none none" }
});

// Scroll to Top Button
if (scrollTopBtn) {
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
}

// Menu Toggle
if (menuToggle && headerExtras) {
  menuToggle.addEventListener("click", () => {
    headerExtras.classList.toggle("active");
    gsap.to(headerExtras, {
      height: headerExtras.classList.contains("active") ? "auto" : 0,
      opacity: headerExtras.classList.contains("active") ? 1 : 0,
      duration: 0.3,
      ease: "power2.out"
    });
  });
}

// Theme Toggle
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    themeToggleBtn.querySelector("i").classList.toggle("fa-moon", !isDark);
    themeToggleBtn.querySelector("i").classList.toggle("fa-sun", isDark);
  });
}

// Language Selector
if (languageToggle && languageSelector) {
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
}

// Profile Dropdown
if (userProfile) {
  userProfile.addEventListener("click", () => {
    userProfile.classList.toggle("active");
  });
}

// Notification Button
if (notificationBtn) {
  notificationBtn.addEventListener("click", () => {
    console.log("Notifications opened"); // Replace with actual notification logic
  });
}

// Settings Button
if (settingsBtn) {
  settingsBtn.addEventListener("click", () => {
    console.log("Settings opened"); // Replace with actual settings logic
  });
}

// Newsletter Subscription
if (newsletterForm) {
  newsletterForm.querySelector("button").addEventListener("click", () => {
    const email = newsletterForm.querySelector("input").value.trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log(`Subscribed with email: ${email}`); // Replace with actual subscription logic
      newsletterForm.querySelector("input").value = "";
    } else {
      console.log("Invalid email");
    }
  });
}

// Close dropdowns when clicking outside
document.addEventListener("click", (e) => {
  if (languageSelector && languageToggle && !languageSelector.contains(e.target) && !languageToggle.contains(e.target)) {
    languageSelector.classList.remove("active");
  }
  if (userProfile && !userProfile.contains(e.target)) {
    userProfile.classList.remove("active");
  }
});

// Table Rendering
function renderTable(data) {
  if (!tableBody) return;
  tableBody.innerHTML = "";
  data.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${sanitizeInput(user.name)}</td>
            <td>${sanitizeInput(user.email)}</td>
            <td>${sanitizeInput(user.status)}</td>
            <td>${sanitizeInput(user.admin)}</td>
            <td>
                <button class="action-btn" data-action="view" data-id="${user._id}" aria-label="View User"><i class="fas fa-eye"></i></button>
                <button class="action-btn" data-action="edit" data-id="${user._id}" aria-label="Edit User"><i class="fas fa-edit"></i></button>
                <button class="action-btn" data-action="delete" data-id="${user._id}" aria-label="Delete User"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
    tableBody.appendChild(row);
  });
  gsap.from("tr", { opacity: 0, y: 10, stagger: 0.1, duration: 0.3 });
}

// Input Sanitization
function sanitizeInput(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

// Modal Functions
window.openModal = function(mode, id = null) {
  if (!modal || isModalAnimating) return;
  isModalAnimating = true;

  // Ensure modal is reset
  modal.classList.remove("active");
  gsap.set(".modal-content", { scale: 1, opacity: 1 });

  const title = document.getElementById("modalTitle");
  const userIdInput = document.getElementById("userId");
  const nameInput = document.getElementById("userName");
  const emailInput = document.getElementById("userEmail");
  const statusInput = document.getElementById("userStatus");
  const saveButton = document.querySelector(".save-user");

  if (!title || !userIdInput || !nameInput || !emailInput || !statusInput || !saveButton) {
    isModalAnimating = false;
    return;
  }

  userIdInput.value = "";
  nameInput.value = "";
  emailInput.value = "";
  statusInput.value = "active";

  if (mode === "add") {
    title.innerHTML = `<i class="fas fa-user-plus"></i> Add User`;
    nameInput.disabled = false;
    emailInput.disabled = false;
    statusInput.disabled = false;
    saveButton.style.display = "block";
  } else {
    const user = users.find(u => u.id === id);
    if (!user) {
      isModalAnimating = false;
      return;
    }

    userIdInput.value = user.id;
    nameInput.value = user.name;
    emailInput.value = user.email;
    statusInput.value = user.status;

    title.innerHTML = `<i class="fas fa-user-${mode === "edit" ? "edit" : ""}"></i> ${mode === "edit" ? "Edit" : "View"} User`;
    nameInput.disabled = mode === "view";
    emailInput.disabled = mode === "view";
    statusInput.disabled = mode === "view";
    saveButton.style.display = mode === "view" ? "none" : "block";
  }

  modal.classList.add("active");
  gsap.fromTo(
    ".modal-content",
    { scale: 0.8, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: "back.out(1.7)",
      onComplete: () => {
        isModalAnimating = false;
      }
    }
  );
};

window.closeModal = function() {
  if (!modal || isModalAnimating) return;
  isModalAnimating = true;

  gsap.to(".modal-content", {
    scale: 0.8,
    opacity: 0,
    duration: 0.3,
    ease: "back.in(1.7)",
    onComplete: () => {
      modal.classList.remove("active");
      gsap.set(".modal-content", { scale: 1, opacity: 1 });
      isModalAnimating = false;
    }
  });
};

window.deleteUser = async function(id) {
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    const res = await fetch(`/api/delete_user/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'appliation/json',
      }
    });
    const { success } = await res.json();
    if (success) {
      showStatusModal("success");
    } else {
      showStatusModal("failed")
    }


    renderTable(users);
  }
};

window.saveUser = async function() {
  const userIdInput = document.getElementById("userId");
  const nameInput = document.getElementById("userName");
  const passwordInput = document.getElementById("password")
  const emailInput = document.getElementById("userEmail");
  const statusInput = document.getElementById("userStatus");

  if (!userIdInput || !nameInput || !emailInput || !statusInput) return;

  const id = userIdInput.value;
  const name = sanitizeInput(nameInput.value.trim());
  const email = sanitizeInput(emailInput.value.trim());
  const status = statusInput.value;
  const password = passwordInput.value;

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.log("Invalid input");
    return;
  }

  if (id) {
    const user = users.find(u => u.id == id);
    if (user) {
      user.name = name;
      user.email = email;
      user.status = status;
    }
  } else {
    const response = await fetch("/api/add_user", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        admin: status,
        password
      })
    });
    const { success } = await response.json();
    if (success) {
      showStatusModal("success");
    } else {
      showStatusModal("failed");
    }
    users.push({ id: Date.now(), name, email, status });
  }

  renderTable(users);
  closeModal();
};

// Event Delegation for Action Buttons
if (tableBody) {
  tableBody.addEventListener("click", (e) => {
    const button = e.target.closest(".action-btn");
    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === "view" || action === "edit") {
      openModal(action, id);
    } else if (action === "delete") {
      deleteUser(id);
    }
  });
}

// Search & Sort
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

if (searchInput) {
  searchInput.addEventListener("input", function() {
    const value = this.value.toLowerCase().trim();
    const filtered = users.filter(u => u.name.toLowerCase().includes(value) || u.email.toLowerCase().includes(value));
    renderTable(filtered);
  });
}

if (sortSelect) {
  sortSelect.addEventListener("change", function() {
    const val = this.value;
    if (val === "name") {
      users.sort((a, b) => a.name.localeCompare(b.name));
    } else if (val === "email") {
      users.sort((a, b) => a.email.localeCompare(b.email));
    }
    renderTable(users);
  });
}

// Initial Render
renderTable(users);
