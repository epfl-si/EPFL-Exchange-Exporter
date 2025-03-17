// "use client";
export default ({value, setter, required=false}) => {
  return (
    // <>
      // <input
      // required={required}
      // className="text-xl text-right block py-2.5 px-0 w-full text-slate-700 bg-transparent border-0 border-b-2 appearance-none placeholder:text-gray-400 border-[#FF0000] focus:outline-none focus:ring-0 focus:border-[#B51F1F] peer"
      // placeholder="fichier"
      // value={value}
      // list="filenameDataList"
      // onChange={(e) => setter(e.target.value)}/>
    // </>
    <div className="relative">
      <input
      id="floating_outlined"
      required={required}
      className="text-xl block py-2.5 px-3 w-full text-slate-700 bg-transparent border-[1px] rounded-xl appearance-none border-[#007480] focus:outline-none focus:ring-0 focus:border-[#004248] peer peer-border-[#FF0000] invalid:border-gray-500"
      placeholder=""
      value={value}
      list="filenameDataList"
      onChange={(e) => setter(e.target.value)}/>
      {/* for floating label, tailwind css code from flowbite */}
      <label htmlFor="floating_outlined" className="select-none absolute text-sm text-[#007480] duration-300 transform -translate-y-4 scale-75 top-2 left-3 z-10 origin-[0] bg-[#EEEEEE] px-2 peer-placeholder-shown:text-gray-500 peer-focus:text-[#004248] peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:left-3 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Nom de fichier</label>
    </div>
  );
};