export const P2K9Badge = ({ name }: { name: string }) => (
  <div className="w-[45px] h-[20px] flex flex-col border-[1px] border-black">
    <div className="w-[43px] h-[9px] flex items-center justify-center bg-[#29A6A0] border-b-[1px] border-black text-[7px] font-medium text-white">
      {name}
    </div>
    <div className="w-[43px] h-[9px] flex items-center justify-center bg-[#D9D9D9]">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.1" width="9" height="9" rx="1" ry="1" fill="#D9D9D9" stroke="black" strokeWidth="0.7" />
      </svg>
    </div>
  </div>
);