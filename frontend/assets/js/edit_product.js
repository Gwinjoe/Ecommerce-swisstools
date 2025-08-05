import { gsap } from "gsap";
import showStatusModal from "./modal.js"

// Log script loading for debugging
console.log("edit_product.js loaded");

// Google Analytics event tracking function
function trackEvent(eventName, eventParams = {}) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, eventParams);
  } else {
    console.warn("Google Analytics not loaded, event not tracked:", eventName, eventParams);
  }
}

// Mock API for dynamic category loading
async function fetchCategories() {
  const response = await fetch("/api/categories");
  const { data } = await response.json();
  return data
}

// Mock API for fetching product data
async function mockfetchProductData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "12345",
        name: "Sample Product",
        description: "This is a sample product description.",
        price: 99.99,
        category: "electronics",
        stock: 50,
        images: [
          { url: "https://via.placeholder.com/100", isMain: true },
          { url: "https://via.placeholder.com/100/FF0000", isMain: false },
          { url: "https://via.placeholder.com/100/00FF00", isMain: false }
        ],
        keyFeatures: ["Feature 1", "Feature 2", "Feature 3"],
        whatsInBox: ["Item 1", "Item 2", "Item 3"],
        productDetails: "Detailed summary of the sample product, including specifications and benefits."
      });
    }, 1000); // Simulate network delay
  });
}
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

async function fetchProductData() {
  const response = await fetch(`/api/edit_product/${productId}`);
  const { result } = await response.json();
  return result;

}


// Load categories dynamically
async function loadCategories() {
  const categorySelect = document.querySelector("#category");
  if (!categorySelect) {
    console.error("Error: #category not found");
    return;
  }
  try {
    const categories = await fetchCategories();
    categorySelect.innerHTML = '<option value="">Select category</option>';
    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category._id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
    gsap.from(categorySelect, { opacity: 0, duration: 0.5, ease: "power3.out" });
  } catch (error) {
    console.error("Error fetching categories:", error);
    categorySelect.innerHTML = '<option value="">Error loading categories</option>';
  }
}

// Pre-populate form with product data
async function populateForm() {
  const productData = await fetchProductData();
  if (!productData) return;

  const productName = document.querySelector("#product-name");
  const description = document.querySelector("#description");
  const price = document.querySelector("#price");
  const category = document.querySelector("#category");
  const stock = document.querySelector("#stock");
  const imagePreview = document.querySelector("#image-preview");
  const mainImagePreview = document.querySelector("#main-image-preview");
  const keyFeaturesList = document.querySelector("#key-features");
  const whatsInBoxList = document.querySelector("#whats-in-box");
  const productDetails = document.querySelector("#product-details");

  if (productName) productName.value = productData.name;
  if (description) description.value = productData.description;
  if (price) price.value = productData.price.$numberDecimal;
  if (category) category.value = productData.category;
  if (stock) stock.value = productData.stock;
  if (productDetails) productDetails.value = productData.productDetails;

  // Populate images

  if (mainImagePreview && productData.images.mainImage) {
    const previewItem = document.createElement("div");
    previewItem.classList.add("preview-item");
    const img = document.createElement("img");
    img.src = productData.images.mainImage.url;
    previewItem.appendChild(img);
    mainImagePreview.appendChild(previewItem);
  }

  if (imagePreview && productData.images) {
    productData.images.thumbnails.forEach((image, index) => {
      const previewItem = document.createElement("div");
      previewItem.classList.add("preview-item");
      //if (image.isMain) previewItem.classList.add("main-image");
      const img = document.createElement("img");
      img.src = image.url;
      // const removeBtn = document.createElement("button");
      // removeBtn.textContent = "Remove";
      // removeBtn.addEventListener("click", () => {
      //   previewItem.remove();
      //   trackEvent("remove_image");
      // });
      // const setMainBtn = document.createElement("button");
      // setMainBtn.textContent = "Set as Main";
      // setMainBtn.classList.add("set-main");
      // setMainBtn.addEventListener("click", () => {
      //   document.querySelectorAll(".preview-item").forEach(item => item.classList.remove("main-image"));
      //   previewItem.classList.add("main-image");
      //   trackEvent("set_main_image");
      // });
      previewItem.appendChild(img);
      //previewItem.appendChild(removeBtn);
      //previewItem.appendChild(setMainBtn);
      imagePreview.appendChild(previewItem);
      gsap.from(previewItem, { opacity: 0, scale: 0.8, duration: 0.3, ease: "power3.out", delay: index * 0.1 });
    });
  }

  // Populate key features
  if (keyFeaturesList && productData.keyFeatures) {
    productData.keyFeatures.forEach(feature => {
      const item = document.createElement("div");
      item.classList.add("dynamic-item");
      item.innerHTML = `
                <input type="text" value="${feature}" data-ga-event="key_feature_input">
                <button type="button" class="remove-item" data-ga-event="remove_key_feature"><i class="fas fa-trash"></i></button>
            `;
      keyFeaturesList.appendChild(item);
      item.querySelector(".remove-item").addEventListener("click", () => {
        gsap.to(item, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          ease: "power3.in",
          onComplete: () => item.remove()
        });
        trackEvent("remove_key_feature");
      });
      gsap.from(item, { opacity: 0, y: 10, duration: 0.3, ease: "power3.out" });
    });
  }

  // Populate what's in the box
  if (whatsInBoxList && productData.whatsInBox) {
    productData.whatsInBox.forEach(itemText => {
      const item = document.createElement("div");
      item.classList.add("dynamic-item");
      item.innerHTML = `
                <input type="text" value="${itemText}" data-ga-event="whats_in_box_input">
                <button type="button" class="remove-item" data-ga-event="remove_whats_in_box"><i class="fas fa-trash"></i></button>
            `;
      whatsInBoxList.appendChild(item);
      item.querySelector(".remove-item").addEventListener("click", () => {
        gsap.to(item, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          ease: "power3.in",
          onComplete: () => item.remove()
        });
        trackEvent("remove_whats_in_box");
      });
      gsap.from(item, { opacity: 0, y: 10, duration: 0.3, ease: "power3.out" });
    });
  }
}


function handleMainImageUpload() {
  const mainImagePreview = document.querySelector("#main-image-preview");
  const mainImageInput = document.querySelector("#mainImage");

  if (!mainImageInput || !mainImagePreview) {
    console.error("Error: #mainImage or #mainImagePreview not found");
    return;
  }
  mainImageInput.addEventListener("change", (e) => {

    const file = e.target.files[0]

    if (!file.type.match("image/(png|jpeg)")) {
      error.textContent = "Only PNG and JPEG images are allowed";
      error.classList.add("active");
      gsap.from(error, { opacity: 0, y: 5, duration: 0.3, ease: "power3.out" });
      mainImageInput.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 2MB limit
      error.textContent = "Image size must be less than 5MB";
      error.classList.add("active");
      gsap.from(error, { opacity: 0, y: 5, duration: 0.3, ease: "power3.out" });
      mainImageInput.value = "";
      return;
    }

    mainImagePreview.innerHTML = "";

    const previewItem = document.createElement("div");
    previewItem.classList.add("preview-item");
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

    previewItem.appendChild(img);
    mainImagePreview.appendChild(previewItem);
    gsap.from(previewItem, { opacity: 0, scale: 0.8, duration: 0.3, ease: "power3.out", delay: index * 0.1 });
  })
}


// Handle image uploads and previews
function handleImageUploads() {
  const imageInput = document.querySelector("#image");
  const imagePreview = document.querySelector("#image-preview");
  if (!imageInput || !imagePreview) {
    console.error("Error: #image or #image-preview not found");
    return;
  }

  let allFiles = []; // Store all selected files

  imageInput.addEventListener("change", () => {
    const newFiles = Array.from(imageInput.files);
    const error = imageInput.nextElementSibling;

    // Validate new files
    for (const file of newFiles) {
      if (!file.type.match("image/(png|jpeg)")) {
        error.textContent = "Only PNG and JPEG images are allowed";
        error.classList.add("active");
        gsap.from(error, { opacity: 0, y: 5, duration: 0.3, ease: "power3.out" });
        imageInput.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        error.textContent = "Image size must be less than 5MB";
        error.classList.add("active");
        gsap.from(error, { opacity: 0, y: 5, duration: 0.3, ease: "power3.out" });
        imageInput.value = "";
        return;
      }
    }

    // Check total file count
    if (allFiles.length + newFiles.length > 6) {
      error.textContent = "Maximum 6 images allowed";
      error.classList.add("active");
      gsap.from(error, { opacity: 0, y: 5, duration: 0.3, ease: "power3.out" });
      imageInput.value = "";
      return;
    }

    // Append new files to allFiles
    allFiles = [...allFiles, ...newFiles];
    error.textContent = "";
    error.classList.remove("active");

    // Update preview
    imagePreview.innerHTML = "";
    allFiles.forEach((file, index) => {
      const previewItem = document.createElement("div");
      previewItem.classList.add("preview-item");
      if (index === 0) previewItem.classList.add("main-image");
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        allFiles = allFiles.filter(f => f !== file);
        previewItem.remove();
        // Update input files
        const dataTransfer = new DataTransfer();
        allFiles.forEach(f => dataTransfer.items.add(f));
        imageInput.files = dataTransfer.files;
        // Refresh preview to maintain main image
        imagePreview.innerHTML = "";
        allFiles.forEach((f, i) => {
          const newPreviewItem = document.createElement("div");
          newPreviewItem.classList.add("preview-item");
          if (i === 0) newPreviewItem.classList.add("main-image");
          const newImg = document.createElement("img");
          newImg.src = URL.createObjectURL(f);
          const newRemoveBtn = document.createElement("button");
          newRemoveBtn.textContent = "Remove";
          newRemoveBtn.addEventListener("click", () => {
            allFiles = allFiles.filter(f2 => f2 !== f);
            newPreviewItem.remove();
            const newDataTransfer = new DataTransfer();
            allFiles.forEach(f2 => newDataTransfer.items.add(f2));
            imageInput.files = newDataTransfer.files;
            trackEvent("remove_image");
          });
          // const newSetMainBtn = document.createElement("button");
          // newSetMainBtn.textContent = "Set as Main";
          // newSetMainBtn.classList.add("set-main");
          // newSetMainBtn.addEventListener("click", () => {
          //   document.querySelectorAll(".preview-item").forEach(item => item.classList.remove("main-image"));
          //   newPreviewItem.classList.add("main-image");
          //   trackEvent("set_main_image");
          // });
          newPreviewItem.appendChild(newImg);
          //newPreviewItem.appendChild(newRemoveBtn);
          //newPreviewItem.appendChild(newSetMainBtn);
          imagePreview.appendChild(newPreviewItem);
        });
        trackEvent("remove_image");
      });
      // const setMainBtn = document.createElement("button");
      // setMainBtn.textContent = "Set as Main";
      // setMainBtn.classList.add("set-main");
      // setMainBtn.addEventListener("click", () => {
      //   document.querySelectorAll(".preview-item").forEach(item => item.classList.remove("main-image"));
      //   previewItem.classList.add("main-image");
      //   trackEvent("set_main_image");
      // });
      previewItem.appendChild(img);
      //previewItem.appendChild(removeBtn);
      //previewItem.appendChild(setMainBtn);
      imagePreview.appendChild(previewItem);
      gsap.from(previewItem, { opacity: 0, scale: 0.8, duration: 0.3, ease: "power3.out", delay: index * 0.1 });
    });

    // Update input files to reflect allFiles
    const dataTransfer = new DataTransfer();
    allFiles.forEach(f => dataTransfer.items.add(f));
    imageInput.files = dataTransfer.files;

    trackEvent("image_input", { file_count: allFiles.length });
  });
}

// Handle dynamic list fields (key features, what's in the box)
function handleDynamicLists() {
  const addFeatureBtn = document.querySelector("#key-features + .add-item");
  const addBoxItemBtn = document.querySelector("#whats-in-box + .add-item");
  if (!addFeatureBtn || !addBoxItemBtn) {
    console.error("Error: Dynamic list add buttons not found");
    return;
  }

  addFeatureBtn.addEventListener("click", () => {
    const list = document.querySelector("#key-features");
    const item = document.createElement("div");
    item.classList.add("dynamic-item");
    item.innerHTML = `
            <input type="text" placeholder="Enter key feature" data-ga-event="key_feature_input">
            <button type="button" class="remove-item" data-ga-event="remove_key_feature"><i class="fas fa-trash"></i></button>
        `;
    list.appendChild(item);
    gsap.from(item, { opacity: 0, y: 10, duration: 0.3, ease: "power3.out" });
    item.querySelector(".remove-item").addEventListener("click", () => {
      gsap.to(item, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => item.remove()
      });
      trackEvent("remove_key_feature");
    });
    trackEvent("add_key_feature");
  });

  addBoxItemBtn.addEventListener("click", () => {
    const list = document.querySelector("#whats-in-box");
    const item = document.createElement("div");
    item.classList.add("dynamic-item");
    item.innerHTML = `
            <input type="text" placeholder="Enter item in box" data-ga-event="whats_in_box_input">
            <button type="button" class="remove-item" data-ga-event="remove_whats_in_box"><i class="fas fa-trash"></i></button>
        `;
    list.appendChild(item);
    gsap.from(item, { opacity: 0, y: 10, duration: 0.3, ease: "power3.out" });
    item.querySelector(".remove-item").addEventListener("click", () => {
      gsap.to(item, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => item.remove()
      });
      trackEvent("remove_whats_in_box");
    });
    trackEvent("add_whats_in_box");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded fired");

  // Load categories and populate form
  loadCategories();
  populateForm();

  handleMainImageUpload();

  // Handle image uploads
  handleImageUploads();

  // Handle dynamic lists
  handleDynamicLists();

  // Validate form
  function validateForm() {
    const productName = document.querySelector("#product-name");
    const description = document.querySelector("#description");
    const price = document.querySelector("#price");
    const category = document.querySelector("#category");
    const stock = document.querySelector("#stock");
    const images = document.querySelector("#image");
    const keyFeatures = document.querySelectorAll("#key-features input");
    const whatsInBox = document.querySelectorAll("#whats-in-box input");
    const productDetails = document.querySelector("#product-details");
    let isValid = true;

    // Reset error states
    document.querySelectorAll(".error-message").forEach(error => {
      error.textContent = "";
      error.classList.remove("active");
    });
    document.querySelectorAll("input, textarea, select").forEach(input => input.classList.remove("invalid"));

    // Validate product name
    if (!productName || productName.value.trim().length < 3) {
      const error = productName?.nextElementSibling;
      if (error) {
        error.textContent = "Product name must be at least 3 characters";
        error.classList.add("active");
        productName.classList.add("invalid");
        gsap.from(error, { opacity: 0, y: 5, duration: 0.3, ease: "power3.out" });
      }
      isValid = false;
    }

    // Validate description
    if (!description || description.value.trim().length < 10) {
      const error = description?.nextElementSibling;
      if (error) {
        error.textContent = "Description must be at least 10 characters";
        error.classList.add("active");
        description.classList.add("invalid");
        gsap.from(error, { opacity: 0, y: 5, duration: 0.3, ease: "power3.out" });
      }
      isValid = false;
    }

    // Validate price
    if (!price || price.value <= 0) {
      const error = price?.nextElementSibling;
      if (error) {
        error.textContent = "Price must be a positive number";
        error.classList.add("active");
        price.classList.add("invalid");
        gsap.from(error, { opacity: 0, y: 5, duration: 0.3, ease: "power3.out" });
      }
      isValid = false;
    }

    // Validate category
    if (!category || !category.value) {
      const error = category?.nextElementSibling;
      if (error) {
        error.textContent = "Please select a category";
        error.classList.add("active");
        category.classList.add("invalid");
        gsap.from(error, { opacity: 0, y: 5, duration: 0.3, ease: "power3.out" });
      }
      isValid = false;
    }

    // Validate stock
    if (!stock || stock.value < 0) {
      const error = stock?.nextElementSibling;
      if (error) {
        error.textContent = "Stock quantity cannot be negative";
        error.classList.add("active");
        stock.classList.add("invalid");
        gsap.from(error, { opacity: 0, y: 5, duration: 0.3, ease: "power3.out" });
      }
      isValid = false;
    }

    // Validate images
    const previewItems = document.querySelectorAll(".preview-item");
    if (previewItems.length === 0) {
      const error = images?.nextElementSibling;
      if (error) {
        error.textContent = "At least one image is required";
        error.classList.add("active");
        images.classList.add("invalid");
        gsap.from(error, { opacity: 0, y: 5, duration: 0.3, ease: "power3.out" });
      }
      isValid = false;
    }

    // Validate key features
    const validFeatures = Array.from(keyFeatures).filter(feature => feature.value.trim().length > 0);
    if (validFeatures.length === 0) {
      const error = document.querySelector("#key-features + .add-item + .error-message");
      if (error) {
        error.textContent = "At least one key feature is required";
        error.classList.add("active");
        gsap.from(error, { opacity: 0, y: 5, duration: 0.3, ease: "power3.out" });
      }
      isValid = false;
    }

    // Validate what's in the box
    const validBoxItems = Array.from(whatsInBox).filter(item => item.value.trim().length > 0);
    if (validBoxItems.length === 0) {
      const error = document.querySelector("#whats-in-box + .add-item + .error-message");
      if (error) {
        error.textContent = "At least one item in the box is required";
        error.classList.add("active");
        gsap.from(error, { opacity: 0, y: 5, duration: 0.3, ease: "power3.out" });
      }
      isValid = false;
    }

    // Validate product details
    if (!productDetails || productDetails.value.trim().length < 10) {
      const error = productDetails?.nextElementSibling;
      if (error) {
        error.textContent = "Product details must be at least 10 characters";
        error.classList.add("active");
        productDetails.classList.add("invalid");
        gsap.from(error, { opacity: 0, y: 5, duration: 0.3, ease: "power3.out" });
      }
      isValid = false;
    }

    return isValid;
  }

  // Update product button handler
  const updateBtn = document.querySelector(".update-btn");
  if (updateBtn) {
    updateBtn.addEventListener("click", async () => {
      if (validateForm()) {
        const productName = document.querySelector("#product-name")?.value;
        const description = document.querySelector("#description")?.value;
        const price = document.querySelector("#price")?.value;
        const category = document.querySelector("#category")?.value;
        const stock = document.querySelector("#stock")?.value;
        const mainImage = document.querySelector("#mainImage")?.files[0] || [];
        const thumbnails = document.querySelector("#image")?.files || [];
        const keyFeatures = Array.from(document.querySelectorAll("#key-features input")).map(input => input.value.trim()).filter(val => val) || [document.querySelector("#key-features input").value];
        const whatsInBox = Array.from(document.querySelectorAll("#whats-in-box input")).map(input => input.value.trim()).filter(val => val) || [document.querySelector("whats-in-box input").value];
        const productDetails = document.querySelector("#product-details")?.value;


        const formData = new FormData();
        formData.append("id", productId);
        formData.append("name", productName);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("category", category);
        formData.append("stock", stock);
        formData.append("mainImage", mainImage);
        for (let i = 0; i < thumbnails.length; i++) {
          formData.append("thumbnails", thumbnails[i]);
        }
        formData.append("keyFeatures", JSON.stringify(keyFeatures));
        formData.append("whatsInBox", JSON.stringify(whatsInBox));
        formData.append("productDetails", productDetails);

        const response = await fetch("/api/edit_product", {
          method: "PUT",
          body: formData,
        });
        const { success, message } = await response.json();
        if (success) {
          showStatusModal("success", message);
        } else {
          showStatusModal("failed", message);
        }

        gsap.to(updateBtn, {
          scale: 0.95,
          duration: 0.1,
          ease: "power2.in",
          onComplete: () => {
            gsap.to(updateBtn, { scale: 1, duration: 0.1 });
            console.log(`Product updated:`, {
              productName,
              description,
              price,
              category,
              stock,
              mainImage: mainImage?.name,
              thumbnails: thumbnails.map(t => t.name),
              keyFeatures,
              whatsInBox,
              productDetails
            });
            alert("Product updated successfully (placeholder)");
            trackEvent("update_product", { product_name: productName, category: category });
            window.location.reload();
          }
        });
      } else {
        gsap.to(updateBtn, {
          x: -10,
          duration: 0.1,
          repeat: 3,
          yoyo: true,
          ease: "power2.inOut"
        });
        trackEvent("update_product_failed");
      }
    });
  } else {
    console.error("Error: .update-btn not found");
  }

  // Cancel button handler
  const cancelBtn = document.querySelector(".cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      gsap.to(cancelBtn, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.in",
        onComplete: () => {
          gsap.to(cancelBtn, { scale: 1, duration: 0.1 });
          console.log("Edit product cancelled");
          trackEvent("cancel_edit_product");
          window.location.href = "/admin/product";
        }
      });
    });
  } else {
    console.error("Error: .cancel-btn not found");
  }

  // Input tracking
  const inputs = document.querySelectorAll(".edit-product-form input:not(.remove-item), .edit-product-form textarea, .edit-product-form select");
  if (inputs.length) {
    inputs.forEach(input => {
      input.addEventListener("input", () => {
        trackEvent(input.dataset.gaEvent, { value: input.value });
      });
    });
  } else {
    console.error("Error: .edit-product-form input/textarea/select elements not found");
  }

  // Animate edit product card
  const editProductCard = document.querySelector(".edit-product-card");
  if (editProductCard) {
    gsap.from(editProductCard, {
      opacity: 0,
      y: 50,
      duration: 0.7,
      ease: "power3.out"
    });
  } else {
    console.error("Error: .edit-product-card not found");
  }

  // Animate form elements
  const formElements = document.querySelectorAll(".edit-product-form .form-group, .form-actions");
  if (formElements.length) {
    gsap.from(formElements, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.2
    });
  } else {
    console.error("Error: Edit product form elements not found");
  }
});
