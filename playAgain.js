export function checkPlayAgain() {

    return !!localStorage.getItem('receipt');
}

export function addPlayAgainButton(containerId) {
    if (localStorage.getItem('receipt')) {
        // verify payment
        const playAgain = document.createElement("a");
        playAgain.setAttribute("href", "#");
        playAgain.textContent = "Play Again";
        playAgain.onclick = function () {
            location.reload();
            return false;
        };
        document.getElementById(containerId).appendChild(playAgain);
    }
}
