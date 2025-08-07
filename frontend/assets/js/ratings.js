const ratings = [
    { id: 1, productName: "Swiss Knife Pro", rating: 5, comment: "Amazing quality, very versatile!" },
    { id: 2, productName: "Swiss Knife Pro", rating: 4, comment: "Great tool, but a bit heavy." },
    { id: 3, productName: "Multi-Tool Kit", rating: 3, comment: "Decent, but could be more durable." },
    { id: 4, productName: "Camping Gear Set", rating: 5, comment: "Perfect for outdoor adventures!" }
];

function displayRatings(reviews) {
    const ratingList = document.getElementById('ratingList');
    ratingList.innerHTML = '';

    if (reviews.length === 0) {
        ratingList.innerHTML = '<p class="no-results">No reviews found for this product.</p>';
        return;
    }

    reviews.forEach(rating => {
        const div = document.createElement('div');
        div.className = 'rating-item';
        div.innerHTML = `
            <h3>${rating.productName}</h3>
            <div class="stars">${'★'.repeat(rating.rating)}${'☆'.repeat(5 - rating.rating)}</div>
            <p>${rating.comment}</p>
        `;
        ratingList.appendChild(div);
    });
}

function searchReviews() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredRatings = ratings.filter(rating =>
        rating.productName.toLowerCase().includes(searchInput)
    );
    displayRatings(filteredRatings);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayRatings(ratings);
});