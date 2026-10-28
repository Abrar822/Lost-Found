
import { useNavigate } from "react-router-dom";
import {
  CalendarBlank,
  MapPin,
  ArrowLeft,
  Phone,
  FileText,
  UserCircle,
  EnvelopeSimple,
} from "@phosphor-icons/react";
import defaultItem from "../assets/default-item.png";
import { useEffect } from "react";

export default function ClaimRequests({ claimDetail }) {
  const navigate = useNavigate();

  // Read data from the claimDetail prop
  const user = claimDetail?.user ?? {};
  const lostItem = claimDetail?.lost_item ?? {};
  const foundItem = claimDetail?.found_item ?? {};

  const formattedDate = (date) => {
    if (!date) return "Not provided";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const Detail = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 text-gray-600">
      <div className="py-1 shrink-0">
        <Icon size={24} />
      </div>

      <div className="min-w-0">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="break-words">{value || "Not provided"}</p>
      </div>
    </div>
  );

  const ItemSection = ({ title, item, dateLabel, dateField }) => (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item image */}
        <div className="w-full h-56 sm:h-64 border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50">
          <img
            src={item.Image_Upload || defaultItem}
            alt={item.Item_Name || "Item"}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultItem;
            }}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Item information */}
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl font-bold text-gray-900">
            {item.Item_Name || "Item details unavailable"}
          </h3>

          <Detail
            icon={CalendarBlank}
            label={dateLabel}
            value={formattedDate(item[dateField])}
          />

          <Detail
            icon={MapPin}
            label="Location"
            value={item.Location_Lost}
          />

          <Detail
            icon={FileText}
            label="Description"
            value={item.Description}
          />

          
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-(--bg) px-4 py-8 mt-17.5">
      <div className="max-w-5xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 font-semibold hover:text-gray-600 cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span>Back to Profile</span>
        </button>

        <div className="flex flex-col gap-6">

          {/* 1. User details */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Claimer Details
            </h2>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <UserCircle
                  size={48}
                  className="text-(--orange)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1 w-full">
                <Detail
                  icon={UserCircle}
                  label="Full Name"
                  value={user.Name}
                />

                <Detail
                  icon={EnvelopeSimple}
                  label="Email"
                  value={user.Email}
                />

                <Detail
                  icon={Phone}
                  label="Contact"
                  value={user.Phone_Number}
                />
              </div>
            </div>
          </section>

          {/* 2. Lost item details */}
          <ItemSection
            title="Lost Item Details"
            item={lostItem}
            dateLabel="Date Lost"
            dateField="Date_Lost"
          />

          {/* 3. Found item details */}
          <ItemSection
            title="Found Item Details"
            item={foundItem}
            dateLabel="Date Found"
            dateField="Date_Found"
          />

        </div>
      </div>
    </div>
  );
}
