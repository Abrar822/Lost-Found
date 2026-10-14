import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CloudArrowUpIcon } from "@phosphor-icons/react";
import { postLost, postFound } from "../api/PostApi";

export default function Post({ setActivePost, activePost, loading, setLoading, setAlert }) {

  const [lostItemDetails, setLostItemDetails] = useState({
    item_name: "",
    description: "",
    date: "",
    location: "",
    image: null,
  });

  const [foundItemDetails, setFoundItemDetails] = useState({
    item_name: "",
    description: "",
    date: "",
    location: "",
    image: null,
  });

  function onLostChange(event) {
    const { name, value, type, files } = event.target;
    console.log(lostItemDetails.date)
    setLostItemDetails((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  }

  function onFoundChange(event) {
    const { name, value, type, files } = event.target;

    setFoundItemDetails((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  }

  async function onSubmit(event) {
    event.preventDefault();

    if (activePost === "lost") {
      try {
        if (lostItemDetails.item_name === '' || lostItemDetails.description === '' || lostItemDetails.date === '' || lostItemDetails.location === '') {
          setAlert({ msg: 'All the details must be filled other than Image.', state: true })
          return
        }
        setLoading(true)
        let result = await postLost(lostItemDetails)
        if (result) {
          setAlert({ msg: 'Posting lost item Successful.', state: true })
          setLostItemDetails({
            item_name: "",
            description: "",
            date: "",
            location: "",
            image: null,
          })
          setLoading(false)
        }
      }
      catch (err) {
        setAlert({ msg: 'Posting Lost Item Failed. ' + String(err.message), state: true })
      }
      finally {
        setLoading(false)
      }
    }
    else {
      try {
        if (foundItemDetails.item_name === '' || foundItemDetails.description === '' || foundItemDetails.date === '' || foundItemDetails.location === '') {
          setAlert({ msg: 'All the details must be filled other than Image.', state: true })
          return
        }
        setLoading(true)
        let result = await postFound(foundItemDetails)
        if (result) {
          setAlert({ msg: 'Posting found item Successful.', state: true })
          setFoundItemDetails({
            item_name: "",
            description: "",
            date: "",
            location: "",
            image: null,
          });
        }
        setLoading(false)
      }
      catch (err) {
        setAlert({ msg: 'Posting Found Item Failed. ' + String(err.message), state: true })
      }
      finally {
        setLoading(false)
      }
    }
  }
  const navigate_post = useNavigate();

  return (
    <>
      <div className="mt-30 flex flex-col items-center border-none rounded-2xl w-200 mx-auto bg-(--pure-white) ">
        <div className="flex w-full h-12 border-b">
          <button
            type="button"
            onClick={() => {
              setActivePost("lost");
              navigate_post("/post/report_lost_items");
            }}
            className={`w-1/2 rounded-tl-lg transition-colors font-bold
                ${activePost === "lost"
                ? "bg-(--green) text-(--pure-white) hover:bg-(--green-hover)"
                : "bg-(--pure-white) text-(--text-1)"
              } cursor-pointer`}
          >
            Post Lost Item
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePost("found");
              navigate_post("/post/report_found_items");
            }}
            className={`w-1/2 rounded-tr-lg font-bold transition-colors
                ${activePost === "found"
                ? "bg-(--orange) text-(--pure-white) hover:bg-(--orange-hover)"
                : "bg-(--pure-white) text-(--text-1)"
              } cursor-pointer`}
          >
            Post Found Item
          </button>
        </div>

        {activePost === "lost" ? (
          <form className="my-5 flex flex-col items-center w-4/5 gap-2">
            <div className="w-180 flex flex-col gap-1">
              <label htmlFor="item_name" className="text-left">
                Item Name:
              </label>
              <input
                type="text"
                name="item_name"
                id="item_name"
                value={lostItemDetails.item_name}
                onChange={onLostChange}
                placeholder="Enter lost item name"
                className="w-full px-2 py-2 focus:outline-none focus:ring-0 border rounded-lg"
              />
            </div>

            <div className="w-180 flex flex-col gap-1">
              <label htmlFor="description">Description:</label>
              <textarea
                name="description"
                id="description"
                value={lostItemDetails.description}
                onChange={onLostChange}
                placeholder="Describe lost item"
                rows="3"
                className="w-full px-2 py-2 focus:outline-none focus:ring-0 border resize-none rounded-lg"
              />
            </div>

            <div className="w-180 flex flex-col gap-1">
              <label htmlFor="date" className="text-left">
                Date Lost:
              </label>
              <input
                type="date"
                name="date"
                id="date"
                value={lostItemDetails.date}
                onChange={onLostChange}
                className="w-full px-2 py-2 focus:outline-none focus:ring-0 border rounded-lg"
              />
            </div>

            <div className="w-180 flex flex-col gap-1">
              <label htmlFor="location" className="text-left">
                Location:
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={lostItemDetails.location}
                onChange={onLostChange}
                placeholder="Location where item was lost"
                className="w-full px-2 py-2 focus:outline-none focus:ring-0 border rounded-lg"
              />
            </div>

            <div className="w-180 flex flex-col gap-1">
              <label htmlFor="image" className="text-left">
                Upload Image:
              </label>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={onLostChange}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="flex flex-col justify-center items-center gap-2 w-full h-30 border rounded-lg cursor-pointer"
              >
                <span className="text-2xl">
                  <CloudArrowUpIcon />
                </span>
                <span>
                  {lostItemDetails.image
                    ? lostItemDetails.image.name
                    : "Click to upload lost item image"}
                </span>
              </label>
            </div>

            <button
              className="border rounded-lg w-180 h-10 cursor-pointer bg-[linear-gradient(90deg,#255A4F_0%,#2F6F62_100%)] text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(47,111,98,0.5)] hover:brightness-110 flex justify-center items-center gap-6"
              onClick={onSubmit}
            >
              {loading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin "></span>}<span>Submit</span>
            </button>
          </form>
        ) : (
          <form className="my-5 flex flex-col items-center w-4/5 gap-2">
            <div className="w-180 flex flex-col gap-1">
              <label htmlFor="found_item_name" className="text-left">
                Item Name:
              </label>
              <input
                type="text"
                name="item_name"
                id="found_item_name"
                value={foundItemDetails.item_name}
                onChange={onFoundChange}
                placeholder="Enter found item name"
                className="w-full px-2 py-2 focus:outline-none focus:ring-0 border rounded-lg"
              />
            </div>

            <div className="w-180 flex flex-col gap-1">
              <label htmlFor="found_description">Description:</label>
              <textarea
                name="description"
                id="found_description"
                value={foundItemDetails.description}
                onChange={onFoundChange}
                placeholder="Describe found item"
                rows="3"
                className="w-full px-2 py-2 focus:outline-none focus:ring-0 resize-none border rounded-lg"
              />
            </div>

            <div className="w-180 flex flex-col gap-1">
              <label htmlFor="found_date" className="text-left">
                Date Found:
              </label>
              <input
                type="date"
                name="date"
                id="found_date"
                value={foundItemDetails.date}
                onChange={onFoundChange}
                // placeholder="dd-mm-yyyy"
                className="w-full px-2 py-2 focus:outline-none focus:ring-0 border rounded-lg"
              />
            </div>

            <div className="w-180 flex flex-col gap-1">
              <label htmlFor="found_location" className="text-left">
                Location:
              </label>
              <input
                type="text"
                name="location"
                id="found_location"
                value={foundItemDetails.location}
                onChange={onFoundChange}
                placeholder="Location where item was found"
                className="w-full px-2 py-2 focus:outline-none focus:ring-0 border rounded-lg"
              />
            </div>

            <div className="w-180 flex flex-col gap-1">
              <label htmlFor="found_image" className="text-left">
                Upload Image:
              </label>

              <input
                type="file"
                name="image"
                id="found_image"
                accept="image/*"
                onChange={onFoundChange}
                className="hidden"
              />

              <label
                htmlFor="found_image"
                className="flex flex-col justify-center items-center gap-2 w-full h-30 border rounded-lg cursor-pointer"
              >
                <span className="text-2xl">
                  <CloudArrowUpIcon />
                </span>

                <span>
                  {foundItemDetails.image
                    ? foundItemDetails.image.name
                    : "Click to upload found item image"}
                </span>
              </label>
            </div>

            <button
              className="border rounded-lg w-180 h-10 cursor-pointer bg-[linear-gradient(90deg,#A9701E_0%,#C2872E_100%)] text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(194,135,46,0.5)] hover:brightness-110 flex justify-center items-center gap-6"
              onClick={onSubmit}
            >
              {loading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}<span>Submit</span>
            </button>
          </form>
        )}
      </div>
    </>
  );
}
