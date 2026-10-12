import React from "react";
import { LeftPanelka } from "./leftPanelka";
import { RightPanelka } from "./rightPanelka"
import { SidePanelka } from "./sidePanelka"
import { SchemeLabels } from "./schemaLabels";
import { StaticMarkers } from "./stepsNumber";

type Segment = readonly [x1: number, y1: number, x2: number, y2: number];
type Point = readonly [x: number, y: number];

const COLORS = {
  o: "#EAAD81",
  p: "#E9A8CD",
  r: "#F49EA0",
  g: "#727272",
  b: "#5FA0EF",
  n: "#15008C",
  gr: "#1D7E00",
} as const;

type ColorKey = keyof typeof COLORS;
type ByColor = Partial<Record<ColorKey, Segment[]>>;

const LINES: ByColor = {
  o: [[346.9,405.5,346.9,430.5],[817.9,415.5,817.9,430.5],[857.9,414.5,816.9,414.5],[1009.9,345.5,889.9,345.5],[857.9,429.5,818.9,429.5],[345.9,429.5,307.9,429.5],[306.9,404.5,306.9,430.5]],
  p: [[17.9,233.5,228.9,233.5],[17.9,309.5,214.9,309.5]],
  g: [[256.9,36.5,906.9,36.5],[301.9,144.5,310.9,144.5],[322.9,144.5,331.9,144.5],[531.9,144.5,540.9,144.5],[525.9,221.5,536.9,221.5],[650.9,144.5,658.9,144.5],[850.9,143.5,858.9,143.5],[290.9,269.5,299.9,269.5],[292.9,387.5,325.9,387.5],[540.9,176.5,585.9,176.5],[775.9,143.5,825.9,143.5],[787.9,266.5,839.9,266.5],[291.9,357.5,291.9,388.5],[324.9,388.5,324.9,425.5],[539.9,145.5,539.9,177.5],[309.9,246.5,309.9,256.5],[323.9,246.5,323.9,256.5],[838.9,357.5,838.9,426.5]],
};

/**
 * Обычные стрелки: остриё наконечника лежит в конечной точке (x2, y2).
 */
const ARROWS: ByColor = {
  o: [[888.9,346.5,888.9,255.5],[936.9,346.5,936.9,255.5],[985.9,346.5,985.9,255.5]],
  p: [[213.9,310.5,213.9,517.5],[227.9,233.5,227.9,517.5],[1120.9,212.5,995.9,212.5],[1120.9,118.5,995.9,118.5]],
  r: [[481.9,517.5,481.9,380.5],[1028.9,517.5,1028.9,380.5]],
  b: [[761.9,331.5,761.9,517.5],[392.9,337.5,392.9,517.5]],
  g: [
    ...[905.9, 731.9, 602.9, 484.9, 375.9, 257.9].map((x): Segment => [x, 37.5, x, 60.5]),
    [309.9,145.5,309.9,248.5],[323.9,145.5,323.9,248.5],[291.9,270.5,291.9,360.5],[657.9,145.5,657.9,205.5],[838.9,267.5,838.9,359.5],[824.9,144.5,824.9,179.5],[851.9,144.5,851.9,179.5],[584.9,177.5,584.9,206.5],[526.9,222.5,526.9,253.5],
  ],
};

/**
 * Перевёрнутые наконечники: в конечной точке (x2, y2) стоит основание
 * треугольника, а остриё смотрит назад, на линию.
 */
const FLIPPED_ARROWS: ByColor = {
  o: [[858.9,430.5,858.9,354.5],[347.9,405.5,8.9,405.5]],
  p: [[16.9,310.5,16.9,92.5],[1121.9,213.5,1121.9,1.5]],
};

const DASHED: ByColor = {
  n: [[1083.9,118.5,1083.9,86.5],[1083.9,213.5,1083.9,181.5]],
  gr: [[202.9,484.5,278.9,484.5],[391.9,356.5,467.9,356.5],[373.9,484.5,401.9,484.5],[548.9,542.5,576.9,542.5],[886.9,484.5,914.9,484.5],[750.9,484.5,794.9,484.5],[732.9,357.5,760.9,357.5],[859.9,406.5,887.9,406.5],[655.9,541.5,683.9,541.5],[258.9,440.5,258.9,516.5],[983.9,495.5,983.9,519.5],[154.9,385.5,154.9,405.5],[793.9,122.5,793.9,142.5],[1120.9,29.5,1098.9,29.5],[656.9,181.5,636.9,181.5],[538.9,173.5,518.9,173.5],[307.9,232.5,286.9,232.5],[342.9,232.5,322.9,232.5],[35.9,125.5,15.9,125.5],[541.9,470.5,569.9,470.5],[541.9,506.5,569.9,506.5],[662.9,470.5,690.9,470.5],[662.9,506.5,690.9,506.5]],
};

const DASH_PATHS: readonly string[] = [
  "M136.9 202.5H176.9V232.5",
  "M393.9 392.5H261.9V408.5",
  "M91.4 156.5H51.4V270.5H176.9V310.5",
  "M1040.9 434.5H1112.9V414.5",
];

const DOTS: Point[] = [[16.9,125.5],[154.9,404.5],[258.9,517.5],[542.9,470.5],[542.9,506.5],[549.9,542.5],[682.9,541.5],[689.9,506.5],[689.9,470.5],[761.9,357.5],[1121.9,29.5],[793.9,143.5],[657.9,181.5],[539.9,173.5],[323.9,232.5],[392.9,356.5],[309.9,232.5],[858.9,406.5],[983.9,518.5]];


const entries = (o: ByColor) => Object.entries(o) as [ColorKey, Segment[]][];

export interface SpacingDiagramProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function SpacingDiagram({ className, style }: SpacingDiagramProps) {
  const colorKeys = Object.keys(COLORS) as ColorKey[];

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


    
    <svg
      className={className}
      style={{ width: "100%", height: "auto", ...style }}
      viewBox="0 0 1395 626"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Схема отступов"
    >
      <defs>
        {colorKeys.map((k) => (
          <React.Fragment key={k}>
            {/* Обычный: остриё в конце линии */}
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
            {/* Перевёрнутый: основание в конце линии, остриё смотрит назад */}
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

            {/* Панельки лежат под разметкой. Они масштабируются вместе с SVG. */}
      <foreignObject x="0" y="0" width="1395" height="626" overflow="visible">
        <div style={{ position: "relative", width: 1128, height: 546 }}>
          {/* Каждая обёртка — containing block для absolute-детей панельки */}
          <div style={{ position: "absolute", left: 0, top: 395 }}>
            <LeftPanelka />
          </div>
          <div style={{ position: "absolute", left: 678, top: 395 }}>
            <RightPanelka />
          </div>
          <SidePanelka />
          <SchemeLabels />
          <StaticMarkers />
        </div>
      </foreignObject>

      {entries(LINES).map(([k, list]) =>
        list.map(([x1, y1, x2, y2], i) => (
          <line key={`l${k}${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS[k]} strokeWidth="2" />
        ))
      )}

      {renderArrows(ARROWS, "a", (k) => `sd-arrow-${k}`)}
      {renderArrows(FLIPPED_ARROWS, "f", (k) => `sd-arrow-flip-${k}`)}

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

      {DASH_PATHS.map((d, i) => (
        <path key={`p${i}`} d={d} fill="none" stroke={COLORS.n} strokeWidth="2" strokeDasharray="2 2" />
      ))}
      <line x1="553.9" y1="422.5" x2="489.9" y2="422.5" stroke="#271593" strokeWidth="2" strokeDasharray="2 2" />

      {DOTS.map(([cx, cy], i) => (
        <circle key={`c${i}`} cx={cx} cy={cy} r="3" fill={COLORS.gr} />
      ))}
    </svg>
  );
}


<svg width="12" height="218" viewBox="0 0 12 218" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.7735 10L11.547 2.54857e-10L-4.76837e-07 -2.54857e-10L4.7735 10L6.7735 10ZM5.7735 9L4.7735 9L4.7735 218L5.7735 218L6.7735 218L6.7735 9L5.7735 9Z" fill="#E9A8CD"/>
</svg>
