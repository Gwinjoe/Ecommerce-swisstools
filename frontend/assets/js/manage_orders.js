import { gsap } from "gsap";

// Log script loading for debugging
console.log("orders.js loaded");

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

// Mock API for fetching orders
async function fetchOrders() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockOrders]);
        }, 1000);
    });
}

// Download orders as CSV
function downloadCSV(orders) {
    const headers = ["Order ID", "Customer", "Date", "Amount", "Status"];
    const csvRows = [
        headers.join(","),
        ...orders.map(order =>
            `"${order.id}","${order.customer}","${order.date}","${order.amount.toFixed(2)}","${order.status}"`
        )
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Render orders with pagination, sort, filter, and search
async function renderOrders(page = 1, sort = "date-desc", filter = "", search = "", startDate = "", endDate = "") {
    const orderList = document.querySelector("#order-list");
    const noOrders = document.querySelector(".no-orders");
    const pageInfo = document.querySelector("#page-info");
    const bulkActions = document.querySelector(".bulk-actions");
    const updateStatusBtn = document.querySelector(".update-status-btn");
    const selectAllCheckbox = document.querySelector("#select-all");
    if (!orderList || !noOrders || !pageInfo || !bulkActions || !updateStatusBtn || !selectAllCheckbox) {
        console.error("Error: Required elements not found", {
            orderList: !!orderList,
            noOrders: !!noOrders,
            pageInfo: !!pageInfo,
            bulkActions: !!bulkActions,
            updateStatusBtn: !!updateStatusBtn,
            selectAllCheckbox: !!selectAllCheckbox
        });
        return { orders: [], totalPages: 1 };
    }

    try {
        let orders = await fetchOrders();
        console.log("Fetched orders:", orders.length);
        const itemsPerPage = 5;

        // Apply search
        if (search) {
            orders = orders.filter(order =>
                order.id.toLowerCase().includes(search.toLowerCase()) ||
                order.customer.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply status filter
        if (filter) {
            orders = orders.filter(order => order.status === filter);
        }

        // Apply date range filter
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (start <= end) {
                orders = orders.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= start && orderDate <= end;
                });
            }
        }

        // Apply sort
        orders.sort((a, b) => {
            if (sort === "date-desc") return new Date(b.date) - new Date(a.date);
            if (sort === "date-asc") return new Date(a.date) - new Date(b.date);
            if (sort === "amount-asc") return a.amount - b.amount;
            if (sort === "amount-desc") return b.amount - a.amount;
            return 0;
        });

        // Pagination
        const totalPages = Math.ceil(orders.length / itemsPerPage) || 1;
        page = Math.min(page, totalPages);
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedOrders = orders.slice(start, end);

        // Update page info
        pageInfo.textContent = `Page ${page} of ${totalPages}`;

        // Enable/disable pagination buttons
        const firstBtn = document.querySelector("#first-page");
        const prevBtn = document.querySelector("#prev-page");
        const nextBtn = document.querySelector("#next-page");
        const lastBtn = document.querySelector("#last-page");
        if (firstBtn && prevBtn && nextBtn && lastBtn) {
            firstBtn.disabled = page === 1;
            prevBtn.disabled = page === 1;
            nextBtn.disabled = page === totalPages;
            lastBtn.disabled = page === totalPages;
        } else {
            console.error("Error: Pagination buttons not found");
        }

        // Reset select all checkbox
        selectAllCheckbox.checked = false;

        // Render orders
        orderList.innerHTML = "";
        if (paginatedOrders.length === 0) {
            noOrders.classList.add("active");
            bulkActions.style.display = "none";
            gsap.from(noOrders, { opacity: 0, duration: 0.5, ease: "power3.out" });
            return { orders, totalPages };
        }

        noOrders.classList.remove("active");
        paginatedOrders.forEach((order, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><input type="checkbox" class="select-order" data-id="${order.id}" data-ga-event="select_order"></td>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>$${order.amount.toFixed(2)}</td>
                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                <td>
                    <button class="action-btn view-btn" data-id="${order.id}" data-ga-event="view_order"><i class="fas fa-eye"></i></button>
                    <select class="status-select" data-id="${order.id}" data-ga-event="update_status">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
            `;
            orderList.appendChild(row);
            gsap.from(row, { opacity: 0, y: 20, duration: 0.5, ease: "power3.out", delay: index * 0.1 });
        });

        // Render mobile cards
        const mobileContainer = document.querySelector(".orders-table");
        if (window.innerWidth <= 768) {
            mobileContainer.innerHTML = "";
            paginatedOrders.forEach((order, index) => {
                const card = document.createElement("div");
                card.classList.add("order-card");
                card.innerHTML = `
                    <div><input type="checkbox" class="select-order" data-id="${order.id}" data-ga-event="select_order"></div>
                    <div><strong>Order ID:</strong> ${order.id}</div>
                    <div><strong>Customer:</strong> ${order.customer}</div>
                    <div><strong>Date:</strong> ${order.date}</div>
                    <div><strong>Amount:</strong> $${order.amount.toFixed(2)}</div>
                    <div><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></div>
                    <div class="actions">
                        <button class="action-btn view-btn" data-id="${order.id}" data-ga-event="view_order"><i class="fas fa-eye"></i></button>
                        <select class="status-select" data-id="${order.id}" data-ga-event="update_status">
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                `;
                mobileContainer.appendChild(card);
                gsap.from(card, { opacity: 0, y: 20, duration: 0.5, ease: "power3.out", delay: index * 0.1 });
            });
        }

        // Update bulk actions visibility
        updateBulkActions();

        return { orders, totalPages };
    } catch (error) {
        console.error("Error rendering orders:", error);
        orderList.innerHTML = "";
        noOrders.textContent = "Error loading orders";
        noOrders.classList.add("active");
        bulkActions.style.display = "none";
        gsap.from(noOrders, { opacity: 0, duration: 0.5, ease: "power3.out" });
        return { orders: [], totalPages: 1 };
    }
}

// Update bulk actions visibility and state
function updateBulkActions() {
    const bulkActions = document.querySelector(".bulk-actions");
    const updateStatusBtn = document.querySelector(".update-status-btn");
    const selectAllCheckbox = document.querySelector("#select-all");
    if (!bulkActions || !updateStatusBtn || !selectAllCheckbox) {
        console.error("Error: Bulk action elements not found");
        return;
    }

    const selectedCheckboxes = document.querySelectorAll(".select-order:checked");
    selectAllCheckbox.checked = selectedCheckboxes.length > 0 && selectedCheckboxes.length === document.querySelectorAll(".select-order").length;

    if (selectedCheckboxes.length > 0) {
        bulkActions.style.display = "flex";
        updateStatusBtn.disabled = !document.querySelector("#bulk-status").value;
        gsap.from(bulkActions, { opacity: 0, y: 10, duration: 0.3, ease: "power3.out" });
    } else {
        bulkActions.style.display = "none";
        updateStatusBtn.disabled = true;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded fired for orders.js");

    let currentPage = 1;
    let currentSort = "date-desc";
    let currentFilter = "";
    let currentSearch = "";
    let currentStartDate = "";
    let currentEndDate = "";
    let currentOrders = [];

    // Load initial orders
    renderOrders(currentPage, currentSort, currentFilter, currentSearch, currentStartDate, currentEndDate).then(({ orders }) => {
        currentOrders = orders;
    });

    // Search handler with debounce
    const searchInput = document.querySelector("#search");
    if (searchInput) {
        const debouncedSearch = debounce(() => {
            currentSearch = searchInput.value.trim();
            currentPage = 1;
            renderOrders(currentPage, currentSort, currentFilter, currentSearch, currentStartDate, currentEndDate).then(({ orders }) => {
                currentOrders = orders;
            });
            trackEvent("search_orders", { query: currentSearch });
        }, 300);
        searchInput.addEventListener("input", debouncedSearch);
    } else {
        console.error("Error: #search not found");
    }

    // Sort handler
    const sortSelect = document.querySelector("#sort");
    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            currentSort = sortSelect.value;
            currentPage = 1;
            renderOrders(currentPage, currentSort, currentFilter, currentSearch, currentStartDate, currentEndDate).then(({ orders }) => {
                currentOrders = orders;
            });
            trackEvent("sort_orders", { sort: currentSort });
        });
    } else {
        console.error("Error: #sort not found");
    }

    // Filter handler
    const filterSelect = document.querySelector("#filter");
    if (filterSelect) {
        filterSelect.addEventListener("change", () => {
            currentFilter = filterSelect.value;
            currentPage = 1;
            renderOrders(currentPage, currentSort, currentFilter, currentSearch, currentStartDate, currentEndDate).then(({ orders }) => {
                currentOrders = orders;
            });
            trackEvent("filter_orders", { filter: currentFilter });
        });
    } else {
        console.error("Error: #filter not found");
    }

    // Date range handler
    const startDateInput = document.querySelector("#start-date");
    const endDateInput = document.querySelector("#end-date");
    if (startDateInput && endDateInput) {
        const debouncedDateRange = debounce(() => {
            currentStartDate = startDateInput.value;
            currentEndDate = endDateInput.value;
            if (currentStartDate && currentEndDate && new Date(currentStartDate) > new Date(currentEndDate)) {
                alert("Start date must be before end date");
                startDateInput.value = "";
                endDateInput.value = "";
                currentStartDate = "";
                currentEndDate = "";
            }
            currentPage = 1;
            renderOrders(currentPage, currentSort, currentFilter, currentSearch, currentStartDate, currentEndDate).then(({ orders }) => {
                currentOrders = orders;
            });
            trackEvent("filter_date_range", { start_date: currentStartDate, end_date: currentEndDate });
        }, 300);
        startDateInput.addEventListener("change", debouncedDateRange);
        endDateInput.addEventListener("change", debouncedDateRange);
    } else {
        console.error("Error: #start-date or #end-date not found");
    }

    // Export CSV handler
    const exportBtn = document.querySelector(".export-btn");
    if (exportBtn) {
        exportBtn.addEventListener("click", async () => {
            if (confirm("Export current orders to CSV?")) {
                let orders = await fetchOrders();
                if (currentSearch) {
                    orders = orders.filter(order =>
                        order.id.toLowerCase().includes(currentSearch.toLowerCase()) ||
                        order.customer.toLowerCase().includes(currentSearch.toLowerCase())
                    );
                }
                if (currentFilter) {
                    orders = orders.filter(order => order.status === currentFilter);
                }
                if (currentStartDate && currentEndDate) {
                    const start = new Date(currentStartDate);
                    const end = new Date(currentEndDate);
                    if (start <= end) {
                        orders = orders.filter(order => {
                            const orderDate = new Date(order.date);
                            return orderDate >= start && orderDate <= end;
                        });
                    }
                }
                orders.sort((a, b) => {
                    if (currentSort === "date-desc") return new Date(b.date) - new Date(a.date);
                    if (currentSort === "date-asc") return new Date(a.date) - new Date(b.date);
                    if (currentSort === "amount-asc") return a.amount - b.amount;
                    if (currentSort === "amount-desc") return b.amount - a.amount;
                    return 0;
                });
                downloadCSV(orders);
                trackEvent("export_csv", { order_count: orders.length });
            }
        });
    } else {
        console.error("Error: .export-btn not found");
    }

    // Pagination handlers
    const firstBtn = document.querySelector("#first-page");
    const prevBtn = document.querySelector("#prev-page");
    const nextBtn = document.querySelector("#next-page");
    const lastBtn = document.querySelector("#last-page");
    if (firstBtn && prevBtn && nextBtn && lastBtn) {
        firstBtn.addEventListener("click", () => {
            if (currentPage !== 1) {
                currentPage = 1;
                renderOrders(currentPage, currentSort, currentFilter, currentSearch, currentStartDate, currentEndDate).then(({ orders }) => {
                    currentOrders = orders;
                });
                trackEvent("pagination_first");
            }
        });
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderOrders(currentPage, currentSort, currentFilter, currentSearch, currentStartDate, currentEndDate).then(({ orders }) => {
                    currentOrders = orders;
                });
                trackEvent("pagination_prev");
            }
        });
        nextBtn.addEventListener("click", () => {
            const totalPages = Math.ceil(currentOrders.length / 5);
            if (currentPage < totalPages) {
                currentPage++;
                renderOrders(currentPage, currentSort, currentFilter, currentSearch, currentStartDate, currentEndDate).then(({ orders }) => {
                    currentOrders = orders;
                });
                trackEvent("pagination_next");
            }
        });
        lastBtn.addEventListener("click", () => {
            const totalPages = Math.ceil(currentOrders.length / 5);
            if (currentPage !== totalPages) {
                currentPage = totalPages;
                renderOrders(currentPage, currentSort, currentFilter, currentSearch, currentStartDate, currentEndDate).then(({ orders }) => {
                    currentOrders = orders;
                });
                trackEvent("pagination_last");
            }
        });
    } else {
        console.error("Error: Pagination buttons not found");
    }

    // Select all handler
    const selectAllCheckbox = document.querySelector("#select-all");
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener("change", () => {
            const checkboxes = document.querySelectorAll(".select-order");
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
            updateBulkActions();
            trackEvent("select_all_orders", { checked: selectAllCheckbox.checked });
        });
    } else {
        console.error("Error: #select-all not found");
    }

    // Event delegation for dynamic elements
    document.querySelector(".orders-table").addEventListener("change", (e) => {
        if (e.target.classList.contains("select-order")) {
            updateBulkActions();
            trackEvent("select_order", { order_id: e.target.dataset.id, checked: e.target.checked });
        } else if (e.target.classList.contains("status-select")) {
            const orderId = e.target.dataset.id;
            const newStatus = e.target.value;
            mockOrders.forEach(order => {
                if (order.id === orderId) {
                    order.status = newStatus;
                }
            });
            renderOrders(currentPage, currentSort, currentFilter, currentSearch, currentStartDate, currentEndDate).then(({ orders }) => {
                currentOrders = orders;
            });
            trackEvent("update_status", { order_id: orderId, status: newStatus });
        }
    });

    document.querySelector(".orders-table").addEventListener("click", (e) => {
        const target = e.target.closest(".action-btn.view-btn");
        if (!target) return;

        const id = target.dataset.id;
        console.log(`Navigating to order details for ID: ${id}`);
        gsap.to(target, {
            scale: 0.95,
            duration: 0.1,
            ease: "power2.in",
            onComplete: () => {
                gsap.to(target, { scale: 1, duration: 0.1 });
                trackEvent("view_order", { order_id: id });
                window.location.href = `order_details.html?id=${id}`;
            }
        });
    });

    // Bulk status update handler
    const updateStatusBtn = document.querySelector(".update-status-btn");
    const bulkStatusSelect = document.querySelector("#bulk-status");
    if (updateStatusBtn && bulkStatusSelect) {
        bulkStatusSelect.addEventListener("change", () => {
            updateBulkActions();
            trackEvent("bulk_status_select", { status: bulkStatusSelect.value });
        });
        updateStatusBtn.addEventListener("click", async () => {
            const selectedCheckboxes = document.querySelectorAll(".select-order:checked");
            if (selectedCheckboxes.length === 0 || !bulkStatusSelect.value) return;
            if (confirm(`Update status of ${selectedCheckboxes.length} order(s) to ${bulkStatusSelect.value}?`)) {
                const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.id);
                mockOrders.forEach(order => {
                    if (selectedIds.includes(order.id)) {
                        order.status = bulkStatusSelect.value;
                    }
                });
                const { orders } = await renderOrders(currentPage, currentSort, currentFilter, currentSearch, currentStartDate, currentEndDate);
                currentOrders = orders;
                trackEvent("bulk_update_status", { status: bulkStatusSelect.value, order_ids: selectedIds });
                bulkStatusSelect.value = "";
                updateBulkActions();
            }
        });
    } else {
        console.error("Error: .update-status-btn or #bulk-status not found");
    }

    // Animate orders card
    const ordersCard = document.querySelector(".orders-card");
    if (ordersCard) {
        gsap.from(ordersCard, {
            opacity: 0,
            y: 50,
            duration: 0.7,
            ease: "power3.out"
        });
    } else {
        console.error("Error: .orders-card not found");
    }

    // Animate controls and table
    const controlsAndTable = document.querySelectorAll(".orders-controls, .orders-table, .pagination");
    if (controlsAndTable.length) {
        gsap.from(controlsAndTable, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.2
        });
    } else {
        console.error("Error: Orders controls or table not found");
    }
});