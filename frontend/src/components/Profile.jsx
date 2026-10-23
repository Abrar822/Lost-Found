import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultItem from "../assets/default-item.png";
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
import { getUserDetails, updateUserDetails } from "../api/ProfileApi";

export default function Profile({
  userData,
  setUserData,
  lostItems,
  foundItems,
  itemsLoading,
  itemsError,
  editData,
  setEditData
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("lost");
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      const updatedUser = await updateUserDetails(editData);

      // Update the displayed profile using the API response.
      const user = {
        name: updatedUser.Name ?? editData.name,
        email: updatedUser.Email ?? editData.email,
        phone_number: updatedUser.Phone_Number ?? editData.phone_number,
        code: updatedUser.Code ?? editData.code,
      };

      setUserData(user);
      setEditData(user);
      setEdit(false);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const onChangeEditFormData = (event) => {
    setEditData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const currentItems = activeTab === "lost" ? lostItems : foundItems;
  console.log("Lost items:", lostItems);
  console.log("Found items:", foundItems);

  return (
    <>
      {/* Overlay: closes the edit form when clicked */}

      {edit && (
        <div
          className="overlay absolute inset-0 bg-black/60 z-1"
          onClick={() => {
            setEditData({ ...userData });
            setEdit(false);
          }}
        />
      )}

      <div className="relative min-h-screen flex justify-start py-10 px-10 mt-15 bg-(--bg  )">
        <div className="w-full max-w rounded-2xl px-8 py-2 mx-20">
          {/* Header */}
          <h1 className="text-4xl font-bold text-[#1e293b] mb-8">Profile</h1>

          {/* User Info Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex items-center gap-6">
              <div
                onClick={() => setActiveTab("lost")}
                className={`w-24 h-24 rounded-full 
            flex items-center justify-center text-white shadow-md ${activeTab === "lost" ? "bg-(--green)" : "bg-[#B47B27]"
                  }`}
              >
                <User size={48} weight="fill" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {userData.name}
                </h2>
                <p className="text-slate-700 mt-1 text-sm sm:text-base">
                  {userData.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => setEdit(true)}
              className={`border-2 border-indigo-100 font-bold 
          px-6 py-2 rounded-lg transition-colors duration-200 cursor-pointer
          ${activeTab === "found"
                  ? "bg-(--orange) text-(--pure-white) hover:bg-(--orange-hover)"
                  : "bg-(--green) text-(--pure-white) hover:bg-(--green-hover)"
                }`}
            >
              Edit Profile
            </button>
          </div>

          {/* My Posts Section */}
          <div className="bg-white p-5 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Posts</h2>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("lost")}
                className={`flex-1 pb-3 pt-2 text-center text-sm sm:text-base rounded-tl-lg font-bold transition-colors ${activeTab === "lost"
                    ? "bg-(--green) text-(--pure-white) hover:bg-(--green-hover)"
                    : "text--(--text-1)"
                  }`}
              >
                Lost Items
              </button>
              <button
                onClick={() => setActiveTab("found")}
                className={`flex-1 pb-1 text-center text-sm sm:text-base rounded-tr-lg font-bold transition-colors ${activeTab === "found"
                    ? "bg-(--orange) text-(--pure-white) hover:bg-(--orange-hover)"
                    : "text--(--text-1)"
                  }`}
              >
                Found Items
              </button>
            </div>

            {/* Items List */}
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto overflow-x-hidden pr-2">
              {itemsLoading ? (
                <div className="text-center py-10 text-gray-400">
                  Loading {activeTab} items...
                </div>
              ) : itemsError ? (
                <div className="text-center py-10 text-red-500">
                  {itemsError}
                </div>
              ) : currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    onClick={() =>
                      navigate("/item-details", {
                        state: { item },
                      })
                    }
                    className="flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      {/* Item Image */}
                      <div className="flex border items-center justify-center h-20 overflow-hidden rounded-lg">
                        <img
                          src={item.image || defaultItem}
                          alt={item.title || "Item image"}
                          loading="eager"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = defaultItem;
                          }}
                          className="w-30 h-16 rounded-xl border border-gray-100 rotate-315"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900 text-xl sm:text-lg">
                            {item.title}
                          </h3>
                          <span
                            className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md ${item.type === "Lost"
                                ? "bg-green-100 text-(--green)"
                                : "bg-orange-100 text-(--orange)"
                              }`}
                          >
                            {item.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm mt-1">
                          <CalendarBlankIcon size={16} />
                          <span>
                            {item.date
                              ? new Date(
                                `${item.date}T00:00:00`,
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                              : "Date unavailable"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm">
                          <MapPin size={16} weight="regular" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Arrow */}
                    <div className="text-gray-400 group-hover:text-gray-700 transition-colors pr-2">
                      <CaretRight size={24} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-400">
                  No {activeTab} items posted yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {edit && (
        <div
          className="absolute container2 w-full max-w-sm min-h-100 rounded-xl border border-black z-2 
    bg-(--pure-white)
          left-1/2
          top-100
          -translate-x-1/2
          -translate-y-1/2"
        >
          {/* User Icon */}
          <div className="flex justify-center m-5">
            <div className="">
              <svg
                width="100"
                height="100"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                className={`rounded-full ${activeTab === "lost" ? "bg-[linear-gradient(90deg,#255A4F_0%,#2F6F62_100%)]" : ""}`}
              >
                <defs>
                  {/* Orange Gradient */}
                  <linearGradient
                    id="orangeGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#C2872E" />
                    <stop offset="50%" stopColor="#B47B27" />
                    <stop offset="100%" stopColor="#A9701E" />
                  </linearGradient>
                </defs>

                {/* Background Circle */}
                <circle cx="100" cy="100" r="98" fill={`${activeTab === 'lost' ? "url()" : "url(#orangeGradient)"}`} />

                {/* User Head */}
                <circle
                  cx="100"
                  cy="80"
                  r="28"
                  fill="#FFFFFF"
                  fillOpacity="0.9"
                />

                {/* User Body */}
                <path
                  d="
                M 50 165
                C 50 125 72 108 100 108
                C 128 108 150 125 150 165
                Z
              "
                  fill="#FFFFFF"
                  fillOpacity="0.9"
                />

                {/* Circle Clip */}
                <clipPath id="orangeCircleClip">
                  <circle cx="100" cy="100" r="98" />
                </clipPath>
              </svg>
            </div>
          </div>
          <form
            onSubmit={handleUpdateProfile}
            className="flex flex-col gap-4 ml-5.5"
          >
            <div className="flex border rounded-lg px-2 py-1 w-85">
              <UserIcon size={24} className={`${activeTab === "lost" ? "text-(--green)" : "text-(--orange)"}`} />

              <input
                type="text"
                placeholder="Name"
                name="name"
                id="name"
                value={editData.name}
                onChange={onChangeEditFormData}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="flex border rounded-lg px-2 py-1 w-85">
              <PhoneIcon size={24} className={`${activeTab === "lost" ? "text-(--green)" : "text-(--orange)"}`} />

              <input
                type="tel"
                placeholder="Phone No"
                name="phone_number"
                id="phone_number"
                value={editData.phone_number}
                onChange={onChangeEditFormData}
                maxLength={10}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="flex border rounded-lg px-2 py-1 w-85">
              <EnvelopeIcon size={24} className={`${activeTab === "lost" ? "text-(--green)" : "text-(--orange)"}`} />

              <input
                type="text"
                placeholder="Email"
                name="email"
                id="signup-email"
                value={editData.email}
                onChange={onChangeEditFormData}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="flex border rounded-lg px-2 py-1 w-85">
              <CodeIcon size={24} className={`${activeTab === "lost" ? "text-(--green)" : "text-(--orange)"}`} />

              <input
                type="text"
                placeholder="Code"
                name="code"
                id="code"
                value={editData.code}
                onChange={onChangeEditFormData}
                className="w-65 px-2 focus:outline-none focus:ring-0"
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm" role="alert">
                {error}
              </p>
            )}

            <div className="flex justify-center w-85 pt-1">
              <button
                type="submit"
                disabled={saving}
                className={`flex items-center justify-center font-semibold
      border rounded-lg w-30 h-10
      disabled:opacity-60 disabled:cursor-not-allowed
      hover:cursor-pointer
      
      text-white transition-all duration-300
      ${activeTab === "lost" ? "bg-(--green) hover:bg-(--green-hover)" : "bg-(--orange) hover:bg-(--orange-hover)"}`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
