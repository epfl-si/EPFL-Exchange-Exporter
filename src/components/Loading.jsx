import loader from "/public/img/loader.gif";
import BackgroundTasks from "./BackgroundTasks";

export default ({label = "Chargement"}) =>{
    return (
      <BackgroundTasks>
        <img className="w-24 h-24" src={loader.src} draggable={false}/>
        <span className="text-center w-36 font-bold">{label}</span>
      </BackgroundTasks>
    );
};