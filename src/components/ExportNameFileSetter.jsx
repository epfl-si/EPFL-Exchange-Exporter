import InputText from "./InputText";
export default ({value, setter, placeholder, required=false}) => {

  return (
    <InputText id="floating_outlined" value={value} setter={setter} placeholder={placeholder} required={required}/>
  );
};