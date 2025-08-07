let brands = [];

function addBrand() {
    const brandName = document.getElementById('brandName').value;
    const brandLogo = document.getElementById('brandLogo').files[0];
    const brandDescription = document.getElementById('brandDescription').value;

    if (!brandName) {
        alert('Brand name is required');
        return;
    }

    const brand = {
        id: Date.now(),
        name: brandName,
        description: brandDescription,
        logo: brandLogo ? URL.createObjectURL(brandLogo) : ''
    };

    brands.push(brand);
    updateBrandList();
    clearForm();

    // Preview logo
    if (brandLogo) {
        const preview = document.getElementById('logoPreview');
        preview.innerHTML = `<img src="${brand.logo}" alt="Brand Logo">`;
    }
}

function updateBrandList() {
    const brandList = document.getElementById('brandList');
    brandList.innerHTML = '';
    brands.forEach(brand => {
        const div = document.createElement('div');
        div.className = 'brand-item';
        div.innerHTML = `
            ${brand.logo ? `<img src="${brand.logo}" alt="${brand.name}">` : ''}
            <span>${brand.name} - ${brand.description}</span>
            <button onclick="deleteBrand(${brand.id})">Delete</button>
        `;
        brandList.appendChild(div);
    });
}

function deleteBrand(id) {
    brands = brands.filter(brand => brand.id !== id);
    updateBrandList();
}

function clearForm() {
    document.getElementById('brandName').value = '';
    document.getElementById('brandLogo').value = '';
    document.getElementById('brandDescription').value = '';
    document.getElementById('logoPreview').innerHTML = '';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateBrandList();
});