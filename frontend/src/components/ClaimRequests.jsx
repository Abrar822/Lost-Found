
import { useLocation, useNavigate } from "react-router-dom";
import {
  CalendarBlank,
  MapPin,
  ArrowLeft,
  Phone,
  FileText,
  UserCircle,
  EnvelopeSimple,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react";
import defaultItem from "../assets/default-item.png";
import { useEffect } from "react";

export default function ClaimRequests() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user = {},
    lostItem = {},
    foundItem = {},
  } = location.state || {};

  const formattedDate = (date) => {
    if (!date) return "Not provided";

    const parsedDate = new Date(date);

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

  const handleApprove = () => {
    // TODO: Call your FastAPI approve-claim endpoint.
    console.log("Approve claim", {
      user,
      lostItem,
      foundItem,
    });
  };

  const handleReject = () => {
    // TODO: Call your FastAPI reject-claim endpoint.
    console.log("Reject claim", {
      user,
      lostItem,
      foundItem,
    });
  };

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

  const ItemSection = ({ title, item, dateLabel }) => (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full h-56 sm:h-64 border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50">
          <img
            src={item.image || defaultItem}
            alt={item.title || "Item"}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultItem;
            }}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {item.title || item.item_name || "Item details unavailable"}
            </h3>
          </div>

          <Detail
            icon={CalendarBlank}
            label={dateLabel}
            value={formattedDate(item.date)}
          />

          <Detail
            icon={MapPin}
            label="Location"
            value={item.location}
          />

          <Detail
            icon={FileText}
            label="Description"
            value={item.description}
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
          {/* 1. Claimant / User Details */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              User Details
            </h2>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <UserCircle size={48} className="text-(--orange)" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1 w-full">
                <Detail
                  icon={UserCircle}
                  label="Full Name"
                  value={user.name || user.full_name || user.username}
                />

                <Detail
                  icon={EnvelopeSimple}
                  label="Email"
                  value={user.email}
                />

                <Detail
                  icon={Phone}
                  label="Contact"
                  value={user.phone || user.contact}
                />

              </div>
            </div>
          </section>

          {/* 2. Lost Item Details */}
          <ItemSection
            title="Lost Item Details"
            item={lostItem}
            dateLabel="Date Lost"
          />

          {/* 3. Found Item Details */}
          <ItemSection
            title="Found Item Details"
            item={foundItem}
            dateLabel="Date Found"
          />

          {/* 4. Approve / Reject */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Review Claim Request
            </h2>

            <p className="text-gray-600 mb-5">
              Review the claimant and both items before making a decision.
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={handleReject}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-colors"
              >
                <XCircle size={20} />
                Reject
              </button>

              <button
                onClick={handleApprove}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
              >
                <CheckCircle size={20} />
                Approve
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
