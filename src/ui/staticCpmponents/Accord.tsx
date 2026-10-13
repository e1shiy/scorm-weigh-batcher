import {Accord_Data} from "./diagramData";

export const Accord = () =>{
    return(
        <div className="absolute left-[0px] top-[0px] w-[1395px] h-[626px]">
                {Accord_Data.map((item) => (
                    <div
                        key={item.id}
                        style={{ left: item.x, top: item.y }}
                    >
                        <div 
                        className="absolute flex w-[65px] h-[14px] items-center justify-between border bg-[#FFFFFF] border-black rounded-[1px] px-[1px] font-medium"
                        style={{ left: item.x, top: item.y }} // если координаты динамические
                        >
                        {/* Текстовая плашка */}
                        <div className="flex w-[50px] h-[10px] items-center justify-center bg-[#D9D9D9] border border-black text-[8px] truncate">
                            {item.name}
                        </div>

                        {/* Кнопка со стрелочкой */}
                        <div className="flex w-[10px] h-[10px] items-center justify-center bg-[#D9D9D9] border border-black shrink-0">
                            <svg width="7" height="5" viewBox="0 0 7 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.353546 0.353554L3.35355 3.35355L6.35355 0.353554" stroke="black" />
                            </svg>
                        </div>
                        </div>
                    </div>
                ))}
        </div>
    )
}