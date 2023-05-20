import { useCallback, useReducer } from "react";
import {
  BoardSpace,
  PlayerPiece,
  BOARD_HEIGHT,
  BOARD_WIDTH,
} from "./typesConstants";

type BoardStatus = "idle" | "pieceFalling" | "redWins" | "yellowWins" | "tie";
type Board = readonly (readonly BoardSpace[])[];

type GameState = Readonly<{
  board: Board;
  status: BoardStatus;
  activePlayer: PlayerPiece;
  activeCellIndices: null | Readonly<{
    row: number;
    column: number;
  }>;
}>;

type GameAction =
  | { type: "columnSelected"; payload: { columnIndex: number } }
  | { type: "gameTicked" }
  | { type: "gameReset" };

const initialGameState = {
  board: new Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => new Array(BOARD_WIDTH).fill("empty")),
  status: "idle",
  activePlayer: "red",
  activeCellIndices: null,
} as const satisfies GameState;

function determineWinner(board: Board): PlayerPiece | null {
  // Scan rows
  for (const row of board) {
    for (let x = 0; x <= row.length - 4; x++) {
      const head = row[x];
      if (head === undefined || head === "empty") {
        continue;
      }

      const horizontalSegment = row.slice(x, x + 4);
      if (horizontalSegment.every((cell) => cell === head)) {
        return head;
      }
    }
  }

  // Scan columns
  for (let x = 0; x < (board[0]?.length ?? 0); x++) {
    for (let y = 0; y <= board.length - 4; y++) {
      const head = board[y]?.[x];
      if (head === undefined || head === "empty") {
        continue;
      }

      const verticalSegment: (BoardSpace | undefined)[] = [];
      for (let offset = y; offset < y + 4; offset++) {
        verticalSegment.push(board[offset]?.[x]);
      }

      if (verticalSegment.every((cell) => cell === head)) {
        return head;
      }
    }
  }

  // Scan diagonals going top-right to bottom-left
  for (let y = 0; y <= board.length - 4; y++) {
    for (let x = 3; x < (board[0]?.length ?? 0); x++) {
      const head = board[y]?.[x];
      if (head === undefined || head === "empty") {
        continue;
      }

      const diagonalSegment: (BoardSpace | undefined)[] = [];
      for (let offset = 0; offset < 4; offset++) {
        const newSpace = board[y + offset]?.[x - offset];
        diagonalSegment.push(newSpace);
      }

      if (diagonalSegment.every((cell) => cell === head)) {
        return head;
      }
    }
  }

  // Scan diagonals going top-left to bottom-right
  for (let y = 0; y <= board.length - 4; y++) {
    for (let x = 0; x <= (board[0]?.length ?? 0) - 4; x++) {
      const head = board[y]?.[x];
      if (head === undefined || head === "empty") {
        continue;
      }

      const diagonalSegment: (BoardSpace | undefined)[] = [];
      for (let offset = 0; offset < 4; offset++) {
        const newSpace = board[y + offset]?.[x + offset];
        diagonalSegment.push(newSpace);
      }

      if (diagonalSegment.every((cell) => cell === head)) {
        return head;
      }
    }
  }

  return null;
}

function makeNewStatus(board: Board): BoardStatus {
  const winner = determineWinner(board);

  if (winner === "red") {
    return "redWins";
  }

  if (winner === "yellow") {
    return "yellowWins";
  }

  const boardFull = board.every((row) => row.every((cell) => cell !== "empty"));
  return boardFull ? "tie" : "idle";
}

export function reduceGameState(
  state: GameState,
  action: GameAction
): GameState {
  switch (action.type) {
    case "columnSelected": {
      const { board, activePlayer, status } = state;
      const { columnIndex } = action.payload;

      const entryPoint = board[0]?.[columnIndex];
      if (status !== "idle" || entryPoint !== "empty") {
        return state;
      }

      const newBoard = board.map((row, rowIndex) => {
        if (rowIndex !== 0) return row;
        return row.map((cell, colIndex) => {
          if (colIndex !== columnIndex) return cell;
          return activePlayer;
        });
      });

      return {
        ...state,
        status: "pieceFalling",
        board: newBoard,
        activeCellIndices: { row: 0, column: columnIndex },
      };
    }

    case "gameTicked": {
      const { status, board, activePlayer, activeCellIndices } = state;
      if (status !== "pieceFalling" || activeCellIndices === null) {
        return state;
      }

      const nextCell =
        board[activeCellIndices.row + 1]?.[activeCellIndices.column];

      if (nextCell !== "empty") {
        return {
          board,
          status: makeNewStatus(board),
          activePlayer: activePlayer === "red" ? "yellow" : "red",
          activeCellIndices: null,
        };
      }

      const newBoard = board.map((row, rowIndex) => {
        if (rowIndex === activeCellIndices.row) {
          return row.map((cell, colIndex) => {
            if (colIndex !== activeCellIndices.column) return cell;
            return "empty";
          });
        }

        if (rowIndex === activeCellIndices.row + 1) {
          return row.map((cell, colIndex) => {
            if (colIndex !== activeCellIndices.column) return cell;
            return activePlayer;
          });
        }

        return row;
      });

      return {
        ...state,
        board: newBoard,
        activeCellIndices: {
          ...activeCellIndices,
          row: activeCellIndices.row + 1,
        },
      };
    }

    case "gameReset": {
      return initialGameState;
    }

    default: {
      throw new Error(`Unknown action ${JSON.stringify(action)} detected`);
    }
  }
}

export default function useGameState() {
  const [state, dispatch] = useReducer(reduceGameState, initialGameState);

  const selectColumn = useCallback((columnIndex: number) => {
    dispatch({ type: "columnSelected", payload: { columnIndex } });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "gameReset" });
  }, []);

  const nextTick = useCallback(() => {
    dispatch({ type: "gameTicked" });
  }, []);

  return {
    state,
    updaters: {
      selectColumn,
      resetGame,
      nextTick,
    },
  } as const;
}
