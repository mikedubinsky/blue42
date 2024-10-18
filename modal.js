document.addEventListener("DOMContentLoaded", function () {

// Get modal, link to open modal, and close button elements
    const modal = document.getElementById("disclaimer");
    const openModalLink = document.getElementById("openModal");
    const closeModalBtn = document.querySelector(".close-btn");

// Open modal when link is clicked
    openModalLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior
        modal.style.display = "block"; // Show modal
    });

// Close modal when close button is clicked
    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none"; // Hide modal
    });

// Close modal when clicking outside of the modal content
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none"; // Hide modal
        }
    });
});