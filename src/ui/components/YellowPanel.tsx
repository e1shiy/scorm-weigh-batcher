import React from "react";

export interface YellowPanelProps {
  id: string;              
  upValue?: number | string;
  value: number | string; // Текущее значение (синее снизу)
  unit?: string;            
  isManual?: boolean;     
  isF?: boolean;   
  headerColor?: string; 
  onClick?: () => void;
}

export const YellowPanel: React.FC<{ data: YellowPanelProps }> = ({ data }) => {
  return (
    <div className="inline-flex flex-col w-[52px] h-[43px] border border-black bg-[#D9D9D9] font-sans select-none text-[8px] leading-none cursor-pointer">
      
      {/* 1. Шапка с ID */}
      <div 
        className="h-[11px] flex items-center justify-center text-white font-bold tracking-tighter px-0.5 border-b border-black truncate text-[7px]"
        style={{ backgroundColor: data.headerColor || "#C59028" }}
      >
        {data.id}
      </div>

      {/* 2. Строка статусов (5 индикаторов) */}
      <div className="h-[10px] grid grid-cols-5 border-b border-black divide-x divide-black text-center font-bold text-[7px]">
        {/* 1-я ячейка (разделена пополам по строкам) */}
        <div className="grid grid-rows-2 divide-y divide-black">
          <div className="bg-[#D9D9D9]" />
          <div className="bg-[#D9D9D9]" />
        </div>

        {/* 2-я ячейка */}
        <div className="bg-[#D9D9D9]" />

        {/* 3-я ячейка (M/A: Ручной / Автомат) */}
        <div 
          className="flex items-center justify-center transition-colors"
          style={{ backgroundColor: data.isManual ? "#D9D9D9" : "#03FD07" }}
        >
          {data.isManual ? "M" : "A"}
        </div>

        {/* 4-я ячейка (I) */}
        <div className="flex items-center justify-center bg-[#D9D9D9]">
          I
        </div>

        {/* 5-я ячейка (F - ошибка/авария) */}
        <div className={`flex items-center justify-center bg-[#D9D9D9] ${data.isF ? "text-red-600 font-black" : ""}`}>
          {data.isF ? "F" : ""}
        </div>
      </div>

      {/* 3 и 4. Рабочая зона (Уставка + Измерение + Единицы) */}
      <div className="flex-1 grid grid-cols-2 p-[1px] gap-[1px]">
        {/* Левая колонка со значениями */}
        <div className="flex flex-col justify-between">
          {/* Уставка (up) в белой рамочке */}
          <div className="h-[9px] bg-white border border-black flex items-center px-0.5 font-bold text-black text-[7px]">
            {data.upValue ?? ""}
          </div>

          {/* Текущее значение (down) синим цветом */}
          <div className="h-[9px] flex items-center px-0.5 font-bold text-[#15008C] text-[7px]">
            {data.value ?? ""}
          </div>
        </div>

        {/* Правая колонка с единицами измерения */}
        <div className="flex items-end justify-center pb-0.5 text-[8px] font-semibold text-black overflow-hidden">
          {data.unit ?? ""}
        </div>
      </div>
    </div>
  );
};
