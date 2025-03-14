import loader from "/public/img/loader.gif";

export default ({label = "Chargement"}) =>{
    return (
      <div className="flex flex-col absolute bg-white w-full h-full top-0 left-0 justify-center items-center select-none opacity-95">
        <img className="w-24 h-24" src={loader.src} draggable={false}/>
        <span className="text-center w-36 font-bold">{label}</span>
      </div>
    );
};