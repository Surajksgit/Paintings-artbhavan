function openImageModal(imageUrl) {
    const popupImage = document.getElementById('popupImage');
    popupImage.src = imageUrl;
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    imageModal.show();
  }