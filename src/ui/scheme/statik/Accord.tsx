export const AccordItem = ({ name }: { name: string }) => (
  <div className="flex w-[65px] h-[14px] items-center justify-between border bg-[#FFFFFF] border-black rounded-[1px] px-[1px] font-medium">
    {/* Текстовая плашка */}
    <div className="flex w-[50px] h-[10px] items-center justify-center bg-[#D9D9D9] border border-black text-[8px] truncate">
      {name}
    </div>

    {/* Кнопка со стрелочкой */}
    <div className="flex w-[10px] h-[10px] items-center justify-center bg-[#D9D9D9] border border-black shrink-0">
      <svg width="7" height="5" viewBox="0 0 7 5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.353546 0.353554L3.35355 3.35355L6.35355 0.353554" stroke="black" />
      </svg>
    </div>
  </div>
);