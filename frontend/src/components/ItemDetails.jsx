import { useLocation, useNavigate } from "react-router-dom";
import {
  CalendarBlank,
  MapPin,
  ArrowLeft,
  Phone,
  FileText,
} from "@phosphor-icons/react";
import defaultItem from "../assets/default-item.png";

export default function ItemDetails() {
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

  return (
    <div className="min-h-screen bg-(--bg) px-4 py-8 mt-15">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={20} />
          Back to Profile
        </button>

        {/* Item details card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-8">
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
                className="w-full h-full object-contain rotate-323"
              />
            </div>

            {/* Item information */}
            <div className="flex flex-col gap-5">
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    isLost
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {item.type}
                </span>

                <h1 className="text-3xl font-bold text-gray-900 mt-3">
                  {item.title}
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
                  <p>{item.contact || "Contact information unavailable"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-900">
            {isLost
              ? "If you have found this item, please contact the owner using the details above."
              : "If this item belongs to you, please contact the person who reported it found."}
          </div>
        </div>
      </div>
    </div>
  );
}
