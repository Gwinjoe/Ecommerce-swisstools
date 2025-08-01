import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    // Dummy data for wishlist (increased to 12 items for pagination testing)
    const wishlistData = [
        { id: "#W001", item: "Construction Hammer", price: "₦10,000", date: "2025-06-10", status: "In Stock", description: "Heavy-duty hammer for construction", category: "Tools" },
        { id: "#W002", item: "Power Drill", price: "₦50,000", date: "2025-06-15", status: "Out of Stock", description: "Cordless power drill with multiple bits", category: "Power Tools" },
        { id: "#W003", item: "Safety Helmet", price: "₦10,000", date: "2025-06-20", status: "In Stock", description: "High-impact safety helmet", category: "Safety Gear" },
        { id: "#W004", item: "Toolbox", price: "₦25,000", date: "2025-06-25", status: "In Stock", description: "Portable toolbox with compartments", category: "Storage" },
        { id: "#W005", item: "Wrench Set", price: "₦15,000", date: "2025-07-01", status: "Out of Stock", description: "Set of adjustable wrenches", category: "Tools" },
        { id: "#W006", item: "Electric Saw", price: "₦60,000", date: "2025-07-05", status: "In Stock", description: "High-power electric saw", category: "Power Tools" },
        { id: "#W007", item: "Screwdriver Set", price: "₦12,000", date: "2025-07-10", status: "In Stock", description: "Multi-head screwdriver set", category: "Tools" },
        { id: "#W008", item: "Measuring Tape", price: "₦5,000", date: "2025-07-12", status: "Out of Stock", description: "25ft retractable measuring tape", category: "Tools" },
        { id: "#W009", item: "Hard Hat", price: "₦8,000", date: "2025-07-15", status: "In Stock", description: "Durable hard hat for safety", category: "Safety Gear" },
        { id: "#W010", item: "Cordless Grinder", price: "₦45,000", date: "2025-07-20", status: "In Stock", description: "Cordless angle grinder", category: "Power Tools" },
        { id: "#W011", item: "Safety Gloves", price: "₦6,000", date: "2025-07-25", status: "Out of Stock", description: "Heavy-duty safety gloves", category: "Safety Gear" },
        { id: "#W012", item: "Level Tool", price: "₦7,000", date: "2025-07-30", status: "In Stock", description: "Precision leveling tool", category: "Tools" }
    ];

    let filteredData = [...wishlistData];
    let sortColumn = null;
    let sortDirection = 'asc';
    let currentPage = 1;
    const itemsPerPage = 5;
    const maxPageButtons = 5;

    // Render wishlist table
    function renderWishlist(data, page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedData = data.slice(start, end);

        const tbody = document.querySelector(".wishlist-table tbody");
        tbody.innerHTML = paginatedData.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.item}</td>
                <td>${item.price}</td>
                <td>${item.date}</td>
                <td>${item.status}</td>
                <td>
                    <button type="button" class="details-btn" data-id="${item.id}">Details</button>
                    <button type="button" class="add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
                    <button type="button" class="remove-btn" data-id="${item.id}">Remove</button>
                </td>
            </tr>
        `).join("");
        gsap.from(".wishlist-table tr", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out"
        });

        // Render pagination
        renderPagination(data.length);

        // Add event listeners for buttons
        document.querySelectorAll(".details-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const item = wishlistData.find(i => i.id === btn.dataset.id);
                openItemDetailsModal(item);
            });
        });
        document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                console.log(`Add to cart: ${btn.dataset.id}`); // Placeholder for cart logic
            });
        });
        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                console.log(`Remove item: ${btn.dataset.id}`); // Placeholder for removal logic
            });
        });
    }

    // Render pagination with ellipsis
    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const pageNumbers = document.querySelector(".page-numbers");
        let buttons = [];

        // Calculate page range
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        // Adjust if near the end
        if (endPage - startPage + 1 < maxPageButtons) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        // Add first page
        buttons.push(`<button type="button" class="pagination-btn page-number ${currentPage === 1 ? 'active' : ''}" data-page="1">1</button>`);

        // Add ellipsis if needed
        if (startPage > 2) {
            buttons.push(`<button type="button" class="pagination-btn ellipsis" disabled>...</button>`);
        }

        // Add middle pages
        for (let i = Math.max(2, startPage); i < endPage; i++) {
            buttons.push(`<button type="button" class="pagination-btn page-number ${currentPage === i ? 'active' : ''}" data-page="${i}">${i}</button>`);
        }

        // Add last page and ellipsis if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(`<button type="button" class="pagination-btn ellipsis" disabled>...</button>`);
            }
            buttons.push(`<button type="button" class="pagination-btn page-number ${currentPage === totalPages ? 'active' : ''}" data-page="${totalPages}">${totalPages}</button>`);
        }

        pageNumbers.innerHTML = buttons.join("");

        const prevBtn = document.querySelector(".prev-page");
        const nextBtn = document.querySelector(".next-page");
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        document.querySelectorAll(".page-number").forEach(btn => {
            btn.addEventListener("click", () => {
                currentPage = parseInt(btn.dataset.page);
                renderWishlist(filteredData, currentPage);
            });
        });

        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderWishlist(filteredData, currentPage);
            }
        });

        nextBtn.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderWishlist(filteredData, currentPage);
            }
        });
    }

    // Open item details modal
    function openItemDetailsModal(item) {
        const modal = document.querySelector(".item-details-modal");
        const content = document.querySelector(".item-details-body");
        content.innerHTML = `
            <dl>
                <dt>Item ID:</dt><dd>${item.id}</dd>
                <dt>Item:</dt><dd>${item.item}</dd>
                <dt>Price:</dt><dd>${item.price}</dd>
                <dt>Date Added:</dt><dd>${item.date}</dd>
                <dt>Stock Status:</dt><dd>${item.status}</dd>
                <dt>Description:</dt><dd>${item.description}</dd>
                <dt>Category:</dt><dd>${item.category}</dd>
            </dl>
        `;
        modal.classList.add("active");
        gsap.fromTo(".order-details-content",
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }

    // Sorting function
    function sortData(column) {
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }

        document.querySelectorAll(".wishlist-table th").forEach(th => {
            th.classList.remove("active-sort");
            const icon = th.querySelector("i");
            icon.classList.remove("fa-sort-up", "fa-sort-down");
            icon.classList.add("fa-sort");
        });
        const activeTh = document.querySelector(`th[data-sort="${column}"]`);
        activeTh.classList.add("active-sort");
        const icon = activeTh.querySelector("i");
        icon.classList.remove("fa-sort");
        icon.classList.add(sortDirection === 'asc' ? "fa-sort-up" : "fa-sort-down");

        filteredData.sort((a, b) => {
            let valA = a[column];
            let valB = b[column];

            if (column === 'price') {
                valA = parseFloat(valA.replace("₦", "").replace(",", ""));
                valB = parseFloat(valB.replace("₦", "").replace(",", ""));
            } else if (column === 'date') {
                valA = new Date(valA);
                valB = new Date(valB);
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        currentPage = 1;
        renderWishlist(filteredData, currentPage);
    }

    // Filtering function
    function filterData() {
        const itemFilter = document.querySelector("#filter-item").value.toLowerCase();
        const statusFilter = document.querySelector("#filter-status").value;

        filteredData = wishlistData.filter(item => {
            const matchesItem = item.item.toLowerCase().includes(itemFilter);
            const matchesStatus = statusFilter === "all" || item.status === statusFilter;
            return matchesItem && matchesStatus;
        });

        currentPage = 1;
        renderWishlist(filteredData, currentPage);
    }

    // Initialize table
    renderWishlist(filteredData, currentPage);

    // Sort event listeners
    document.querySelectorAll(".wishlist-table th[data-sort]").forEach(th => {
        th.addEventListener("click", () => {
            sortData(th.dataset.sort);
        });
    });

    // Filter event listeners
    document.querySelector("#filter-item").addEventListener("input", filterData);
    document.querySelector("#filter-status").addEventListener("change", filterData);

    // Item details modal close
    document.querySelector(".close-item-details").addEventListener("click", () => {
        const modal = document.querySelector(".item-details-modal");
        gsap.to(".order-details-content", {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => modal.classList.remove("active")
        });
    });

    // Header Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navList = document.querySelector(".nav-list");
    const menuIcon = document.querySelector(".menu-icon");
    menuToggle.addEventListener("click", () => {
        navList.classList.toggle("active");
        menuIcon.classList.toggle("fa-bars");
        menuIcon.classList.toggle("fa-times");
        gsap.fromTo(".nav-item",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
        );
    });

    // Theme Toggle
    const themeToggleBtn = document.querySelector(".theme-toggle-btn");
    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        themeToggleBtn.querySelector("i").classList.toggle("fa-moon");
        themeToggleBtn.querySelector("i").classList.toggle("fa-sun");
        gsap.to("body", { backgroundColor: document.body.classList.contains("dark-mode") ? "#1a1a1a" : "#e5e5e5", duration: 0.5 });
    });

    // Language Selector
    const languageToggle = document.querySelector(".language-toggle");
    const languageOptions = document.querySelector(".language-options");
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
            console.log(`Switch to language: ${lang}`); // Placeholder for translation
            languageOptions.parentElement.classList.remove("active");
        });
    });

    // Profile Dropdown
    const userProfile = document.querySelector(".user-profile");
    userProfile.addEventListener("click", () => {
        userProfile.classList.toggle("active");
        gsap.fromTo(".profile-dropdown li",
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: "power2.out" }
        );
    });

    // Settings Modal
    const settingsBtn = document.querySelector(".settings-btn");
    const settingsModal = document.querySelector(".settings-modal");
    const closeSettings = document.querySelector(".close-settings");
    const saveSettings = document.querySelector(".save-settings");
    const deleteAccountBtn = document.querySelector(".delete-account-btn");

    settingsBtn.addEventListener("click", () => {
        settingsModal.classList.add("active");
        gsap.fromTo(".settings-content",
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    });

    closeSettings.addEventListener("click", () => {
        gsap.to(".settings-content", {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => settingsModal.classList.remove("active")
        });
    });

    saveSettings.addEventListener("click", () => {
        console.log("Save settings"); // Placeholder for form submission
        gsap.to(".settings-content", {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => settingsModal.classList.remove("active")
        });
    });

    deleteAccountBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete your account?")) {
            console.log("Delete account"); // Placeholder for deletion logic
        }
    });

    // Scroll to Top
    const scrollTopBtn = document.querySelector(".scroll-top-btn");
    window.addEventListener("scroll", () => {
        scrollTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Dynamic Year
    document.querySelector(".year").textContent = new Date().getFullYear();

    // Close dropdowns and modals when clicking outside
    document.addEventListener("click", (e) => {
        if (!languageToggle.contains(e.target) && !languageOptions.contains(e.target)) {
            languageOptions.parentElement.classList.remove("active");
        }
        if (!userProfile.contains(e.target)) {
            userProfile.classList.remove("active");
        }
        if (!document.querySelector(".order-details-content").contains(e.target) && !e.target.classList.contains("details-btn")) {
            const modal = document.querySelector(".item-details-modal");
            if (modal.classList.contains("active")) {
                gsap.to(".order-details-content", {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => modal.classList.remove("active")
                });
            }
        }
    });
});