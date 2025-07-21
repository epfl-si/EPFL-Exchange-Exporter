import { useEffect, useState } from "react";

export default ({ label = "", paramsKeyValue, setParamsKeyValue }) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    const paramsKeyValueTemp = structuredClone(paramsKeyValue);
    paramsKeyValueTemp.filter(p => p.label == label)[0].value = value;
    setParamsKeyValue(paramsKeyValueTemp);
  }, [value])
    return (
      <div>
        <input type="text" placeholder={label} value={value} onChange={(e)=>setValue(e.target.value)}/>
      </div>
    );
};