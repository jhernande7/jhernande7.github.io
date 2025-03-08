/*   Name: Jonathan Hernandez-Cardenas
    Date: 3.7.2025
    CSC 372-01
    
    This is the javascript file for the rock, paper, scissors game.
    This file contains the callbacks and functions for the game. 
 */


//variables for keeping track of the game's score
let playerScore = 0;
let computerScore = 0;

// event listeners for when player clicks on image
document.getElementById("rock").addEventListener("click", () => playerThrow("rock"));
document.getElementById("paper").addEventListener("click", () => playerThrow("paper"));
document.getElementById("scissors").addEventListener("click", () => playerThrow("scissors"));
document.getElementById("restart").addEventListener("click", resetGame);

//call back function for players choice
function playerThrow(playerChoice) {
    highlightPlayerChoice(playerChoice);
    shuffleComputerThrow();
    setTimeout(() => {
        const computerChoice = getComputerThrow();
        const result = determineWinner(playerChoice, computerChoice);
        displayResults(result);
        displayComputerThrow(computerChoice);
        updateScores(result);
    }, 3000);

}

//highlights the players choice
function highlightPlayerChoice(playerChoice) {
    const playerThrows = document.querySelectorAll("#player-throw .throw-container");
    playerThrows.forEach((throwElement) => {
        throwElement.classList.remove("selected-player");
        if(throwElement.querySelector("p").textContent.toLowerCase() === playerChoice) {
            throwElement.classList.add("selected-player");
        }
        
    });
}
//needs shuffle function so that the pictures can be shuffled before the computer throw is displayed.
function shuffleComputerThrow() {
    const choices = ["rock", "paper", "scissors"];
    const computerImage = document.getElementById("computer-quesstion");
    const suffleInterval = setInterval(() => {
        const randomChoice = choices[Math.floor(Math.random() * choices.length)];
        computerImage.src = `imgs/${randomChoice}.PNG`;
        computerImage.alt = randomChoice;
    }, 500);
    setTimeout(() => {
        clearInterval(suffleInterval);
    }, 3000);
}
//gets computer throw using random function. 
function getComputerThrow() {
    const choices = ["rock", "paper", "scissors"];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}


//determines winner
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return "It's a tie!";
    } else if (
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
    ) {
        return "You win!";
    } else {
        return "Computer wins!";
    }
}

//displays computer throw
function displayComputerThrow(computerChoice) {
    const computerImage = document.getElementById("computer-quesstion");
    computerImage.src = `imgs/${computerChoice}.PNG`;
    computerImage.alt = computerChoice;
    document.querySelector("#computer-throw .throw-selected p").textContent = `Computer Chose ${computerChoice}`;
    highlightComputerChoice();
}

//highlights the computer choice
function highlightComputerChoice() {
    const computerThrow = document.querySelector("#computer-throw .throw-selected");
    computerThrow.classList.add("selected-computer");
}

//displays results of the game
function displayResults(result) {
    document.getElementById("result-text").textContent = result;
}

// for updating scores
function updateScores(result) {
    if (result === "You win!") {
        playerScore++;
    } else if (result === "Computer wins!") {
        computerScore++;
    }
    displayScores();
}

function displayScores() {
    document.getElementById("player-score").textContent = `Player Score: ${playerScore}`;
    document.getElementById("computer-score").textContent = `Computer Score: ${computerScore}`;
}

//resets the game
function resetGame() {
    document.getElementById("result-text").textContent = "";
    document.getElementById("computer-quesstion").src = "imgs/question-mark.PNG";
    document.getElementById("computer-quesstion").alt = "question-mark";
    document.querySelector("#computer-throw .throw-selected p").textContent = "Computer is deciding...";

    const playerThrows = document.querySelectorAll("#player-throw .throw-selected ");
    playerThrows.forEach((throwElement) => {
        throwElement.classList.remove("selected-player");
    });
    document.querySelector("#computer-throw .throw-selected ").classList.remove("selected-computer");

    playerScore = 0;
    computerScore = 0;
    displayScores();
}