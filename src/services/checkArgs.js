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

  // console.log("#################################################")
  // console.log(!dayjs(option.start, 'YYYY-MM-DD', false).isValid())
  // console.log(!dayjs(option.end, 'YYYY-MM-DD', false).isValid())
  // console.log("#################################################")

  //Check email resource format
  let isArgsWrong = checkEmailValidity(option.resource);
  //Check date format (start)
  isArgsWrong =
    isArgsWrong.state == true ?
      !dayjs(option.start, 'YYYY-MM-DD', true).isValid() ?
        { state: false, cause: "start" } :
        isArgsWrong :
      isArgsWrong;

  //Check date format (end)
  isArgsWrong =
    isArgsWrong.state == true ?
      !dayjs(option.end, 'YYYY-MM-DD', true).isValid() ?
        { state: false, cause: "end" } :
        isArgsWrong :
      isArgsWrong;

  return isArgsWrong;
}

export const checkEmailValidity = (email) => {
  let emailDomain = "epfl.ch"
  let isArgsWrong = email.includes(`@${emailDomain}`) && email.split("@")[email.split("@").length - 1] == emailDomain && email.split("@").length - 1 == 1 ? { state: true, cause: "resource" } : { state: false, cause: "resource" };
  return isArgsWrong;
}