import {addGalleryLinkToFooter} from './playAgain.js';

const baseUrl = "https://il7bkysao3dscz7bylpledumk40tbmof.lambda-url.us-east-1.on.aws/gallery";
const galleryUrl = "https://aivote.s3.us-east-1.amazonaws.com/";
const home = "/";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let imageId = urlParams.get('id');
const key = localStorage.getItem('key') ?? false;
const receipt = localStorage.getItem('receipt') ?? false;
let imageList = localStorage.getItem('images') ? JSON.parse(localStorage.getItem('images')) : [];
let cachedImages = {};
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", async function (event) {
    if (!imageId) {
        if (localStorage.getItem('lastImageId')) {
            imageId = localStorage.getItem('lastImageId');
        } else {
            // fallback
            imageId = "03fbfbd26e562b20";
        }
    }
    addGalleryLinkToFooter();

    await getImage(imageId);
});

async function getImage() {
    let url = baseUrl + '?imageId=' + imageId;
    if (receipt && (!imageList.length || Object.keys(cachedImages).length === 0)) {
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
            if (Object.keys(cachedImages).length > 0 && cachedImages[imageId]) {
                setCurrentIndex(imageId);
                createGallerySlider(imageList);
            } else if (data.imageList) {
                imageList = data.imageList;
                localStorage.setItem("images", JSON.stringify(data.imageList));
                setCurrentIndex(imageId);
                createGallerySlider(imageList);
            }
            cachedImages[imageId] = {'imageUrl': data.imageUrl, 'slogan': data.message};
            showResponse(data.message, data.imageUrl);
        })
        .catch(error => {
            console.error("Error: ", error);
            window.location.href = home;
        });
}

async function updateImage(index) {
    const slogan = document.getElementById('slogan')
    const imageElement = document.getElementById('aiImage');
    imageElement.classList.add('fade-out');

    //check cache
    if (cachedImages[imageList[index]]) {
        slogan.textContent = cachedImages[imageList[index]]['slogan'];
        imageElement.src = cachedImages[imageList[index]]['imageUrl'];
    } else {
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
                imageElement.src = data.imageUrl;
                if (data.message) {
                    slogan.textContent = data.message.replace(/^"|"$/g, '');
                    imageElement.alt = data.message;
                } else {
                    imageElement.alt = "AI Image";
                    slogan.textContent = "";
                    data.message = "";
                }
                cachedImages[imageList[index]] = {'imageUrl': data.imageUrl, 'slogan': data.message};
                imageElement.classList.remove('fade-out');
            })
            .catch(error => {
                console.error("Error: ", error);
                window.location.href = home;
            });
    }
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

    if (!key || receipt) {
        // verify payment
        const playAgain = document.createElement("button");
        playAgain.classList.add("form-button", "play-button");
        playAgain.textContent = receipt ? "Play Again!" : "Play Now!";
        playAgain.onclick = function () {
            const imageId = localStorage.getItem('lastImageId') ?? false;
            localStorage.clear();
            if (receipt) {
                localStorage.setItem('receipt', receipt);
            }
            if(imageId){
                localStorage.setItem('lastImageId', imageId);
            }
            // location.reload();
            window.location.href = "/";
            return false;
        };
        document.getElementById('results').appendChild(playAgain);
    }

    // // arrows on main image = OFF
    // if (receipt) {
    //     addSliderArrows();
    // }
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

function updateActiveThumbnail(thumbnail) {
    document.querySelectorAll('.thumbnail').forEach(img => img.classList.remove('active'));
    thumbnail.classList.add('active');
}

function createGallerySlider(imageList) {
    const thumbnailSliderContainer = document.getElementById("thumbnail-slider-container");
    const leftButton = document.createElement("button");
    leftButton.classList.add("gallery-arrow", "gallery-arrow-left");
    leftButton.innerHTML = "&#10094;";
    leftButton.onclick = function () {
        slideLeft()
    };
    const rightButton = document.createElement("button");
    rightButton.classList.add("gallery-arrow", "gallery-arrow-right");
    rightButton.innerHTML = "&#10095;";
    rightButton.onclick = function () {
        slideRight()
    };

    const thumbnailSlider = document.createElement("div");
    thumbnailSlider.classList.add("thumbnail-slider");

    for (let i = 0; i < imageList.length; i++) {
        const imageElement = document.createElement("img");
        // imageElement.src = galleryUrl + imageList[i] + ".png";
        imageElement.dataset.src = galleryUrl + imageList[i] + ".png";
        imageElement.index = i;
        imageElement.classList.add('lazy');
        imageElement.onclick = async function () {
            await updateImage(this.index);
            updateActiveThumbnail(this);
        };
        if (currentIndex === i) {
            imageElement.classList.add("thumbnail", "active");
        } else {
            imageElement.classList.add("thumbnail");
        }
        thumbnailSlider.append(imageElement);
        imageObserver.observe(imageElement);
    }

    thumbnailSliderContainer.append(leftButton);
    thumbnailSliderContainer.append(thumbnailSlider);
    thumbnailSliderContainer.append(rightButton);

    // Listen for scroll events to update arrow visibility
    thumbnailSlider.addEventListener('scroll', updateArrowVisibility);
    // Check if arrows should be shown or hidden
    function updateArrowVisibility() {
        // At the start
        if (thumbnailSlider.scrollLeft === 0) {
            leftButton.classList.add('hidden');
        } else {
            leftButton.classList.remove('hidden');
        }

        // At the end
        if (thumbnailSlider.scrollLeft + thumbnailSlider.clientWidth >= thumbnailSlider.scrollWidth) {
            rightButton.classList.add('hidden');
        } else {
            rightButton.classList.remove('hidden');
        }
    }
    updateArrowVisibility(); // initial
}

const lazyLoad = (image) => {
    image.src = image.dataset.src;  // Assign the actual src when in view
    image.onload = () => {
        image.style.opacity = 1;  // Optional: fade in effect
    };
};

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            lazyLoad(entry.target);
            observer.unobserve(entry.target);  // Stop observing once loaded
        }
    });
});

// Function to slide the thumbnails left
function slideLeft() {
    const thumbnailSlider = document.querySelector("#thumbnail-slider-container .thumbnail-slider");
    if (thumbnailSlider) {
        thumbnailSlider.scrollBy({left: -200, behavior: 'smooth'});
    }
}

// Function to slide the thumbnails right
function slideRight() {
    const thumbnailSlider = document.querySelector("#thumbnail-slider-container .thumbnail-slider");
    if (thumbnailSlider) {
        thumbnailSlider.scrollBy({left: 200, behavior: 'smooth'});
    }
}
