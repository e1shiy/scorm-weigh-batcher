import React from "react";
import { LeftPanelka } from "./leftPanelka";
import { RightPanelka } from "./rightPanelka";
import { SidePanelka } from "./sidePanelka";
import { SchemeLabels } from "./schemaLabels";
import { MARKERS, StepMarker } from "../config/stepsNumber";
import { DiagramDefs, DiagramLines } from "./diagramVectors";
import { KvitButton } from "./kvit";
import { AccordItem } from "./Accord";
import { P2K9Badge } from "./2k-9";
import { P2k9_DATA, Kvit_Data, Accord_Data } from "../config/diagramData";
import { At } from "./map_shablon";

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
      <DiagramDefs />
      <DiagramLines />

      <foreignObject x="0" y="0" overflow="visible">
        <div style={{ position: "absolute", left: 0, top: 395 }}>
          <LeftPanelka />
        </div>
        <div style={{ position: "absolute", left: 678, top: 395 }}>
          <RightPanelka />
        </div>
        <SidePanelka />
        <SchemeLabels />

        {/* Метки шагов */}
        {MARKERS.map(({ id, left, top }) => (
          <At key={id} x={left} y={top}><StepMarker id={id} /></At>
        ))}

        {/* Квитирование */}
        {Kvit_Data.map(({ id, x, y }) => (
          <At key={id} x={x} y={y}><KvitButton /></At>
        ))}

        {/* Каратау, Ковдорский */}
        {Accord_Data.map(({ id, x, y, name }) => (
          <At key={id} x={x} y={y}><AccordItem name={name} /></At>
        ))}

        {/* 2K-9 */}
        {P2k9_DATA.map(({ id, x, y, name }) => (
          <At key={id} x={x} y={y}><P2K9Badge name={name} /></At>
        ))}
      </foreignObject>
    </svg>
  );
}