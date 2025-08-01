import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Log script loading for debugging
console.log("profile.js loaded");

try {
    gsap.registerPlugin(ScrollTrigger);
} catch (error) {
    console.error("Failed to register GSAP ScrollTrigger:", error);
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded fired");

    // Dummy data for recent activity
    const recentActivity = [
        { id: 1, action: "Added Construction Hammer to wishlist", date: "2025-07-05" },
        { id: 2, action: "Placed order #O001", date: "2025-07-03" },
        { id: 3, action: "Added Power Drill to wishlist", date: "2025-07-01" },
        { id: 4, action: "Updated profile information", date: "2025-06-28" },
        { id: 5, action: "Placed order #O002", date: "2025-06-25" }
    ];

    // Render recent activity
    function renderActivity() {
        const activityList = document.querySelector(".activity-list");
        if (!activityList) {
            console.error("Error: .activity-list element not found");
            return;
        }
        if (!recentActivity.length) {
            console.warn("Warning: recentActivity data is empty");
            activityList.innerHTML = "<li>No recent activity available</li>";
            return;
        }

        activityList.innerHTML = recentActivity.map(item => `
            <li data-id="${item.id}">${item.action} <span>(${item.date})</span></li>
        `).join("");
        gsap.from(".activity-list li", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out"
        });

        // Use event delegation for activity items
        activityList.addEventListener("click", (e) => {
            const item = e.target.closest("li[data-id]");
            if (item) {
                console.log(`Clicked activity: ${item.dataset.id} - ${item.textContent}`);
            }
        });
    }

    // Initialize activity list
    try {
        renderActivity();
    } catch (error) {
        console.error("Error rendering activity list:", error);
    }

    // Edit Profile Modal
    const editProfileBtn = document.querySelector(".edit-profile-btn");
    const editProfileModal = document.querySelector(".edit-profile-modal");
    const closeProfileBtn = document.querySelector(".close-profile");
    const saveProfileBtn = document.querySelector(".save-profile");
    const deleteAccountBtn = document.querySelector(".delete-account-btn");

    if (!editProfileBtn) console.error("Error: .edit-profile-btn not found");
    if (!editProfileModal) console.error("Error: .edit-profile-modal not found");
    if (!closeProfileBtn) console.error("Error: .close-profile not found");
    if (!saveProfileBtn) console.error("Error: .save-profile not found");
    if (!deleteAccountBtn) console.error("Error: .delete-account-btn not found");

    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", () => {
            if (editProfileModal) {
                editProfileModal.classList.add("active");
                gsap.fromTo(".edit-profile-content",
                    { scale: 0.8, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
                );
            }
        });
    }

    if (closeProfileBtn) {
        closeProfileBtn.addEventListener("click", () => {
            if (editProfileModal) {
                gsap.to(".edit-profile-content", {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => editProfileModal.classList.remove("active")
                });
            }
        });
    }

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener("click", () => {
            const form = document.querySelector(".edit-profile-form");
            if (form) {
                const formData = {
                    name: form.querySelector("#edit-name")?.value,
                    address: form.querySelector("#edit-address")?.value,
                    phone: form.querySelector("#edit-phone")?.value,
                    password: form.querySelector("#edit-password")?.value,
                    profilePic: form.querySelector("#edit-profile-pic")?.files[0]?.name
                };
                console.log("Profile form submission:", formData);
            }
            if (editProfileModal) {
                gsap.to(".edit-profile-content", {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => editProfileModal.classList.remove("active")
                });
            }
        });
    }

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to delete your account?")) {
                console.log("Delete account initiated");
                alert("Account deletion requested (placeholder)");
            }
        });
    }

    // Header Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navList = document.querySelector(".nav-list");
    const menuIcon = document.querySelector(".menu-icon");
    if (menuToggle && navList && menuIcon) {
        menuToggle.addEventListener("click", () => {
            navList.classList.toggle("active");
            menuIcon.classList.toggle("fa-bars");
            menuIcon.classList.toggle("fa-times");
            gsap.fromTo(".nav-item",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
            );
        });
    } else {
        console.error("Error: Menu toggle elements not found");
    }

    // Theme Toggle
    const themeToggleBtn = document.querySelector(".theme-toggle-btn");
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            themeToggleBtn.querySelector("i")?.classList.toggle("fa-moon");
            themeToggleBtn.querySelector("i")?.classList.toggle("fa-sun");
            gsap.to("body", {
                backgroundColor: document.body.classList.contains("dark-mode") ? "#1a1a1a" : "#e5e5e5",
                duration: 0.5
            });
        });
    } else {
        console.error("Error: .theme-toggle-btn not found");
    }

    // Language Selector
    const languageToggle = document.querySelector(".language-toggle");
    const languageOptions = document.querySelector(".language-options");
    if (languageToggle && languageOptions) {
        languageToggle.addEventListener("click", () => {
            languageOptions.parentElement.classList.toggle("active");
            gsap.fromTo(".language-options li",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: "power2.out" }
            );
        });
        languageOptions.querySelectorAll("li").forEach(option => {
            option.addEventListener("click", () => {
                const lang = option.dataset.lang;
                console.log(`Switch to language: ${lang}`);
                languageOptions.parentElement.classList.remove("active");
            });
        });
    } else {
        console.error("Error: Language selector elements not found");
    }

    // Profile Dropdown
    const userProfile = document.querySelector(".user-profile");
    if (userProfile) {
        userProfile.addEventListener("click", () => {
            userProfile.classList.toggle("active");
            gsap.fromTo(".profile-dropdown li",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: "power2.out" }
            );
        });
    } else {
        console.error("Error: .user-profile not found");
    }

    // Settings Modal
    const settingsBtn = document.querySelector(".settings-btn");
    const settingsModal = document.querySelector(".settings-modal");
    const closeSettings = document.querySelector(".close-settings");
    const saveSettings = document.querySelector(".save-settings");

    if (settingsBtn) {
        settingsBtn.addEventListener("click", () => {
            if (settingsModal) {
                settingsModal.classList.add("active");
                gsap.fromTo(".settings-content",
                    { scale: 0.8, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
                );
            }
        });
    } else {
        console.error("Error: .settings-btn not found");
    }

    if (closeSettings) {
        closeSettings.addEventListener("click", () => {
            if (settingsModal) {
                gsap.to(".settings-content", {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => settingsModal.classList.remove("active")
                });
            }
        });
    } else {
        console.error("Error: .close-settings not found");
    }

    if (saveSettings) {
        saveSettings.addEventListener("click", () => {
            const form = document.querySelector(".settings-form");
            if (form) {
                const formData = {
                    name: form.querySelector("#name")?.value,
                    address: form.querySelector("#address")?.value,
                    phone: form.querySelector("#phone")?.value,
                    password: form.querySelector("#password")?.value
                };
                console.log("Settings form submission:", formData);
            }
            if (settingsModal) {
                gsap.to(".settings-content", {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => settingsModal.classList.remove("active")
                });
            }
        });
    } else {
        console.error("Error: .save-settings not found");
    }

    // Scroll to Top
    const scrollTopBtn = document.querySelector(".scroll-top-btn");
    if (scrollTopBtn) {
        window.addEventListener("scroll", () => {
            scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
        });
        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    } else {
        console.error("Error: .scroll-top-btn not found");
    }

    // Dynamic Year
    const yearElement = document.querySelector(".year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    } else {
        console.error("Error: .year element not found");
    }

    // Close dropdowns and modals when clicking outside
    document.addEventListener("click", (e) => {
        if (languageToggle && languageOptions && !languageToggle.contains(e.target) && !languageOptions.contains(e.target)) {
            languageOptions.parentElement.classList.remove("active");
        }
        if (userProfile && !userProfile.contains(e.target)) {
            userProfile.classList.remove("active");
        }
        if (editProfileBtn && editProfileModal && !editProfileBtn.contains(e.target) && !document.querySelector(".edit-profile-content")?.contains(e.target)) {
            if (editProfileModal.classList.contains("active")) {
                gsap.to(".edit-profile-content", {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => editProfileModal.classList.remove("active")
                });
            }
        }
        if (settingsBtn && settingsModal && !settingsBtn.contains(e.target) && !document.querySelector(".settings-content")?.contains(e.target)) {
            if (settingsModal.classList.contains("active")) {
                gsap.to(".settings-content", {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => settingsModal.classList.remove("active")
                });
            }
        }
    });
});