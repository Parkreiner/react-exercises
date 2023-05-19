export type BoardSpace = "red" | "yellow" | "empty";
export type PlayerPiece = Exclude<BoardSpace, "empty">;
