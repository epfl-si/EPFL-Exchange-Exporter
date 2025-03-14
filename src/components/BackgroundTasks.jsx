"use client"

export default ({children}) =>{
    return (
      <div className="flex flex-col absolute bg-gray-100 w-full h-full top-0 left-0 justify-center items-center select-none bg-opacity-90">
        {children}
      </div>
    );
};