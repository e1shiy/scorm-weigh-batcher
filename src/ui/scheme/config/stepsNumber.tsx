export const MARKERS = [
{ id: 1, left: 228, top: 549 },
  { id: 2, left: 166, top: 549 },
  { id: 3, left: 102, top: 549 },
  { id: 4, left: 452, top: 550 },
  { id: 5, left: 517, top: 550 },
  { id: 6, left: 1088, top: 550 },
  { id: 7, left: 1026, top: 550 },
  { id: 8, left: 962, top: 550 },
  { id: 9, left: 755, top: 601 },
  { id: 10, left: 711, top: 601 },
  { id: 11, left: 360, top: 427 },
  { id: 12, left: 286, top: 427 },
  { id: 13, left: 909, top: 440 },
  { id: 14, left: 788, top: 427 },
  { id: 15, left: 354, top: 320 },
  { id: 16, left: 267, top: 270 },
  { id: 17, left: 718, top: 258 },
  { id: 18, left: 622, top: 210 },
  { id: 19, left: 502, top: 385 },
  { id: 21, left: 974, top: 427 },
  { id: 22, left: 884, top: 349 },
  { id: 23, left: 932, top: 349 },
  { id: 24, left: 980, top: 349 },
  { id: 25, left: 255, top: 167 },
  { id: 26, left: 363, top: 167 },
  { id: 27, left: 72, top: 184 },
  { id: 28, left: 73, top: 245 },
  { id: 29, left: 621, top: 121 },
  { id: 30, left: 511, top: 121 },
  { id: 31, left: 1039, top: 65 },
  { id: 32, left: 1127, top: 154 },
] as const;


export const StepMarker = ({ id }: { id: number }) => (
  <div className="box-border flex h-[10px] w-[11px] items-center justify-center rounded-[2px] border border-black bg-white text-center font-['Inter'] text-[7px] font-medium leading-[8px] text-black shadow-[2px_2px_4px_rgba(0,0,0,0.25)]">
    {id}
  </div>
);
