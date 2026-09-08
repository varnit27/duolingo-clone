"use client";

/**
 * Draws the dotted connecting line behind a column of skill nodes,
 * following the same left/center/right wiggle offsets the nodes use.
 * Rendered as an absolutely-positioned SVG behind the nodes, which sit
 * in normal document flow above it (see HomePage) so vertical spacing
 * always matches exactly — no manual position math to keep in sync.
 */
export default function PathTrack({
  offsets,
  nodeSize = 84,
  gapY = 40,
  wiggle = 70,
}: {
  offsets: number[];
  nodeSize?: number;
  gapY?: number;
  wiggle?: number;
}) {
  const step = nodeSize + gapY;
  const height = offsets.length > 0 ? (offsets.length - 1) * step + nodeSize : 0;
  const centerX = wiggle + nodeSize / 2; // enough left margin for the leftmost wiggle

  const points = offsets.map((offset, i) => ({
    x: centerX + offset * wiggle,
    y: i * step + nodeSize / 2,
  }));

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `Q ${points[i - 1].x} ${p.y - gapY / 2}, ${p.x} ${p.y}`))
    .join(" ");

  return (
    <svg
      className="absolute top-0 left-1/2 -translate-x-1/2 -z-10"
      width={centerX * 2}
      height={height}
      viewBox={`0 0 ${centerX * 2} ${height}`}
    >
      <path
        d={pathD}
        fill="none"
        stroke="#E5E5E5"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="2 16"
      />
    </svg>
  );
}
