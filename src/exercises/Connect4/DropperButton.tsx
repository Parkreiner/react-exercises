import { useState } from "react";
import { PlayerPiece, pieceBackgroundColors } from "./typesConstants";

type Props = {
  activePlayer: PlayerPiece;
  disabled: boolean;
  onClick: () => void;
};

export default function DropperButton({
  activePlayer,
  disabled,
  onClick,
}: Props) {
  const [hovered, setHovered] = useState(false);

  const backgroundColor =
    hovered && !disabled ? pieceBackgroundColors[activePlayer] : "inherit";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={{
        backgroundColor: "hsl(0deg, 0%, 80%)",
        cursor: disabled ? "default" : "pointer",
        width: "50px",
        height: "50px",
        padding: "4px",
        border: "none",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          backgroundColor,
          width: "100%",
          height: "100%",
          borderRadius: "9999px",
        }}
      />
    </button>
  );
}
