import { useState, useEffect } from 'react';
import Cards from './components/Cards';

function App() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [cards, setCards] = useState(null);
  
const [score, setScore] = useState(0);
const [highScore, setHighScore] = useState(0);
const [startTime, setStartTime] = useState(null);


  // Timer state
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedTime, setSelectedTime] = useState(60);
  const timerOptions = [30, 60, 90]; // Available timer options

  // Timer logic
  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0 && !gameWon) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameWon) {
      setGameOver(true); // Auto-lose if time runs out
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, gameWon]);

  
  // Start game handler
 const handleStartGame = () => {
  setTimeLeft(selectedTime);
  setGameStarted(true);
  setGameOver(false);
  setGameWon(false);
  setScore(0);
  setStartTime(Date.now());
};

  // Stop game handler (resets without "Lose" message)
  const handleStopGame = () => {
    setGameStarted(false);
    setTimeLeft(selectedTime); // Reset to selected time
    setCards(Math.random()); // Reshuffle cards
  };

  // Restart game (for Win/Lose screens)
  // const handleRestartGame = () => {
  //   handleStartGame();
  // };

  const handleRestartGame = () => {
  setGameStarted(false);       // Ensure game doesn't auto-start
  setGameOver(false);          // Hide "You Lose!" message
  setGameWon(false);           // Reset win state
  setTimeLeft(selectedTime);   // Reset timer to selected value
  setCards(Math.random());     // Reshuffle cards
};

  // Win condition check
  // Modify the checkWinCondition function to calculate final score:
const checkWinCondition = (items) => {
  const allCorrect = items.every(item => item.stat === "correct");
  if (allCorrect) {
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000; // in seconds
    const newScore = Math.floor((selectedTime - timeTaken) * 10); // Higher score for faster completion
    
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
    setGameWon(true);
    setGameOver(true);
  }
};

  return (
    <div className="App">
      {/* Main game UI (hidden when game over) */}
      {!gameOver && (
        <>
          <h1>Memory Game</h1>
          <h3>Try to match all the pairs of cards!</h3>
       <div className="score-display">
  <h3>High Score: <span className="high-score">{highScore}</span></h3>
  {gameStarted && <h3>Current Score: {score}</h3>}
</div>
          {/* Timer selection (only shown before game starts) */}
          {!gameStarted && (
            <div className="timer-selector">
              <label>Select Timer: </label> {/* Label now on its own line */}
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(Number(e.target.value))}
              >
                {timerOptions.map((time) => (
                  <option key={time} value={time}>
                    {time} seconds
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Active game info */}
          {gameStarted &&(<div className='time-left'> <h3>Time left: {timeLeft} seconds</h3></div>)}

          {/* Game controls */}
          <div className="button-group">
  {/* Show Start Game only when game is NOT running */}
  {!gameStarted && (
    <button className="btn" onClick={handleStartGame}>
      Start Game
    </button>
  )}
  
  {/* Show Stop Game only when game is running */}
  {gameStarted && (
    <button className="btn btn-stop" onClick={handleStopGame}>
      Stop Game
    </button>
  )}
</div>

          {/* Cards component */}
          <Cards 
            key={cards} 
            onGameStateChange={checkWinCondition} 
            gameStarted={gameStarted} 
          />
        </>
      )}

      {/* Win/Lose screen (shown only when game ends naturally) */}
      {gameOver && (
  <div className="game-over-message">
    <h2>{gameWon ? `Congratulations You Win! Score: ${score}` : 'Game Over!'}</h2>
    {gameWon && highScore === score && <h3 className="new-high-score">New High Score!</h3>}
    <button className="btn" onClick={handleRestartGame}>
      {gameWon ? 'Restart Game' : 'Try Again'}
    </button>
  </div>
)}
    </div>
  );
}

export default App;