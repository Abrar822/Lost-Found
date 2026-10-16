export default function Alert({ msg }) {
  return (
    <>
      <div className="fixed alert z-3 text-(--pure-white) w-full top-[70px] flex justify-center items-center">
        <div className="bg-(--btn-black) absolute w-[full] mx-auto px-4 py-2 rounded-lg max-w-[500px] min-w-[350px] text-center shadow-xl shadow-black/40">
          {msg}
        </div>
      </div>
    </>
  );
}
