// Dictionary of words
const wordList = ['a', 'yo', 'dog', 'baby', 'guilt', 'freely', 'ability'];

// Game state variables
let correctWord;
let currentGuess = '';
let previousGuesses = [];
let totalCharactersUsed = 0;

// DOM elements
const boardElement = document.querySelector('.board');
// const keyboardElement = document.querySelector('.keyboard');
// const enterButton = document.querySelector('.enter-btn');
// const backspaceButton = document.querySelector('.backspace-btn');

// Game setup
function initializeGame() {
  correctWord = wordList[Math.floor(Math.random() * wordList.length)];
  console.log(correctWord);
  renderBoard();
  setEventListeners();
}

// Render the game board
function renderBoard() {
  boardElement.innerHTML = '';
  previousGuesses.forEach((guess, index) => {
    const wordRowElement = document.createElement('div');
    wordRowElement.classList.add('word-row');
    guess.forEach((letter, i) => {
      console.log(letter, i);
      const tileElement = document.createElement('div');
      tileElement.classList.add('tile', letter.color);
      tileElement.textContent = letter.letter;
      wordRowElement.appendChild(tileElement);
    });
    boardElement.appendChild(wordRowElement);
  });

  const currentWordRowElement = document.createElement('div');
  currentWordRowElement.classList.add('word-row');
  for (let i = 0; i < currentGuess.length; i++) {
    const tileElement = document.createElement('div');
    tileElement.classList.add('tile', 'white-border');
    tileElement.textContent = currentGuess[i];
    currentWordRowElement.appendChild(tileElement);
  }
  if (currentGuess.length < 7) {
    const blinkingTileElement = document.createElement('div');
    blinkingTileElement.classList.add('tile', 'blinking', 'white-border');
    currentWordRowElement.appendChild(blinkingTileElement);
  }
  boardElement.appendChild(currentWordRowElement);
}

// Handle user input
function handleKeyInput(key) {
  if (key.match(/^[a-zA-Z]$/) && currentGuess.length < 7) {
    currentGuess += key.toLowerCase();
  } else if (key === 'Backspace' && currentGuess.length > 0) {
    currentGuess = currentGuess.slice(0, -1);
  } else if (key === 'Enter') {
    submitGuess();
  }
  renderBoard();
}

// Validate the word
function validateWord(word) {
  return true;
  // return wordList.includes(word);
}

function submitGuess() {
  if (validateWord(currentGuess)) {
    const result = evaluateGuess(currentGuess, correctWord);
    previousGuesses.push(result);
    totalCharactersUsed += currentGuess.length;
    currentGuess = '';
    if (isGameWon(result, correctWord)) {
      const starRating = calculateStarRating();
      displayGameOverModal(starRating);
    }
  } else {
    // Word is not valid, display a message
    alert(`${currentGuess} is not a valid word.`);
    currentGuess = '';
  }
  renderBoard();
}

// Evaluate the guess
function evaluateGuess(guess, correctWord) {
  const result = [];
  const wordLetters = correctWord.split('');
  guess.split('').forEach((letter, i) => {
    if (letter === wordLetters[i]) {
      result.push({ letter, color: 'green' });
      wordLetters[i] = null;
    } else if (wordLetters.includes(letter)) {
      result.push({ letter, color: 'yellow' });
      wordLetters[wordLetters.indexOf(letter)] = null;
    } else {
      result.push({ letter, color: 'gray' });
    }
  });
  return result;
}

// Check if the game is won
function isGameWon(guess, correctWord) {
  return guess.every((letter, i) => letter.color === 'green' && letter.letter === correctWord[i]);
}

// Calculate the star rating
function calculateStarRating() {
  const wordLength = correctWord.length;
  if (totalCharactersUsed * 2 + 5 <= wordLength) {
    return 5;
  } else if (totalCharactersUsed * 3 + 5 <= wordLength) {
    return 4;
  } else if (totalCharactersUsed * 4 + 5 <= wordLength) {
    return 3;
  } else if (totalCharactersUsed * 5 + 5 <= wordLength) {
    return 2;
  } else if (totalCharactersUsed * 6 + 5 <= wordLength) {
    return 1;
  } else {
    return 0;
  }
}

// Display the game over modal
function displayGameOverModal(starRating) {
  alert(`Congratulations! You found the word "${correctWord}" with a ${starRating} star rating.`);
}

// Set event listeners
function setEventListeners() {
  document.addEventListener('keydown', (event) => {
    handleKeyInput(event.key);
  });

  // enterButton.addEventListener('click', submitGuess);
  // backspaceButton.addEventListener('click', () => {
  //   currentGuess = currentGuess.slice(0, -1);
  //   renderBoard();
  // });
}

// Initialize the game
initializeGame();