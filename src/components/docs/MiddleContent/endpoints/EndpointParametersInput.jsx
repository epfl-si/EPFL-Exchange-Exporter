import { useEffect, useState } from "react";

export default ({ params, placeholder = "", paramsKeyValue, setParamsKeyValue }) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    const paramsKeyValueTemp = structuredClone(paramsKeyValue);
    paramsKeyValueTemp.filter(p => p.key == params.key)[0].value = value;
    setParamsKeyValue(paramsKeyValueTemp);
  }, [value])
    return (
        // <div className="flex flex-col">
        //   <label>{params}</label>
        //   <input type="text" placeholder={placeholder} value={value} onChange={(e)=>setValue(e.target.value)}/>
        // </div>
        // <tr className="last:!bg-yellow-600 last:[&>*:first]:!text-blue-600">
        <tr className="">
          <td>{params.key}<span className="text-red-600">{JSON.parse(params.required) ? " *" : ""}</span></td>
          <td className="pl-2">
            <input className="bg-transparent outline-none w-full" type="text" placeholder={placeholder} value={value} onChange={(e)=>setValue(e.target.value)}/>
          </td>
        </tr>
    );
};