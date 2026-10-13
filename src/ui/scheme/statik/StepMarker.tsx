export const StepMarker = ({ id }: { id: number }) => (
  <div className="box-border flex h-2.5 w-2.75 items-center justify-center rounded-xs border border-black bg-white text-center font-['Inter'] text-[7px] font-medium leading-2 text-black shadow-[2px_2px_4px_rgba(0,0,0,0.25)]">
    {id}
  </div>
)
