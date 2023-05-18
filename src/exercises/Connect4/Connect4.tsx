import { useEffect } from "react";
import { pieceBackgroundColors } from "./typesConstants";
import useGameState from "./useGameState";
import DropperButton from "./DropperButton";

const ANIMATION_DELAY_MS = 50;

export default function Connect4() {
  const { state, updaters } = useGameState();

  useEffect(() => {
    if (state.status !== "pieceFalling") return;
    const timeoutId = window.setTimeout(updaters.nextTick, ANIMATION_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [state.board, state.status, updaters.nextTick]);

  const topRow = state.board[0];
  const gameOver =
    state.status === "redWins" ||
    state.status === "yellowWins" ||
    state.status === "tie";

  return (
    <div className="App">
      {topRow?.map((topRowCell, columnIndex) => (
        <DropperButton
          key={columnIndex}
          activePlayer={state.activePlayer}
          disabled={gameOver || topRowCell !== "empty"}
          onClick={() => updaters.selectColumn(columnIndex)}
        />
      ))}

      <table
        style={{
          borderSpacing: "0",
          backgroundColor: "hsl(245deg, 50%, 45%)",
          borderRadius: "8px",
        }}
      >
        <tbody>
          {state.board.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <td
                  key={columnIndex}
                  style={{
                    width: "50px",
                    height: "50px",
                    padding: "4px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "9999px",
                      backgroundColor: pieceBackgroundColors[cell],
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {gameOver && (
        <>
          <p>
            {state.status === "tie" && "Tie!"}
            {state.status === "redWins" && "Red player wins!"}
            {state.status === "yellowWins" && "Yellow player wins!"}
          </p>

          <button type="button" onClick={updaters.resetGame}>
            Play again
          </button>
        </>
      )}
    </div>
  );
}
