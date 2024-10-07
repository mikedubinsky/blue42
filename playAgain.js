export function checkPlayAgain() {

    return !!localStorage.getItem('receipt');
}

export function addPlayAgainButton(containerId, label = "Play Again", force = false) {
    if (localStorage.getItem('receipt') || force) {
        // verify payment
        const playAgain = document.createElement("a");
        playAgain.setAttribute("href", "#");
        playAgain.textContent = label;
        playAgain.onclick = function () {
            const receipt = localStorage.getItem('receipt') ?? false;
            localStorage.clear();
            if(receipt){
                localStorage.setItem('receipt', receipt);
            }
            location.reload();
            return false;
        };
        document.getElementById(containerId).appendChild(playAgain);
    }
}
