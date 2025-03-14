export default ({value, setter, label, required=false}) => {

  return (
  <div className="flex items-start flex-col">
    {label ? <label className="text-black">{label}</label> : <></>}
    <div className="relative max-w-48">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
        <svg className="w-4 h-4 text-white " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
        </svg>
      </div>
      <input
      required={required}
      onChange={(e) => {setter(e.target.value)}}
      value={value}
      id="default-datepicker"
      type="date"
      className="bg-[#e02222] border  text-white text-sm rounded-lg block w-full ps-10 p-2.5 placeholder-white outline-none font-bold"/>
    </div>
  </div>
  );
};