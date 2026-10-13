import { P2k9_DATA } from "./diagramData";

export const P2K9 = () =>{
    return(
        <div className="absolute left-[0px] top-[0px] w-[1395px] h-[626px]">
                {P2k9_DATA.map((item) => (
                    <div
                        key={item.id}
                        style={{
                        position: "absolute",
                        left: item.x,
                        top: item.y,
                        }}
                    >
                <div className="w-[45px] h-[20px] flex flex-col border-[1px] border-black">
                        <div className="w-[43px] h-[9px] flex items-center justify-center bg-[#29A6A0] border-b-[1px] border-black text-[7px] font-medium text-white">
                            {item.name}
                        </div>
                        <div className="w-[43px] h-[9px] flex items-center justify-center bg-[#D9D9D9]">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0" width="9" height="9" rx="1" ry="1" fill="#D9D9D9" stroke="black"/>
                            </svg>
                        </div>
                </div>
            </div>
                ))}
        </div>
    )
}