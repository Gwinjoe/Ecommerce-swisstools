import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Log script loading for debugging
console.log("index.js loaded");

try {
    gsap.registerPlugin(ScrollTrigger);
} catch (error) {
    console.error("Failed to register GSAP ScrollTrigger:", error);
}

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

    // Dummy data for notifications
    const notifications = [
        { id: 1, message: "New user registered: John Doe", date: "2025-07-06" },
        { id: 2, message: "Order #O001 requires review", date: "2025-07-05" }
    ];

    // Dummy data for orders (for filtering and sorting)
    const orders = [
        { id: "#O001", customer: "John Doe", date: "2025-07-05", category: "electronics", amount: 150, status: "pending" },
        { id: "#O002", customer: "Jane Smith", date: "2025-07-04", category: "tools", amount: 300, status: "shipped" },
        { id: "#O003", customer: "Mike Johnson", date: "2025-07-03", category: "materials", amount: 450, status: "delivered" },
        { id: "#O004", customer: "Emily Davis", date: "2025-07-02", category: "electronics", amount: 200, status: "pending" },
        { id: "#O005", customer: "Chris Brown", date: "2025-07-01", category: "tools", amount: 120, status: "shipped" }
    ];

    // Dummy data for charts
    const chartData = {
        "total-orders": { labels: ["2025-07-01", "2025-07-02", "2025-07-03", "2025-07-04", "2025-07-05", "2025-07-06", "2025-07-07"], values: [150, 200, 180, 220, 190, 210, 230] },
        "total-products": { labels: ["2025-07-01", "2025-07-02", "2025-07-03", "2025-07-04", "2025-07-05", "2025-07-06", "2025-07-07"], values: [50, 60, 55, 65, 62, 67, 75] },
        "total-users": { labels: ["2025-07-01", "2025-07-02", "2025-07-03", "2025-07-04", "2025-07-05", "2025-07-06", "2025-07-07"], values: [2000, 2100, 2050, 2200, 2150, 2250, 2300] },
        "total-categories": { labels: ["2025-07-01", "2025-07-02", "2025-07-03", "2025-07-04", "2025-07-05", "2025-07-06", "2025-07-07"], values: [40, 41, 42, 43, 44, 44, 45] },
        "revenue": { labels: ["2025-07-01", "2025-07-02", "2025-07-03", "2025-07-04", "2025-07-05", "2025-07-06", "2025-07-07"], values: [8000, 8500, 8200, 9000, 8700, 9100, 9500] },
        "pending-orders": { labels: ["2025-07-01", "2025-07-02", "2025-07-03", "2025-07-04", "2025-07-05", "2025-07-06", "2025-07-07"], values: [60, 65, 70, 75, 80, 85, 90] }
    };

    // Render metric charts
    function renderMetricCharts() {
        Object.keys(chartData).forEach(metric => {
            const canvas = document.querySelector(`.metric-chart[data-metric="${metric}-chart"]`);
            if (!canvas) {
                console.error(`Error: .metric-chart for ${metric} not found`);
                return;
            }
            const ctx = canvas.getContext("2d");
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: chartData[metric].labels,
                    datasets: [{
                        data: chartData[metric].values,
                        backgroundColor: "rgba(242, 140, 40, 0.6)",
                        borderColor: "rgba(242, 140, 40, 1)",
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { display: false },
                        y: { display: false, beginAtZero: true }
                    }
                }
            });
            gsap.from(canvas, {
                opacity: 0,
                y: 10,
                duration: 0.5,
                ease: "power3.out"
            });
        });
    }

    // Render main orders chart
    function renderOrdersChart() {
        const ctx = document.getElementById("ordersChart")?.getContext("2d");
        if (!ctx) {
            console.error("Error: #ordersChart canvas not found");
            return;
        }

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: chartData["total-orders"].labels,
                datasets: [{
                    label: "Orders Per Day",
                    data: chartData["total-orders"].values,
                    backgroundColor: "rgba(242, 140, 40, 0.6)",
                    borderColor: "rgba(242, 140, 40, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Number of Orders",
                            font: { family: "Montserrat", size: 14 }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Date",
                            font: { family: "Montserrat", size: 14 }
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            font: { family: "Montserrat" }
                        }
                    }
                }
            }
        });

        gsap.from(".chart-container canvas", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power3.out"
        });
    }

    // Render notifications modal
    function renderNotifications() {
        const modal = document.querySelector(".notifications-modal");
        const content = document.querySelector(".notifications-content .notifications-body");
        if (!modal || !content) {
            console.error("Error: .notifications-modal or .notifications-body not found");
            return;
        }

        if (!notifications.length) {
            console.warn("Warning: No notifications available");
            content.innerHTML = "<p>No notifications available</p>";
            return;
        }

        content.innerHTML = notifications.map(item => `
            <p>${item.message} <span>(${item.date})</span></p>
        `).join("");
        modal.classList.add("active");
        gsap.fromTo(".notifications-content",
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
        trackEvent("modal_open", { modal_name: "notifications" });
    }

    // Validate settings form
    function validateForm() {
        const form = document.querySelector(".settings-form");
        if (!form) {
            console.error("Error: .settings-form not found");
            return false;
        }

        let isValid = true;
        const nameInput = form.querySelector("#name");
        const emailInput = form.querySelector("#email");
        const passwordInput = form.querySelector("#password");

        form.querySelectorAll(".error-message").forEach(error => {
            error.textContent = "";
            error.classList.remove("active");
        });
        form.querySelectorAll("input").forEach(input => input.classList.remove("invalid"));

        if (nameInput && nameInput.value.trim().length < 3) {
            const error = nameInput.nextElementSibling;
            if (error) {
                error.textContent = "Full Name must be at least 3 characters";
                error.classList.add("active");
                nameInput.classList.add("invalid");
            }
            isValid = false;
        }

        if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            const error = emailInput.nextElementSibling;
            if (error) {
                error.textContent = "Enter a valid email address";
                error.classList.add("active");
                emailInput.classList.add("invalid");
            }
            isValid = false;
        }

        if (passwordInput && passwordInput.value.trim() && passwordInput.value.length < 8) {
            const error = passwordInput.nextElementSibling;
            if (error) {
                error.textContent = "Password must be at least 8 characters";
                error.classList.add("active");
                passwordInput.classList.add("invalid");
            }
            isValid = false;
        }

        return isValid;
    }

    // Update metrics (simulated)
    function updateMetrics() {
        const metrics = {
            "total-orders": 1234,
            "total-products": 567,
            "total-users": 2890,
            "total-categories": 45,
            "revenue": 12345,
            "pending-orders": 89
        };

        Object.keys(metrics).forEach(key => {
            const element = document.querySelector(`[data-metric="${key}"]`);
            if (element) {
                const current = parseFloat(element.textContent.replace(/[^0-9.]/g, ""));
                const increment = Math.floor(Math.random() * 10);
                const newValue = key === "revenue" ? `$${current + increment}` : current + increment;
                element.textContent = newValue;
                gsap.from(element, {
                    scale: 1.2,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    }

    // Filter and sort orders
    function filterAndSortOrders() {
        const statusFilter = document.querySelector("#status-filter")?.selectedOptions || [];
        const categoryFilter = document.querySelector("#category-filter")?.value || "all";
        const amountFilter = document.querySelector("#amount-filter")?.value || "all";
        const startDate = document.querySelector("#start-date")?.value || "";
        const endDate = document.querySelector("#end-date")?.value || "";
        const search = document.querySelector("#search")?.value.toLowerCase() || "";
        const sortBy = document.querySelector("#sort-by")?.value || "id-asc";
        const rows = document.querySelectorAll(".orders-table tbody tr");

        if (!rows.length) {
            console.error("Error: .orders-table tbody tr elements not found");
            return;
        }

        let filteredOrders = [...orders];

        // Apply filters
        filteredOrders = filteredOrders.filter(order => {
            let show = true;

            // Status filter (multiple)
            const selectedStatuses = Array.from(statusFilter).map(opt => opt.value);
            if (selectedStatuses.length && !selectedStatuses.includes("all") && !selectedStatuses.includes(order.status)) {
                show = false;
            }

            // Category filter
            if (categoryFilter !== "all" && order.category !== categoryFilter) {
                show = false;
            }

            // Amount filter
            if (amountFilter !== "all") {
                if (amountFilter === "0-100" && (order.amount < 0 || order.amount > 100)) show = false;
                if (amountFilter === "100-500" && (order.amount < 100 || order.amount > 500)) show = false;
                if (amountFilter === "500+" && order.amount <= 500) show = false;
            }

            // Date range filter
            if (startDate && order.date < startDate) show = false;
            if (endDate && order.date > endDate) show = false;

            // Search filter
            if (search && !order.id.toLowerCase().includes(search) && !order.customer.toLowerCase().includes(search)) {
                show = false;
            }

            return show;
        });

        // Sort orders
        filteredOrders.sort((a, b) => {
            const [field, direction] = sortBy.split("-");
            let valueA = a[field], valueB = b[field];
            if (field === "amount") {
                valueA = parseFloat(valueA);
                valueB = parseFloat(valueB);
            }
            if (direction === "asc") {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });

        // Update table
        const tbody = document.querySelector(".orders-table tbody");
        if (tbody) {
            tbody.innerHTML = filteredOrders.map(order => `
                <tr data-status="${order.status}" data-date="${order.date}" data-category="${order.category}" data-amount="${order.amount}">
                    <td>${order.id}</td>
                    <td>${order.customer}</td>
                    <td>${order.date}</td>
                    <td>${order.category.charAt(0).toUpperCase() + order.category.slice(1)}</td>
                    <td>$${order.amount}</td>
                    <td class="status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</td>
                    <td><button class="view-order-btn" data-ga-event="view_order" data-ga-value="${order.id}">View</button></td>
                </tr>
            `).join("");

            // Reattach view order button listeners
            const viewOrderButtons = document.querySelectorAll(".view-order-btn");
            viewOrderButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    const orderId = btn.dataset.gaValue;
                    gsap.to(btn, {
                        scale: 0.95,
                        duration: 0.1,
                        ease: "power2.in",
                        onComplete: () => {
                            gsap.to(btn, { scale: 1, duration: 0.1 });
                            console.log(`View order ${orderId}`);
                            trackEvent("view_order", { order_id: orderId });
                            alert(`Viewing order ${orderId} (placeholder)`);
                        }
                    });
                });
            });

            // Animate rows
            gsap.from(".orders-table tbody tr", {
                opacity: 0,
                y: 10,
                duration: 0.5,
                stagger: 0.1,
                ease: "power3.out"
            });
        }
    }

    // Language selector logic
    const languageToggle = document.querySelector(".language-toggle");
    const languageOptions = document.querySelector(".language-options");
    if (languageToggle && languageOptions) {
        languageToggle.addEventListener("click", () => {
            languageOptions.classList.toggle("active");
            gsap.fromTo(".language-options li",
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: "power3.out" }
            );
            trackEvent("language_toggle");
        });

        languageOptions.querySelectorAll("li").forEach(option => {
            option.addEventListener("click", () => {
                const lang = option.dataset.lang;
                console.log(`Language selected: ${lang}`);
                languageOptions.classList.remove("active");
                gsap.to(".language-options", {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power3.in",
                    onComplete: () => {
                        alert(`Language changed to ${option.textContent} (placeholder)`);
                        trackEvent("select_language", { language: lang });
                    }
                });
            });
        });
    } else {
        console.error("Error: .language-toggle or .language-options not found");
    }

    // Theme toggle
    const themeToggleBtn = document.querySelector(".theme-toggle-btn");
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDarkMode = document.body.classList.contains("dark-mode");
            gsap.to("body", {
                backgroundColor: isDarkMode ? "#1a1a1a" : "#e5e5e5",
                duration: 0.5,
                ease: "power2.out"
            });
            trackEvent("theme_toggle", { theme: isDarkMode ? "dark" : "light" });
        });
    } else {
        console.error("Error: .theme-toggle-btn not found");
    }

    // Sidebar toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const sidebar = document.querySelector(".sidebar");
    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", () => {
            sidebar.classList.toggle("active");
            gsap.to(sidebar, {
                x: sidebar.classList.contains("active") ? 0 : -250,
                duration: 0.3,
                ease: "power3.out"
            });
            trackEvent("sidebar_toggle");
        });
    } else {
        console.error("Error: .menu-toggle or .sidebar not found");
    }

    // Profile dropdown
    const userProfile = document.querySelector(".user-profile");
    if (userProfile) {
        userProfile.addEventListener("click", () => {
            userProfile.classList.toggle("active");
            gsap.fromTo(".profile-dropdown li",
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: "power3.out" }
            );
            trackEvent("profile_toggle");
        });
    } else {
        console.error("Error: .user-profile not found");
    }

    // Settings modal
    const settingsBtn = document.querySelector(".settings-btn");
    const settingsModal = document.querySelector(".settings-modal");
    const closeSettingsBtn = document.querySelector(".close-settings");
    const saveSettingsBtn = document.querySelector(".save-settings");
    if (settingsBtn && settingsModal && closeSettingsBtn && saveSettingsBtn) {
        settingsBtn.addEventListener("click", () => {
            settingsModal.classList.add("active");
            gsap.fromTo(".settings-content",
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
            trackEvent("settings_open");
        });

        closeSettingsBtn.addEventListener("click", () => {
            gsap.to(".settings-content", {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    settingsModal.classList.remove("active");
                    trackEvent("settings_close");
                }
            });
        });

        saveSettingsBtn.addEventListener("click", () => {
            if (validateForm()) {
                gsap.to(".settings-content", {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        settingsModal.classList.remove("active");
                        console.log("Settings saved");
                        alert("Settings saved (placeholder)");
                        trackEvent("settings_save");
                    }
                });
            }
        });
    } else {
        console.error("Error: Settings modal elements not found");
    }

    // Notifications modal
    const notificationBtn = document.querySelector(".notification-btn");
    const notificationsModal = document.querySelector(".notifications-modal");
    const closeNotificationsBtn = document.querySelector(".close-notifications");
    const clearNotificationsBtn = document.querySelector(".clear-notifications");
    if (notificationBtn && notificationsModal && closeNotificationsBtn && clearNotificationsBtn) {
        notificationBtn.addEventListener("click", () => {
            renderNotifications();
        });

        closeNotificationsBtn.addEventListener("click", () => {
            gsap.to(".notifications-content", {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    notificationsModal.classList.remove("active");
                    trackEvent("notifications_close");
                }
            });
        });

        clearNotificationsBtn.addEventListener("click", () => {
            const content = document.querySelector(".notifications-content .notifications-body");
            if (content) {
                content.innerHTML = "<p>No notifications available</p>";
                notifications.length = 0; // Clear notifications array
                gsap.from(".notifications-body", {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power3.out"
                });
                trackEvent("notifications_clear");
            }
        });
    } else {
        console.error("Error: Notifications modal elements not found");
    }

    // Scroll to top
    const scrollTopBtn = document.querySelector(".scroll-top-btn");
    if (scrollTopBtn) {
        ScrollTrigger.create({
            trigger: ".admin-content",
            start: "top top",
            onEnterBack: () => {
                gsap.to(scrollTopBtn, { opacity: 1, duration: 0.3, display: "block" });
            },
            onLeave: () => {
                gsap.to(scrollTopBtn, { opacity: 0, duration: 0.3, display: "none" });
            }
        });

        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            trackEvent("scroll_top");
        });
    } else {
        console.error("Error: .scroll-top-btn not found");
    }

    // Newsletter subscription
    const newsletterBtn = document.querySelector(".footer-newsletter button");
    if (newsletterBtn) {
        newsletterBtn.addEventListener("click", () => {
            const emailInput = document.querySelector(".footer-newsletter input");
            if (emailInput && emailInput.value.trim()) {
                console.log(`Subscribed with email: ${emailInput.value}`);
                alert("Subscribed to newsletter (placeholder)");
                emailInput.value = "";
                trackEvent("newsletter_subscribe", { email: emailInput.value });
            } else {
                console.warn("Error: Newsletter email input is empty or not found");
                alert("Please enter a valid email address");
            }
        });
    } else {
        console.error("Error: .footer-newsletter button not found");
    }

    // Footer year
    const yearElement = document.querySelector(".footer-bottom .year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    } else {
        console.error("Error: .footer-bottom .year not found");
    }

    // Animate overview cards
    const cards = document.querySelectorAll(".dashboard-card");
    if (cards.length) {
        gsap.from(cards, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out"
        });
    } else {
        console.error("Error: .dashboard-card elements not found");
    }

    // Animate filter controls
    const filterControls = document.querySelectorAll(".filters .filter-group, .filters .reset-filters");
    if (filterControls.length) {
        gsap.from(filterControls, {
            opacity: 0,
            y: 10,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out"
        });
    } else {
        console.error("Error: Filter controls not found");
    }

    // Action buttons
    const actionButtons = document.querySelectorAll(".action-btn");
    if (actionButtons.length) {
        actionButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const action = btn.dataset.gaValue;
                gsap.to(btn, {
                    scale: 0.95,
                    duration: 0.1,
                    ease: "power2.in",
                    onComplete: () => {
                        gsap.to(btn, { scale: 1, duration: 0.1 });
                        trackEvent("quick_action", { action_name: action });
                    }
                });
            });
        });
    } else {
        console.error("Error: .action-btn elements not found");
    }

    // Filter and sort controls
    const statusFilter = document.querySelector("#status-filter");
    const categoryFilter = document.querySelector("#category-filter");
    const amountFilter = document.querySelector("#amount-filter");
    const startDate = document.querySelector("#start-date");
    const endDate = document.querySelector("#end-date");
    const searchInput = document.querySelector("#search");
    const sortBy = document.querySelector("#sort-by");
    const resetFilters = document.querySelector(".reset-filters");

    if (statusFilter) {
        statusFilter.addEventListener("change", () => {
            filterAndSortOrders();
            trackEvent("filter_status", { selected: Array.from(statusFilter.selectedOptions).map(opt => opt.value).join(",") });
        });
    } else {
        console.error("Error: #status-filter not found");
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", () => {
            filterAndSortOrders();
            trackEvent("filter_category", { category: categoryFilter.value });
        });
    } else {
        console.error("Error: #category-filter not found");
    }

    if (amountFilter) {
        amountFilter.addEventListener("change", () => {
            filterAndSortOrders();
            trackEvent("filter_amount", { range: amountFilter.value });
        });
    } else {
        console.error("Error: #amount-filter not found");
    }

    if (startDate) {
        startDate.addEventListener("change", () => {
            filterAndSortOrders();
            trackEvent("filter_date_start", { date: startDate.value });
        });
    } else {
        console.error("Error: #start-date not found");
    }

    if (endDate) {
        endDate.addEventListener("change", () => {
            filterAndSortOrders();
            trackEvent("filter_date_end", { date: endDate.value });
        });
    } else {
        console.error("Error: #end-date not found");
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            filterAndSortOrders();
            trackEvent("filter_search", { query: searchInput.value });
        });
    } else {
        console.error("Error: #search not found");
    }

    if (sortBy) {
        sortBy.addEventListener("change", () => {
            filterAndSortOrders();
            trackEvent("filter_sort", { sort: sortBy.value });
        });
    } else {
        console.error("Error: #sort-by not found");
    }

    if (resetFilters) {
        resetFilters.addEventListener("click", () => {
            if (statusFilter) statusFilter.selectedIndex = 0;
            if (categoryFilter) categoryFilter.value = "all";
            if (amountFilter) amountFilter.value = "all";
            if (startDate) startDate.value = "";
            if (endDate) endDate.value = "";
            if (searchInput) searchInput.value = "";
            if (sortBy) sortBy.value = "id-asc";
            filterAndSortOrders();
            gsap.from(".filters", {
                opacity: 0,
                duration: 0.3,
                ease: "power3.out"
            });
            trackEvent("reset_filters");
        });
    } else {
        console.error("Error: .reset-filters not found");
    }

    // Initialize charts and filters
    renderMetricCharts();
    renderOrdersChart();
    filterAndSortOrders();
});