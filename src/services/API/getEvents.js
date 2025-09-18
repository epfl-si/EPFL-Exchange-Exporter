import getEventCount from "../getEventCount";
import getOnPremEvents from "./getOnPremEvents";
import { getExchangeEvents, getEchangeEventsBusy } from "./getExchangeEvents";
import ConvertSelectKeyValue from "./ConvertSelectKeyValue";

export default async (option) => {
  // console.log(option.select)
  if (option.select) {
    option.select = ConvertSelectKeyValue(option.select);
  }
  const resultJSON = await getEventCount(option);
  if (resultJSON?.error) {
    switch (resultJSON.error.code) {
      case "MailboxNotEnabledForRESTAPI":
        const data = await getOnPremEvents(option);
        return data;
      case "ErrorItemNotFound":
        const response = await getEchangeEventsBusy(option);
        return response;
      default:
        switch (resultJSON.error.code) {
          case "ErrorInvalidParameter":
            return { ...resultJSON, error: { ...resultJSON.error, code: "errParameters" } };
          default:
            return resultJSON;
        }
    }
  }

  const maxEvents = 1000;
  if (resultJSON.count <= 0 || resultJSON.count > maxEvents) {
    if (resultJSON.count > maxEvents) {
      return {
        error: {
          code: "errTooMuchData",
          message: `Your request can't be completed. The range between the start and end dates contains more events that the API can manage. ${resultJSON.count} are returned and the max is ${maxEvents}`
        }
      };
    }
    else {
      return {
        data: []
      };
    }
  }
  const data = await getExchangeEvents(option);
  return data;
}