import { useState, useEffect } from 'react';
import Cards from './components/Cards';

function App() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [cards, setCards] = useState(null);

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
    setTimeLeft(selectedTime); // Use selected time
    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);
  };

  // Stop game handler (resets without "Lose" message)
  const handleStopGame = () => {
    setGameStarted(false);
    setTimeLeft(selectedTime); // Reset to selected time
    setCards(Math.random()); // Reshuffle cards
  };

  // Restart game handler
  const handleRestartGame = () => {
    setGameStarted(false);       // Ensure game doesn't auto-start
    setGameOver(false);          // Hide "You Lose!" message
    setGameWon(false);           // Reset win state
    setTimeLeft(selectedTime);   // Reset timer to selected value
    setCards(Math.random());     // Reshuffle cards
  };

  // Win condition check
  const checkWinCondition = (items) => {
    const allCorrect = items.every(item => item.stat === "correct");
    if (allCorrect) {
      setGameWon(true);
      setGameOver(true);
    }
  };

  return (
    <div className="App">
      {/* Main game UI (hidden when game over) */}
      {!gameOver ? (
        <div className="game-wrapper">
          <h1>Memory Game</h1>
          <h3>Try to match all the pairs of cards!</h3>
       
          {/* Timer selection (only shown before game starts) */}
          {!gameStarted && (
            <div className="timer-selector">
              <label>Select Timer: </label>
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
          {gameStarted && (
            <div className='time-left'>
              <h3>Time left: {timeLeft} seconds</h3>
            </div>
          )}

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
        </div>
      ) : (
        /* Win/Lose screen (shown only when game ends naturally) */
        <div className="game-over-message">
          <h2>{gameWon ? 'Congratulations You Win!' : 'Game Over!'}</h2>
          <button className="btn" onClick={handleRestartGame}>
            {gameWon ? 'Restart Game' : 'Try Again'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;