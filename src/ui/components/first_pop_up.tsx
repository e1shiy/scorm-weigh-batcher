import React from "react";


const Body_svg = () => (
  <svg width="74" height="110" viewBox="0 0 74 120" className="block">
    {/* Круг 40x40 (r = 19.4 + обводка 1.2 = ровно 40px) */}
    <circle cx="37" cy="20" r="19.4" fill="#76EE82" stroke="black" strokeWidth="1.2" />
    <polygon
      points="27,16 36.7,16 36.7,11 47,20 36.7,29 36.7,24 27,24"
      fill="white"
      stroke="black"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />

    {/* Маленький серый индикатор */}
    <circle cx="5" cy="47" r="4" fill="#D9D9D9" stroke="black" strokeWidth="1.2" />

    {/* Четыре серых блока 74x12 (шаг 17px) */}
    <rect x="0.6" y="56.6" width="72.8" height="10.8" fill="#C8C8C8" stroke="black" strokeWidth="1.2" />
    <rect x="0.6" y="73.6" width="72.8" height="10.8" fill="#C8C8C8" stroke="black" strokeWidth="1.2" />
    <rect x="0.6" y="90.6" width="72.8" height="10.8" fill="#C8C8C8" stroke="black" strokeWidth="1.2" />
    <rect x="0.6" y="107.6" width="72.8" height="10.8" fill="#C8C8C8" stroke="black" strokeWidth="1.2" />
  </svg>
);

const Header_svg = () => {
  // 14 квадратов: ширина 9px, шаг 9.8px (от x=1.5 до x=138.9)
  const squareXs = Array.from({ length: 14 }, (_, i) => 1.5 + i * 9.8);
  const sqY = 7; // Подняли на 4px выше (было 11)

  return (
    <svg
      viewBox="0 0 234 22"
      className="w-full h-full block select-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Фон всей панели */}
      <rect width="234" height="22" fill="#D4D4D4" />

      {/* Горизонтальные линии-разделители */}
      <line x1="0" y1="21.5" x2="140" y2="21.5" stroke="#000000" strokeWidth="1" />
      <line x1="196" y1="16.5" x2="206" y2="16.5" stroke="#000000" strokeWidth="1" />

      {/* --- 14 индикаторов слева (подняты на y=7) --- */}
      {squareXs.map((x, idx) => {
        if (idx === 4) {
          // Квадрат 5: P (Бирюзовый)
          return (
            <g key={idx}>
              <rect x={x} y={sqY} width="9" height="9" fill="#148B85" stroke="#000000" strokeWidth="0.8" />
              <text
                x={x + 4.5}
                y={sqY + 7.2}
                fill="#FFFFFF"
                fontSize="7.5"
                fontWeight="900"
                fontFamily="Arial, sans-serif"
                textAnchor="middle"
              >
                P
              </text>
            </g>
          );
        }

        if (idx === 5) {
          // Квадрат 6: Замок
          return (
            <g key={idx}>
              <rect x={x} y={sqY} width="9" height="9" fill="#C4C4C4" stroke="#000000" strokeWidth="0.8" />
              <path
                d={`M${x + 2.8} ${sqY + 3.5} V${sqY + 2.3} C${x + 2.8} ${sqY + 1} ${x + 6.2} ${sqY + 1} ${x + 6.2} ${sqY + 2.3} V${sqY + 3.5}`}
                stroke="#888888"
                strokeWidth="0.9"
                fill="none"
              />
              <rect x={x + 2.2} y={sqY + 3.5} width="4.6" height="4" fill="#9E9E9E" stroke="#555555" strokeWidth="0.5" />
            </g>
          );
        }

        if (idx === 7) {
          // Квадрат 8: Ромб (Force / Simulation)
          return (
            <g key={idx}>
              <rect x={x} y={sqY} width="9" height="9" fill="#C4C4C4" stroke="#000000" strokeWidth="0.8" />
              <polygon
                points={`${x + 4.5},${sqY + 1.5} ${x + 7.2},${sqY + 4.5} ${x + 4.5},${sqY + 7.5} ${x + 1.8},${sqY + 4.5}`}
                fill="#DCDCDC"
                stroke="#666666"
                strokeWidth="0.8"
              />
            </g>
          );
        }

        // Обычные серые ячейки с эффектом углубления
        return (
          <g key={idx}>
            <rect x={x} y={sqY} width="9" height="9" fill="#C8C8C8" stroke="#000000" strokeWidth="0.8" />
            <line x1={x + 0.5} y1={sqY + 0.5} x2={x + 8.2} y2={sqY + 0.5} stroke="#858585" strokeWidth="0.8" />
            <line x1={x + 0.5} y1={sqY + 0.5} x2={x + 0.5} y2={sqY + 8.2} stroke="#858585" strokeWidth="0.8" />
          </g>
        );
      })}

      {/* --- Блок из 4 кнопок видов (каждая ширина 14px, высота 21px) --- */}
      <g>
        {/* Кнопка 1: Домик (x=140..154) */}
        <rect x="140" y="0.5" width="14" height="21" rx="0.5" fill="#D4D4D4" stroke="#000000" strokeWidth="1" />
        <polygon points="147,5.5 142.5,10.8 151.5,10.8" fill="#FFE600" stroke="#000000" strokeWidth="0.9" strokeLinejoin="round" />
        <rect x="143.5" y="10.8" width="7" height="6.5" fill="#FFFFFF" stroke="#000000" strokeWidth="0.9" />
        <rect x="146" y="12.8" width="2" height="4.5" fill="#000000" />

        {/* Кнопка 2: Свиток / Аварии (x=154..168) */}
        <rect x="154" y="0.5" width="14" height="21" rx="0.5" fill="#D4D4D4" stroke="#000000" strokeWidth="1" />
        <path
          d="M164 4.5 H158 C157 6 156 8 157 9.8 C158 11.5 158.5 13.5 157.5 15.2 C157 16 156.5 16.8 156 18 H163 C164.3 16.5 165 14.5 164 12.5 C163.3 11 163.5 9 164.5 7.5 Z"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="0.9"
        />
        <line x1="159" y1="8" x2="162.5" y2="8" stroke="#000000" strokeWidth="0.6" />
        <line x1="159.5" y1="10" x2="163" y2="10" stroke="#000000" strokeWidth="0.6" />
        <line x1="160" y1="12" x2="163.5" y2="12" stroke="#000000" strokeWidth="0.6" />
        <line x1="159.5" y1="14" x2="163" y2="14" stroke="#000000" strokeWidth="0.6" />
        <line x1="158.5" y1="16" x2="162" y2="16" stroke="#000000" strokeWidth="0.6" />
        <polygon points="156.5,4.5 160,4.5 158,7 156.5,5.5" fill="#FF6600" />

        {/* Кнопка 3: Шкала / Параметры (x=168..182) */}
        <rect x="168" y="0.5" width="14" height="21" rx="0.5" fill="#D4D4D4" stroke="#000000" strokeWidth="1" />
        <polygon points="171.5,5.5 173.5,8 169.5,8" fill="#1C18D4" />
        <polygon points="171.5,17 173.5,14.5 169.5,14.5" fill="#1C18D4" />
        <rect x="174.5" y="5.5" width="4.5" height="11.5" rx="0.5" fill="#FFE600" stroke="#000000" strokeWidth="0.7" />
        <line x1="176" y1="7.5" x2="178" y2="7.5" stroke="#000000" strokeWidth="0.5" />
        <line x1="176" y1="11.2" x2="178" y2="11.2" stroke="#000000" strokeWidth="0.5" />
        <line x1="176" y1="15" x2="178" y2="15" stroke="#000000" strokeWidth="0.5" />

        {/* Кнопка 4: График (x=182..196) */}
        <rect x="182" y="0.5" width="14" height="21" rx="0.5" fill="#D4D4D4" stroke="#000000" strokeWidth="1" />
        <rect x="184.2" y="5.5" width="9.5" height="11.5" fill="#FFFFFF" stroke="#000000" strokeWidth="0.8" />
        <path d="M184.8 12 L186.2 9.5 L187.8 11 L189.8 7 L192.8 11" stroke="#FF0000" strokeWidth="0.9" fill="none" strokeLinejoin="round" />
        <path d="M184.8 15.5 L186.8 14 L188.8 15.5 L190.8 13 L192.8 14.5" stroke="#000000" strokeWidth="0.9" fill="none" strokeLinejoin="round" />
      </g>

      {/* --- Кнопка "..." на всю ширину (x=196..220, ширина 24px) --- */}
      <rect x="196" y="0.5" width="24" height="21" rx="0.5" fill="#D4D4D4" stroke="#000000" strokeWidth="1" />
      <circle cx="204.5" cy="11" r="0.75" fill="#000000" />
      <circle cx="208"   cy="11" r="0.75" fill="#000000" />
      <circle cx="211.5" cy="11" r="0.75" fill="#000000" />

      {/* --- Две кнопки справа (x=220..233.5) --- */}
      {/* Верхняя: Рупор / Гудок */}
      <rect x="220" y="0.5" width="13.5" height="10" rx="0.5" fill="#D4D4D4" stroke="#000000" strokeWidth="1" />
      <path d="M223 5 H224.5 L227 3.5 V7.5 L224.5 6 H223 Z" fill="#000000" stroke="#000000" strokeWidth="0.4" />
      <line x1="228.5" y1="4" x2="228.5" y2="7" stroke="#000000" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="230" y1="4.8" x2="230" y2="6.2" stroke="#000000" strokeWidth="0.8" strokeLinecap="round" />

      {/* Нижняя: Сброс (Розовая стрелка) */}
      <rect x="220" y="10.5" width="13.5" height="11" rx="0.5" fill="#D4D4D4" stroke="#000000" strokeWidth="1" />
      <path
        d="M228.5 18 C226 18 224 16.5 224 14.5 C224 12.5 226 13 228 13 C229.5 13 230.5 14 230.5 15.5 C230.5 17 229.5 18 228 18"
        stroke="#CE00BA"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <polygon points="229,17 227.5,19 230.5,19" fill="#CE00BA" />
    </svg>
  );
};


export const PopUp = ({ onClose }: { onClose: () => void }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="h-[158px] w-[236px] border border-black bg-[#D9D9D9]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-[23px]"><Header_svg></Header_svg></div>
        <div className="grid pt-6px grid-cols-3">
          <div className="pt-[6px] pl-[3px] 1-fr">
            <Body_svg></Body_svg>
          </div>
          <div className="2-fr flex inline">
            <div className="text-[8px] pl-[5px] pt-[10px] ">Режим</div>
          </div>
        </div>
      </div>
    </div>
  );
};
    
  

