export default ({isLastMissing, isClickedSetter}) => {
  return (
    <button className="bg-[#00A79F] hover:bg-[#007480] active:bg-[#004248] text-white font-bold py-2 px-4 rounded inline-flex items-center" type="submit" onClick={()=> {if (isLastMissing){isClickedSetter(true)}}}>
      <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
      <span>Télécharger</span>
    </button>
  );
};