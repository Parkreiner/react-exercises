export type BoardSpace = "red" | "yellow" | "empty";
export type PlayerPiece = Exclude<BoardSpace, "empty">;
export const BOARD_WIDTH = 7;
export const BOARD_HEIGHT = 6;
