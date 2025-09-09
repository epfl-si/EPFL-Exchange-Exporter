import { parseString } from "xml2js";

import Event from "@/class/EventClass";

export const callPostAPI = async(req) => {
  const response = await fetch(process.env.AUTH_EWS_SERVICE_ENDPOINT, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'text/xml',
      'Authorization': 'Basic ' + Buffer.from(`${process.env.AUTH_EWS_CREDENTIALS_USERNAME}:${process.env.AUTH_EWS_CREDENTIALS_PASSWORD}`).toString('base64'),
    }),
    body: req
  }).then(res => res.text());

  return { data: response };
}

const getCalendarItems = async (items) => {
  let itemsNormal = items.filter((i) => i["t:Sensitivity"][0].toLowerCase() == "normal");
  let itemsNormalFetchArray = itemsNormal;
  let data = []
  let dataTemp = []

  let indexOfError = -1; // -1 for "not find"

  let loopCondition = true;

  while (loopCondition) {
    let indexSlice = 0;
    let lastIndexSlice = indexSlice;
    const xmlRequest = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
      xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">
      <soap:Header>
        <t:RequestServerVersion Version="Exchange2016" />
      </soap:Header>
      <soap:Body>
        <GetItem xmlns="http://schemas.microsoft.com/exchange/services/2006/messages">
          <ItemShape>
            <t:BaseShape>IdOnly</t:BaseShape>
            <t:AdditionalProperties>
              <t:FieldURI FieldURI="item:Subject"/>
              <t:FieldURI FieldURI="calendar:Start"/>
              <t:FieldURI FieldURI="calendar:End"/>
              <t:FieldURI FieldURI="calendar:Organizer"/>
            </t:AdditionalProperties>
          </ItemShape>
          <ItemIds>
            ${itemsNormalFetchArray.map((item) => `<t:ItemId Id="${item["t:ItemId"][0]["$"].Id}" ChangeKey="${item["t:ItemId"][0]["$"].ChangeKey}"/>`).join("")}
          </ItemIds>
        </GetItem>
      </soap:Body>
    </soap:Envelope>`;

    const res = await callPostAPI(xmlRequest);
    parseString(res.data, function (err, result) {
      dataTemp = result["s:Envelope"]["s:Body"][0]
      ["m:GetItemResponse"]
      [0]
      ["m:ResponseMessages"][0]
      ["m:GetItemResponseMessage"];
    });

    indexOfError = dataTemp.findIndex(d => d["m:ResponseCode"][0].toLowerCase() != "noerror");
    loopCondition = indexOfError != -1;
    if (loopCondition) {
      indexSlice = indexOfError + 1;
    }
    data.push(indexOfError != -1 ? dataTemp.slice(undefined, indexSlice) : dataTemp)
    // data.push({ indexSlice: indexSlice, indexOfError, indexOfError, dataTemp: dataTemp, value: indexOfError != -1 ? dataTemp.slice(undefined, indexSlice) : dataTemp, itemsNormalFetchArrayBefore: itemsNormalFetchArray, itemsNormalFetchArrayAfter: itemsNormalFetchArray.slice(indexSlice) })
    itemsNormalFetchArray = itemsNormalFetchArray.slice(indexSlice);
  }

  data = data.flat(1);



  let idArray = itemsNormal.map(i => i["t:ItemId"][0]["$"].Id);

  // data = data.map((d, index) => d["m:ResponseCode"][0].toLowerCase() == "noerror" ? d["m:Items"][0]["t:CalendarItem"][0] : { a: itemsNormal[index], b: d }) //Let theses lines for debug
  // return { data: data };

  data = data.map((d, index) => d["m:ResponseCode"][0].toLowerCase() == "noerror" ? d["m:Items"][0]["t:CalendarItem"][0] : itemsNormal[index])

  let itemsNormalObject = data.reduce((obj, key) => {
    // obj[key["t:ItemId"][0]["$"].Id] = key;
    obj[key["t:ItemId"][0]["$"].Id] = key;
    return obj;
  }, {})

  console.log(items)
  console.log(items.length)
  items = formateEWSJSONResult(items
    .map(d => !idArray.includes(d["t:ItemId"][0]["$"].Id) ? ({ ...d, ["t:Organizer"]: ( d["t:Organizer"] ? d["t:Organizer"].map(x => ({ ...x, ["t:Mailbox"]: x["t:Mailbox"].map((d2 => ({ ...d2, "t:EmailAddress": ["private email"] }))) })) : [{"t:Mailbox":[{"t:EmailAddress": ["private email"]}]}]), "t:Subject": ["private subject"] }) : itemsNormalObject[d["t:ItemId"][0]["$"].Id] )
    .map((d) => Object.keys(d)
      .filter((x) => { return !["itemid"].includes(x.replace("t:", "").toLowerCase()) })
      .reduce((obj, key) => {
    obj[key] = d[key];
    return obj;
      }, {}))
    .sort((d1, d2) => new Date(d2.start) - new Date(d1.start)))
    .map(x => ({ ...x, organizer: x.organizer["t:Mailbox"][0]["t:EmailAddress"][0] }))
    .map(x => x.organizer.includes("/O=") ? ({ ...x, organizer: "private email", subject: "private subject"}) : x)
    .map((d) => new Event(d.start, d.end, d.subject, d.organizer))

  return { data: items};
}

export default async (params) => {
  const { ressource, start, end } = params;

  const isoStart = (new Date(start)).toISOString();
  const isoEnd = (new Date((new Date(end)).setUTCHours(23, 59, 59, 999))).toISOString();

  const xmlRequest = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages"
      xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"
      xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Header>
      <t:RequestServerVersion Version="Exchange2016" />
    </soap:Header>
    <soap:Body>
      <m:FindItem Traversal="Shallow">
        <m:ItemShape>
          <t:BaseShape>IdOnly</t:BaseShape>
          <t:AdditionalProperties>
            <t:FieldURI FieldURI="item:Subject" />
            <t:FieldURI FieldURI="item:Sensitivity"/>
            <t:FieldURI FieldURI="calendar:Start" />
            <t:FieldURI FieldURI="calendar:End" />
            <t:FieldURI FieldURI="calendar:Organizer" />
          </t:AdditionalProperties>
        </m:ItemShape>
        <m:CalendarView StartDate="${isoStart}" EndDate="${isoEnd}" />
        <m:ParentFolderIds>
          <t:DistinguishedFolderId Id="calendar">
            <t:Mailbox>
              <t:EmailAddress>${ressource}</t:EmailAddress>
            </t:Mailbox>
          </t:DistinguishedFolderId>
        </m:ParentFolderIds>
      </m:FindItem>
    </soap:Body>
  </soap:Envelope>`



  try {
    const response = await callPostAPI(xmlRequest);

    let data = ""
    parseString(response.data, function (err, result) {
      data = result["s:Envelope"]["s:Body"][0]
      ["m:FindItemResponse"][0]
      ["m:ResponseMessages"][0]
      ["m:FindItemResponseMessage"][0];
    });

    // return { data: data };

    // Check if the request occured an error
    if (data["$"]["ResponseClass"] != "Success") {
      return { error: { code: "errUserAccessMissing", message: data["m:MessageText"][0] } }
    }

    data = data["m:RootFolder"][0]

    // Check if the request return 0 events
    if (data["$"].TotalItemsInView == 0) {
      return { data: [] }
    }


    data = data["t:Items"][0]["t:CalendarItem"];
    let items = await getCalendarItems(data)

    return { data: items.data};
  } catch (error) {
    console.error('Error making EWS request:', error);
    return {
      error: {
        code: 'errEWSRequest',
        message: error.toString()
      }
    }
  }
}

const formateEWSJSONResult = (result, filter = false) => {
  if (filter) {
    result = result
    .map((item) => Object.keys(item)
      .filter((x) => { return filter.includes(x.replace("t:", "").toLowerCase()) })
      .reduce((obj, key) => {
        obj[key.replace("t:", "").toLowerCase()] = item[key][0];
        return obj;
      }, {}))
    return result
  }
  // return result;
  result = result
  .map((item) => Object.keys(item)
    .reduce((obj, key) => {
      obj[key.replace("t:", "").toLowerCase()] = item[key][0];
      return obj;
    }, {}))
  return result;
}