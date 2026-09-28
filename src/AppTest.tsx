import React from "react";
import { Panel } from "./ui/components/Panel";
import { Klapan } from "./ui/components/Klapan";

export default function App() {
  return (
    <div className="p-10 flex gap-6">
      {/* Компактный вид (без isManual / isF) */}
      <Panel id="TI-101" value="25.4" valueColor="#FFFFFF" unit="°C" />

      {/* Полный вид со строкой статусов */}
      <Panel id="FIC-201" value="12.0" unit="m³/h" isManual={false} isF={false} />

      {/* Полный вид, ручной режим и авария */}
      <Panel id="PIC-301" value="3.5" unit="bar" isManual={true} isF={true} />

      <Klapan id="2-pec" value={4.5} isManual={true}/>

      <Klapan id="2-pec" value={4.5} isE={true}/>
    </div>
  );
}