import { useState } from "react";
import { cva } from "class-variance-authority";
import { PlayerPiece } from "./typesConstants";

type Props = {
  activePlayer: PlayerPiece;
  disabled: boolean;
  onClick: () => void;
};

const pieceStyles = cva("w-full h-full rounded-full border-dotted border-2", {
  variants: {
    disabled: {
      true: "border-none",
      false: "border-black",
    },

    activePlayer: {
      red: "",
      yellow: "",
    } satisfies Record<PlayerPiece, string>,

    hovered: {
      true: "",
      false: "bg-inherit",
    },
  },

  compoundVariants: [
    {
      hovered: true,
      disabled: false,
      activePlayer: "red",
      class: "bg-red-700",
    },
    {
      hovered: true,
      disabled: false,
      activePlayer: "yellow",
      class: "bg-yellow-400",
    },
  ],
});

export default function DropperButton({
  activePlayer,
  disabled,
  onClick,
}: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={`w-[50px] h-[50px] p-1 border-none bg-white rounded-md ${
        disabled ? "default" : "pointer"
      }`}
    >
      <div className={pieceStyles({ hovered, activePlayer, disabled })} />
    </button>
  );
}
