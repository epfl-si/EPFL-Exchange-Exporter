// "use client";
export default ({value, setter, required=false}) => {
  return (
    <input
    required={required}
    className="text-xl text-right block py-2.5 px-0 w-full text-slate-700 bg-transparent border-0 border-b-2 appearance-none placeholder:text-gray-400 border-[#FF0000] focus:outline-none focus:ring-0 focus:border-[#B51F1F] peer"
    placeholder="fichier"
    value={value}
    onChange={(e) => setter(e.target.value)}/>
  );
};