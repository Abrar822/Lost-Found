import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { search } from "../api/searchApi";
import { CalendarBlankIcon, MapPin, CaretRight } from "@phosphor-icons/react";
import defaultItem from "../assets/default-item.png";

export default function Search({
  setAlert,
  retrievedData,
  isLog,
  setChangeInPost,
}) {
  const [loading, setLoading] = useState(false);
  const [SearchState, SetSearchState] = useState("founded_item");
  const [filterArr, setFilterArr] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const navigate = useNavigate();

  // Display original items before searching,
  // and search results after a search has been performed.
  const displayLost = useMemo(() => {
    if (!hasSearched) {
      return retrievedData?.lostData ?? [];
    }

    return filterArr;
  }, [hasSearched, filterArr, retrievedData.lostData]);

  const displayFound = useMemo(() => {
    if (!hasSearched) {
      return retrievedData?.foundData ?? [];
    }

    return filterArr;
  }, [hasSearched, filterArr, retrievedData.foundData]);

  const [searchDetails, setSearchDetails] = useState({
    item_name: "",
    description: "",
    date: "",
    location: "",
    role: "finder",
  });

  // Update individual search fields.
  const insertSearchDetails = (e) => {
    const { name, value } = e.target;

    setSearchDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update the role when switching between Found and Lost Items
  useEffect(() => {
    setSearchDetails({
      item_name: "",
      description: "",
      date: "",
      location: "",
      role: SearchState === "founded_item" ? "finder" : "loser",
    });

    setFilterArr([]);
    setHasSearched(false);
  }, [SearchState]);

  // Search items.
  const handleSearch = async () => {
    if (
      !searchDetails.item_name.trim() ||
      !searchDetails.date ||
      !searchDetails.description.trim() ||
      !searchDetails.location.trim()
    ) {
      setAlert({
        msg: "All details must be filled.",
        state: true,
      });
      return;
    }

    try {
      setLoading(true);

      const response = await search({
        item_name: searchDetails.item_name,
        description: searchDetails.description,
        location: searchDetails.location,
        date: searchDetails.date,
        role: searchDetails.role,
      });

      const data = response.map((ele) => ({
        item_name: ele.Item_Name,
        location: ele.Location_Lost,
        description: ele.Description,
        date: SearchState === "lost_item" ? ele.Date_Lost : ele.Date_Found,
        image: ele.Image_Upload,
        ...(SearchState === "lost_item"
          ? { l_id: ele.L_id }
          : { f_id: ele.F_id }),

        u_id: ele.U_id,
      }));

      setFilterArr(data);
      setHasSearched(true);
    } catch (err) {
      setAlert({
        msg: err.message || "Failed to search items.",
        state: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("displayFound:", displayFound);
    console.log("displayLost:", displayLost);
    console.log("filterArr:", filterArr);
  }, [filterArr, displayFound, displayLost]);

  // Clear search and restore the original items.
  const clearSearch = () => {
    setSearchDetails({
      item_name: "",
      description: "",
      date: "",
      location: "",
      role: SearchState === "founded_item" ? "finder" : "loser",
    });

    setFilterArr([]);
    setHasSearched(false);
    setChangeInPost(true);
  };

  // Format date
  const formattedDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="search-container bg-(--pure-white) max-w-[1170px] mx-auto rounded-2xl mb-10 py-2 shadow-lg">
      {/* Switch between Found and Lost Items */}
      <div className="title overflow-hidden mx-auto w-[50%] rounded-2xl h-[40px] bg-(--navbar) text-(--btn-black) font-bold flex justify-between items-center my-3">
        <button
          className={`${
            SearchState === "founded_item"
              ? "bg-(--orange) text-(--pure-white)"
              : ""
          } finder h-full w-[320px] cursor-pointer transition-all duration-150 ease-in`}
          onClick={() => {
            if (SearchState !== "founded_item") {
              SetSearchState("founded_item");
            } else {
              clearSearch();
            }
          }}
        >
          Search Found Items
        </button>

        <div className="slash bg-(--pure-white) w-[1px] h-full"></div>

        <button
          className={`${
            SearchState === "lost_item"
              ? "bg-(--green) text-(--pure-white)"
              : ""
          } loser h-full w-[320px] cursor-pointer transition-all duration-150 ease-in`}
          onClick={() => {
            if (SearchState !== "lost_item") {
              SetSearchState("lost_item");
            } else {
              clearSearch();
            }
          }}
        >
          Search Lost Items
        </button>
      </div>

      {/* Search fields */}
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
          placeholder="Enter Description..."
          value={searchDetails.description}
          onChange={insertSearchDetails}
        />

        <div className="btn-container w-[90%] mx-auto flex justify-center items-center gap-4">
          <button
            className={`search-btn ${
              SearchState === "founded_item"
                ? "bg-(--orange) hover:bg-(--orange-hover)"
                : "bg-(--green) hover:bg-(--green-hover)"
            } text-(--pure-white) p-1.5 rounded-lg m-1 transition-all duration-150 ease-in-out active:scale-95 mt-2 self-center w-[90%] flex justify-center items-center gap-6 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
            onClick={handleSearch}
            disabled={loading}
          >
            {loading && (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            )}
            <span>{loading ? "Searching..." : "Search"}</span>
          </button>

          <button
            className={`search-btn ${
              SearchState === "founded_item"
                ? "bg-(--orange) hover:bg-(--orange-hover)"
                : "bg-(--green) hover:bg-(--green-hover)"
            } text-(--pure-white) p-1.5 rounded-lg m-1 cursor-pointer transition-all duration-150 ease-in-out active:scale-95 mt-2 self-center w-[90%]`}
            onClick={clearSearch}
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </div>

      {isLog && (
        <div className="container max-h-[500px] w-[90%] mx-auto mt-5 mb-5 flex flex-col gap-4 overflow-auto py-3">
          {(SearchState === "founded_item" ? displayFound : displayLost).map(
            (item, idx) => (
              <div
                key={idx}
                className="relative box px-4 py-3 rounded-2xl flex gap-8 cursor-pointer transition-colors duration-200 hover:bg-gray-50 group"
                onClick={() => {
                  navigate("/item-details", {
                    state: {
                      item: {
                        ...item,
                        type: SearchState === "founded_item" ? "Found" : "Lost",
                      },
                    },
                  });
                }}
              >
                <div className="img h-[100px] w-[150px] bg-white rounded-2xl shrink-0 border-solid border-[1px] border-black overflow-hidden flex justify-center items-center">
                  <img
                    className="text-[12px] w-30 h-16 rounded-xl border border-gray-100 object-contain"
                    src={item.image || defaultItem}
                    alt={item.item_name || "Item"}
                  />
                </div>

                <div className="details flex flex-col justify-center items-start max-w-[90%] overflow-hidden">
                  <div className="item_name font-bold text-[18px] text-black/80 mb-1.5">
                    {item.item_name}
                  </div>

                  <div className="location flex items-center justify-center gap-2 text-slate-900">
                    <MapPin size={16} weight="regular" />
                    {item.location}
                  </div>

                  <div className="date flex justify-center items-center gap-2 text-slate-900">
                    <CalendarBlankIcon size={16} />
                    {formattedDate(item.date)}
                  </div>
                </div>

                <div className="text-gray-400 group-hover:text-black transition-colors duration-200 pr-2 absolute top-1/2 -translate-y-1/2 right-2">
                  <CaretRight size={24} weight="bold" />
                </div>
              </div>
            ),
          )}

          {hasSearched &&
            (SearchState === "founded_item" ? displayFound : displayLost)
              .length === 0 && (
              <p className="text-center text-gray-500 py-6">
                No matching items found.
              </p>
            )}
        </div>
      )}
    </div>
  );
}
