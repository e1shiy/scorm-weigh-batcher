import React from "react";
import type { KlapanProps } from '../../types';

// 1. Единый базовый квадратик (E, I, M/A)
const StatusBadge = ({ label, bg, text = "text-black" }: { label: string; bg: string; text?: string }) => (
  <div className={`w-[11px] h-[11px] border border-black font-bold text-[7.5px] flex items-center justify-center leading-none select-none ${bg} ${text}`}>
    {label}
  </div>
);

// 2. Вынесенные иконки клапанов (чтобы не забивать разметку)
const ValveIconHorizontal = () => (
  <svg width="26" height="16" viewBox="0 0 26 16" className="block">
    <polygon points="1,1 1,15 13,8" fill="#76EE82" stroke="black" strokeWidth="1.2" strokeLinejoin="round" />
    <polygon points="25,1 25,15 13,8" fill="#76EE82" stroke="black" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

const ValveIconVertical = () => (
  <svg width="16" height="26" viewBox="0 0 16 26" className="block">
    <polygon points="1,1 15,1 8,13" fill="#76EE82" stroke="black" strokeWidth="1.2" strokeLinejoin="round" />
    <polygon points="1,25 15,25 8,13" fill="#76EE82" stroke="black" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

// 3. Основной компонент
export const Klapan = ({id, isE, isManual, value, onClick}: KlapanProps) => {
  // Общие шильдики
  const tagBadge = (
    <div className="bg-[#1E7E24] text-white border border-black font-bold text-[8px] h-[12px] px-1 flex items-center justify-center tracking-tight leading-none truncate">
      {id}
    </div>
  );

  const valueBadge = (
    <div className="border border-black bg-[#D9D9D9] p-[1px] flex items-center gap-[2px] leading-none h-[15px]">
      <div className="bg-white border border-black px-1 h-[11px] flex items-center justify-center font-bold text-[8px] text-black min-w-[24px]">
        {value}
      </div>
      <span className="text-[8px] font-bold text-black pr-0.5 select-none">%</span>
    </div>
  );

  const modeBadge = (
    <StatusBadge
      label={isManual ? "M" : "A"}
      bg={isManual ? "bg-[#D9D9D9]" : "bg-[#03FD07]"}
    />
  );

  return (
    <div onClick={onClick} className="inline-block select-none font-sans cursor-pointer hover:opacity-90">
      {isE ? (
        /* ГОРИЗОНТАЛЬНЫЙ ВИД */
        <div className="flex flex-col items-center gap-[1.5px]">
          {tagBadge}
          <div className="flex items-center gap-[2px]">
            <StatusBadge label="E" bg="bg-[#004CB7]" text="text-white" />
            <ValveIconHorizontal />
            {modeBadge}
          </div>
          {valueBadge}
        </div>
      ) : (
        /* ВЕРТИКАЛЬНЫЙ ВИД */
        <div className="flex items-start gap-[1.5px]">
          <StatusBadge label="I" bg="bg-[#D9D9D9]" />
          <ValveIconVertical />
          <div className="flex flex-col items-start gap-[1px]">
            {modeBadge}
            {valueBadge}
            {tagBadge}
          </div>
        </div>
      )}
    </div>
  );
}