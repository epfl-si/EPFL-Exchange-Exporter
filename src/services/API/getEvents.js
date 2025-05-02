import getEventCount from "../getEventCount";
import getOnPremEvents from "./getOnPremEvents";
import getExchangeEvents from "./getExchangeEvents";

import { manageError } from "../exportManager";
import DownloadData from "@/class/downloadDataClass";

export default async (option) => {
  const resultJSON = await getEventCount(option);

  if (resultJSON?.error) {
    switch (resultJSON.error.code) {
      case "MailboxNotEnabledForRESTAPI":
        const data = await getOnPremEvents(option);
        return data;
      default:
        return resultJSON?.error;
    }
  }

  if (resultJSON.count <= 0 || resultJSON.count > 1000){
    let err = manageError(resultJSON.count <= 0 ? noData : `${muchData},${resultJSON.count}`, setIsLoading);
    return new DownloadData(
        {
            state : err.data.state,
            label : err.data.label,
            isExpired : err.isExpired,
            rewrite : false,
            error : err.error,
            errorName : err.errorName
        });
  }
  if (option.isFrontend) {
    option.setLoadingLabel({ label: "loaderNbData", nb: resultJSON.count });
  }
  const data = await getExchangeEvents(option);
  return data;
}