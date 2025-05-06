import getEventCount from "../getEventCount";
import getOnPremEvents from "./getOnPremEvents";
import getExchangeEvents from "./getExchangeEvents";

export default async (option) => {
  const resultJSON = await getEventCount(option);
  if (resultJSON?.error) {
    switch (resultJSON.error.code) {
      case "MailboxNotEnabledForRESTAPI":
        const data = await getOnPremEvents(option);
        return data;
      default:
        return resultJSON;
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
        error: {
          code: "errNoData",
          message: "Your request can't be completed. The range between the start and end dates does not contain events."
        }
      };
    }
  }
  const data = await getExchangeEvents(option);
  return data;
}