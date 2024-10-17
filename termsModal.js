// Get modal, link to open modal, and close button elements
const termsModal = document.getElementById("termsAndConditions");
const openTermsModalLink = document.getElementById("openTermsModal");
const closeTermsModalBtn = document.querySelector(".close-terms-btn");

// Open modal when link is clicked
openTermsModalLink.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default link behavior
    termsModal.style.display = "block"; // Show modal
});

// Close modal when close button is clicked
closeTermsModalBtn.addEventListener("click", function() {
    termsModal.style.display = "none"; // Hide modal
});

// Close modal when clicking outside of the modal content
window.addEventListener("click", function(event) {
    if (event.target === termsModal) {
        termsModal.style.display = "none"; // Hide modal
    }
});