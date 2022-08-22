import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import { getCellElementAtIdx, getCellElementList, getCurrentTurnElement, getGameStatusElement, getReplayButtonElement } from "./selectors.js";
import { checkGameStatus } from "./utils.js";
/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let currentTurnHistory = TURN.CROSS;
let isGameEnded = false;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

function toggleTurn(){
    // toggle turn : chuyển đổi turn
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;
    
    // update Turn on DOM element
    const currentTurnElement = getCurrentTurnElement();
    if(currentTurnElement){
        currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
        currentTurnElement.classList.add(currentTurn);
    }


}
// cập nhập trạng thái trò chơi
function updateGameStatus(newGameStatus){
    gameStatus = newGameStatus;
    const gameStatusElement = getGameStatusElement();
    if(gameStatusElement) gameStatusElement.textContent = newGameStatus;

}
// hiển thị nút phát lại game
function showReplayButton(){
    const replayButton = getReplayButtonElement();
    if(replayButton) replayButton.classList.add('show');
}
// ẩn nút phát lại game
function hideReplayButton(){
    const replayButton = getReplayButtonElement();
    if(replayButton) replayButton.classList.remove('show');
}
// tô sáng ô win
function highlightWinCell(winPositions){
    if(!Array.isArray(winPositions) || winPositions.length !== 3){
        throw new Error("Invalid win positions")
    }

    for(const position of winPositions){
        const cell = getCellElementAtIdx(position);
        if(cell) cell.classList.add('win');
    }
}

function handlerCellClick(cell, index){
    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
    const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
    if(isClicked || isEndGame) return;

    // set selected cell 
    cell.classList.add(currentTurn);

    // update cellValues
    cellValues[index] = currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

    // toggle turn
    toggleTurn();

    // check game status
    const game = checkGameStatus(cellValues);
    switch (game.status) {
        case GAME_STATUS.ENDED:
        {
            // update game status
            updateGameStatus(game.status);
            // show replay button
            showReplayButton();
            break;
        }
        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN:
        {
            // update game status
            updateGameStatus(game.status);
            // show replay button
            showReplayButton();
            // highlight win cell: tô sáng ô win
            highlightWinCell(game.winPositions);
            break;
        }
    
        default:
            // playing
            break;
    }
}
function initCellElementList(){
    const cellElementList = getCellElementList();
    cellElementList.forEach((cell, index) => {
        cell.addEventListener("click", () => handlerCellClick(cell, index));
    })
}
function resetGame(){
    // reset temp global vars
    const currentTurnTemp = currentTurn;
    currentTurn = currentTurnHistory === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;
    currentTurnHistory = currentTurnTemp;
    isGameEnded = false;
    gameStatus = GAME_STATUS.PLAYING;
    cellValues = cellValues.map(() => "");
    
    // reset dom element
    // reset game status
    updateGameStatus(GAME_STATUS.PLAYING);
    
    // reset current turn
    const currentTurnElement = getCurrentTurnElement();
    if(currentTurnElement){
        currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
        currentTurnElement.classList.add(currentTurn);
    }
    // reset game broad
    const cellElementList = getCellElementList();
    for (const cellElement of cellElementList) {
        cellElement.className = '';
    }
    // reset replay button
    hideReplayButton();
}

function initReplayButton(){
    const replayButton = getReplayButtonElement();
    if(replayButton){
        replayButton.addEventListener('click', resetGame);
    }
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
    // bind click event for all li elements
    initCellElementList();

    // bind click event for replay button
    initReplayButton();
})();

