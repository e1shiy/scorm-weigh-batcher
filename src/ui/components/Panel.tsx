import React, { useState } from "react";
import type { PanelProps } from '../../types';
import { PopUp } from "./first_pop_up";

export const Panel = ({id, ClassName, value, valueColor, unit, isManual, isF, onClick}: PanelProps) => {
  
  const [open, setOpen] = useState(false);
  const hasStatusRow = isManual !== undefined || isF !== undefined;

  return (
    <div className="relative inline-block">
      <div
        onClick={() => { setOpen(true); onClick?.(); }}
        className={`inline-flex flex-col border border-black bg-[#D9D9D9] font-sans select-none text-[8px] leading-none cursor-pointer ${
          hasStatusRow ? "w-[52px] h-[43px]" : "w-[44px] h-[32px]"
        }`}
      >
        {/* 1. Шапка с ID — общая для обоих режимов */}
        <div
          className="h-[11px] flex items-center justify-center text-white font-bold tracking-tighter px-0.5 border-b border-black truncate text-[7px]"
          style={{ backgroundColor: ClassName || "#5E6099" }}
        >
          {id}
        </div>

        {/* 2. Строка статусов — только если переданы isManual / isF */}
        {hasStatusRow && (
          <div className="h-[10px] grid grid-cols-5 border-b border-black divide-x divide-black text-center font-bold text-[7px]">
            
            {/* Пустые ячейки / разделители */}
            <div className="grid grid-rows-2 divide-y divide-black">
              <div className="bg-[#D9D9D9]" />
              <div className="bg-[#D9D9D9]" />
            </div>
            <div className="bg-[#D9D9D9]" />

            {/* Режим M / A */}
            <div
              className={`flex items-center justify-center transition-colors ${
                isManual ? "bg-[#D9D9D9]" : "bg-[#03FD07]"
              }`}
            >
              {isManual ? "M" : "A"}
            </div>

            {/* Статус I */}
            <div className="flex items-center justify-center bg-[#D9D9D9]">I</div>

            {/* Флаг аварии F */}
            <div
              className={`flex items-center justify-center bg-[#D9D9D9] ${
                isF ? "text-red-600 font-black" : ""
              }`}
            >
              {isF ? "F" : ""}
            </div>
          </div>
        )}

        {/* 3. Нижний блок значений (Полный vs Компактный) */}
        {hasStatusRow ? (
          /* Полный вид: значение заданное/текущее + единица измерения */
          <div className="flex-1 grid grid-cols-2 gap-[1px]">
            <div className="flex flex-col justify-between">
              <div className="h-[9px] bg-white border-b border-r border-black flex items-center px-0.5 font-bold text-black text-[7px]">
                {value}
              </div>
              <div className="h-[9px] flex items-center px-0.5 font-bold text-[#15008C] text-[7px]">
                {value}
              </div>
            </div>
            <div className="flex items-end justify-center pb-0.5 text-[8px] font-semibold text-black overflow-hidden">
              {unit}
            </div>
          </div>
        ) : (
          /* Компактный вид: одно большое значение + единица снизу */
          <div className="flex-1 flex flex-col bg-white">
            <div
              className="flex-1 flex items-center justify-center"
              style={{ backgroundColor: valueColor }}
            >
              <span className="text-[10px] font-bold leading-none">{value}</span>
            </div>
            {unit !== undefined && (
              <div className="flex-1 flex items-center justify-center text-[8px] font-semibold text-black leading-none border-t border-black">
                {unit}
              </div>
            )}
          </div>
        )}
      </div>

        {open && <PopUp onClose={() => setOpen(false)} />}
    </div>
  );
};