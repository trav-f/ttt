import './App.css';
import './index.css';
import { useCallback, useState } from 'react';
import ReactModal from 'react-modal';
import { createContext } from "react";
import Toggle from 'react-toggle';

export const themes = {
  dark: "dark",
  light: "light",
};

export const ThemeContext = createContext({
    theme: themes.dark,
    changeTheme: () => {},
});

function App() {
  const [p1_score, setP1Score] = useState(0);
  const [p2_score, setP2Score] = useState(0);
  const [isP1Turn, setP1Turn] = useState(true);
  const [board, setBoard] = useState([0,0,0,0,0,0,0,0,0]);
  const [showWinner, setShowWinner] = useState(0);

  const [theme, setTheme] = useState(themes.light);

  const possibles = [[0,1,2], [3,4,5], [6,7,8],
                     [0,3,6], [1,4,7], [2,5,8],
                     [0,4,8], [2,4,6]];

  const reset = () => {
    setP1Score(0);
    setP2Score(0);
    setBoard([0,0,0,0,0,0,0,0,0]);
  }

  const toggleTurn = useCallback(() => {
    setP1Turn(!isP1Turn);
  }, [isP1Turn]);

  const clickedCell = (cellNum) => {
    if (board[cellNum] !== 0) return;
    toggleTurn();
    board[cellNum] = isP1Turn ? 1 : 2; //Not using the board state var as a state var
                                       //Is a state variable the way to go on this?
                                       //Wouldn't the state var be storing the pointer to the beginning
                                       //of the array? And if so, What is a better way to store the 
                                       //State?
    checkFinish();
  }

  const getCellValue = (cellNum) => {
    if (board[cellNum] !== 0) return board[cellNum] === 1 ? 'ttt__tile ttt__tri' : 'ttt__tile ttt__cir';
    return isP1Turn ? 'ttt__tile ttt__tile-tri' : 'ttt__tile ttt__tile-cir';
  }

  const checkFinish = () => {
    if (possibles.every(element => {
      if (board[element[0]] !== 0 && board[element[0]] === board[element[1]] && board[element[1]] === board[element[2]]) {
        setShowWinner(board[element[0]]);
        board[element[0]] === 1 ? setP1Score(p1_score+1) : setP2Score(p2_score+1);
        return false;
      }
      return true;
    }) && board.every(element => element)) setShowWinner(3);
  };

  const closeModal = () => {
    setBoard([0,0,0,0,0,0,0,0,0]);
    setShowWinner(0);
  }

  const toggleTheme = () => {
    setTheme(theme === themes.dark ? themes.light : themes.dark);
  };

  return (
    <div>
      <div className="App" data-theme={theme}>
        <div className="App-header">
          <h1 className='ttt__title'>Tic-Tac-Toe</h1>
          <div className='ttt__players-score'>
            <span className='ttt__score-box'>
              <h3 className='ttt__p'>P1</h3>
              <h3 className='ttt__score'>{p1_score}</h3>
            </span>
            <span className='ttt__score-box'>
              <h3 className='ttt__p'>P2</h3>
              <h3 className='ttt__score'>{p2_score}</h3>
            </span>
          </div>
          <span className='ttt__reset-button' onClick={reset}>RESET</span>
        </div>

        <div className='ttt_turn'>
          <h3>{isP1Turn ? 'P1\'s Turn' : 'P2\'s Turn'}</h3>
        </div>

        <div className='ttt__helper'>
          <div className='ttt__board'>
            <div className={getCellValue(0)} onClick={() => clickedCell(0)}></div>
            <div className={getCellValue(1)} onClick={() => clickedCell(1)}></div>
            <div className={getCellValue(2)} onClick={() => clickedCell(2)}></div>
            <div className={getCellValue(3)} onClick={() => clickedCell(3)}></div>
            <div className={getCellValue(4)} onClick={() => clickedCell(4)}></div>
            <div className={getCellValue(5)} onClick={() => clickedCell(5)}></div>
            <div className={getCellValue(6)} onClick={() => clickedCell(6)}></div>
            <div className={getCellValue(7)} onClick={() => clickedCell(7)}></div>
            <div className={getCellValue(8)} onClick={() => clickedCell(8)}></div>
          </div>
        </div>
        <div className='ttt__mode-toggle'>
          <Toggle
            defaultChecked={theme === themes.dark}
            icons={false}
            onChange={() => {toggleTheme();}}
            />
        </div>
      </div>
      <div className='ttt__game-complete-modal'>
        <ReactModal 
          isOpen={!!showWinner}
          onRequestClose={closeModal}
          contentLabel="WINNER"
          className='ttt__modal'
          ariaHideApp={false}
          >
            <h1>{showWinner === 3 ? "Draw!" : `Player ${showWinner} Wins!`}</h1>
            <div>Play again?</div>
            <div className='bottom-right'>
              <span onClick={closeModal} className='ttt__modal-button'>Yes</span>
              <span onClick={closeModal} className='ttt__modal-button'>No</span>
            </div>
          </ReactModal>
      </div>
    </div>
  );
}

export default App;
