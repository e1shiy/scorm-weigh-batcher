import { Kvit_Data } from "./diagramData";

export const Kvit = () =>{
    return(
        <div className="absolute left-[0px] top-[0px] w-[1395px] h-[626px]">
                {Kvit_Data.map((item) => (
                    <div
                        key={item.id}
                        style={{
                        position: "absolute",
                        left: item.x,
                        top: item.y,
                        }}
                    >
                <div className="bg-[#FFFFFF] flex absolute w-[68px] h-[12px] border-[1px] rounded-[1px] border-black font-medium text-[9px] items-center justify-center">Квитировать</div>
            </div>
                ))}
        </div>
    )
}