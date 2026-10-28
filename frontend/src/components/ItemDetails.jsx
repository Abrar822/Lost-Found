import { useLocation, useNavigate } from "react-router-dom";
import {
  CalendarBlank,
  MapPin,
  ArrowLeft,
  Phone,
  FileText,
} from "@phosphor-icons/react";
import defaultItem from "../assets/default-item.png";
import { useEffect, useRef, useState } from "react";
import SelectLostItem from "./SelectLostItem";

export default function ItemDetails({lostItems, setAlert, loading, setLoading}) {
  const [lostSelector, setLostSelector] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();
  

  const item = location.state?.item;

  // Handle opening this page without a selected item.
  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Item details are unavailable.</p>

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-lg bg-green-600 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const formattedDate = item.date
    ? new Date(`${item.date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "Date unavailable";

  const isLost = item.type?.toLowerCase() === "lost";


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className=" relative min-h-screen bg-(--bg) px-4 py-8 mt-17.5">

      {lostSelector && <SelectLostItem lostSelector={lostSelector} setLostSelector={setLostSelector} lostItems={lostItems} className="absolute" item={item} loading={loading} setLoading={setLoading} setAlert={setAlert} />}
      
      <div className="relative max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 font-semibold hover:text-gray-600 cursor-pointer"
        >
          <ArrowLeft size={20} />
          {item.title ? <span>Back to Profile</span>: <span>Back to Dashboard</span>}
        </button>

        {/* Item details card */}
        <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-8">
          {!item.title && item.type === 'Found' && item.u_id !== lostItems[0]?.U_id && <div className={`duration-150 ease-in-out active:scale-95 cursor-pointer font-bold absolute claim ${item.type === 'Lost' ? 'bg-(--green)' : 'bg-(--orange)'} right-5 bottom-5 px-4 py-2 rounded-xl text-white ${item.type === 'Lost' ? 'hover:bg-(--green-hover)' : 'hover:bg-(--orange-hover)'}`} onClick={()=> setLostSelector(true)}>Claim</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Item image */}
            <div className="w-full h-64 sm:h-80 border border-gray-300 rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={item.image || defaultItem}
                alt={item.title || "Item image"}
                loading="eager"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultItem;
                }}
                className={`w-full h-full object-contain origin-center ${!item.image ? 'rotate-323': ''}`}
              />
            </div>

            {/* Item information */}
            <div className="flex flex-col gap-5">
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${isLost
                      ? "bg-green-100 text-(--green)"
                      : "bg-orange-100 text-(--orange)"
                    }`}
                >
                  {item.type}
                </span>

                <h1 className="text-3xl font-bold text-gray-900 mt-3">
                  {item.title || item?.item_name}
                </h1>
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <div className="py-1">
                  <CalendarBlank size={26} />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    Date {isLost ? "Lost" : "Found"}
                  </p>
                  <p>{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <div className="py-1">
                  <MapPin size={26} />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">Location</p>
                  <p>{item.location || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <div className="py-1">
                  <FileText size={26} />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">Description</p>
                  <p>{item.description || "No description available"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <div className="py-1">
                  <Phone size={26} />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">Contact</p>
                  <p>{item.contact || item.phone_no || "Contact information unavailable"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
