export interface KlapanProps {
  id: string;                      
  isE?: boolean;                   // true — горизонтальный (E), false — вертикальный (I)
  isManual?: boolean;              // true — Ручной (M), false — Автомат (A)
  value: number;         
  onClick?: () => void;
}


export interface PanelProps {
  id: string;
  ClassName?: string;   //цвет шапки
  valueColor?: string;        //цвет фона со значением
  value: number | string;       
  unit?: string;                // единицы измерения
  isManual?: boolean;           // true — Ручной (M), false — Автомат (A)
  isF?: boolean;                // true — появляется красная F
  onClick?: () => void;
}