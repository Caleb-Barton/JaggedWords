document.addEventListener("DOMContentLoaded", () => {
  const keys = Array.from(document.querySelectorAll(".keyboard-row button"));
  let gameOver = false;


  // Dictionary of words
  const wordList = ['a', 'yo', 'dog', 'baby', 'guilt', 'freely', 'ability', 'word', 'shoe', 'the', 'happy', 'toggle', 'beast', 'shame', 'sad', 'rope', 'clean', 'be', 'good', 'please', 'and', 'carpet'];

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


  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      if (!gameOver) {
        const letter = target.getAttribute("data-key");

        handleKeyInput(letter);
      }
    };
  }

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
    scrollDown();
  }

  // Handle user input
  function handleKeyInput(key) {
    if (gameOver) {
      return;
    }
    if (key.match(/^[a-zA-Z]$/) && currentGuess.length < 7) {
      currentGuess += key.toLowerCase();
    } else if (key === 'Backspace' && currentGuess.length > 0) {
      currentGuess = currentGuess.slice(0, -1);
    } else if (key === 'Enter') {
      const container = document.querySelector('.container');
      container.scrollTop = container.scrollHeight;
      submitGuess();
    }
    renderBoard();
  }

  function scrollDown() {
    let board = document.querySelector('.board');
    board.scrollTop = board.scrollHeight;
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
      gameOver = isGameWon(result, correctWord);
      if (gameOver) {
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
      let color;
      if (letter === wordLetters[i]) {
        color = "green";
        wordLetters[i] = null;
      } else if (wordLetters.includes(letter)) {
        color = "yellow";
        wordLetters[wordLetters.indexOf(letter)] = null;
      } else {
        color = "gray";
      }
      result.push({ letter, color });
      let key = keys.find(key => key.dataset.key === letter);
      key.classList.add(color);
      tryAddColorToKey(key, color);
    });
    return result;
  }

  function tryAddColorToKey(key, color) {
    if (Array.from(key.classList).includes("green")) {
      return;
    }
    if (Array.from(key.classList).includes("yellow") && color == "green") {
      key.classList.remove("yellow");
      return key.classList.add(color);
    }
    if (Array.from(key.classList).includes("gray")) {
      return;
    }
    key.classList.add(color);
  }

  // Check if the game is won
  function isGameWon(guess, correctWord) {
    return guess.length === correctWord.length && guess.every((letter, i) => letter.letter === correctWord[i]);
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
});