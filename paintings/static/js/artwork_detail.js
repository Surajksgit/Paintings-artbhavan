function changeImage(el) {
    document.getElementById('mainArtworkImage').src = el.src;
    const thumbnails = document.querySelectorAll('.thumbnail-list img');
    thumbnails.forEach(img => img.classList.remove('active'));
    el.classList.add('active');
}

function updateQty(change) {
    const qtyInput = document.getElementById('quantity');
    let current = parseInt(qtyInput.value);
    current = isNaN(current) ? 1 : current;
    current = Math.max(1, current + change);
    qtyInput.value = current;
}
