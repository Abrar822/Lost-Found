import  { useEffect, useState } from "react";
import { 
  User, 
  CalendarBlank, 
  MapPin, 
  CaretRight,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CodeIcon,
} from "@phosphor-icons/react";

export default function Profile({userData,setUserData}) {
  const [activeTab, setActiveTab] = useState("lost");
  const [edit, setEdit] = useState(false);
  const [editData,setEditData] = useState({
    name:"",
    email:"",
    phone_number:"",
    code:""
  })
  useEffect(()=>{
    setEditData({
      name:userData.name,
      email:userData.email,
      phone_number:userData.phone_number,
      code:userData.code
    })
  },[userData])

  const onChangeEditFormData = (event) => {
    setEditData((prev)=>({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  // Mock data based on the provided image
  const mockLostItems = [
    {
      id: 1,
      title: "Black Backpack",
      type: "Lost",
      date: "12 Sep 2025",
      location: "SCET Campus",
      image: "https://via.placeholder.com/150/333333/FFFFFF?text=Backpack" 
    },
    {
      id: 2,
      title: "iPhone 13",
      type: "Lost",
      date: "10 Sep 2025",
      location: "Library, SCET",
      image: "https://via.placeholder.com/150/000000/FFFFFF?text=Phone"
    },
    {
      id: 3,
      title: "Wallet",
      type: "Lost",
      date: "07 Sep 2025",
      location: "Canteen, SCET",
      image: "https://via.placeholder.com/150/5C4033/FFFFFF?text=Wallet"
    }
  ];

  const mockFoundItems = [
    {
      id: 4,
      title: "Water Bottle",
      type: "Found",
      date: "14 Sep 2025",
      location: "Room 204, SCET",
      image: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Bottle"
    }
  ];

  const currentItems = activeTab === "lost" ? mockLostItems : mockFoundItems;

  return (
    <>
    
{/* Overlay: closes the edit form when clicked */}
{edit && (
  <div
    className="fixed inset-0 bg-black/60 z-2"
    onClick={() => setEdit(false)}
  />
)}

    <div className="min-h-screen  flex justify-center py-10 px-4 mt-15">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-sm p-8">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-[#1e293b] mb-8">Profile</h1>

        {/* User Info Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-6">
            <div onClick={() => setActiveTab("lost")} className={`w-24 h-24 rounded-full 
            flex items-center justify-center text-white shadow-md ${
            activeTab === "lost"
            ? "bg-(--green)"
            : "bg-[#B47B27]"
            }`}>
              <User size={48} weight="fill" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{userData.name}</h2>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">{userData.email}</p>
            </div>
          </div>
          <button onClick={() => setEdit(true)}   className={`border-2 border-indigo-100 text-[#25201B] font-bold 
          px-6 py-2 rounded-lg transition-colors duration-200 bg-[#FAF7F0] cursor-pointer
          ${
            activeTab === "found"
            ? "hover:bg-[#B47B27] hover:text-(--pure-white)"
            : "hover:bg-(--green) hover:text-(--pure-white)"
            }`}>
            Edit Profile
          </button>
        </div>

        {/* My Posts Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">My Posts</h2>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("lost")}
              className={`flex-1 pb-3 pt-2 text-center text-sm sm:text-base rounded-tl-lg font-bold transition-colors ${
                activeTab === "lost" 
                  ? "bg-(--green) text-(--pure-white) hover:bg-(--green-hover)" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Lost Items
            </button>
            <button
              onClick={() => setActiveTab("found")}
              className={`flex-1 pb-1 text-center text-sm sm:text-base rounded-tr-lg font-bold transition-colors ${
                activeTab === "found" 
                  ? "bg-(--orange) text-(--pure-white) hover:bg-(--orange-hover)" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Found Items
            </button>
          </div>

          {/* Items List */}
          <div className="flex flex-col gap-2">
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Item Image */}
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-gray-100 shadow-sm"
                    />
                    
                    {/* Item Details */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{item.title}</h3>
                        <span className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md ${
                          item.type === 'Lost' 
                            ? 'bg-red-100 text-red-500' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mt-1">
                        <CalendarBlank size={16} weight="regular" />
                        <span>{item.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
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

    { edit && <div className="container2 w-full max-w-sm min-h-100 rounded-xl border border-black z-2 
    bg-(--pure-white)
    absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2">
            {/* User Icon */}
        <div className="flex justify-center m-5">
          <div className="">
            <svg
            width="100"
            height="100"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="rounded-full"
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
            <circle cx="100" cy="100" r="98" fill="url(#orangeGradient)" />

            {/* User Head */}
            <circle cx="100" cy="80" r="28" fill="#FFFFFF" fillOpacity="0.9" />

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
        <form className="flex flex-col gap-4 ml-5.5">
          <div className="flex border rounded-lg px-2 py-1 w-85">
              <UserIcon size={24} className="text-(--orange)" />

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
              <PhoneIcon size={24} className="text-(--orange)" />

              <input
                type="tel"
                placeholder="Phone No"
                name="phone_no"
                id="phone_no"
                value={editData.phone_number}
                onChange={onChangeEditFormData}
                maxLength={10}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="flex border rounded-lg px-2 py-1 w-85">
              <EnvelopeIcon size={24} className="text-(--orange)" />

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
            <div className="flex border rounded-lg px-2 py-1">
              <CodeIcon size={24} className="text-(--orange)" />

              <input
                type="text"
                placeholder="Code"
                name="code"
                id="code"
                value={editData.code}
                onChange={onChangeEditFormData}
                className="w-70 px-2 focus:outline-none focus:ring-0"
              />
            </div>
        </form>
      
    </div>}
  </>
  );
}