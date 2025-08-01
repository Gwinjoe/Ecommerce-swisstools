import { gsap } from "gsap";

document.addEventListener("DOMContentLoaded", () => {
    // Thumbnail switching
    const thumbnails = document.querySelectorAll(".thumbnail");
    const mainImage = document.querySelector(".main-image img");

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener("click", () => {
            const newSrc = thumbnail.src;
            gsap.to(mainImage, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    mainImage.src = newSrc;
                    gsap.to(mainImage, { opacity: 1, duration: 0.3 });
                }
            });
        });
    });

    // Animate add to cart button
    const addToCartBtn = document.querySelector(".add-to-cart");
    addToCartBtn.addEventListener("click", () => {
        gsap.to(addToCartBtn, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                alert("Added to cart!"); // Placeholder for cart logic
            }
        });
    });

    // Animate product details on scroll
    gsap.from(".product-details", {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: ".product-details",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });

    // Tab switching
    const tabItems = document.querySelectorAll(".tab-item");
    const tabPanes = document.querySelectorAll(".tab-pane");

    tabItems.forEach(item => {
        item.addEventListener("click", () => {
            // Remove active class from all tabs and panes
            tabItems.forEach(tab => tab.classList.remove("active"));
            tabPanes.forEach(pane => pane.classList.remove("active"));

            // Add active class to clicked tab and corresponding pane
            item.classList.add("active");
            const tabId = item.getAttribute("data-tab");
            const activePane = document.getElementById(tabId);
            activePane.classList.add("active");

            // Animate tab content
            gsap.from(activePane, {
                opacity: 0,
                y: 20,
                duration: 0.5
            });
        });
    });

    // Animate related products on scroll
    gsap.from(".product-card", {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".related-products",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
});