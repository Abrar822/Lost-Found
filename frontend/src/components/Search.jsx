import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { search } from "../api/searchApi";
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
import defaultItem from "../assets/default-item.png";

export default function Search({
  setAlert,
  retrievedData,
  isLog,
  setChangeInPost,
}) {
  const [loading, setLoading] = useState(false);
  const [SearchState, SetSearchState] = useState("founded_item");
  const navigate = useNavigate();

  const [filterArr, setFilterArr] = useState([]);
  // const displayLost = retrievedData?.lostData ?? [];
  const displayLost =
    filterArr.length == 0 && SearchState === "lost_item"
      ? retrievedData?.lostData
      : filterArr;
  // const displayFound = retrievedData?.foundData ?? [];
  const displayFound =
    filterArr.length == 0 && SearchState === "founded_item"
      ? retrievedData?.foundData
      : filterArr;

  const [searchDetails, setSearchDetails] = useState({
    item_name: "",
    description: "",
    date: "",
    location: "",
    role: "",
    image: ""
  });

  const insertSearchDetails = (e) => {
    setSearchDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    setSearchDetails({
      item_name: "",
      description: "",
      date: "",
      location: "",
      role: "",
      image: ""
    });
    if (SearchState === "founded_item") {
      setSearchDetails((prev) => ({ ...prev, role: "finder" }));
    } else if (SearchState === "lost_item") {
      setSearchDetails((prev) => ({ ...prev, role: "loser" }));
    }
  }, [SearchState]);

  const handleSearch = async () => {
    if (
      searchDetails.item_name === "" ||
      searchDetails.date === "" ||
      searchDetails.description === "" ||
      searchDetails.location === ""
    ) {
      setAlert({ msg: "All details must be filled.", state: true });
      return;
    }
    try {
      setLoading(true);
      let data = await search({ item_name: searchDetails.item_name, description: searchDetails.description, location: searchDetails.location, date: searchDetails.date, role: searchDetails.role });
      console.log("", data);
      data = data.map((ele) => ({
        item_name: ele["Item_Name"],
        location: ele["Location_Lost"],
        description: ele["Description"],
        date: ele[
          `${SearchState === "lost_item" ? "Date_Lost" : "Date_Found"}`
        ],
        image: ele['Image_Upload']
      }));
      setFilterArr(data);
    } catch (err) {
      setAlert({ msg: err.message, state: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("displayfound", displayFound);
    console.log("displaylost", displayLost);
  }, [filterArr, displayFound, displayLost]);

  const clearSearch = () => {
    setSearchDetails({
      item_name: "",
      description: "",
      date: "",
      location: "",
      role: "",
      image: ""
    });
    setFilterArr([]);
    setChangeInPost(true);
  };

  const formattedDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <div className="search-container bg-(--pure-white) max-w-[1170px] mx-auto rounded-2xl mb-10 py-2 shadow-lg">
        <div className="title overflow-hidden mx-auto w-[50%] rounded-2xl h-[40px] bg-(--navbar) text-(--btn-black) font-bold flex justify-between items-center my-3">
          <button
            className={`${SearchState == "founded_item" ? "bg-(--orange) text-(--pure-white)" : ""} finder h-full w-[320px] cursor-pointer transition-all duration-150 ease-in`}
            onClick={() => {
              SetSearchState("founded_item");
              clearSearch();
            }}
          >
            Search Found Items
          </button>
          <div className="slash bg-(--pure-white) w-[1px] h-full"></div>
          <button
            className={`${SearchState == "lost_item" ? "bg-(--green) text-(--pure-white)" : ""} loser h-full w-[320px] cursor-pointer transition-all duration-150 ease-in`}
            onClick={() => {
              SetSearchState("lost_item");
              clearSearch();
            }}
          >
            Search Lost Items
          </button>
        </div>

        {SearchState == "founded_item" && (
          <div className="search-fields flex flex-col justify-start">
            <div className="container-1 mx-auto m-2 flex w-[90%] justify-between items-center gap-4">
              <input
                className="h-[35px] flex-1 border-solid border-[1px] border-(--text-1)/15 rounded-lg p-2 bg-(--input-1) text-(--text-1)/90"
                type="text"
                name="item_name"
                placeholder="Item-name..."
                value={searchDetails.item_name}
                onChange={insertSearchDetails}
              />
              <input
                className="h-[35px] flex-1 border-solid border-[1px] border-(--text-1)/15 rounded-lg p-2 bg-(--input-1) text-(--text-1)/90"
                type="text"
                name="location"
                placeholder="Enter Location..."
                value={searchDetails.location}
                onChange={insertSearchDetails}
              />
              <input
                className="h-[35px] flex-0.5 border-solid border-[1px] border-(--text-1)/15 rounded-lg p-2 bg-(--input-1) text-(--text-1)/90"
                type="date"
                name="date"
                value={searchDetails.date}
                onChange={insertSearchDetails}
              />
            </div>
            <textarea
              className="resize-none h-[100px] w-[90%] mx-auto border-solid border-[1px] border-(--text-1)/15 rounded-lg p-2 bg-(--input-1) text-(--text-1)/90"
              name="description"
              id="description"
              placeholder="Enter Description..."
              value={searchDetails.description}
              onChange={insertSearchDetails}
            ></textarea>
            <div className="btn-container w-[90%] mx-auto flex justify-center items-center gap-4">
              <button
                className="search-btn post-found bg-(--orange) hover:bg-(--orange-hover) text-(--pure-white) p-1.5 rounded-lg m-1 cursor-pointer transition-all duration-150 ease-in-out active:scale-95 mt-2 self-center w-[90%] flex justify-center items-center gap-6"
                onClick={handleSearch}
              >
                {loading && (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                )}
                <span>Search</span>
              </button>
              <button
                className="search-btn post-found bg-(--orange) hover:bg-(--orange-hover) text-(--pure-white) p-1.5 rounded-lg m-1 cursor-pointer transition-all duration-150 ease-in-out active:scale-95 mt-2 self-center w-[90%] flex justify-center items-center gap-6"
                onClick={clearSearch}
              >
                <span>Clear</span>
              </button>
            </div>
          </div>
        )}
        {SearchState == "lost_item" && (
          <div className="search-fields flex flex-col justify-start">
            <div className="container-1 mx-auto m-2 flex w-[90%] justify-between items-center gap-4">
              <input
                className="h-[35px] flex-1 border-solid border-[1px] border-(--text-1)/15 rounded-lg p-2 bg-(--input-1) text-(--text-1)/90"
                type="text"
                name="item_name"
                placeholder="Item-name..."
                value={searchDetails.item_name}
                onChange={insertSearchDetails}
              />
              <input
                className="h-[35px] flex-1 border-solid border-[1px] border-(--text-1)/15 rounded-lg p-2 bg-(--input-1) text-(--text-1)/90"
                type="text"
                name="location"
                placeholder="Enter Location..."
                value={searchDetails.location}
                onChange={insertSearchDetails}
              />
              <input
                className="h-[35px] flex-0.5 border-solid border-[1px] border-(--text-1)/15 rounded-lg p-2 bg-(--input-1) text-(--text-1)/90"
                type="date"
                name="date"
                value={searchDetails.date}
                onChange={insertSearchDetails}
              />
            </div>
            <textarea
              className="resize-none h-[100px] w-[90%] mx-auto border-solid border-[1px] border-(--text-1)/15 rounded-lg p-2 bg-(--input-1) text-(--text-1)/90"
              name="description"
              id="description"
              placeholder="Enter Description..."
              value={searchDetails.description}
              onChange={insertSearchDetails}
            ></textarea>
            <div className="btn-container w-[90%] mx-auto flex justify-center items-center gap-4">
              <button
                className="search-btn post-found bg-(--green) hover:bg-(--green-hover) text-(--pure-white) p-1.5 rounded-lg m-1 cursor-pointer transition-all duration-150 ease-in-out active:scale-95 mt-2 self-center w-[90%] flex justify-center items-center gap-6"
                onClick={handleSearch}
              >
                {loading && (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                )}
                <span>Search</span>
              </button>
              <button
                className="search-btn post-found bg-(--green) hover:bg-(--green-hover) text-(--pure-white) p-1.5 rounded-lg m-1 cursor-pointer transition-all duration-150 ease-in-out active:scale-95 mt-2 self-center w-[90%] flex justify-center items-center gap-6"
                onClick={clearSearch}
              >
                <span>Clear</span>
              </button>
            </div>
          </div>
        )}
        {isLog && (
          <div className="container flex max-h-[500px] w-[90%] self-center mx-auto mt-5 mb-5 flex flex-col gap-4 overflow-auto py-3">
            {SearchState === "founded_item" &&
              displayFound.map((item, idx) => (
                <div
                  key={idx}
                  className="relative box px-4 py-3 rounded-2xl flex gap-8 cursor-pointer transition-colors duration-200 hover:bg-gray-50 group"
                  onClick={() => {
                    navigate("/item-details", {
                      state: { item: { ...item, type: "Found" } },
                    });
                  }}
                >
                  <div className="img h-[100px] w-[150px] bg-white rounded-2xl overflow-x-hidden shrink-0 border-solid border-[1px] border-black overflow-hidden flex justify-center items-center">
                    <img
                      className="text-[12px] w-30 h-16 rounded-xl border border-gray-100 rotate-315"
                      src={item.image || defaultItem}
                      alt={item.item_name}
                    />
                  </div>

                  <div className="details flex flex-col justify-center items-start max-w-[90%] overflow-hidden">
                    <div className="item_name font-bold text-[18px] text-black/80 mb-1.5">
                      {item.item_name}
                    </div>
                    <div className="location flex items-center justify-center gap-2 text-slate-900">
                      <MapPin size={16} weight="regular" /> {item.location}
                    </div>
                    <div className="date flex justify-center items-center gap-2 text-slate-900">
                      <CalendarBlankIcon size={16} /> {formattedDate(item.date)}
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-black transition-colors duration-200 pr-2 absolute top-1/2 -translate-y-1/2 right-2">
                    <CaretRight size={24} weight="bold" />
                  </div>
                </div>
              ))}
            {SearchState === "lost_item" &&
              displayLost.map((item, idx) => (
                <div
                  key={idx}
                  className="relative box hover:bg-gray-50 px-4 py-3 rounded-2xl flex gap-8 cursor-pointer group"
                  onClick={() => {
                    navigate("/item-details", {
                      state: { item: { ...item, type: "Lost" } },
                    });
                  }}
                >
                  <div className="img h-[100px] w-[150px] bg-white rounded-2xl overflow-x-hidden shrink-0 border-solid border-[1px] border-black overflow-hidden flex justify-center items-center">
                    <img
                      className="text-[12px] w-30 h-16 rounded-xl border border-gray-100 rotate-315"
                      src={item.image || defaultItem}
                      alt={item.item_name}
                    />
                  </div>
                  <div className="details flex flex-col justify-center items-start max-w-[90%] overflow-hidden">
                    <div className="item_name font-bold text-[18px] text-black/80 mb-1.5">
                      {item.item_name}
                    </div>
                    <div className="location flex items-center justify-center gap-2 text-slate-900">
                      <MapPin size={16} weight="regular" /> {item.location}
                    </div>
                    <div className="date flex justify-center items-center gap-2 text-slate-900">
                      <CalendarBlankIcon size={16} /> {formattedDate(item.date)}
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-black transition-colors duration-200 pr-2 absolute top-1/2 -translate-y-1/2 right-2">
                    <CaretRight size={24} weight="bold" />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}
