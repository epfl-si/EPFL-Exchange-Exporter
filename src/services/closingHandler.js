export default (key) =>{
  switch(key.keyCode){
    case 13: // Enter
    case 32: // Space
      return true;
    default:
      return false;
  }
};