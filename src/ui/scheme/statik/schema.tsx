import React from "react";
import { LeftPanelka } from "./leftPanelka";
import { RightPanelka } from "./rightPanelka";
import { SidePanelka } from "./sidePanelka";
import { SchemeLabels } from "./schemaLabels";
import { MARKERS } from "../config/stepsNumber";
import { DiagramDefs, DiagramLines } from "./diagramVectors";
import { KvitButton } from "./kvit";
import { AccordItem } from "./Accord";
import { P2K9Badge } from "./2k-9";
import { P2k9_DATA, Kvit_Data, Accord_Data } from "../config/diagramData";
import { At } from "./map_shablon";
import { StepMarker } from "./StepMarker";
import {LAU_Data, Long_Mixer_Data, Panel_Data, Silo_Data} from "../config/staticData";
import { Panel } from "../Panel";
import { Valve } from "../Valve";
import { Circulator } from "../Circulator";
import { Vent } from "../Vent";
import { Mixer } from "../Mixer";
import { Pump } from "../Pump";
import { Transporter } from "../Transporter";
import {  Circulator_Data,  Vent_Data,  Mixer_Data,  Pump_Data,  Transporter_Data,  Valve_Data,} from "../config/dinamikData"
import {LongMixer} from "./LongMixer.tsx";
import {LAU} from "./LAU.tsx";
import {Silo} from "./Silo.tsx";
import { Kvf3, Kvf4, Apatite, Lvf } from "./TableTitle";

export const SCHEMA_WIDTH = 1395;
export const SCHEMA_HEIGHT = 626;

export interface SpacingDiagramProps {
  className?: string;
  style?: React.CSSProperties;
  ref?: React.Ref<SVGSVGElement>;
}

export default function SpacingDiagram({ className, style, ref }: SpacingDiagramProps) {
  return (
    <svg
      className={className}
      style={style}
      ref={ref}
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

        {Kvit_Data.map(({ id, x, y }, i) => (
          <At key={`kvit-${id}-${i}`} x={x} y={y}><KvitButton /></At>
        ))}

        {Accord_Data.map(({ id, x, y, name }, i) => (
          <At key={`accord-${id}-${i}`} x={x} y={y}><AccordItem name={name} /></At>
        ))}

        {P2k9_DATA.map(({ id, x, y, name }, i) => (
          <At key={`p2k9-${id}-${i}`} x={x} y={y}><P2K9Badge name={name} /></At>
        ))}

        {Panel_Data.map(({ x, y, ...panelProps }, i) => (
          <At key={`panel-${panelProps.id}-${i}`} x={x} y={y}><Panel {...panelProps} /></At>
        ))}
        {/* Оборудование, читающее состояние из стора */}
        {Mixer_Data.map(({ x, y, ...props }) => (
          <At key={props.id} x={x} y={y}><Mixer {...props} /></At>
        ))}

        {Circulator_Data.map(({ x, y, ...props }) => (
          <At key={props.id} x={x} y={y}><Circulator {...props} /></At>
        ))}

        {Vent_Data.map(({ x, y, ...props }) => (
          <At key={props.id} x={x} y={y}><Vent {...props} /></At>
        ))}

        {Panel_Data.map(({ x, y, ...panelProps }) => (
          <At key={`${panelProps.id}-${x}-${y}`} x={x} y={y}><Panel {...panelProps} /></At>
        ))}

        {Transporter_Data.map(({ x, y, ...props }) => (
          <At key={props.id} x={x} y={y}><Transporter {...props} /></At>
        ))}

        {Valve_Data.map(({ x, y, ...props }) => (
          <At key={props.id} x={x} y={y}><Valve {...props} /></At>
        ))}

        {Pump_Data.map(({ x, y, ...props }) => (
          <At key={props.id} x={x} y={y}><Pump {...props} /></At>
        ))}

        {Long_Mixer_Data.map(({ id, x, y }) => (
          <At key={`${id}-${x}-${y}`} x={x} y={y}><LongMixer id={id} /></At>
        ))}

        {LAU_Data.map(({ x, y, ...props}) => (
          <At key={`${props.id}-${x}-${y}`} x={x} y={y}><LAU id={props.id}/></At>
        ))}

        {Silo_Data.map(({ x, y, ...props }) => (
          <At key={props.id} x={x} y={y}><Silo id={props.id}/></At>
        ))}
        
        <div className="relative">
          <Apatite x={1155} y={12}/>
          <Kvf3 x={1155} y={193}/>
          <Kvf4 x={1155} y={336}/>
          <Lvf x={1155} y={445}/>
        </div>
      </foreignObject>
    </svg>
  );
}
// 2