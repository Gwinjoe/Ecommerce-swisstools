import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Log script loading for debugging
console.log("dashboard.js loaded");

try {
    gsap.registerPlugin(ScrollTrigger);
} catch (error) {
    console.error("Failed to register GSAP ScrollTrigger:", error);
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded fired");

    // Dummy data for recent activity with details
    const recentActivity = [
        { id: 1, action: "Added Construction Hammer to wishlist", date: "2025-07-05", type: "wishlist", details: { product: "Construction Hammer", category: "Tools", price: "$15.99" } },
        { id: 2, action: "Placed order #O001", date: "2025-07-03", type: "orders", details: { orderId: "O001", total: "$150.00", items: 3 } },
        { id: 3, action: "Added Power Drill to wishlist", date: "2025-07-01", type: "wishlist", details: { product: "Power Drill", category: "Power Tools", price: "$89.99" } },
        { id: 4, action: "Updated profile information", date: "2025-06-28", type: "profile", details: { updatedFields: ["Name", "Address"] } },
        { id: 5, action: "Placed order #O002", date: "2025-06-25", type: "orders", details: { orderId: "O002", total: "$220.00", items: 5 } }
    ];

    // Dummy data for notifications
    const notifications = [
        { id: 1, message: "Order #O001 has shipped", date: "2025-07-04" },
        { id: 2, message: "New discount available on power tools!", date: "2025-07-02" },
        { id: 3, message: "Your wishlist item 'Power Drill' is back in stock", date: "2025-07-01" }
    ];

    // Dummy data for order chart
    const chartData = {
        "6months": {
            labels: ["Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025"],
            data: [2, 3, 1, 4, 2, 3]
        },
        "12months": {
            labels: ["Jul 2024", "Aug 2024", "Sep 2024", "Oct 2024", "Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025"],
            data: [1, 2, 0, 3, 2, 1, 2, 3, 1, 4, 2, 3]
        },
        "all": {
            labels: ["2023", "2024", "2025"],
            data: [8, 12, 10]
        }
    };

    let currentChart = null;

    // Render recent activity
    function renderActivity(filter = "all") {
        const activityList = document.querySelector(".activity-list");
        if (!activityList) {
            console.error("Error: .activity-list element not found");
            return;
        }
        let filteredActivities = recentActivity;
        if (filter !== "all") {
            filteredActivities = recentActivity.filter(item => item.type === filter);
        }
        if (!filteredActivities.length) {
            console.warn(`Warning: No activities found for filter: ${filter}`);
            activityList.innerHTML = "<li>No activities available</li>";
            return;
        }

        activityList.innerHTML = filteredActivities.map(item => `
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
                const activityId = item.dataset.id;
                const activity = recentActivity.find(a => a.id == activityId);
                console.log(`Clicked activity: ${activityId} - ${item.textContent}`);
                if (activity) {
                    showActivityDetails(activity);
                }
            }
        });
    }

    // Render activity details modal
    function showActivityDetails(activity) {
        const modal = document.querySelector(".activity-details-modal");
        const content = document.querySelector(".activity-details-content .activity-details-body");
        if (!modal || !content) {
            console.error("Error: .activity-details-modal or .activity-details-body not found");
            return;
        }

        content.innerHTML = `
            <p><strong>Action:</strong> ${activity.action}</p>
            <p><strong>Date:</strong> ${activity.date}</p>
            ${Object.entries(activity.details).map(([key, value]) => `
                <p><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${Array.isArray(value) ? value.join(", ") : value}</p>
            `).join("")}
        `;

        modal.classList.add("active");
        gsap.fromTo(".activity-details-content",
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
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
    }

    // Render order chart
    function renderChart(filter = "6months", type = "line") {
        const chartCanvas = document.getElementById("orderChart");
        if (!chartCanvas) {
            console.error("Error: #orderChart canvas not found");
            return;
        }

        if (currentChart) {
            currentChart.destroy();
        }

        try {
            currentChart = new Chart(chartCanvas, {
                type: type,
                data: {
                    labels: chartData[filter].labels,
                    datasets: [{
                        label: "Orders",
                        data: chartData[filter].data,
                        borderColor: "#f28c28",
                        backgroundColor: type === "line" ? "rgba(242, 140, 40, 0.2)" : "#f28c28",
                        fill: type === "line",
                        tension: type === "line" ? 0.4 : 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: "Number of Orders" }
                        },
                        x: { title: { display: true, text: filter === "all" ? "Year" : "Month" } }
                    },
                    plugins: {
                        legend: { display: true, position: "top" }
                    }
                }
            });
            console.log(`Chart rendered with filter: ${filter}, type: ${type}`);
            gsap.from(".order-chart", {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: "power3.out"
            });
        } catch (error) {
            console.error("Error rendering chart:", error);
        }
    }

    // Export chart data as CSV
    function exportChartData(filter) {
        const data = chartData[filter];
        const csv = ["Period,Orders"];
        data.labels.forEach((label, i) => {
            csv.push(`${label},${data.data[i]}`);
        });
        console.log("Exported CSV:\n", csv.join("\n"));
        alert("Chart data exported to console (placeholder for CSV download)");
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
        const addressInput = form.querySelector("#address");
        const phoneInput = form.querySelector("#phone");
        const passwordInput = form.querySelector("#password");

        // Clear previous errors
        form.querySelectorAll(".error-message").forEach(error => {
            error.textContent = "";
            error.classList.remove("active");
        });
        form.querySelectorAll("input").forEach(input => input.classList.remove("invalid"));

        // Name validation
        if (nameInput && nameInput.value.trim().length < 3) {
            const error = nameInput.nextElementSibling;
            if (error) {
                error.textContent = "Full Name must be at least 3 characters";
                error.classList.add("active");
                nameInput.classList.add("invalid");
            }
            isValid = false;
        }

        // Address validation
        if (addressInput && addressInput.value.trim().length < 3) {
            const error = addressInput.nextElementSibling;
            if (error) {
                error.textContent = "Address must be at least 3 characters";
                error.classList.add("active");
                addressInput.classList.add("invalid");
            }
            isValid = false;
        }

        // Phone validation
        if (phoneInput && !/^\+\d{1,3}[\s-]?\d{3,}$/.test(phoneInput.value.trim())) {
            const error = phoneInput.nextElementSibling;
            if (error) {
                error.textContent = "Enter a valid phone number (e.g., +234 812 345 6789)";
                error.classList.add("active");
                phoneInput.classList.add("invalid");
            }
            isValid = false;
        }

        // Password validation (optional, but min 8 chars if provided)
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

    // Initialize activity and chart
    try {
        renderActivity();
        renderChart();
    } catch (error) {
        console.error("Error rendering activity or chart:", error);
    }

    // Chart filter
    const chartFilter = document.getElementById("chartFilter");
    if (chartFilter) {
        chartFilter.addEventListener("change", (e) => {
            const filter = e.target.value;
            console.log(`Chart filter changed to: ${filter}`);
            renderChart(filter, document.getElementById("chartType")?.value || "line");
        });
    } else {
        console.error("Error: #chartFilter not found");
    }

    // Chart type
    const chartType = document.getElementById("chartType");
    if (chartType) {
        chartType.addEventListener("change", (e) => {
            const type = e.target.value;
            console.log(`Chart type changed to: ${type}`);
            renderChart(document.getElementById("chartFilter")?.value || "6months", type);
        });
    } else {
        console.error("Error: #chartType not found");
    }

    // Export chart button
    const exportChartBtn = document.querySelector(".export-chart-btn");
    if (exportChartBtn) {
        exportChartBtn.addEventListener("click", () => {
            const filter = document.getElementById("chartFilter")?.value || "6months";
            console.log(`Exporting chart data for: ${filter}`);
            exportChartData(filter);
        });
    } else {
        console.error("Error: .export-chart-btn not found");
    }

    // Activity filter
    const activityFilter = document.getElementById("activityFilter");
    if (activityFilter) {
        activityFilter.addEventListener("change", (e) => {
            const filter = e.target.value;
            console.log(`Activity filter changed to: ${filter}`);
            renderActivity(filter);
        });
    } else {
        console.error("Error: #activityFilter not found");
    }

    // Refresh metrics
    const refreshMetricsBtn = document.querySelector(".refresh-metrics-btn");
    if (refreshMetricsBtn) {
        refreshMetricsBtn.addEventListener("click", () => {
            const metrics = document.querySelectorAll(".metric-value");
            metrics.forEach((metric, index) => {
                if (index < 3) { // Skip Account Status
                    const currentValue = parseInt(metric.textContent) || 0;
                    metric.textContent = currentValue + 1; // Simulate update
                }
            });
            console.log("Metrics refreshed (simulated)");
            gsap.from(".dashboard-card", {
                opacity: 0,
                y: 20,
                duration: 0.5,
                stagger: 0.1,
                ease: "power3.out"
            });
        });
    } else {
        console.error("Error: .refresh-metrics-btn not found");
    }

    // Close activity details modal
    const closeActivityDetails = document.querySelector(".close-activity-details");
    if (closeActivityDetails) {
        closeActivityDetails.addEventListener("click", () => {
            const modal = document.querySelector(".activity-details-modal");
            if (modal) {
                gsap.to(".activity-details-content",
                    {
                        scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in",
                        onComplete: () => modal.classList.remove("active")
                    });
            }
        });
    } else {
        console.error("Error: .close-activity-details not found");
    }

    // Notifications modal
    const notificationBtn = document.querySelector(".notification-btn");
    if (notificationBtn) {
        notificationBtn.addEventListener("click", () => {
            console.log("Opening notifications modal");
            renderNotifications();
        });
    } else {
        console.error("Error: .notification-btn not found");
    }

    const closeNotifications = document.querySelector(".close-notifications");
    if (closeNotifications) {
        closeNotifications.addEventListener("click", () => {
            const modal = document.querySelector(".notifications-modal");
            if (modal) {
                gsap.to(".notifications-content",
                    {
                        scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in",
                        onComplete: () => modal.classList.remove("active")
                    });
            }
        });
    } else {
        console.error("Error: .close-notifications not found");
    }

    const clearNotifications = document.querySelector(".clear-notifications");
    if (clearNotifications) {
        clearNotifications.addEventListener("click", () => {
            const content = document.querySelector(".notifications-content .notifications-body");
            if (content) {
                content.innerHTML = "<p>No notifications available</p>";
                console.log("Notifications cleared");
                const count = document.querySelector(".notification-count");
                if (count) count.textContent = "0";
            }
        });
    } else {
        console.error("Error: .clear-notifications not found");
    }

    // Animate dashboard cards
    const dashboardCards = document.querySelectorAll(".dashboard-card");
    if (dashboardCards.length) {
        gsap.from(".dashboard-card", {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out"
        });
    } else {
        console.error("Error: .dashboard-card elements not found");
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
        console.error("Error: Menu toggle elements not found (.menu-toggle, .nav-list, .menu-icon)");
    }

    // Theme Toggle
    const themeToggleBtn = document.querySelector(".theme-toggle-btn");
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const icon = themeToggleBtn.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-moon");
                icon.classList.toggle("fa-sun");
            }
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
        console.error("Error: Language selector elements not found (.language-toggle, .language-options)");
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
    const deleteAccountBtn = document.querySelector(".delete-account-btn");

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
                gsap.to(".settings-content",
                    {
                        scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in",
                        onComplete: () => settingsModal.classList.remove("active")
                    });
            }
        });
    } else {
        console.error("Error: .close-settings not found");
    }

    if (saveSettings) {
        saveSettings.addEventListener("click", () => {
            if (validateForm()) {
                const form = document.querySelector(".settings-form");
                if (form) {
                    const formData = {
                        name: form.querySelector("#name")?.value,
                        address: form.querySelector("#address")?.value,
                        phone: form.querySelector("#phone")?.value,
                        password: form.querySelector("#password")?.value
                    };
                    console.log("Settings form submission:", formData);
                    alert("Settings saved successfully (placeholder)");
                }
                if (settingsModal) {
                    gsap.to(".settings-content",
                        {
                            scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in",
                            onComplete: () => settingsModal.classList.remove("active")
                        });
                }
            }
        });
    } else {
        console.error("Error: .save-settings not found");
    }

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to delete your account?")) {
                console.log("Delete account initiated");
                alert("Account deletion requested (placeholder)");
            }
        });
    } else {
        console.error("Error: .delete-account-btn not found");
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
        if (settingsBtn && settingsModal && !settingsBtn.contains(e.target) && !document.querySelector(".settings-content")?.contains(e.target)) {
            if (settingsModal.classList.contains("active")) {
                gsap.to(".settings-content",
                    {
                        scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in",
                        onComplete: () => settingsModal.classList.remove("active")
                    });
            }
        }
        if (!document.querySelector(".activity-details-content")?.contains(e.target) && !document.querySelector(".activity-list")?.contains(e.target)) {
            const modal = document.querySelector(".activity-details-modal");
            if (modal?.classList.contains("active")) {
                gsap.to(".activity-details-content",
                    {
                        scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in",
                        onComplete: () => modal.classList.remove("active")
                    });
            }
        }
        if (notificationBtn && !notificationBtn.contains(e.target) && !document.querySelector(".notifications-content")?.contains(e.target)) {
            const modal = document.querySelector(".notifications-modal");
            if (modal?.classList.contains("active")) {
                gsap.to(".notifications-content",
                    {
                        scale: 0.8, opacity: 0, duration: 0.3, ease: "power2.in",
                        onComplete: () => modal.classList.remove("active")
                    });
            }
        }
    });
});