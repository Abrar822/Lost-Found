import defaultItem from "../assets/default-item.png"
import {
    User,
    CalendarBlankIcon,
    MapPin,
    CaretRight,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    CodeIcon,
} from "@phosphor-icons/react";

export default function SelectLostItem({ lostSelector, setLostSelector }) {
    return (
        <>
            {/* Overlay */}
            <div
                className="overlay absolute inset-0 bg-black/60 z-1"
                onClick={() => {
                    setLostSelector(false)
                }}
            ></div>
            <div className="absolute z-2 bg-(--bg) flex items-center justify-center flex-col w-[calc(100%-60rem)] left-120 top-10">
                <div className="mt-4 font-bold text-xl">
                    Select the item to be reported
                </div>
                <div className="flex items-center justify-start flex-col h-[400px] overflow-auto w-full max-w-[1200px] m-8">
                    <div
                        className="relative box px-4 py-3 rounded-2xl flex gap-8 cursor-pointer transition-colors duration-200 hover:bg-gray-200 group w-130"
                    >
                        <div className="img h-[100px] w-[150px] bg-white rounded-2xl overflow-x-hidden shrink-0 border-solid border-[1px] border-black overflow-hidden flex justify-center items-center">
                            <img
                                className="text-[12px] w-30 h-16 rounded-xl border border-gray-100 rotate-315"
                                src={defaultItem}
                            // alt={item.item_name}
                            />
                        </div>

                        <div className="details flex flex-col justify-center items-start max-w-[90%] overflow-hidden">
                            <div className="item_name font-bold text-[18px] text-black/80 mb-1.5">
                                {/* {item.item_name} */}
                                Smit Suthar
                            </div>
                            <div className="location flex items-center justify-center gap-2 text-slate-900">
                                <MapPin size={16} weight="regular" /> 
                                {/* {item.location} */}
                                Surat
                            </div>
                            <div className="date flex justify-center items-center gap-2 text-slate-900">
                                <CalendarBlankIcon size={16} /> 
                                {/* {formattedDate(item.date)} */}
                                12-10-2025
                            </div>
                        </div>
                        
                    </div>
                    <div
                        className="relative box px-4 py-3 rounded-2xl flex gap-8 cursor-pointer transition-colors duration-200 hover:bg-gray-200 group w-130"
                    >
                        <div className="img h-[100px] w-[150px] bg-white rounded-2xl overflow-x-hidden shrink-0 border-solid border-[1px] border-black overflow-hidden flex justify-center items-center">
                            <img
                                className="text-[12px] w-30 h-16 rounded-xl border border-gray-100 rotate-315"
                                src={defaultItem}
                            // alt={item.item_name}
                            />
                        </div>

                        <div className="details flex flex-col justify-center items-start max-w-[90%] overflow-hidden">
                            <div className="item_name font-bold text-[18px] text-black/80 mb-1.5">
                                {/* {item.item_name} */}
                                Smit Suthar
                            </div>
                            <div className="location flex items-center justify-center gap-2 text-slate-900">
                                <MapPin size={16} weight="regular" /> 
                                {/* {item.location} */}
                                Surat
                            </div>
                            <div className="date flex justify-center items-center gap-2 text-slate-900">
                                <CalendarBlankIcon size={16} /> 
                                {/* {formattedDate(item.date)} */}
                                12-10-2025
                            </div>
                        </div>
                        
                    </div>
                    <div
                        className="relative box px-4 py-3 rounded-2xl flex gap-8 cursor-pointer transition-colors duration-200 hover:bg-gray-200 group w-130"
                    >
                        <div className="img h-[100px] w-[150px] bg-white rounded-2xl overflow-x-hidden shrink-0 border-solid border-[1px] border-black overflow-hidden flex justify-center items-center">
                            <img
                                className="text-[12px] w-30 h-16 rounded-xl border border-gray-100 rotate-315"
                                src={defaultItem}
                            // alt={item.item_name}
                            />
                        </div>

                        <div className="details flex flex-col justify-center items-start max-w-[90%] overflow-hidden">
                            <div className="item_name font-bold text-[18px] text-black/80 mb-1.5">
                                {/* {item.item_name} */}
                                Smit Suthar
                            </div>
                            <div className="location flex items-center justify-center gap-2 text-slate-900">
                                <MapPin size={16} weight="regular" /> 
                                {/* {item.location} */}
                                Surat
                            </div>
                            <div className="date flex justify-center items-center gap-2 text-slate-900">
                                <CalendarBlankIcon size={16} /> 
                                {/* {formattedDate(item.date)} */}
                                12-10-2025
                            </div>
                        </div>
                        
                    </div>
                    <div
                        className="relative box px-4 py-3 rounded-2xl flex gap-8 cursor-pointer transition-colors duration-200 hover:bg-gray-200 group w-130"
                    >
                        <div className="img h-[100px] w-[150px] bg-white rounded-2xl overflow-x-hidden shrink-0 border-solid border-[1px] border-black overflow-hidden flex justify-center items-center">
                            <img
                                className="text-[12px] w-30 h-16 rounded-xl border border-gray-100 rotate-315"
                                src={defaultItem}
                            // alt={item.item_name}
                            />
                        </div>

                        <div className="details flex flex-col justify-center items-start max-w-[90%] overflow-hidden">
                            <div className="item_name font-bold text-[18px] text-black/80 mb-1.5">
                                {/* {item.item_name} */}
                                Smit Suthar
                            </div>
                            <div className="location flex items-center justify-center gap-2 text-slate-900">
                                <MapPin size={16} weight="regular" /> 
                                {/* {item.location} */}
                                Surat
                            </div>
                            <div className="date flex justify-center items-center gap-2 text-slate-900">
                                <CalendarBlankIcon size={16} /> 
                                {/* {formattedDate(item.date)} */}
                                12-10-2025
                            </div>
                        </div>
                        
                    </div>
                    <div
                        className="relative box px-4 py-3 rounded-2xl flex gap-8 cursor-pointer transition-colors duration-200 hover:bg-gray-200 group w-130"
                    >
                        <div className="img h-[100px] w-[150px] bg-white rounded-2xl overflow-x-hidden shrink-0 border-solid border-[1px] border-black overflow-hidden flex justify-center items-center">
                            <img
                                className="text-[12px] w-30 h-16 rounded-xl border border-gray-100 rotate-315"
                                src={defaultItem}
                            // alt={item.item_name}
                            />
                        </div>

                        <div className="details flex flex-col justify-center items-start max-w-[90%] overflow-hidden">
                            <div className="item_name font-bold text-[18px] text-black/80 mb-1.5">
                                {/* {item.item_name} */}
                                Smit Suthar
                            </div>
                            <div className="location flex items-center justify-center gap-2 text-slate-900">
                                <MapPin size={16} weight="regular" /> 
                                {/* {item.location} */}
                                Surat
                            </div>
                            <div className="date flex justify-center items-center gap-2 text-slate-900">
                                <CalendarBlankIcon size={16} /> 
                                {/* {formattedDate(item.date)} */}
                                12-10-2025
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div>
                    <button className="bg-(--green) rounded-lg px-6 py-2 text-white mb-4">
                        Submit Claim Request
                    </button>
                </div>
            </div>
        </>
    )
}