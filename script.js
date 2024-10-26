const board = document.querySelectorAll('.celda');
const restartButton = document.getElementById('reiniciar_juego');
const bestScoresList = document.getElementById('mejores_puntos');
let currentPlayer = 'X';
let gameOver = false;
let startTime = null;

loadBestScores();

board.forEach(cell => {
  cell.addEventListener('click', handlePlayerMove);
});

restartButton.addEventListener('click', resetGame);

function handlePlayerMove(event) {
  if (gameOver) return;

  const cell = event.target;
  if (cell.textContent === '') {
    cell.textContent = currentPlayer;

    if (!startTime) startTime = new Date();

    if (checkWin()) {
      endGame(`${currentPlayer} | Ganador `);
      recordScore();
    } else if (isDraw()) {
      endGame('Empate');
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      if (currentPlayer === 'O') setTimeout(computerMove, 500);
    }
  }
}

function computerMove() {
  const emptyCells = Array.from(board).filter(cell => cell.textContent === '');
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  if (randomCell) {
    randomCell.textContent = 'O';
    if (checkWin()) {
      endGame('O gana');
    } else if (isDraw()) {
      endGame('Empate');
    } else {
      currentPlayer = 'X';
    }
  }
}

function checkWin() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return board[a].textContent === currentPlayer &&
           board[a].textContent === board[b].textContent &&
           board[a].textContent === board[c].textContent;
  });
}

function isDraw() {
  return Array.from(board).every(cell => cell.textContent !== '');
}

function endGame(message) {
  gameOver = true;
  setTimeout(() => alert(message), 100);
}

function resetGame() {
  board.forEach(cell => {
    cell.textContent = '';
  });
  currentPlayer = 'X';
  gameOver = false;
  startTime = null;
}

function recordScore() {
  if (currentPlayer === 'X') {
    const endTime = new Date();
    const scoreTime = Math.floor((endTime - startTime) / 1000);
    const playerName = prompt("Felicidades\nIngresa tu nombre:");
    const scoreEntry = { name: playerName, time: scoreTime, date: new Date().toLocaleString() };
    saveScore(scoreEntry);
    loadBestScores();
  }
}

function saveScore(score) {
  const scores = JSON.parse(localStorage.getItem('mejores_puntos')) || [];
  scores.push(score);
  scores.sort((a, b) => a.time - b.time);
  if (scores.length > 10) scores.pop();
  localStorage.setItem('mejores_puntos', JSON.stringify(scores));
}

function loadBestScores() {
  const tbody = document.querySelector('#mejores_puntos tbody');
  tbody.innerHTML = '';

  const scores = JSON.parse(localStorage.getItem('mejores_puntos')) || [];
  scores.forEach(score => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${score.name}</td>
      <td>${score.time} seg</td>
      <td>${score.date}</td>
    `;
    tbody.appendChild(tr);
  });
}
