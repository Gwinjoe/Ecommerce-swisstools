// hamburger menu icon
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const menuIcon = document.getElementById("menu-icon");

  toggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    menuIcon.classList.toggle("fa-bars");
    menuIcon.classList.toggle("fa-times"); // switch icon
  });
});


// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  // Add your smooth scroll logic here
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});


// Dropdown functionality for category selection
// This code assumes you have a dropdown structure in your HTML
document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("categoryDropdown");
  const selected = dropdown.querySelector(".dropdown-selected");
  const options = dropdown.querySelectorAll(".dropdown-options li");

  selected.addEventListener("click", () => {
    dropdown.classList.toggle("open");
  });

  options.forEach(option => {
    option.addEventListener("click", () => {
      selected.textContent = option.textContent;
      dropdown.classList.remove("open");
      const value = option.dataset.value;
      console.log("Selected category:", value); // Use this to trigger filtering
    });
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("open");
    }
  });
});

// Lazy background loader
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-section");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hero.classList.add("loaded");
          observer.unobserve(hero);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(hero);
  } else {
    hero.classList.add("loaded"); // fallback
  }

  // Scroll-based animations
  const animateEls = document.querySelectorAll(".animate-fade-in, .animate-up");

  const animObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  animateEls.forEach((el) => animObserver.observe(el));
});

// Javascript for Scroll Reveal
document.addEventListener("DOMContentLoaded", () => {
  const animatedEls = document.querySelectorAll(".animate-fade-in, .animate-up");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedEls.forEach(el => observer.observe(el));
});


// Swiper Init
const swiper = new Swiper(".mySwiper", {
  slidesPerView: 1.2,
  spaceBetween: 20,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    640: {
      slidesPerView: 1.5,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 2.5,
    },
  },
});

// Filter logic
const catBoxes = document.querySelectorAll('.cat-box');
const slides = document.querySelectorAll('.swiper-slide');

catBoxes.forEach(box => {
  box.addEventListener('click', () => {
    const filter = box.dataset.filter;

    catBoxes.forEach(b => b.classList.remove('active'));
    box.classList.add('active');

    slides.forEach(slide => {
      const category = slide.dataset.category;
      if (filter === 'all' || category === filter) {
        slide.style.display = 'block';
      } else {
        slide.style.display = 'none';
      }
    });

    swiper.update(); // Recalculate swiper layout
  });
});


// featured section
document.addEventListener("DOMContentLoaded", () => {
  const productCards = document.querySelectorAll(".product-card.hidden");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  const revealCards = (count = 6) => {
    let revealed = 0;
    for (let card of productCards) {
      if (card.classList.contains("hidden")) {
        card.classList.remove("hidden");
        card.classList.add("visible");
        revealed++;
        if (revealed >= count) break;
      }
    }
    // Hide the button if all are shown
    if (document.querySelectorAll(".product-card.hidden").length === 0) {
      loadMoreBtn.style.display = "none";
    }
  };

  loadMoreBtn.addEventListener("click", () => {
    revealCards(6); // Show 4 more on each click
  });

  // Animate visible cards
  const animateVisibleCards = document.querySelectorAll(".product-card.animate-fade");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.1 });

  animateVisibleCards.forEach(card => observer.observe(card));
});

// Recently added product section
const recentSwiper = new Swiper(".recent-swiper", {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
    },
  },
});

// Search logic
function searchPage() {
  const keyword = document.getElementById("searchInput").value.trim().toLowerCase();

  // Remove previous highlights
  document.querySelectorAll(".highlight-search").forEach(el => {
    el.outerHTML = el.innerText;
  });

  // Remove previous "no results" message
  const oldFeedback = document.getElementById("search-feedback");
  if (oldFeedback) oldFeedback.remove();

  if (keyword === "") return;

  const searchableContent = document.body.querySelectorAll("h1, h2, h3, h4, p, a, span, li, .product-card");

  let matchFound = false;

  searchableContent.forEach(element => {
    const text = element.innerHTML;
    const regex = new RegExp(`(${keyword.split(" ").join("|")})`, "gi");

    if (regex.test(text)) {
      matchFound = true;
      element.innerHTML = text.replace(regex, match => `<mark class="highlight-search">${match}</mark>`);
    }
  });

  if (!matchFound) {
    const feedback = document.createElement("div");
    feedback.id = "search-feedback";
    feedback.innerText = "No results found.";
    feedback.style.cssText = `
      color: #f00;
      font-weight: bold;
      margin-top: 10px;
      font-family: var(--body-font, sans-serif);
    `;
    document.querySelector(".search-bar").appendChild(feedback);
  }
}

// footer section
// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-fade').forEach(el => observer.observe(el));

// Scroll to Top Button
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.onscroll = function() {
  scrollTopBtn.style.display = (document.documentElement.scrollTop > 300) ? "block" : "none";
};

scrollTopBtn.onclick = function() {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Dynamic Year
document.getElementById("year").textContent = new Date().getFullYear();
