let currentStep = 1;

function showStep(step) {
    const formSlider = document.querySelector('.form-slider');
    const steps = document.querySelectorAll('.form-step');

    steps.forEach((stepDiv, index) => {
        stepDiv.classList.remove('active');
    });

    steps[step - 1].classList.add('active');

    const sliderWidth = 100;
    formSlider.style.transform = `translateX(${-(step - 1) * sliderWidth}%)`;
}

function nextStep(currentStepIndex) {
    if (currentStepIndex < 3) {
        currentStep = currentStepIndex + 1;
        showStep(currentStep);
    }
}

function prevStep(currentStepIndex) {
    if (currentStepIndex > 1) {
        currentStep = currentStepIndex - 1;
        showStep(currentStep);
    }
}

function submitForm(event) {
    event.preventDefault();  // Prevent form submission

    const formContainer = document.getElementById('form-container');

    // Replace form content with confirmation message
    formContainer.innerHTML = `
        <div class="confirmation">
            <h2>Thank you!</h2>
            <p>Your submission has been received.</p>
        </div>
    `;
}

// Initialize the first step
showStep(currentStep);