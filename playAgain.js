export function checkPlayAgain() {

    return !!localStorage.getItem('receipt');
}

export function addPlayAgainButton(containerId, label = "Play Again", force = false) {
    if (localStorage.getItem('receipt') || force) {
        // verify payment
        const playAgain = document.createElement("button");
        playAgain.classList.add("form-button", "play-button");
        playAgain.textContent = label;
        playAgain.onclick = function () {
            const receipt = localStorage.getItem('receipt') ?? false;
            const imageId = localStorage.getItem('lastImageId') ?? false;
            localStorage.clear();
            if(receipt){
                localStorage.setItem('receipt', receipt);
            }
            if(imageId){
                localStorage.setItem('lastImageId', imageId);
            }
            // location.reload();
            window.location.href = "/";
            return false;
        };
        document.getElementById(containerId).appendChild(playAgain);
    }
}

export function addViewGalleryButton(containerId, label = "Play Again", force = false){
    const viewGallery = document.createElement("button");
    viewGallery.classList.add("form-button", "play-button");
    viewGallery.textContent = label;
    viewGallery.onclick = function () {
        window.location.href = "gallery.html";
    };
    document.getElementById(containerId).appendChild(viewGallery);
}

// Only show the gallery link to contributors
export function addGalleryLinkToFooter() {
    if(localStorage.getItem('receipt')){
        const galleryLink = document.createElement("a");
        galleryLink.href = "gallery.html";
        galleryLink.textContent = "Gallery";

        const footerSpan = document.querySelector("footer#ai-footer span.footer-row");
        footerSpan.append(galleryLink);
    }
}
