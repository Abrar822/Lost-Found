import { useLocation, useNavigate } from "react-router-dom";
import {
  CalendarBlank,
  MapPin,
  ArrowLeft,
  Phone,
  FileText,
} from "@phosphor-icons/react";
import defaultItem from "../assets/default-item.png";
import { useEffect, useState } from "react";

export default function ClaimRequests() {
  const [lostSelector, setLostSelector] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const item = location.state?.item;

  // Handle opening this page without a selected item.
  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Details are unavailable.</p>

        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-lg bg-green-600 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const formattedDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className=" relative min-h-screen bg-(--bg) px-4 py-8 mt-17.5">

      <div className="relative max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 font-semibold hover:text-gray-600 cursor-pointer"
        >
          <ArrowLeft size={20} />
            <span>Back to Profile</span>
        </button>

        {/* Item details card */}
        <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-8">
            <div
            className={`duration-150 ease-in-out active:scale-95 cursor-pointer font-bold absolute claim bg-(--orange) right-5 bottom-5 px-4 py-2 rounded-xl text-white hover:bg-(--orange-hover)`}
            >
            Claim
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Item image */}
            <div className="w-full h-64 sm:h-80 border border-gray-300 rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={defaultItem}
                alt={"Item image"}
                loading="eager"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultItem;
                }}
                className={`w-full h-full object-contain origin-center rotate-323`}
              />
            </div>

            {/* Item information */}
            <div className="flex flex-col gap-5">
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-(--orange)`}
                >
                  Lost
                </span>

                <h1 className="text-3xl font-bold text-gray-900 mt-3">
                  I Phone S165
                </h1>
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <div className="py-1">
                  <CalendarBlank size={26} />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    Date Lost
                  </p>
                  <p>16 Oct 2026</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <div className="py-1">
                  <MapPin size={26} />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">Location</p>
                  <p>{"Not provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <div className="py-1">
                  <FileText size={26} />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">Description</p>
                  <p>{"No description available"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <div className="py-1">
                  <Phone size={26} />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">Contact</p>
                  <p>
                    {"Contact information unavailable"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
