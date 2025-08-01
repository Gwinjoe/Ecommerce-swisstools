import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    // Dummy data for orders
    const ordersData = [
        { id: "#1001", date: "2025-06-15", item: "Construction Hammer", quantity: 2, total: "₦20,000", status: "Delivered", shippingAddress: "123 Builder Lane, Lagos, Nigeria", paymentMethod: "Credit Card" },
        { id: "#1002", date: "2025-06-20", item: "Power Drill", quantity: 1, total: "₦50,000", status: "Shipped", shippingAddress: "456 Main St, Abuja, Nigeria", paymentMethod: "PayPal" },
        { id: "#1003", date: "2025-07-01", item: "Safety Helmet", quantity: 3, total: "₦30,000", status: "Pending", shippingAddress: "789 Coastal Rd, Lagos, Nigeria", paymentMethod: "Bank Transfer" },
        { id: "#1004", date: "2025-07-05", item: "Toolbox", quantity: 1, total: "₦25,000", status: "Delivered", shippingAddress: "101 Industrial Ave, Kano, Nigeria", paymentMethod: "Credit Card" },
        { id: "#1005", date: "2025-07-10", item: "Wrench Set", quantity: 2, total: "₦15,000", status: "Shipped", shippingAddress: "202 Tool St, Port Harcourt, Nigeria", paymentMethod: "PayPal" },
        { id: "#1006", date: "2025-07-12", item: "Electric Saw", quantity: 1, total: "₦60,000", status: "Pending", shippingAddress: "303 Builder Rd, Lagos, Nigeria", paymentMethod: "Bank Transfer" }
    ];

    let filteredData = [...ordersData];
    let sortColumn = null;
    let sortDirection = 'asc';
    let currentPage = 1;
    const itemsPerPage = 5;

    // Render orders table
    function renderOrders(data, page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedData = data.slice(start, end);

        const tbody = document.querySelector(".orders-table tbody");
        tbody.innerHTML = paginatedData.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.date}</td>
                <td>${order.item}</td>
                <td>${order.quantity}</td>
                <td>${order.total}</td>
                <td>${order.status}</td>
                <td><button type="button" class="details-btn" data-id="${order.id}">Details</button></td>
            </tr>
        `).join("");
        gsap.from(".orders-table tr", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out"
        });

        // Render pagination
        renderPagination(data.length);

        // Add event listeners for details buttons
        document.querySelectorAll(".details-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const order = ordersData.find(o => o.id === btn.dataset.id);
                openOrderDetailsModal(order);
            });
        });
    }

    // Render pagination
    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const pageNumbers = document.querySelector(".page-numbers");
        pageNumbers.innerHTML = Array.from({ length: totalPages }, (_, i) => `
            <button type="button" class="pagination-btn page-number ${i + 1 === currentPage ? 'active' : ''}" data-page="${i + 1}">${i + 1}</button>
        `).join("");

        const prevBtn = document.querySelector(".prev-page");
        const nextBtn = document.querySelector(".next-page");
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        // Add event listeners for page buttons
        document.querySelectorAll(".page-number").forEach(btn => {
            btn.addEventListener("click", () => {
                currentPage = parseInt(btn.dataset.page);
                renderOrders(filteredData, currentPage);
            });
        });

        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderOrders(filteredData, currentPage);
            }
        });

        nextBtn.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderOrders(filteredData, currentPage);
            }
        });
    }

    // Open order details modal
    function openOrderDetailsModal(order) {
        const modal = document.querySelector(".order-details-modal");
        const content = document.querySelector(".order-details-body");
        content.innerHTML = `
            <dl>
                <dt>Order ID:</dt><dd>${order.id}</dd>
                <dt>Date:</dt><dd>${order.date}</dd>
                <dt>Item:</dt><dd>${order.item}</dd>
                <dt>Quantity:</dt><dd>${order.quantity}</dd>
                <dt>Total:</dt><dd>${order.total}</dd>
                <dt>Status:</dt><dd>${order.status}</dd>
                <dt>Shipping Address:</dt><dd>${order.shippingAddress}</dd>
                <dt>Payment Method:</dt><dd>${order.paymentMethod}</dd>
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

        // Update sort icons
        document.querySelectorAll(".orders-table th").forEach(th => {
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

            if (column === 'total') {
                valA = parseFloat(valA.replace("₦", "").replace(",", ""));
                valB = parseFloat(valB.replace("₦", "").replace(",", ""));
            } else if (column === 'quantity') {
                valA = parseInt(valA);
                valB = parseInt(valB);
            } else if (column === 'date') {
                valA = new Date(valA);
                valB = new Date(valB);
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        currentPage = 1;
        renderOrders(filteredData, currentPage);
    }

    // Filtering function
    function filterData() {
        const itemFilter = document.querySelector("#filter-item").value.toLowerCase();
        const statusFilter = document.querySelector("#filter-status").value;

        filteredData = ordersData.filter(order => {
            const matchesItem = order.item.toLowerCase().includes(itemFilter);
            const matchesStatus = statusFilter === "all" || order.status === statusFilter;
            return matchesItem && matchesStatus;
        });

        currentPage = 1;
        renderOrders(filteredData, currentPage);
    }

    // Initialize table
    renderOrders(filteredData, currentPage);

    // Sort event listeners
    document.querySelectorAll(".orders-table th[data-sort]").forEach(th => {
        th.addEventListener("click", () => {
            sortData(th.dataset.sort);
        });
    });

    // Filter event listeners
    document.querySelector("#filter-item").addEventListener("input", filterData);
    document.querySelector("#filter-status").addEventListener("change", filterData);

    // Order details modal close
    document.querySelector(".close-order-details").addEventListener("click", () => {
        const modal = document.querySelector(".order-details-modal");
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
            const modal = document.querySelector(".order-details-modal");
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