
import connect from "@/services/connect";

export default () =>{
    return (
      <button onClick={() => connect()} className="hover:text-[#FF0000] hover:cursor-pointer">
        Sign In
      </button>
    );
};