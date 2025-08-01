document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        menuToggle: document.getElementById('menu-toggle'),
        navMenu: document.getElementById('nav-menu'),
        menuIcon: document.getElementById('menu-icon'),
        searchInput: document.getElementById('searchInput'),
        categoryFilter: document.getElementById('categoryFilter'),
        brandFilter: document.getElementById('brandFilter'),
        ratingFilter: document.getElementById('ratingFilter'),
        sortPrice: document.getElementById('sortPrice'),
        priceMin: document.getElementById('priceMin'),
        priceMax: document.getElementById('priceMax'),
        minPriceDisplay: document.getElementById('minPrice'),
        maxPriceDisplay: document.getElementById('maxPrice'),
        productGrid: document.getElementById('productGrid'),
        noResults: document.getElementById('noResults'),
        cartCount: document.getElementById('cart-count'),
        pagination: document.getElementById('pagination'),
        quickViewModal: document.getElementById('quickViewModal'),
        modalImage: document.getElementById('modalImage'),
        modalName: document.getElementById('modalName'),
        modalBrand: document.getElementById('modalBrand'),
        modalRating: document.getElementById('modalRating'),
        modalPrice: document.getElementById('modalPrice'),
        modalDescription: document.getElementById('modalDescription'),
        modalAddToCart: document.getElementById('modalAddToCart'),
        compareModal: document.getElementById('compareModal'),
        compareTable: document.getElementById('compareTable'),
        clearCompare: document.getElementById('clearCompare'),
        gridViewBtn: document.getElementById('gridView'),
        listViewBtn: document.getElementById('listView'),
        resetFilters: document.getElementById('resetFilters'),
        autocomplete: document.getElementById('autocomplete'),
        filterSummary: document.getElementById('filterSummary'),
        spinner: document.getElementById('spinner'),
        recentlyViewed: document.getElementById('recentlyViewed')
    };

    // State Management
    let state = {
        cart: JSON.parse(localStorage.getItem('cart') || '[]'),
        wishlist: JSON.parse(localStorage.getItem('wishlist') || '[]'),
        compareList: JSON.parse(localStorage.getItem('compare') || '[]'),
        recentlyViewedList: JSON.parse(localStorage.getItem('recentlyViewed') || '[]'),
        currentPage: 1,
        itemsPerPage: 8
    };

    // Utility Functions
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // Safe localStorage access
    const safeLocalStorage = {
        get: (key) => {
            try {
                return JSON.parse(localStorage.getItem(key) || '[]');
            } catch (e) {
                console.error(`Error reading ${key} from localStorage:`, e);
                return [];
            }
        },
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error(`Error writing ${key} to localStorage:`, e);
            }
        }
    };

    // Menu Toggle
    const toggleMenu = () => {
        elements.navMenu.classList.toggle('active');
        elements.menuIcon.classList.toggle('fa-bars');
        elements.menuIcon.classList.toggle('fa-times');
    };

    // Update Cart Count
    const updateCartCount = () => {
        if (elements.cartCount) {
            elements.cartCount.textContent = state.cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        }
    };

    // Update Wishlist Buttons
    const updateWishlistButtons = () => {
        document.querySelectorAll('.wishlist').forEach(button => {
            const productId = button.closest('.product-item')?.dataset.name.replace(/\s+/g, '-').toLowerCase();
            if (productId) {
                button.classList.toggle('active', state.wishlist.includes(productId));
            }
        });
    };

    // Update Compare Buttons
    const updateCompareButtons = () => {
        document.querySelectorAll('.compare').forEach(button => {
            const productId = button.closest('.product-item')?.dataset.name.replace(/\s+/g, '-').toLowerCase();
            if (productId) {
                button.classList.toggle('active', state.compareList.includes(productId));
            }
        });
    };

    // Toggle View Mode
    const toggleViewMode = (isGrid) => {
        elements.productGrid.classList.toggle('list', !isGrid);
        elements.gridViewBtn.classList.toggle('active', isGrid);
        elements.listViewBtn.classList.toggle('active', !isGrid);
        updateProducts();
    };

    // Update Price Display
    const updatePriceDisplay = () => {
        if (elements.priceMin && elements.priceMax && elements.minPriceDisplay && elements.maxPriceDisplay) {
            // Ensure max is not less than min
            if (parseFloat(elements.priceMax.value) < parseFloat(elements.priceMin.value)) {
                elements.priceMax.value = elements.priceMin.value;
            }
            elements.minPriceDisplay.textContent = `$${elements.priceMin.value}`;
            elements.maxPriceDisplay.textContent = `$${elements.priceMax.value}`;
        }
    };

    // Autocomplete Suggestions
    const updateAutocomplete = () => {
        if (!elements.searchInput || !elements.autocomplete) return;
        const query = elements.searchInput.value.toLowerCase().trim();
        const suggestions = Array.from(elements.productGrid.querySelectorAll('.product-item'))
            .map(item => ({
                name: item.dataset.name,
                category: item.dataset.category
            }))
            .filter(item => item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query))
            .slice(0, 5);

        elements.autocomplete.innerHTML = '';
        if (query && suggestions.length > 0) {
            suggestions.forEach((item, index) => {
                const div = document.createElement('div');
                div.classList.add('autocomplete-item');
                div.textContent = item.name;
                div.setAttribute('tabindex', '0');
                div.addEventListener('click', () => {
                    elements.searchInput.value = item.name;
                    elements.autocomplete.style.display = 'none';
                    updateProducts();
                });
                div.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        elements.searchInput.value = item.name;
                        elements.autocomplete.style.display = 'none';
                        updateProducts();
                    }
                });
                elements.autocomplete.appendChild(div);
            });
            elements.autocomplete.style.display = 'block';
        } else {
            elements.autocomplete.style.display = 'none';
        }
    };

    // Filter Summary
    const updateFilterSummary = () => {
        if (!elements.filterSummary) return;
        elements.filterSummary.innerHTML = '';
        const filters = [
            { key: 'search', value: elements.searchInput.value, label: `Search: ${elements.searchInput.value}` },
            { key: 'category', value: elements.categoryFilter.value, label: `Category: ${elements.categoryFilter.options[elements.categoryFilter.selectedIndex]?.text || 'All'}` },
            { key: 'brand', value: elements.brandFilter.value, label: `Brand: ${elements.brandFilter.options[elements.brandFilter.selectedIndex]?.text || 'All'}` },
            { key: 'rating', value: elements.ratingFilter.value, label: `Rating: ${elements.ratingFilter.options[elements.ratingFilter.selectedIndex]?.text || 'All'}` },
            { key: 'priceMin', value: elements.priceMin.value, label: `Min Price: $${elements.priceMin.value}` },
            { key: 'priceMax', value: elements.priceMax.value, label: `Max Price: $${elements.priceMax.value}` }
        ].filter(f => f.value && f.value !== 'all' && f.value !== '0' && f.value !== '500');

        filters.forEach(filter => {
            const tag = document.createElement('div');
            tag.classList.add('filter-tag');
            tag.innerHTML = `${filter.label} <span aria-label="Remove ${filter.label}">×</span>`;
            tag.querySelector('span').addEventListener('click', () => {
                if (filter.key === 'search') elements.searchInput.value = '';
                else if (filter.key === 'category') elements.categoryFilter.value = 'all';
                else if (filter.key === 'brand') elements.brandFilter.value = 'all';
                else if (filter.key === 'rating') elements.ratingFilter.value = 'all';
                else if (filter.key === 'priceMin') elements.priceMin.value = '0';
                else if (filter.key === 'priceMax') elements.priceMax.value = '500';
                updatePriceDisplay();
                updateProducts();
                updateURLParams();
            });
            elements.filterSummary.appendChild(tag);
        });
    };

    // URL Parameters
    const updateURLParams = () => {
        const params = new URLSearchParams();
        if (elements.searchInput.value) params.set('search', elements.searchInput.value);
        if (elements.categoryFilter.value !== 'all') params.set('category', elements.categoryFilter.value);
        if (elements.brandFilter.value !== 'all') params.set('brand', elements.brandFilter.value);
        if (elements.ratingFilter.value !== 'all') params.set('rating', elements.ratingFilter.value);
        if (elements.priceMin.value !== '0') params.set('priceMin', elements.priceMin.value);
        if (elements.priceMax.value !== '500') params.set('priceMax', elements.priceMax.value);
        if (elements.sortPrice.value !== 'default') params.set('sort', elements.sortPrice.value);
        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    };

    const loadURLParams = () => {
        const params = new URLSearchParams(window.location.search);
        elements.searchInput.value = params.get('search') || '';
        elements.categoryFilter.value = params.get('category') || 'all';
        elements.brandFilter.value = params.get('brand') || 'all';
        elements.ratingFilter.value = params.get('rating') || 'all';
        elements.priceMin.value = params.get('priceMin') || '0';
        elements.priceMax.value = params.get('priceMax') || '500';
        elements.sortPrice.value = params.get('sort') || 'default';
        updatePriceDisplay();
    };

    // Product Actions
    const handleProductActions = (e) => {
        const productItem = e.target.closest('.product-item');
        if (!productItem) return;
        const productId = productItem.dataset.name.replace(/\s+/g, '-').toLowerCase();

        if (e.target.closest('.add-to-cart')) {
            const product = {
                id: productId,
                name: productItem.dataset.name,
                price: parseFloat(productItem.dataset.price) || 0,
                quantity: 1
            };
            const existingItem = state.cart.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 0) + 1;
            } else {
                state.cart.push(product);
            }
            safeLocalStorage.set('cart', state.cart);
            updateCartCount();
        }

        if (e.target.closest('.quick-view')) {
            elements.modalImage.src = productItem.querySelector('img').src;
            elements.modalImage.alt = productItem.querySelector('img').alt;
            elements.modalName.textContent = productItem.dataset.name;
            elements.modalBrand.textContent = productItem.querySelector('.brand').textContent;
            elements.modalRating.innerHTML = productItem.querySelector('.rating').innerHTML;
            elements.modalPrice.textContent = `$${productItem.dataset.price}`;
            elements.modalDescription.textContent = `High-quality ${productItem.dataset.name} from ${productItem.querySelector('.brand').textContent}.`;
            elements.modalAddToCart.dataset.id = productId;
            elements.quickViewModal.style.display = 'flex';
            state.recentlyViewedList = [productId, ...state.recentlyViewedList.filter(id => id !== productId)].slice(0, 4);
            safeLocalStorage.set('recentlyViewed', state.recentlyViewedList);
            updateRecentlyViewed();
        }

        if (e.target.closest('.wishlist')) {
            state.wishlist = state.wishlist.includes(productId)
                ? state.wishlist.filter(id => id !== productId)
                : [...state.wishlist, productId];
            safeLocalStorage.set('wishlist', state.wishlist);
            updateWishlistButtons();
        }

        if (e.target.closest('.compare')) {
            if (state.compareList.includes(productId)) {
                state.compareList = state.compareList.filter(id => id !== productId);
            } else if (state.compareList.length < 3) {
                state.compareList.push(productId);
            }
            safeLocalStorage.set('compare', state.compareList);
            updateCompareButtons();
            updateCompareTable();
        }
    };

    // Modal Add to Cart
    const handleModalAddToCart = () => {
        const product = {
            id: elements.modalAddToCart.dataset.id,
            name: elements.modalName.textContent,
            price: parseFloat(elements.modalPrice.textContent.replace('$', '')) || 0,
            quantity: 1
        };
        const existingItem = state.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 0) + 1;
        } else {
            state.cart.push(product);
        }
        safeLocalStorage.set('cart', state.cart);
        updateCartCount();
        elements.quickViewModal.style.display = 'none';
    };

    // Compare Table
    const updateCompareTable = () => {
        if (!elements.compareTable) return;
        elements.compareTable.innerHTML = '';
        if (state.compareList.length === 0) {
            elements.compareModal.style.display = 'none';
            return;
        }
        const products = Array.from(elements.productGrid.querySelectorAll('.product-item')).filter(item =>
            state.compareList.includes(item.dataset.name.replace(/\s+/g, '-').toLowerCase())
        );
        const fields = ['Name', 'Brand', 'Price', 'Rating', 'Category', 'Specs'];
        fields.forEach(field => {
            const row = document.createElement('div');
            row.style.display = 'contents';
            const label = document.createElement('div');
            label.classList.add('label');
            label.textContent = field;
            row.appendChild(label);
            products.forEach(product => {
                const cell = document.createElement('div');
                if (field === 'Name') cell.textContent = product.dataset.name;
                else if (field === 'Brand') cell.textContent = product.querySelector('.brand').textContent;
                else if (field === 'Price') cell.textContent = `$${product.dataset.price}`;
                else if (field === 'Rating') cell.innerHTML = product.querySelector('.rating').innerHTML;
                else if (field === 'Category') cell.textContent = product.dataset.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                else if (field === 'Specs') cell.textContent = product.dataset.specs;
                row.appendChild(cell);
            });
            elements.compareTable.appendChild(row);
        });
        elements.compareModal.style.display = 'flex';
    };

    // Recently Viewed
    const updateRecentlyViewed = () => {
        if (!elements.recentlyViewed) return;
        elements.recentlyViewed.innerHTML = '';
        const products = Array.from(elements.productGrid.querySelectorAll('.product-item')).filter(item =>
            state.recentlyViewedList.includes(item.dataset.name.replace(/\s+/g, '-').toLowerCase())
        );
        products.forEach(product => {
            const clone = product.cloneNode(true);
            clone.querySelector('.tooltip')?.remove();
            elements.recentlyViewed.appendChild(clone);
        });
        elements.recentlyViewed.parentElement.style.display = products.length > 0 ? 'block' : 'none';
    };

    // Pagination
    const setupPagination = (products) => {
        if (!elements.pagination) return;
        elements.pagination.innerHTML = '';
        const pageCount = Math.ceil(products.length / state.itemsPerPage);
        if (state.currentPage > pageCount) state.currentPage = 1;
        for (let i = 1; i <= pageCount; i++) {
            const link = document.createElement('a');
            link.textContent = i;
            link.href = '#';
            if (i === state.currentPage) link.classList.add('current');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                state.currentPage = i;
                updateProducts();
            });
            elements.pagination.appendChild(link);
        }
    };

    // Update Products
    const updateProducts = () => {
        if (!elements.spinner || !elements.productGrid || !elements.noResults) return;
        elements.spinner.style.display = 'block';
        setTimeout(() => {
            const query = elements.searchInput.value.toLowerCase().trim();
            const category = elements.categoryFilter.value;
            const brand = elements.brandFilter.value;
            const rating = elements.ratingFilter.value;
            const sortBy = elements.sortPrice.value;
            const minPrice = parseFloat(elements.priceMin.value) || 0;
            const maxPrice = parseFloat(elements.priceMax.value) || 500;

            let products = Array.from(elements.productGrid.querySelectorAll('.product-item'));

            // Filter products
            products = products.filter(product => {
                const name = product.dataset.name.toLowerCase();
                const prodCat = product.dataset.category;
                const prodBrand = product.dataset.brand;
                const price = parseFloat(product.dataset.price) || 0;
                const prodRating = parseFloat(product.dataset.rating) || 0;
                const matchesSearch = name.includes(query);
                const matchesCategory = category === 'all' || prodCat === category;
                const matchesBrand = brand === 'all' || prodBrand === brand;
                const matchesPrice = price >= minPrice && price <= maxPrice;
                const matchesRating = rating === 'all' || prodRating >= parseFloat(rating);
                const matchesSort = sortBy === 'trending' ? product.dataset.trending === 'true' :
                    sortBy === 'best-selling' ? product.dataset.best === 'true' :
                        sortBy === 'new-arrivals' ? product.dataset.new === 'true' : true;
                return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating && matchesSort;
            });

            // Sort products
            products.sort((a, b) => {
                const priceA = parseFloat(a.dataset.price) || 0;
                const priceB = parseFloat(b.dataset.price) || 0;
                const ratingA = parseFloat(a.dataset.rating) || 0;
                const ratingB = parseFloat(b.dataset.rating) || 0;
                if (sortBy === 'low-high') return priceA - priceB;
                if (sortBy === 'high-low') return priceB - priceA;
                if (sortBy === 'rating') return ratingB - ratingA;
                return 0;
            });

            // Pagination
            setupPagination(products);
            const start = (state.currentPage - 1) * state.itemsPerPage;
            const end = start + state.itemsPerPage;

            // Display products
            products.forEach((product, index) => {
                product.style.display = (index >= start && index < end) ? 'flex' : 'none';
                if (index >= start && index < end) {
                    setTimeout(() => product.classList.add('visible'), index * 50);
                } else {
                    product.classList.remove('visible');
                }
            });

            // Show/hide no results
            elements.noResults.style.display = products.length > 0 ? 'none' : 'block';
            updateFilterSummary();
            updateURLParams();
            elements.spinner.style.display = 'none';
        }, 300);
    };

    // Reset Filters
    const resetFilters = () => {
        elements.searchInput.value = '';
        elements.categoryFilter.value = 'all';
        elements.brandFilter.value = 'all';
        elements.ratingFilter.value = 'all';
        elements.sortPrice.value = 'default';
        elements.priceMin.value = '0';
        elements.priceMax.value = '500';
        state.currentPage = 1;
        updatePriceDisplay();
        updateProducts();
        updateURLParams();
    };

    // Tooltips
    const handleTooltips = (e) => {
        const productItem = e.target.closest('.product-item');
        if (!productItem) return;
        const tooltip = productItem.querySelector('.tooltip');
        if (e.target.closest('.product-item img')) {
            tooltip.textContent = productItem.dataset.specs;
            tooltip.style.display = 'block';
            tooltip.style.left = `${e.clientX - productItem.getBoundingClientRect().left + 10}px`;
            tooltip.style.top = `${e.clientY - productItem.getBoundingClientRect().top + 10}px`;
        } else {
            tooltip.style.display = 'none';
        }
    };

    const hideTooltip = (e) => {
        const tooltip = e.target.querySelector('.tooltip');
        if (tooltip) tooltip.style.display = 'none';
    };

    // Event Listeners
    elements.menuToggle.addEventListener('click', toggleMenu);
    elements.gridViewBtn.addEventListener('click', () => toggleViewMode(true));
    elements.listViewBtn.addEventListener('click', () => toggleViewMode(false));
    elements.resetFilters.addEventListener('click', resetFilters);
    elements.productGrid.addEventListener('click', handleProductActions);
    elements.productGrid.addEventListener('mousemove', handleTooltips);
    elements.productGrid.addEventListener('mouseleave', hideTooltip);
    elements.modalAddToCart.addEventListener('click', handleModalAddToCart);
    elements.clearCompare.addEventListener('click', () => {
        state.compareList = [];
        safeLocalStorage.set('compare', state.compareList);
        updateCompareButtons();
        elements.compareModal.style.display = 'none';
    });

    [elements.quickViewModal, elements.compareModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });

    const debouncedUpdate = debounce(updateProducts, 300);
    const debouncedAutocomplete = debounce(updateAutocomplete, 200);
    const debouncedPriceUpdate = debounce(updatePriceDisplay, 100);

    [elements.categoryFilter, elements.brandFilter, elements.ratingFilter, elements.sortPrice].forEach(el => {
        el.addEventListener('change', debouncedUpdate);
    });

    [elements.priceMin, elements.priceMax].forEach(el => {
        el.addEventListener('input', () => {
            debouncedPriceUpdate();
            debouncedUpdate();
        });
    });

    elements.searchInput.addEventListener('input', () => {
        debouncedUpdate();
        debouncedAutocomplete();
    });

    elements.searchInput.addEventListener('keydown', (e) => {
        const items = elements.autocomplete.querySelectorAll('.autocomplete-item');
        if (items.length === 0) return;
        let currentIndex = Array.from(items).findIndex(item => item === document.activeElement);
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % items.length;
            items[currentIndex].focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            items[currentIndex].focus();
        } else if (e.key === 'Enter' && currentIndex >= 0) {
            e.preventDefault();
            elements.searchInput.value = items[currentIndex].textContent;
            elements.autocomplete.style.display = 'none';
            updateProducts();
        }
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Initialize
    state.cart = safeLocalStorage.get('cart');
    state.wishlist = safeLocalStorage.get('wishlist');
    state.compareList = safeLocalStorage.get('compare');
    state.recentlyViewedList = safeLocalStorage.get('recentlyViewed');
    loadURLParams();
    updateCartCount();
    updateWishlistButtons();
    updateCompareButtons();
    updateRecentlyViewed();
    updateProducts();
});