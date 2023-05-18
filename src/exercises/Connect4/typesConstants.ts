export type BoardSpace = "red" | "yellow" | "empty";
export type PlayerPiece = Exclude<BoardSpace, "empty">;

export const pieceBackgroundColors: Record<BoardSpace, string> = {
  red: "hsl(0deg, 80%, 45%)",
  yellow: "hsl(53deg, 95%, 50%)",
  empty: "white",
};
