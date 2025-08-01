import { gsap } from "gsap";

// Log script loading for debugging
console.log("products.js loaded");

// Google Analytics event tracking function
function trackEvent(eventName, eventParams = {}) {
    if (typeof gtag === 'function') {
        gtag('event', eventName, eventParams);
    } else {
        console.warn("Google Analytics not loaded, event not tracked:", eventName, eventParams);
    }
}

// Mock product data storage (to simulate persistence)
let mockProducts = [
    { id: "1", name: "Laptop Pro", category: "electronics", price: 1299.99, stock: 25, mainImage: "https://via.placeholder.com/100" },
    { id: "2", name: "Cordless Drill", category: "tools", price: 89.99, stock: 50, mainImage: "https://via.placeholder.com/100/FF0000" },
    { id: "3", name: "Steel Rod", category: "materials", price: 45.50, stock: 100, mainImage: "https://via.placeholder.com/100/00FF00" },
    { id: "4", name: "Wireless Mouse", category: "accessories", price: 29.99, stock: 75, mainImage: "https://via.placeholder.com/100/0000FF" },
    { id: "5", name: "Coffee Table", category: "furniture", price: 199.99, stock: 10, mainImage: "https://via.placeholder.com/100/FFFF00" },
    { id: "6", name: "Smartphone X", category: "electronics", price: 799.99, stock: 30, mainImage: "https://via.placeholder.com/100/FF00FF" },
    { id: "7", name: "Hammer", category: "tools", price: 19.99, stock: 60, mainImage: "https://via.placeholder.com/100/00FFFF" },
    { id: "8", name: "Wood Plank", category: "materials", price: 15.75, stock: 200, mainImage: "https://via.placeholder.com/100/FF0000" },
    { id: "9", name: "Desk Lamp", category: "accessories", price: 39.99, stock: 40, mainImage: "https://via.placeholder.com/100/00FF00" },
    { id: "10", name: "Bookshelf", category: "furniture", price: 149.99, stock: 15, mainImage: "https://via.placeholder.com/100/0000FF" }
];

// Mock API for fetching products
async function fetchProducts() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockProducts]); // Return a copy to avoid direct mutation
        }, 1000);
    });
}

// Mock API for fetching categories
async function fetchCategories() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const categories = [
                { id: "electronics", name: "Electronics" },
                { id: "tools", name: "Tools" },
                { id: "materials", name: "Materials" },
                { id: "accessories", name: "Accessories" },
                { id: "furniture", name: "Furniture" }
            ];
            if (categories.length === 0) {
                reject(new Error("No categories available"));
            } else {
                resolve(categories);
            }
        }, 1000);
    });
}

// Load categories for filter and bulk actions dropdowns
async function loadCategories() {
    const filterSelect = document.querySelector("#filter");
    const bulkCategorySelect = document.querySelector("#bulk-category");
    if (!filterSelect || !bulkCategorySelect) {
        console.error("Error: #filter or #bulk-category not found");
        return;
    }
    try {
        const categories = await fetchCategories();
        filterSelect.innerHTML = '<option value="">All Categories</option>';
        bulkCategorySelect.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(category => {
            const filterOption = document.createElement("option");
            filterOption.value = category.id;
            filterOption.textContent = category.name;
            filterSelect.appendChild(filterOption);
            const bulkOption = document.createElement("option");
            bulkOption.value = category.id;
            bulkOption.textContent = category.name;
            bulkCategorySelect.appendChild(bulkOption);
        });
        gsap.from([filterSelect, bulkCategorySelect], { opacity: 0, duration: 0.5, ease: "power3.out" });
    } catch (error) {
        console.error("Error fetching categories:", error);
        filterSelect.innerHTML = '<option value="">Error loading categories</option>';
        bulkCategorySelect.innerHTML = '<option value="">Error loading categories</option>';
        const noProducts = document.querySelector(".no-products");
        if (noProducts) {
            noProducts.textContent = "Error loading data";
            noProducts.classList.add("active");
            gsap.from(noProducts, { opacity: 0, duration: 0.5, ease: "power3.out" });
        }
    }
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

// Render products with pagination, sort, filter, and search
async function renderProducts(page = 1, sort = "name-asc", filter = "", search = "") {
    const productList = document.querySelector("#product-list");
    const noProducts = document.querySelector(".no-products");
    const pageInfo = document.querySelector("#page-info");
    const bulkActions = document.querySelector(".bulk-actions");
    const deleteSelectedBtn = document.querySelector(".delete-selected-btn");
    const assignCategoryBtn = document.querySelector(".assign-category-btn");
    const selectAllCheckbox = document.querySelector("#select-all");
    if (!productList || !noProducts || !pageInfo || !bulkActions || !deleteSelectedBtn || !assignCategoryBtn || !selectAllCheckbox) {
        console.error("Error: Required elements not found");
        return;
    }

    try {
        let products = await fetchProducts();
        const itemsPerPage = 5;

        // Apply search
        if (search) {
            products = products.filter(product => product.name.toLowerCase().includes(search.toLowerCase()));
        }

        // Apply filter
        if (filter) {
            products = products.filter(product => product.category === filter);
        }

        // Apply sort
        products.sort((a, b) => {
            if (sort === "name-asc") return a.name.localeCompare(b.name);
            if (sort === "name-desc") return b.name.localeCompare(a.name);
            if (sort === "price-asc") return a.price - b.price;
            if (sort === "price-desc") return b.price - a.price;
            return 0;
        });

        // Pagination
        const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
        page = Math.min(page, totalPages); // Ensure page doesn't exceed totalPages
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedProducts = products.slice(start, end);

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

        // Render products
        productList.innerHTML = "";
        if (paginatedProducts.length === 0) {
            noProducts.classList.add("active");
            bulkActions.style.display = "none";
            gsap.from(noProducts, { opacity: 0, duration: 0.5, ease: "power3.out" });
            return;
        }

        noProducts.classList.remove("active");
        paginatedProducts.forEach((product, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><input type="checkbox" class="select-product" data-id="${product.id}" data-ga-event="select_product"></td>
                <td>${product.name}</td>
                <td>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td><img src="${product.mainImage}" alt="${product.name}"></td>
                <td>
                    <button class="action-btn edit-btn" data-id="${product.id}" data-ga-event="edit_product"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${product.id}" data-ga-event="delete_product"><i class="fas fa-trash"></i></button>
                </td>
            `;
            productList.appendChild(row);
            gsap.from(row, { opacity: 0, y: 20, duration: 0.5, ease: "power3.out", delay: index * 0.1 });
        });

        // Render mobile cards
        const mobileContainer = document.querySelector(".products-table");
        if (window.innerWidth <= 768) {
            mobileContainer.innerHTML = "";
            paginatedProducts.forEach((product, index) => {
                const card = document.createElement("div");
                card.classList.add("product-card");
                card.innerHTML = `
                    <div><input type="checkbox" class="select-product" data-id="${product.id}" data-ga-event="select_product"></div>
                    <div><strong>Name:</strong> ${product.name}</div>
                    <div><strong>Category:</strong> ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                    <div><strong>Price:</strong> $${product.price.toFixed(2)}</div>
                    <div><strong>Stock:</strong> ${product.stock}</div>
                    <div><img src="${product.mainImage}" alt="${product.name}"></div>
                    <div class="actions">
                        <button class="action-btn edit-btn" data-id="${product.id}" data-ga-event="edit_product"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" data-id="${product.id}" data-ga-event="delete_product"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                mobileContainer.appendChild(card);
                gsap.from(card, { opacity: 0, y: 20, duration: 0.5, ease: "power3.out", delay: index * 0.1 });
            });
        }

        // Update bulk actions visibility
        updateBulkActions();

        return { products, totalPages }; // Return for pagination handlers
    } catch (error) {
        console.error("Error rendering products:", error);
        productList.innerHTML = "";
        noProducts.textContent = "Error loading products";
        noProducts.classList.add("active");
        bulkActions.style.display = "none";
        gsap.from(noProducts, { opacity: 0, duration: 0.5, ease: "power3.out" });
        return { products: [], totalPages: 1 };
    }
}

// Update bulk actions visibility and state
function updateBulkActions() {
    const bulkActions = document.querySelector(".bulk-actions");
    const deleteSelectedBtn = document.querySelector(".delete-selected-btn");
    const assignCategoryBtn = document.querySelector(".assign-category-btn");
    const selectAllCheckbox = document.querySelector("#select-all");
    const selectedCheckboxes = document.querySelectorAll(".select-product:checked");
    if (!bulkActions || !deleteSelectedBtn || !assignCategoryBtn || !selectAllCheckbox) return;

    selectAllCheckbox.checked = selectedCheckboxes.length > 0 && selectedCheckboxes.length === document.querySelectorAll(".select-product").length;

    if (selectedCheckboxes.length > 0) {
        bulkActions.style.display = "flex";
        deleteSelectedBtn.disabled = false;
        assignCategoryBtn.disabled = !document.querySelector("#bulk-category").value;
        gsap.from(bulkActions, { opacity: 0, y: 10, duration: 0.3, ease: "power3.out" });
    } else {
        bulkActions.style.display = "none";
        deleteSelectedBtn.disabled = true;
        assignCategoryBtn.disabled = true;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded fired");

    let currentPage = 1;
    let currentSort = "name-asc";
    let currentFilter = "";
    let currentSearch = "";
    let currentProducts = [];

    // Load categories and initial products
    loadCategories();
    renderProducts(currentPage, currentSort, currentFilter, currentSearch).then(({ products }) => {
        currentProducts = products;
    });

    // Add product button
    const addProductBtn = document.querySelector(".add-product-btn");
    if (addProductBtn) {
        addProductBtn.addEventListener("click", () => {
            gsap.to(addProductBtn, {
                scale: 0.95,
                duration: 0.1,
                ease: "power2.in",
                onComplete: () => {
                    gsap.to(addProductBtn, { scale: 1, duration: 0.1 });
                    trackEvent("add_product_nav");
                    window.location.href = "add_product.html";
                }
            });
        });
    } else {
        console.error("Error: .add-product-btn not found");
    }

    // Search handler with debounce
    const searchInput = document.querySelector("#search");
    if (searchInput) {
        const debouncedSearch = debounce(() => {
            currentSearch = searchInput.value.trim();
            currentPage = 1;
            renderProducts(currentPage, currentSort, currentFilter, currentSearch).then(({ products }) => {
                currentProducts = products;
            });
            trackEvent("search_products", { query: currentSearch });
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
            renderProducts(currentPage, currentSort, currentFilter, currentSearch).then(({ products }) => {
                currentProducts = products;
            });
            trackEvent("sort_products", { sort: currentSort });
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
            renderProducts(currentPage, currentSort, currentFilter, currentSearch).then(({ products }) => {
                currentProducts = products;
            });
            trackEvent("filter_products", { filter: currentFilter });
        });
    } else {
        console.error("Error: #filter not found");
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
                renderProducts(currentPage, currentSort, currentFilter, currentSearch).then(({ products }) => {
                    currentProducts = products;
                });
                trackEvent("pagination_first");
            }
        });
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts(currentPage, currentSort, currentFilter, currentSearch).then(({ products }) => {
                    currentProducts = products;
                });
                trackEvent("pagination_prev");
            }
        });
        nextBtn.addEventListener("click", () => {
            const totalPages = Math.ceil(currentProducts.length / 5);
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts(currentPage, currentSort, currentFilter, currentSearch).then(({ products }) => {
                    currentProducts = products;
                });
                trackEvent("pagination_next");
            }
        });
        lastBtn.addEventListener("click", () => {
            const totalPages = Math.ceil(currentProducts.length / 5);
            if (currentPage !== totalPages) {
                currentPage = totalPages;
                renderProducts(currentPage, currentSort, currentFilter, currentSearch).then(({ products }) => {
                    currentProducts = products;
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
            const checkboxes = document.querySelectorAll(".select-product");
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
            updateBulkActions();
            trackEvent("select_all_products", { checked: selectAllCheckbox.checked });
        });
    } else {
        console.error("Error: #select-all not found");
    }

    // Event delegation for dynamic elements
    document.querySelector(".products-table").addEventListener("change", (e) => {
        if (e.target.classList.contains("select-product")) {
            updateBulkActions();
            trackEvent("select_product", { product_id: e.target.dataset.id, checked: e.target.checked });
        }
    });

    document.querySelector(".products-table").addEventListener("click", async (e) => {
        const target = e.target.closest(".action-btn");
        if (!target) return;

        const id = target.dataset.id;
        if (target.classList.contains("edit-btn")) {
            gsap.to(target, {
                scale: 0.95,
                duration: 0.1,
                ease: "power2.in",
                onComplete: () => {
                    gsap.to(target, { scale: 1, duration: 0.1 });
                    trackEvent("edit_product", { product_id: id });
                    window.location.href = `edit_product.html?id=${id}`;
                }
            });
        } else if (target.classList.contains("delete-btn")) {
            if (confirm("Are you sure you want to delete this product?")) {
                const row = target.closest("tr") || target.closest(".product-card");
                gsap.to(row, {
                    opacity: 0,
                    x: -50,
                    duration: 0.5,
                    ease: "power3.in",
                    onComplete: async () => {
                        row.remove();
                        mockProducts = mockProducts.filter(product => product.id !== id);
                        if (currentProducts.length <= (currentPage - 1) * 5) {
                            currentPage = Math.max(1, currentPage - 1);
                        }
                        const { products } = await renderProducts(currentPage, currentSort, currentFilter, currentSearch);
                        currentProducts = products;
                        trackEvent("delete_product", { product_id: id });
                    }
                });
            }
        }
    });

    // Bulk delete handler
    const deleteSelectedBtn = document.querySelector(".delete-selected-btn");
    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener("click", async () => {
            const selectedCheckboxes = document.querySelectorAll(".select-product:checked");
            if (selectedCheckboxes.length === 0) return;
            if (confirm(`Are you sure you want to delete ${selectedCheckboxes.length} product(s)?`)) {
                const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.id);
                const rows = Array.from(selectedCheckboxes).map(cb => cb.closest("tr") || cb.closest(".product-card"));
                gsap.to(rows, {
                    opacity: 0,
                    x: -50,
                    duration: 0.5,
                    ease: "power3.in",
                    stagger: 0.1,
                    onComplete: async () => {
                        rows.forEach(row => row.remove());
                        mockProducts = mockProducts.filter(product => !selectedIds.includes(product.id));
                        if (currentProducts.length <= (currentPage - 1) * 5) {
                            currentPage = Math.max(1, currentPage - 1);
                        }
                        const { products } = await renderProducts(currentPage, currentSort, currentFilter, currentSearch);
                        currentProducts = products;
                        trackEvent("bulk_delete_products", { product_ids: selectedIds });
                    }
                });
            }
        });
    } else {
        console.error("Error: .delete-selected-btn not found");
    }

    // Bulk category assign handler
    const assignCategoryBtn = document.querySelector(".assign-category-btn");
    const bulkCategorySelect = document.querySelector("#bulk-category");
    if (assignCategoryBtn && bulkCategorySelect) {
        bulkCategorySelect.addEventListener("change", () => {
            updateBulkActions();
            trackEvent("bulk_category_select", { category: bulkCategorySelect.value });
        });
        assignCategoryBtn.addEventListener("click", async () => {
            const selectedCheckboxes = document.querySelectorAll(".select-product:checked");
            if (selectedCheckboxes.length === 0 || !bulkCategorySelect.value) return;
            const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.id);
            mockProducts = mockProducts.map(product => {
                if (selectedIds.includes(product.id)) {
                    return { ...product, category: bulkCategorySelect.value };
                }
                return product;
            });
            const { products } = await renderProducts(currentPage, currentSort, currentFilter, currentSearch);
            currentProducts = products;
            trackEvent("bulk_assign_category", { category: bulkCategorySelect.value, product_ids: selectedIds });
            bulkCategorySelect.value = "";
            updateBulkActions();
        });
    } else {
        console.error("Error: .assign-category-btn or #bulk-category not found");
    }

    // Animate products card
    const productsCard = document.querySelector(".products-card");
    if (productsCard) {
        gsap.from(productsCard, {
            opacity: 0,
            y: 50,
            duration: 0.7,
            ease: "power3.out"
        });
    } else {
        console.error("Error: .products-card not found");
    }

    // Animate controls and table
    const controlsAndTable = document.querySelectorAll(".products-controls, .products-table, .pagination");
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
        console.error("Error: Products controls or table not found");
    }
});