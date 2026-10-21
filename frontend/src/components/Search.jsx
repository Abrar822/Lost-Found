import { useState } from "react";

export default function Search() {
  const [SearchState, SetSearchState] = useState("founded_item");

  return (
    <>
      <div className="search-container bg-(--pure-white) max-w-[750px] mx-auto rounded-2xl mb-10 py-2 shadow-lg">
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
                name="item-name"
                placeholder="Item-name..."
              />
              <input
                className="h-[35px] flex-1 border-solid border-[1px] border-(--text-1)/15 rounded-lg p-2 bg-(--input-1) text-(--text-1)/90"
                type="text"
                name="location"
                placeholder="Enter Location..."
              />
              <input
                className="h-[35px] flex-0.5 border-solid border-[1px] border-(--text-1)/15 rounded-lg p-2 bg-(--input-1) text-(--text-1)/90"
                type="date"
                name="date"
              />
            </div>
            <textarea
              className="resize-none h-[100px] w-[90%] mx-auto border-solid border-[1px] border-(--text-1)/15 rounded-lg p-2 bg-(--input-1) text-(--text-1)/90"
              name="description"
              id="description"
              placeholder="Enter Description..."
            ></textarea>
            <button className="search-btn post-found bg-(--orange) text-(--pure-white) p-1.5 rounded-lg m-1 cursor-pointer transition-all duration-150 ease-in-out active:scale-95 mt-2 self-center w-[90%]">
              Search
            </button>
          </div>
        )}
        {SearchState == "lost_item" && (
          <div className="search-fields flex flex-col justify-start">
            <div className="container-1 mx-auto m-2 flex w-[90%] justify-between items-center gap-4">
              <input
                className="h-[35px] flex-1 border-solid border-[1px] border-(--text-1)/15 rounded-lg p-2 bg-(--input-1) text-(--text-1)/90"
                type="text"
                name="item-name"
                placeholder="Item-name..."
              />
              <input
                className="h-[35px] flex-1 border-solid border-[1px] border-(--text-1)/15 rounded-lg p-2 bg-(--input-1) text-(--text-1)/90"
                type="text"
                name="location"
                placeholder="Enter Location..."
              />
              <input
                className="h-[35px] flex-0.5 border-solid border-[1px] border-(--text-1)/15 rounded-lg p-2 bg-(--input-1) text-(--text-1)/90"
                type="date"
                name="date"
              />
            </div>
            <textarea
              className="resize-none h-[100px] w-[90%] mx-auto border-solid border-[1px] border-(--text-1)/15 rounded-lg p-2 bg-(--input-1) text-(--text-1)/90"
              name="description"
              id="description"
              placeholder="Enter Description..."
            ></textarea>
            <button className="search-btn post-found bg-(--green) text-(--pure-white) p-1.5 rounded-lg m-1 cursor-pointer transition-all duration-150 ease-in-out active:scale-95 mt-2 self-center w-[90%]">
              Search
            </button>
          </div>
        )}
      </div>
    </>
  );
}


