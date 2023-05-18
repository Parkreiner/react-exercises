export type BoardSpace = "red" | "yellow" | "empty";
export type PlayerPiece = Exclude<BoardSpace, "empty">;

export const pieceBackgroundColors = {
  red: "bg-red-700",
  yellow: "bg-yellow-700",
  empty: "bg-white",
} as const satisfies Record<BoardSpace, string>;
