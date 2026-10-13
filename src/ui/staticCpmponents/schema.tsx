// SpacingDiagram.tsx
import React from "react";
import { LeftPanelka } from "./leftPanelka";
import { RightPanelka } from "./rightPanelka";
import { SidePanelka } from "./sidePanelka";
import { SchemeLabels } from "./schemaLabels";
import { StaticMarkers } from "./stepsNumber";
import { DiagramDefs, DiagramLines } from "./diagramVectors";
import { Kvit } from "./Kvit";
import { Accord } from "./Accord";
import { P2K9 } from "./2k-9";


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

      {/* 3. Слой векторных линий и точек */}
      <DiagramLines />

            {/* 2. HTML-панели через foreignObject */}
      <foreignObject x="0" y="0" width="1395" height="626" overflow="visible">
          {/* Левая панель */}
          <div style={{ position: "absolute", left: 0, top: 395 }}>
            <LeftPanelka />
          </div>
          {/* Правая панель */}
          <div style={{ position: "absolute", left: 678, top: 395 }}>
            <RightPanelka />
          </div>
          {/* Боковая панель */}
          <SidePanelka />
          {/* Тексты */}
          <SchemeLabels />
          {/* Метки шагов */}
          <StaticMarkers />
          {/* Квитирование */}
          <Kvit />  
          {/* Каратау, Ковдорский */}
          <Accord />
          <P2K9 />
      </foreignObject>
    </svg>
  );
}