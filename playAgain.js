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
            localStorage.clear();
            if(receipt){
                localStorage.setItem('receipt', receipt);
            }
            // location.reload();
            window.location.href = "/";
            return false;
        };
        document.getElementById(containerId).appendChild(playAgain);
    }
}
