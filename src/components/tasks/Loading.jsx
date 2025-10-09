import loader from "/public/img/loader.gif";
import BackgroundTasks from "./BackgroundTasks";

import Image from 'next/image'

export default ({label}) =>{
    return (
      <BackgroundTasks>
        <Image id="loadingImg" src={loader.src} draggable={false} width={96} height={96} alt="Loading Icon"/>
        <span className="text-center w-36 text-lg font-bold">{label}</span>
      </BackgroundTasks>
    );
};