"use client";

/**
 * Subtle static grid background — no animation, no drifting.
 * Uses a SVG pattern tile.
 */
interface StaticGridProps {
  size?: number;          // cell size in px
  opacity?: number;       // 0–1
  color?: string;         // stroke color (CSS)
  className?: string;
}

export function StaticGrid({
  size = 40,
  opacity = 0.08,
  color = "currentColor",
  className = "",
}: StaticGridProps) {
  const id = `grid-${size}`;
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke={color}
            strokeWidth="0.75"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacity} />
    </svg>
  );
}
