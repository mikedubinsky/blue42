import {addPlayAgainButton} from './playAgain.js';

const baseUrl = "https://il7bkysao3dscz7bylpledumk40tbmof.lambda-url.us-east-1.on.aws/gallery";
const home = "/";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let imageId = urlParams.get('id');
const key = localStorage.getItem('key') ?? false;
const receipt = localStorage.getItem('receipt') ?? false;
let imageList = localStorage.getItem('images') ? JSON.parse(localStorage.getItem('images')) : [];
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", async function (event) {
    if (imageId || receipt) {
        if (!imageId) {
            imageId = "df862158939a5266";
        }
        await getImage(imageId);
    } else {
        window.location.href = home;
    }
});

async function getImage() {
    let url = baseUrl + '?imageId=' + imageId;
    if (receipt && !imageList.length) {
        url += "&receipt=" + receipt;
    }
    await fetch(url, {
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
            if (data.imageList) {
                imageList = data.imageList;
                localStorage.setItem("images", JSON.stringify(data.imageList));
                setCurrentIndex(imageId);
            }
            showResponse(data.message, data.imageUrl);
        })
        .catch(error => {
            console.error("Error: ", error);
            window.location.href = home;
        });
}

async function updateImage(index) {
    // Apply fade-out effect
    const imageElement = document.getElementById('aiImage');
    imageElement.classList.add('fade-out');

    let url = baseUrl + '?imageId=' + imageList[index];

    await fetch(url, {
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
            const slogan = document.getElementById('slogan')
            imageElement.src = data.imageUrl;
            if (data.message) {
                slogan.textContent = data.message.replace(/^"|"$/g, '');
                imageElement.alt = data.message;
            } else {
                imageElement.alt = "AI Image";
                slogan.textContent = "";
            }
            imageElement.classList.remove('fade-out');
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
    if (message) {
        slogan.textContent = message.replace(/^"|"$/g, '');
    }

    if (!key) {
        // verify payment
        const playAgain = document.createElement("button");
        playAgain.classList.add("form-button", "play-button");
        playAgain.textContent = "Play Now!";
        playAgain.onclick = function () {

            localStorage.clear();
            if (receipt) {
                localStorage.setItem('receipt', receipt);
            }
            // location.reload();
            window.location.href = "/";
            return false;
        };
        document.getElementById('results').appendChild(playAgain);
    }
    if (receipt) {
        addSliderArrows();
    }
}

function addSliderArrows() {
    // <div className="arrow left-arrow" id="prev-arrow">&#10094;</div>
    // <div className="arrow right-arrow" id="next-arrow">&#10095;</div>
    const leftArrow = document.createElement("div");
    leftArrow.classList.add("arrow", "left-arrow");
    leftArrow.id = "prev-arrow";
    leftArrow.innerHTML = "&#10094;";
    const rightArrow = document.createElement("div");
    rightArrow.classList.add("arrow", "right-arrow");
    rightArrow.id = "next-arrow";
    rightArrow.innerHTML = "&#10095;";

    const referenceElement = document.getElementById("aiImage");
    const parentElement = referenceElement.parentNode;

    parentElement.insertBefore(leftArrow, referenceElement);
    parentElement.insertBefore(rightArrow, referenceElement.nextSibling);
    // Add event listeners to arrows
    document.getElementById('prev-arrow').addEventListener('click', async function () {
        currentIndex = (currentIndex === 0) ? imageList.length - 1 : currentIndex - 1;
        await updateImage(currentIndex)
    });

    document.getElementById('next-arrow').addEventListener('click', async function () {
        currentIndex = (currentIndex === imageList.length - 1) ? 0 : currentIndex + 1;
        await updateImage(currentIndex)
    });
}

function setCurrentIndex(imageId) {
    for (let i = 0; i < imageList.length; i++) {
        if (imageList[i] === imageId) {
            currentIndex = i;
        }
    }
}
