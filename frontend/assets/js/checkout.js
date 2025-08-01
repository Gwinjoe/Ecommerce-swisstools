import { gsap } from "gsap";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".checkout-form");
    const placeOrderBtn = document.querySelector(".btn-place-order");
    const couponInput = document.querySelector("#coupon-code");
    const applyCouponBtn = document.querySelector(".btn-apply-coupon");
    const subtotalElement = document.querySelector(".summary-subtotal");
    const discountElement = document.querySelector(".summary-discount");
    const totalElement = document.querySelector(".summary-total");

    // Coupon application logic (placeholder)
    applyCouponBtn.addEventListener("click", () => {
        const couponCode = couponInput.value.trim();
        if (couponCode) {
            // Simulate a 10% discount for demo purposes
            const subtotal = parseFloat(subtotalElement.textContent.replace("$", ""));
            const discount = subtotal * 0.1; // 10% discount
            const newTotal = subtotal - discount + 10.00; // Add fixed shipping
            discountElement.textContent = `$${discount.toFixed(2)}`;
            totalElement.textContent = `$${newTotal.toFixed(2)}`;
            gsap.to(".summary-details", {
                scale: 1.05,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
            alert(`Coupon "${couponCode}" applied! Discount: $${discount.toFixed(2)}`);
            couponInput.value = ""; // Clear input
        } else {
            gsap.to(couponInput, {
                borderColor: "#e63946",
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });
            alert("Please enter a valid coupon code.");
        }
    });

    // Form validation
    placeOrderBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const inputs = form.querySelectorAll("input[required]");
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                gsap.to(input, {
                    borderColor: "#e63946",
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
            }
        });

        if (isValid) {
            gsap.to(placeOrderBtn, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    alert("Order placed successfully!");
                }
            });
        } else {
            alert("Please fill in all required fields.");
        }
    });

    // Animate form and summary on scroll
    gsap.from(".checkout-form", {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: ".checkout-form",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });

    gsap.from(".order-summary", {
        opacity: 0,
        x: 50,
        duration: 1,
        scrollTrigger: {
            trigger: ".order-summary",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });

    gsap.from(".summary-item", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: ".summary-items",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
});