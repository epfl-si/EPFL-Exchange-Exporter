import { useMediaQuery } from "react-responsive";

export default ({ isLastMissing, isClickedSetter, label, ref = null }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
  return (
    <button ref={ref} className={`bg-[#FF0000] hover:bg-[#c90000] active:bg-[#B51F1F] text-white font-bold py-2 ${isMobile ? "justify-center" : "px-4"} rounded inline-flex items-center`} type="submit" onClick={()=> {if (isLastMissing){isClickedSetter(true)}}}>
      <svg className="fill-current size-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
      <span>{label}</span>
    </button>
  );
};