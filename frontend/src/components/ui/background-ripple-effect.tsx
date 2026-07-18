"use client";

import React, { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const BackgroundRippleEffect = ({
  rows = 14,
  cols = 36,
  cellSize = 52,
}: {
  rows?: number;
  cols?: number;
  cellSize?: number;
}) => {
  const [clickedCell, setClickedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 h-full w-full pointer-events-auto z-0 overflow-hidden flex items-center justify-center bg-[#0A0A0B] opacity-40"
      )}
      style={{
        maskImage: "radial-gradient(ellipse 100% 100% at 50% 40%, black 75%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 50% 40%, black 75%, transparent 100%)",
      }}
    >
      <div className="relative h-auto w-auto overflow-hidden">
        <DivGrid
          key={`base-${rippleKey}`}
          rows={rows}
          cols={cols}
          cellSize={cellSize}
          borderColor="rgba(245, 245, 247, 0.04)"
          fillColor="transparent"
          clickedCell={clickedCell}
          onCellClick={(row, col) => {
            setClickedCell({ row, col });
            setRippleKey((k) => k + 1);
          }}
          interactive
        />
      </div>
    </div>
  );
};

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number; // in pixels
  borderColor: string;
  fillColor: string;
  clickedCell: { row: number; col: number } | null;
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
};

type CellStyle = React.CSSProperties & {
  ["--delay"]?: string;
  ["--duration"]?: string;
};

const DivGrid = ({
  className,
  rows = 14,
  cols = 36,
  cellSize = 52,
  borderColor = "rgba(245, 245, 247, 0.08)",
  fillColor = "transparent",
  clickedCell = null,
  onCellClick = () => {},
  interactive = true,
}: DivGridProps) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, idx) => idx),
    [rows, cols]
  );

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
    marginInline: "auto",
  };

  return (
    <div className={cn("relative z-[3]", className)} style={gridStyle}>
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;
        const distance = clickedCell
          ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
          : 0;
        const delay = clickedCell ? Math.max(0, distance * 50) : 0; // ms
        const duration = 200 + distance * 70; // ms

        const style: CellStyle = clickedCell
          ? {
              "--delay": `${delay}ms`,
              "--duration": `${duration}ms`,
            }
          : {};

        return (
          <div
            key={idx}
            className={cn(
              "cell relative border border-[rgba(245,245,247,0.08)] bg-transparent transition-all duration-200 ease-out will-change-transform",
              "hover:z-20 hover:scale-[1.05] hover:bg-[#8B8FE8]/25 hover:border-[#8B8FE8] hover:shadow-[0_0_20px_2px_rgba(139,143,232,0.5),inset_0_0_12px_rgba(139,143,232,0.3)] cursor-pointer",
              clickedCell && "animate-cell-ripple [animation-fill-mode:none]",
              !interactive && "pointer-events-none"
            )}
            style={{
              borderColor: borderColor,
              ...style,
            }}
            onClick={
              interactive ? () => onCellClick?.(rowIdx, colIdx) : undefined
            }
          />
        );
      })}
    </div>
  );
};
