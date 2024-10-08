import {addPlayAgainButton} from './playAgain.js';

const url = "https://il7bkysao3dscz7bylpledumk40tbmof.lambda-url.us-east-1.on.aws/gallery";
const home = "/";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const imageId = urlParams.get('id');

document.addEventListener("DOMContentLoaded", async function (event) {
    if (imageId) {
        await getImage(imageId);
    } else {
        window.location.href = home;
    }
});

async function getImage() {
    await fetch(url + '?imageId=' + imageId, {
        method: 'GET',
        headers: {
            'Host': 'il7bkysao3dscz7bylpledumk40tbmof.lambda-url.us-east-1.on.aws',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Server error: ' + response.statusText);
            }
            return response.json(); // Parse the JSON response if needed
        })
        .then(data => {
            showResponse(data.message, data.imageUrl);
        })
        .catch(error => {
            console.error("Error: ", error);
            window.location.href = home;
        });
}


function removeMainPlaceholder() {
    const placeholder = document.getElementById("results-placeholder");
    placeholder.classList.remove('placeholder');
}

function showResponse(message = "", imageUrl = "") {
    const slogan = document.getElementById('slogan')
    slogan.textContent = "";
    // remove placeholders
    removeMainPlaceholder();

    // set image
    if (imageUrl) {
        const image = document.getElementById("aiImage");
        image.src = imageUrl;
        image.alt = message;
    }
    // set slogan
    slogan.textContent = message.replace(/^"|"$/g, '');

    const key = localStorage.getItem('key') ?? false;
    if (!key) {
        // verify payment
        const playAgain = document.createElement("button");
        playAgain.classList.add("form-button", "play-button");
        playAgain.textContent = "Play Now!";
        playAgain.onclick = function () {
            const receipt = localStorage.getItem('receipt') ?? false;
            localStorage.clear();
            if(receipt){
                localStorage.setItem('receipt', receipt);
            }
            // location.reload();
            window.location.href = "/";
            return false;
        };
        document.getElementById('results').appendChild(playAgain);
    }
}