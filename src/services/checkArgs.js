import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

export const checkArgsMissing = (headersReq, requiredParams) => {
  for (let param of requiredParams){
    if (!headersReq.has(param)){
      return {
        state: "error",
        value: {
          error: {
            code: "errMissingArgs",
            message: `Missing following argument : ${param}`
          }
        }
      };
    }
  }
  return {
    state: "success"
  };
}

export const checkArgsValidity = (option) => {
  //Add necessary plugins to check date format strictly
  dayjs.extend(customParseFormat);

  //Check email room format
  let emailDomain = "epfl.ch"
  let isArgsWrong = option.room.includes(`@${emailDomain}`) && option.room.split("@")[option.room.split("@").length - 1] == emailDomain && option.room.split("@").length - 1 == 1 ? { state: true, cause: "room" } : { state: false, cause: "room" };

  //Check date format (start)
  isArgsWrong =
    isArgsWrong.state == true ?
      !dayjs(option.start, 'YYYY-MM-DD', false).isValid() ?
        { state: false, cause: "start" } :
        isArgsWrong :
      isArgsWrong;

  //Check date format (end)
  isArgsWrong =
    isArgsWrong.state == true ?
      !dayjs(option.end, 'YYYY-MM-DD', false).isValid() ?
        { state: false, cause: "end" } :
        isArgsWrong :
      isArgsWrong;

  return isArgsWrong;
}