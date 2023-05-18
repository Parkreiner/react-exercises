import { useEffect } from "react";
import { cva } from "class-variance-authority";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { BoardSpace } from "./typesConstants";
import useGameState from "./useGameState";
import DropperButton from "./DropperButton";

const ANIMATION_DELAY_MS = 50;

const pieceStyles = cva("rounded-full w-full h-full", {
  variants: {
    cellContent: {
      red: "bg-red-700",
      yellow: "bg-yellow-400",
      empty: "bg-white",
    } satisfies Record<BoardSpace, string>,
  },
});

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
    <div className="h-full flex justify-center items-center flex-col">
      <div>
        {topRow?.map((_, columnIndex) => (
          <DropperButton
            key={columnIndex}
            activePlayer={state.activePlayer}
            onClick={() => updaters.selectColumn(columnIndex)}
            disabled={
              gameOver ||
              state.board.every((row) => row[columnIndex] !== "empty")
            }
          />
        ))}
      </div>

      <table className="border-spacing-0 rounded-lg bg-blue-700 p-1 block">
        <tbody>
          {state.board.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cellContent, columnIndex) => (
                <td
                  key={columnIndex}
                  className="w-[50px] h-[50px] p-1"
                  aria-live="polite"
                >
                  <VisuallyHidden.Root>
                    The space at row {rowIndex + 1}, column {columnIndex + 1} is{" "}
                    {cellContent}.
                  </VisuallyHidden.Root>
                  <div className={pieceStyles({ cellContent })} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {gameOver && (
        <div className="text-center">
          <p className="pt-4">
            {state.status === "tie" && "Tie!"}
            {state.status === "redWins" && "Red player wins!"}
            {state.status === "yellowWins" && "Yellow player wins!"}
          </p>

          <button
            type="button"
            className="bg-gray-200 py-4 px-8 rounded-full mt-2 hover:bg-gray-300 transition-colors"
            onClick={updaters.resetGame}
          >
            Play again
          </button>
        </div>
      )}
    </div>
  );
}
