// "use client";
export default ({value, setter, required=false}) => {
  return (
    <>
      <select required={required} onChange={(e) => setter(e.target.value)} id="underline_select" value={value}
      className="text-xl text-block py-2.5 px-0 w-full text-slate-700 bg-transparent border-0 border-b-2 border-[#FF0000] focus:outline-none focus:ring-0 focus:border-[#B51F1F] peer invalid:text-gray-400" //appearance-none
      >
          <option value="" hidden disabled>.extension</option>
          <option value="csv">.csv</option>
          <option value="json">.json</option>
      </select>
    </>
  );
};