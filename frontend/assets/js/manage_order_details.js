import { gsap } from "gsap";

// Log script loading for debugging
console.log("order_details.js loaded");

// Google Analytics event tracking function
function trackEvent(eventName, eventParams = {}) {
    if (typeof gtag === 'function') {
        gtag('event', eventName, eventParams);
    } else {
        console.warn("Google Analytics not loaded, event not tracked:", eventName, eventParams);
    }
}

// Mock order data storage (in production, move to shared module or backend)
const mockOrders = [
    {
        id: "ORD001",
        customer: "John Doe",
        date: "2025-07-01",
        amount: 149.99,
        status: "pending",
        customerDetails: {
            email: "john.doe@example.com",
            phone: "+1-555-0101",
            address: "123 Maple St, Springfield, IL 62701"
        },
        items: [
            { product: "Laptop Pro", quantity: 1, price: 1299.99, total: 1299.99 },
            { product: "Wireless Mouse", quantity: 2, price: 29.99, total: 59.98 }
        ]
    },
    {
        id: "ORD002",
        customer: "Jane Smith",
        date: "2025-06-30",
        amount: 89.50,
        status: "shipped",
        customerDetails: {
            email: "jane.smith@example.com",
            phone: "+1-555-0102",
            address: "456 Oak Ave, Chicago, IL 60601"
        },
        items: [
            { product: "Cordless Drill", quantity: 1, price: 89.50, total: 89.50 }
        ]
    },
    {
        id: "ORD003",
        customer: "Alice Johnson",
        date: "2025-06-29",
        amount: 299.99,
        status: "delivered",
        customerDetails: {
            email: "alice.johnson@example.com",
            phone: "+1-555-0103",
            address: "789 Pine Rd, Evanston, IL 60201"
        },
        items: [
            { product: "Coffee Table", quantity: 1, price: 199.99, total: 199.99 },
            { product: "Desk Lamp", quantity: 1, price: 39.99, total: 39.99 }
        ]
    },
    {
        id: "ORD004",
        customer: "Bob Brown",
        date: "2025-06-28",
        amount: 45.75,
        status: "cancelled",
        customerDetails: {
            email: "bob.brown@example.com",
            phone: "+1-555-0104",
            address: "101 Elm St, Naperville, IL 60540"
        },
        items: [
            { product: "Steel Rod", quantity: 1, price: 45.75, total: 45.75 }
        ]
    },
    {
        id: "ORD005",
        customer: "Emma Davis",
        date: "2025-06-27",
        amount: 199.99,
        status: "pending",
        customerDetails: {
            email: "emma.davis@example.com",
            phone: "+1-555-0105",
            address: "202 Birch Ln, Aurora, IL 60504"
        },
        items: [
            { product: "Bookshelf", quantity: 1, price: 149.99, total: 149.99 },
            { product: "Desk Lamp", quantity: 1, price: 39.99, total: 39.99 }
        ]
    },
    {
        id: "ORD006",
        customer: "Liam Wilson",
        date: "2025-06-26",
        amount: 1299.99,
        status: "shipped",
        customerDetails: {
            email: "liam.wilson@example.com",
            phone: "+1-555-0106",
            address: "303 Cedar Dr, Joliet, IL 60435"
        },
        items: [
            { product: "Smartphone X", quantity: 1, price: 799.99, total: 799.99 },
            { product: "Laptop Pro", quantity: 1, price: 1299.99, total: 1299.99 }
        ]
    },
    {
        id: "ORD007",
        customer: "Olivia Taylor",
        date: "2025-06-25",
        amount: 29.99,
        status: "delivered",
        customerDetails: {
            email: "olivia.taylor@example.com",
            phone: "+1-555-0107",
            address: "404 Walnut St, Peoria, IL 61604"
        },
        items: [
            { product: "Wireless Mouse", quantity: 1, price: 29.99, total: 29.99 }
        ]
    },
    {
        id: "ORD008",
        customer: "Noah Martinez",
        date: "2025-06-24",
        amount: 79.99,
        status: "pending",
        customerDetails: {
            email: "noah.martinez@example.com",
            phone: "+1-555-0108",
            address: "505 Spruce Ct, Rockford, IL 61101"
        },
        items: [
            { product: "Hammer", quantity: 1, price: 19.99, total: 19.99 },
            { product: "Wood Plank", quantity: 4, price: 15.75, total: 63.00 }
        ]
    },
    {
        id: "ORD009",
        customer: "Sophia Anderson",
        date: "2025-06-23",
        amount: 249.99,
        status: "shipped",
        customerDetails: {
            email: "sophia.anderson@example.com",
            phone: "+1-555-0109",
            address: "606 Chestnut Ave, Champaign, IL 61820"
        },
        items: [
            { product: "Coffee Table", quantity: 1, price: 199.99, total: 199.99 },
            { product: "Desk Lamp", quantity: 1, price: 39.99, total: 39.99 }
        ]
    },
    {
        id: "ORD010",
        customer: "James Thomas",
        date: "2025-06-22",
        amount: 399.99,
        status: "delivered",
        customerDetails: {
            email: "james.thomas@example.com",
            phone: "+1-555-0110",
            address: "707 Willow Rd, Bloomington, IL 61701"
        },
        items: [
            { product: "Bookshelf", quantity: 1, price: 149.99, total: 149.99 },
            { product: "Coffee Table", quantity: 1, price: 199.99, total: 199.99 }
        ]
    }
];

// Mock API for fetching order by ID
async function fetchOrderById(orderId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const order = mockOrders.find(o => o.id === orderId);
            if (order) {
                resolve({ ...order });
            } else {
                reject(new Error(`Order with ID ${orderId} not found`));
            }
        }, 1000);
    });
}

// Render order details
async function renderOrderDetails(orderId) {
    const elements = {
        orderIdSpan: document.querySelector("#order-id"),
        customerSpan: document.querySelector("#customer"),
        dateSpan: document.querySelector("#date"),
        amountSpan: document.querySelector("#amount"),
        statusSpan: document.querySelector("#status"),
        customerEmailSpan: document.querySelector("#customer-email"),
        customerPhoneSpan: document.querySelector("#customer-phone"),
        customerAddressSpan: document.querySelector("#customer-address"),
        itemsList: document.querySelector("#items-list"),
        noItems: document.querySelector(".no-items"),
        updateStatusSelect: document.querySelector("#update-status")
    };

    // Check if all required elements exist
    if (Object.values(elements).some(el => !el)) {
        console.error("Error: One or more required DOM elements not found", {
            missing: Object.keys(elements).filter(key => !elements[key])
        });
        if (elements.noItems) {
            elements.noItems.textContent = "Error: Page elements missing";
            elements.noItems.classList.add("active");
            if (gsap) {
                gsap.from(elements.noItems, { opacity: 0, duration: 0.5, ease: "power3.out" });
            }
        }
        return;
    }

    try {
        console.log(`Fetching order details for ID: ${orderId}`);
        const order = await fetchOrderById(orderId);
        console.log("Fetched order:", order);

        // Populate order details
        elements.orderIdSpan.textContent = order.id || "N/A";
        elements.customerSpan.textContent = order.customer || "N/A";
        elements.dateSpan.textContent = order.date || "N/A";
        elements.amountSpan.textContent = order.amount ? order.amount.toFixed(2) : "N/A";
        elements.statusSpan.textContent = order.status || "N/A";
        elements.statusSpan.className = `status-badge status-${order.status || ''}`;
        elements.customerEmailSpan.textContent = order.customerDetails?.email || "N/A";
        elements.customerPhoneSpan.textContent = order.customerDetails?.phone || "N/A";
        elements.customerAddressSpan.textContent = order.customerDetails?.address || "N/A";
        elements.updateStatusSelect.value = order.status || "pending";

        // Clear previous items
        elements.itemsList.innerHTML = "";
        if (!order.items || order.items.length === 0) {
            elements.noItems.textContent = "No items in this order";
            elements.noItems.classList.add("active");
            if (gsap) {
                gsap.from(elements.noItems, { opacity: 0, duration: 0.5, ease: "power3.out" });
            }
            return;
        }

        elements.noItems.classList.remove("active");

        // Render desktop table
        order.items.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.product || "N/A"}</td>
                <td>${item.quantity || "N/A"}</td>
                <td>$${item.price ? item.price.toFixed(2) : "N/A"}</td>
                <td>$${item.total ? item.total.toFixed(2) : "N/A"}</td>
            `;
            elements.itemsList.appendChild(row);
            if (gsap) {
                gsap.from(row, { opacity: 0, y: 20, duration: 0.5, ease: "power3.out", delay: index * 0.1 });
            }
        });

        // Render mobile cards
        const mobileContainer = document.querySelector(".items-table");
        if (mobileContainer && window.innerWidth <= 768) {
            mobileContainer.innerHTML = "";
            order.items.forEach((item, index) => {
                const card = document.createElement("div");
                card.classList.add("item-card");
                card.innerHTML = `
                    <div><strong>Product:</strong> ${item.product || "N/A"}</div>
                    <div><strong>Quantity:</strong> ${item.quantity || "N/A"}</div>
                    <div><strong>Price:</strong> $${item.price ? item.price.toFixed(2) : "N/A"}</div>
                    <div><strong>Total:</strong> $${item.total ? item.total.toFixed(2) : "N/A"}</div>
                `;
                mobileContainer.appendChild(card);
                if (gsap) {
                    gsap.from(card, { opacity: 0, y: 20, duration: 0.5, ease: "power3.out", delay: index * 0.1 });
                }
            });
        }

        // Animate sections
        const animatedSections = document.querySelectorAll(".order-info, .customer-details, .items-table");
        if (animatedSections.length && gsap) {
            gsap.from(animatedSections, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                stagger: 0.1,
                ease: "power3.out",
                delay: 0.2
            });
        } else {
            console.warn("Warning: No sections found for animation or GSAP not loaded");
        }

        trackEvent("view_order_details", { order_id: orderId });
        trackEvent("view_customer_details", { order_id: orderId });
    } catch (error) {
        console.error("Error rendering order details:", error.message);
        elements.orderIdSpan.textContent = "N/A";
        elements.customerSpan.textContent = "N/A";
        elements.dateSpan.textContent = "N/A";
        elements.amountSpan.textContent = "N/A";
        elements.statusSpan.textContent = "Error";
        elements.statusSpan.className = "status-badge";
        elements.customerEmailSpan.textContent = "N/A";
        elements.customerPhoneSpan.textContent = "N/A";
        elements.customerAddressSpan.textContent = "N/A";
        elements.itemsList.innerHTML = "";
        elements.noItems.textContent = error.message || "Error loading order details";
        elements.noItems.classList.add("active");
        if (gsap) {
            gsap.from(elements.noItems, { opacity: 0, duration: 0.5, ease: "power3.out" });
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded fired for order_details.js");

    // Verify GSAP is loaded
    if (!gsap) {
        console.error("Error: GSAP library not loaded");
    }

    // Get order ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("id");
    if (!orderId) {
        console.error("Error: No order ID provided in URL");
        const noItems = document.querySelector(".no-items");
        if (noItems) {
            noItems.textContent = "Invalid or missing order ID";
            noItems.classList.add("active");
            if (gsap) {
                gsap.from(noItems, { opacity: 0, duration: 0.5, ease: "power3.out" });
            }
        }
        return;
    }

    // Render order details
    renderOrderDetails(orderId);

    // Update status handler
    const updateStatusBtn = document.querySelector(".update-status-btn");
    const updateStatusSelect = document.querySelector("#update-status");
    if (updateStatusBtn && updateStatusSelect) {
        updateStatusBtn.addEventListener("click", () => {
            const newStatus = updateStatusSelect.value;
            console.log(`Updating status for order ${orderId} to ${newStatus}`);
            mockOrders.forEach(order => {
                if (order.id === orderId) {
                    order.status = newStatus;
                }
            });
            renderOrderDetails(orderId);
            if (gsap) {
                gsap.from(".status-badge", {
                    scale: 1.2,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power3.out"
                });
            }
            trackEvent("update_status_btn", { order_id: orderId, status: newStatus });
        });
    } else {
        console.error("Error: .update-status-btn or #update-status not found", {
            updateStatusBtn: !!updateStatusBtn,
            updateStatusSelect: !!updateStatusSelect
        });
    }

    // Back button handler
    const backBtn = document.querySelector(".back-btn");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            if (gsap) {
                gsap.to(backBtn, {
                    scale: 0.95,
                    duration: 0.1,
                    ease: "power2.in",
                    onComplete: () => {
                        gsap.to(backBtn, { scale: 1, duration: 0.1 });
                        trackEvent("back_to_orders", { order_id: orderId });
                        window.location.href = "orders.html";
                    }
                });
            } else {
                trackEvent("back_to_orders", { order_id: orderId });
                window.location.href = "orders.html";
            }
        });
    } else {
        console.error("Error: .back-btn not found");
    }

    // Animate order details card
    const orderDetailsCard = document.querySelector(".order-details-card");
    if (orderDetailsCard && gsap) {
        gsap.from(orderDetailsCard, {
            opacity: 0,
            y: 50,
            duration: 0.7,
            ease: "power3.out"
        });
    } else {
        console.error("Error: .order-details-card not found or GSAP not loaded");
    }

    // Note: Status updates are stored in memory only. For persistence, integrate with a backend or localStorage.
});