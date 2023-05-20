import { useEffect, useId } from "react";
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

export default function ConnectFour() {
  const hookId = useId();
  const { state, updaters } = useGameState();

  useEffect(() => {
    if (state.status !== "pieceFalling") return;
    const timeoutId = window.setTimeout(updaters.nextTick, ANIMATION_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [state.board, state.status, updaters.nextTick]);

  const announcementAreaId = `announcement-${hookId}`;
  const topRow = state.board[0];
  const gameOver =
    state.status === "redWins" ||
    state.status === "yellowWins" ||
    state.status === "tie";

  return (
    <main className="h-full flex justify-center items-center flex-col">
      <h1 className="font-bold">Connect Four</h1>

      <section role="group" className="px-2 mt-2.5">
        {topRow?.map((_, columnIndex) => (
          <DropperButton
            key={columnIndex}
            hoverFillColor={state.activePlayer}
            onClick={() => updaters.selectColumn(columnIndex)}
            disabled={
              gameOver ||
              state.board.every((row) => row[columnIndex] !== "empty")
            }
          />
        ))}
      </section>

      <table>
        <caption>
          <VisuallyHidden.Root>Current Board</VisuallyHidden.Root>
        </caption>

        <tbody
          aria-labelledby={announcementAreaId}
          className="border-spacing-0 rounded-lg bg-blue-700 p-1 block"
        >
          {state.board.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cellContent, columnIndex) => (
                <td key={columnIndex} className="w-[50px] h-[50px] p-1">
                  <VisuallyHidden.Root>
                    The space at column {columnIndex + 1}, row {rowIndex + 1} is{" "}
                    {cellContent}.
                  </VisuallyHidden.Root>
                  <div className={pieceStyles({ cellContent })} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <section className="text-center mt-2">
        <p
          id={announcementAreaId}
          aria-live="polite"
          className="flex flex-row items-center gap-x-1 mt-1 min-h-[1rem] leading-none"
        >
          {!gameOver && (
            <>
              <div
                className={`w-3 h-3 rounded-full border-black border-2 ${
                  state.activePlayer === "red" ? "bg-red-600" : "bg-yellow-300"
                }`}
              />
              {state.activePlayer === "red" ? "Red" : "Yellow"} player&apos;s
              turn
            </>
          )}

          {state.status === "tie" && "Tie!"}
          {state.status === "redWins" && "Red player wins!"}
          {state.status === "yellowWins" && "Yellow player wins!"}
        </p>

        {/*
          Not conditionally rendering button to prevent layout reflows once the
          game ends
        */}
        <button
          type="button"
          className={`bg-gray-200 py-4 px-8 rounded-full mt-4 hover:bg-gray-300 transition-colors ${
            gameOver ? "opacity-100" : "opacity-0"
          }`}
          disabled={!gameOver}
          onClick={updaters.resetGame}
        >
          Play again
        </button>
      </section>
    </main>
  );
}
