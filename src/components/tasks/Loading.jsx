import loader from "/public/img/loader.gif";
import BackgroundTasks from "./BackgroundTasks";

export default ({label}) =>{
    return (
      <BackgroundTasks>
        <img id="loadingImg" className="w-24 h-24" src={loader.src} draggable={false}/>
        <span className="text-center w-36 text-lg font-bold">{label}</span>
      </BackgroundTasks>
    );
};