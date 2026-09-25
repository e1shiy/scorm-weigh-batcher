import React from "react";


export interface BluePanelProps {
    id: string;
    value: number | string;
    onClick?: () => void;
    unit?: string;
    headerColor?: string ;
}

export const BluePanel: React.FC<{ data: BluePanelProps }> = ({ data }) => {
    return (
        <div className="inline-flex flex-col w-[44px] h-[32px] border border-black shadow-sm font-sans select-none bg-white cursor-pointer">
            {/* Id */}
            <div className="flex-1 flex items-center text-white text-[8px] font-semibold text-center border-b border-black truncate"
                 style={{ backgroundColor: data.headerColor ?? '#5c5e93' }}>
                {data.id}
            </div>
            {/* Значение */}
            <div className="flex-1 flex bg-white text-black items-center text-[8px] font-bold text-center border-b border-black leading-tight">
                {data.value}
            </div>
            {/* Единица измерения (если есть) */}
            <div className="flex-1 flex bg-[#d4d4d8] items-center text-[8px] text-zinc-700 text-center">
                {data.unit ?? ''}
            </div>

        </div>
    );
}
