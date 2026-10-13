// DiagramVectors.tsx
import React from "react";
import {  COLORS,  LINES,  ARROWS,  FLIPPED_ARROWS,  DASHED,  DASH_PATHS,  DOTS,} from "../config/diagramData";
import type { ByColor, ColorKey } from "../config/diagramData";

const entries = (o: ByColor) => Object.entries(o) as [ColorKey, (readonly [number, number, number, number])[]][];

/** Одиночная векторная размерная стрелка из вашего макета */
export interface DimensionArrowProps {
  x: number;
  y: number;
  color?: string;
  className?: string;
}

/** Маркеры для стрелок в SVG defs */
export function DiagramDefs() {
  const colorKeys = Object.keys(COLORS) as ColorKey[];
  return (
    <defs>
      {colorKeys.map((k) => (
        <React.Fragment key={k}>
          <marker
            id={`sd-arrow-${k}`}
            viewBox="0 0 10 12"
            refX="10"
            refY="6"
            markerUnits="userSpaceOnUse"
            markerWidth="10"
            markerHeight="12"
            orient="auto"
            overflow="visible"
          >
            <path d="M0 0L10 6L0 12z" fill={COLORS[k]} />
          </marker>
          <marker
            id={`sd-arrow-flip-${k}`}
            viewBox="0 0 10 12"
            refX="10"
            refY="6"
            markerUnits="userSpaceOnUse"
            markerWidth="10"
            markerHeight="12"
            orient="auto"
            overflow="visible"
          >
            <path d="M10 0L0 6L10 12z" fill={COLORS[k]} />
          </marker>
        </React.Fragment>
      ))}
    </defs>
  );
}

/** Слой линий, пунктиров и стрелок */
export function DiagramLines() {
  const renderArrows = (data: ByColor, prefix: string, markerId: (k: ColorKey) => string) =>
    entries(data).map(([k, list]) =>
      list.map(([x1, y1, x2, y2], i) => (
        <line
          key={`${prefix}${k}${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={COLORS[k]}
          strokeWidth="2"
          markerEnd={`url(#${markerId(k)})`}
        />
      ))
    );

  return (
    <g id="diagram-geometry">
      {/* Обычные линии */}
      {entries(LINES).map(([k, list]) =>
        list.map(([x1, y1, x2, y2], i) => (
          <line key={`l${k}${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS[k]} strokeWidth="2" />
        ))
      )}

      {/* Стрелки */}
      {renderArrows(ARROWS, "a", (k) => `sd-arrow-${k}`)}
      {renderArrows(FLIPPED_ARROWS, "f", (k) => `sd-arrow-flip-${k}`)}

      {/* Пунктирные линии */}
      {entries(DASHED).map(([k, list]) =>
        list.map(([x1, y1, x2, y2], i) => (
          <line
            key={`d${k}${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={COLORS[k]}
            strokeWidth="2"
            strokeDasharray="2 2"
          />
        ))
      )}

      {/* Пунктирные пути */}
      {DASH_PATHS.map((d, i) => (
        <path key={`p${i}`} d={d} fill="none" stroke={COLORS.n} strokeWidth="2" strokeDasharray="2 2" />
      ))}
      <line x1="553.9" y1="422.5" x2="489.9" y2="422.5" stroke="#271593" strokeWidth="2" strokeDasharray="2 2" />

      {/* Точки */}
      {DOTS.map(([cx, cy], i) => (
        <circle key={`c${i}`} cx={cx} cy={cy} r="3" fill={COLORS.gr} />
      ))}
    </g>
  );
}