// "use client";
export default ({value, setter, placeholder, required=false}) => {
  return (
    <div className="relative">
      <input
      id="floating_outlined"
      required={required}
      className="text-xl block py-2.5 px-4 font-light w-full text-slate-700 bg-transparent border rounded-lg appearance-none border-[#FF0000] focus:outline-none focus:ring-0 focus:border-[#B51F1F] peer peer-border-[#FF0000] invalid:border-gray-500"
      placeholder=""
      value={value}
      autoComplete="off"
      onChange={(e) => setter(e.target.value)}/>
      {/* for floating label, tailwind css code from flowbite */}
      <label
      htmlFor="floating_outlined"
      className="cursor-text select-none absolute text-sm text-[#FF0000] duration-300 transform -translate-y-4 scale-75 top-2 left-3 z-10 origin-[0] bg-[#EEEEEE] px-2 peer-placeholder-shown:text-gray-500 peer-focus:text-[#B51F1F] peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">{placeholder}</label>
    </div>
  );
};