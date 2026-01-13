class SelectKeyValue{
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

export default (select) => {
  select = !select.includes(",") ?
    [select] :
    select.split(",")
    ; //Convert to array
  select = select.map(value => value.includes(":") ? new SelectKeyValue(value.split(":")[0], value.split(":")[1]) : new SelectKeyValue(value, value))
    ; //Change array value to key pair value
  return select;
};

export const RewriteKeyValue = (data, select) =>{
  let allEvents = data;
  if (select) {
    allEvents = allEvents.map(event => {
      const newEvent = {}
      for (let element of select) {
        newEvent[element.value] = event[element.key];
      }
      return (newEvent);
    });
  }
  return allEvents;
}