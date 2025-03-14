export default (text) =>{
  //ref : the accepted answer at https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}