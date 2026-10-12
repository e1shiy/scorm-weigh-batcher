// SpacingDiagram.tsx
import React from "react";
import { LeftPanelka } from "./leftPanelka";
import { RightPanelka } from "./rightPanelka";
import { SidePanelka } from "./sidePanelka";
import { SchemeLabels } from "./schemaLabels";
import { StaticMarkers } from "./stepsNumber";
import { DiagramDefs, DiagramLines, DimensionArrow } from "./diagramVectors";

export interface SpacingDiagramProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function SpacingDiagram({ className, style }: SpacingDiagramProps) {
  return (
    <svg
      className={className}
      style={{ width: "100%", height: "auto", ...style }}
      viewBox="0 0 1395 626"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Схема отступов"
    >
      {/* 1. Графические маркеры */}
      <DiagramDefs />

      {/* 2. HTML-панели через foreignObject */}
      <foreignObject x="0" y="0" width="1395" height="626" overflow="visible">
        <div style={{ position: "relative", width: 1128, height: 546 }}>
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

      {/* 3. Слой векторных линий и точек */}
      <DiagramLines />

      {/* 4. Если нужно разместить отдельную векторную стрелку по координатам x, y: */}
      <DimensionArrow x={200} y={150} />
    </svg>
  );
}