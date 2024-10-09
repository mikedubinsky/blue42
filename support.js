import {addPlayAgainButton} from './playAgain.js';

const url = "https://il7bkysao3dscz7bylpledumk40tbmof.lambda-url.us-east-1.on.aws/support";
const form = document.getElementById('infoForm');
const amountInput = document.getElementById('amount');
const amountError = document.getElementById('amountError');
const noteInput = document.getElementById('note');
const noteError = document.getElementById('noteError');
const stripe = Stripe('pk_live_51KiTxhG01bbaC0pFwZFznQhwgevhLcws58TcSYAIXJaSOem1MllR1IUd8R5owdrEdyw5U7HmBgYFHwe2mqolJiIC00ufqhmzO3');
let elements;
let paymentElement;

form.addEventListener('submit', function (event) {
    event.preventDefault();

    let hasError = false;

    // Reset error messages
    // noteError.classList.remove('visible');
    amountError.classList.remove('visible');

    // // Validate note (must not be empty)
    // if (noteInput.value.trim() === '') {
    //     noteError.classList.add('visible');
    //     hasError = true;
    // }

    // Validate amount (must be a valid number with up to 2 decimal places)
    const validAmount = /^\d+(\.\d{1,2})?$/.test(amountInput.value);
    const amountValue = parseFloat(amountInput.value).toFixed(2)
    if (!validAmount || amountValue < .99) {
        amountError.classList.add('visible');
        hasError = true;
        if (paymentElement) {
            paymentElement.unmount();
            document.querySelector("#payment-form #submit").classList.add("hidden");
        }
    }

    if (!hasError) {
        // Hide the input field and "Next" button, show the total and "Edit" button

        document.getElementById('total-amount').textContent = `$${amountValue}`;
        document.querySelector('#infoForm .input-container').style.display = 'none';
        document.querySelector('#infoForm .total-container').style.display = 'flex';
        // get credit card form
        setLoading(true);
        initialize(amountValue).then(r => setLoading(false));
    }
});

document.getElementById('edit-amount-button').addEventListener('click', function () {
    // Show the input field again and hide the total display
    document.querySelector('#infoForm .input-container').style.display = 'flex';
    document.querySelector('#infoForm .total-container').style.display = 'none';

    // Focus on the input field for editing
    document.getElementById('amount').focus();
});


document
    .querySelector("#payment-form")
    .addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize(amount) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Host': 'il7bkysao3dscz7bylpledumk40tbmof.lambda-url.us-east-1.on.aws',
                'Accept': '*/*',
                'Connection': 'keep-alive'
            },
            body: JSON.stringify({'amount': amount * 100}),
        });

        const {paymentIntent} = await response.json();

        const appearance = {
            theme: 'stripe',
        };
        elements = stripe.elements({appearance, clientSecret: paymentIntent});
        paymentElement = elements.create("payment", {
            layout: "tabs",
        });
        paymentElement.mount("#payment-element");
        const paymentFormContainer = document.querySelector("#payment-form");
        paymentFormContainer.classList.remove("hidden");
        document.querySelector("#payment-form #submit").classList.remove("hidden");

    } catch (error) {
        console.error(error);
        showMessage("An unexpected error occurred.", false);
    }
}

async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const {error, paymentIntent} = await stripe.confirmPayment({
        elements,
        confirmParams: {
            // Make sure to change this to your payment completion page
            return_url: "https://aivotehelper.dubslack.com",

        },
        redirect: "if_required"
    });

    if (error) {
        showMessage(error.message, false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
        const paid = (paymentIntent.amount / 100).toLocaleString('en-US', {style: 'currency', currency: 'USD'});
        localStorage.setItem('receipt', paymentIntent.id);
        showMessage(`<h3>Thank you for your support.</h3><p>Amount: ${paid}<br>Reference: ${paymentIntent.id}</p>`, true);
        addPlayAgainButton('stripe-container');
    } else {
        showMessage("An unexpected error occurred.", false);
    }
    setLoading(false);
}

// ------- UI helpers -------

function showMessage(messageText, success) {
    const paymentFormContainer = document.querySelector("#payment-form");
    paymentFormContainer.classList.add("hidden");

    const messageContainer = document.querySelector("#payment-message");
    messageContainer.classList.remove("error");
    messageContainer.classList.remove("hidden");
    messageContainer.innerHTML = messageText;

    if (!success) {
        messageContainer.classList.add("error");

        setTimeout(function () {
            messageContainer.classList.add("hidden");
            messageContainer.textContent = "";
        }, 8000);
    } else {
        const infoForm = document.querySelector("#infoForm");
        infoForm.classList.add("hidden");
        const title = document.querySelector("#stripe-container.inner-container .title");
        title.classList.add("hidden");
    }

}

// Show a spinner on payment submission
function setLoading(isLoading) {
    if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("#payment-form #submit").disabled = true;
        // document.querySelector("#button-text").classList.add("hidden");
        document.querySelector("#spinner").classList.remove("hidden");

    } else {
        document.querySelector("#submit").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        // document.querySelector("#button-text").classList.remove("hidden");
    }
}