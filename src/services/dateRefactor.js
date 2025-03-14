export const changeUTC = (dateStr, utc=1) =>{
  let date = new Date(dateStr);
  return new Date(date.setUTCHours(date.getUTCHours() + utc));
}

export const changeFormat = (date) =>{
  return date.toISOString();
}