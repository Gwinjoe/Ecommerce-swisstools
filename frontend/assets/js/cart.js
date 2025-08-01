import { gsap } from "gsap";

document.addEventListener("DOMContentLoaded", () => {
    // Update subtotal and total
    const updateCart = () => {
        let subtotal = 0;
        document.querySelectorAll(".cart-item").forEach(item => {
            const price = parseFloat(item.querySelector(".cart-item-price").textContent.replace("$", ""));
            const quantity = parseInt(item.querySelector(".quantity-input").value);
            const itemSubtotal = price * quantity;
            item.querySelector(".cart-item-subtotal").textContent = `$${itemSubtotal.toFixed(2)}`;
            subtotal += itemSubtotal;
        });
        const shipping = 10.00; // Fixed shipping cost for demo
        document.querySelector(".summary-details p:nth-child(1) span:last-child").textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector(".summary-total").textContent = `$${(subtotal + shipping).toFixed(2)}`;
    };

    // Quantity input change
    document.querySelectorAll(".quantity-input").forEach(input => {
        input.addEventListener("change", () => {
            if (input.value < 1) input.value = 1;
            updateCart();
            gsap.to(input, { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
        });
    }); 

    // Remove item
    document.querySelectorAll(".btn-remove").forEach(button => {
        button.addEventListener("click", () => {
            const item = button.closest(".cart-item");
            gsap.to(item, {
                opacity: 0,
                height: 0,
                marginBottom: 0,
                duration: 0.5,
                onComplete: () => {
                    item.remove();
                    updateCart();
                    if (!document.querySelector(".cart-item")) {
                        document.querySelector(".cart-items").innerHTML = "<p>Your cart is empty.</p>";
                    }
                }
            });
        });
    });

    // Animate cart items and summary on scroll
    gsap.from(".cart-item", {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".cart-items",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });

    gsap.from(".cart-summary", {
        opacity: 0,
        x: 50,
        duration: 1,
        scrollTrigger: {
            trigger: ".cart-summary",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
});