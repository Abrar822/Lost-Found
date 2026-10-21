import { useState, useEffect } from "react";
import { search } from "../api/searchApi";
import { CaretRight } from "@phosphor-icons/react";

export default function Search({
  setAlert,
  retrievedData,
  isLog,
  setChangeInPost,
}) {
  const [loading, setLoading] = useState(false);
  const [SearchState, SetSearchState] = useState("founded_item");

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
      let data = await search({ ...searchDetails });
      console.log("", data);
      data = data.map((ele) => ({
        item_name: ele["Item_Name"],
        location: ele["Location"],
        description: ele["Description"],
        date: ele[
          `${SearchState === "lost_item" ? "Date_Lost" : "Date_found"}`
        ],
      }));
      setFilterArr(data);
    } catch (err) {
      setAlert({ msg: err.message, state: true });
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchDetails({
      item_name: "",
      description: "",
      date: "",
      location: "",
      role: "",
    });
    setFilterArr([]);
    setChangeInPost(true);
  };

  return (
    <>
      <div className="search-container bg-(--pure-white) max-w-[750px] mx-auto rounded-2xl mb-10 py-2">
        <div className="title overflow-hidden mx-auto w-[50%] rounded-2xl h-[40px] bg-(--navbar) text-(--btn-black) font-bold flex justify-between items-center my-3">
          <button
            className={`${SearchState == "founded_item" ? "bg-(--orange) text-(--pure-white)" : ""} finder h-full w-[230px] cursor-pointer transition-all duration-150 ease-in`}
            onClick={() => {
              SetSearchState("founded_item");
            }}
          >
            Search Found Items
          </button>
          <div className="slash bg-(--pure-white) w-[1px] h-full"></div>
          <button
            className={`${SearchState == "lost_item" ? "bg-(--green) text-(--pure-white)" : ""} loser h-full w-[230px] cursor-pointer transition-all duration-150 ease-in`}
            onClick={() => {
              SetSearchState("lost_item");
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
                className="search-btn post-found bg-(--orange) text-(--pure-white) p-1.5 rounded-lg m-1 cursor-pointer transition-all duration-150 ease-in-out active:scale-95 mt-2 self-center w-[90%] flex justify-center items-center gap-6"
                onClick={handleSearch}
              >
                {loading && (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                )}
                <span>Search</span>
              </button>
              <button
                className="search-btn post-found bg-(--orange) text-(--pure-white) p-1.5 rounded-lg m-1 cursor-pointer transition-all duration-150 ease-in-out active:scale-95 mt-2 self-center w-[90%] flex justify-center items-center gap-6"
                onClick={clearSearch}
              >
                {loading && (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                )}
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
                className="search-btn post-found bg-(--green) text-(--pure-white) p-1.5 rounded-lg m-1 cursor-pointer transition-all duration-150 ease-in-out active:scale-95 mt-2 self-center w-[90%] flex justify-center items-center gap-6"
                onClick={handleSearch}
              >
                {loading && (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                )}
                <span>Search</span>
              </button>
              <button
                className="search-btn post-found bg-(--green) text-(--pure-white) p-1.5 rounded-lg m-1 cursor-pointer transition-all duration-150 ease-in-out active:scale-95 mt-2 self-center w-[90%] flex justify-center items-center gap-6"
                onClick={clearSearch}
              >
                {loading && (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                )}
                <span>Clear</span>
              </button>
            </div>
          </div>
        )}
        {isLog && (
          <div className="container flex max-h-[500px] w-[90%] self-center mx-auto mt-5 mb-5 rounded-2xl flex flex-col gap-4 overflow-auto">
            {SearchState === "founded_item" &&
              displayFound.map((ele, idx) => (
                <div
                  key={idx}
                  className="relative box bg-(--input-1) px-3 py-2 rounded-2xl flex gap-4"
                >
                  <div className="img h-full max-h-[200px] w-[150px] bg-amber-50 overflow-x-hidden shrink-0">
                    <img className="text-[12px]" src="/" alt={ele.item_name} />
                  </div>
                  <div className="details flex flex-col justify-center items-start max-w-[90%] overflow-hidden">
                    <div className="item_name">
                      <span className="font-bold">Name:</span> {ele.item_name}
                    </div>
                    <div className="description">
                      <span className="font-bold">Description:</span>{" "}
                      {ele.description}
                    </div>
                    <div className="location">
                      <span className="font-bold">Location:</span>{" "}
                      {ele.location}
                    </div>
                    <div className="date">
                      <span className="font-bold">Date:</span> {ele.date}
                    </div>
                  </div>
                  <div className="arrow self-end absolute cursor-pointer right-[10px] top-[10px]">
                    <CaretRight size={24} weight="bold" />
                  </div>
                </div>
              ))}
            {SearchState === "lost_item" &&
              displayLost.map((ele, idx) => (
                <div
                  key={idx}
                  className="relative box bg-(--input-1) px-3 py-2 rounded-2xl flex gap-4"
                >
                  <div className="img h-full max-h-[200px] w-[150px] bg-amber-50 overflow-x-hidden shrink-0">
                    <img className="text-[12px]" src="/" alt={ele.item_name} />
                  </div>
                  <div className="details flex flex-col justify-center items-start max-w-[90%] overflow-hidden">
                    <div className="item_name">
                      <span className="font-bold">Name:</span> {ele.item_name}
                    </div>
                    <div className="description">
                      <span className="font-bold">Description:</span>{" "}
                      {ele.description}
                    </div>
                    <div className="location">
                      <span className="font-bold">Location:</span>{" "}
                      {ele.location}
                    </div>
                    <div className="date">
                      <span className="font-bold">Date:</span> {ele.date}
                    </div>
                  </div>
                  <div className="arrow self-end absolute cursor-pointer right-[10px] top-[10px]">
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
