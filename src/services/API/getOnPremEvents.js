import { parseString } from "xml2js";
import axios from "axios";

import Event from "@/class/EventClass";

const callApi = async(req) => {
  const response = await axios.post(
    process.env.SERVICE_ENDPOINT,
    req,
    {
      headers: {
        'Content-Type': 'text/xml',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.CREDENTIALS_USERNAME}:${process.env.CREDENTIALS_PASSWORD}`).toString('base64'),
      }
    }
  );

  let address = ""

  parseString(response.data, function (err, result) {
    address = result["s:Envelope"]["s:Body"][0]
    ["m:ResolveNamesResponse"][0]
    ["m:ResponseMessages"][0]
    ["m:ResolveNamesResponseMessage"][0]
  });

  return address;
}

const getCalendarItems = async(items) => {
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
          ${items.map((item) => `<t:ItemId Id="${item.Id}" ChangeKey="${item.ChangeKey}"/>`).join("")}
        </ItemIds>
      </GetItem>
    </soap:Body>
  </soap:Envelope>`

  let data;
  const res = await fetch(process.env.SERVICE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml',
      'Authorization': 'Basic ' + Buffer.from(`${process.env.CREDENTIALS_USERNAME}:${process.env.CREDENTIALS_PASSWORD}`).toString('base64'),
    },
    body: xmlRequest
  })

  const response = await res.text();

  parseString(response, function (err, result) {
    data = result["s:Envelope"]["s:Body"][0]
    ["m:GetItemResponse"]
    [0]
    ["m:ResponseMessages"][0]
    ["m:GetItemResponseMessage"];
  });

  data = formateEWSJSONResult(data.map(d => d["m:Items"][0]["t:CalendarItem"][0]))
    .map((d) => { d.organizer = d.organizer["t:Mailbox"][0]["t:EmailAddress"][0]; return d; })
    .map((d) => Object.keys(d)
      .filter((x) => { return !["itemid"].includes(x.replace("t:", "").toLowerCase()) })
      .reduce((obj, key) => {
    obj[key] = d[key];
    return obj;
      }, {}))
    .map((d) => new Event(d.start, d.end, d.subject, d.organizer))

  return { data: data};
}

const getAddressFromId = async(emailIdRequest) => {
  const xmlRequest = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">
  <soap:Header>
    <t:RequestServerVersion Version="Exchange2013" />
  </soap:Header>
  <soap:Body>
    <ResolveNames xmlns="http://schemas.microsoft.com/exchange/services/2006/messages"
      ReturnFullContactData="true"
      SearchScope="ActiveDirectory">
      <UnresolvedEntry>${emailIdRequest}</UnresolvedEntry>
    </ResolveNames>
  </soap:Body>
</soap:Envelope>
`
  const xmlRequest500 = `
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">
  <soap:Header>
    <t:RequestServerVersion Version="Exchange2013" />
  </soap:Header>
  <soap:Body>
    <ResolveNames xmlns="http://schemas.microsoft.com/exchange/services/2006/messages"
      ReturnFullContactData="true"
      SearchScope="ActiveDirectory">
      <UnresolvedEntry>X500:${emailIdRequest}</UnresolvedEntry>
    </ResolveNames>
  </soap:Body>
</soap:Envelope>
`

  let address = await callApi(xmlRequest)

  if (address["$"]["ResponseClass"] == "Error") {
    address = await callApi(xmlRequest500)
  }

  return { address: address, emailIdRequest: emailIdRequest };
}

export default async (params) => {
  const { room, start, end } = params;

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
            <t:FieldURI FieldURI="calendar:Start" />
            <t:FieldURI FieldURI="calendar:End" />
            <t:FieldURI FieldURI="calendar:Organizer" />
          </t:AdditionalProperties>
        </m:ItemShape>
        <m:CalendarView StartDate="${isoStart}" EndDate="${isoEnd}" />
        <m:ParentFolderIds>
          <t:DistinguishedFolderId Id="calendar">
            <t:Mailbox>
              <t:EmailAddress>${room}</t:EmailAddress>
            </t:Mailbox>
          </t:DistinguishedFolderId>
        </m:ParentFolderIds>
      </m:FindItem>
    </soap:Body>
  </soap:Envelope>`



  try {
    const response = await axios.post(
      process.env.SERVICE_ENDPOINT,
      xmlRequest,
      {
        headers: {
          'Content-Type': 'text/xml',
          'Authorization': 'Basic ' + Buffer.from(`${process.env.CREDENTIALS_USERNAME}:${process.env.CREDENTIALS_PASSWORD}`).toString('base64'),
        }
      }
    );

    let data = ""
    parseString(response.data, function (err, result) {
      data = result["s:Envelope"]["s:Body"][0]
      ["m:FindItemResponse"][0]
      ["m:ResponseMessages"][0]
      ["m:FindItemResponseMessage"][0];
    });

    // Check if the request occured an error
    if (data["$"]["ResponseClass"] != "Success") {
      return {error: data["m:MessageText"][0]}
    }

    data = data["m:RootFolder"][0]

    // Check if the request return 0 events
    if (data["$"].TotalItemsInView == 0) {
      return {error: "No datas during provided period."}
    }

    let items = data["t:Items"][0]["t:CalendarItem"];

    items = items
      .map((item) => Object.keys(item)
        .filter((x) => { return ["itemid"].includes(x.replace("t:", "").toLowerCase()) })
        .reduce((obj, key) => {
          obj[key.replace("t:", "").toLowerCase()] = item[key][0];
          return obj;
        }, {}))

    items = items.map(item=>item.itemid["$"])
    items = await getCalendarItems(items)
    return { data: items.data};
  } catch (error) {
    console.error('Error making EWS request:', error);
    return {
      error: {
        code: 'Internal Server Error',
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
  result = result
  .map((item) => Object.keys(item)
    .reduce((obj, key) => {
      obj[key.replace("t:", "").toLowerCase()] = item[key][0];
      return obj;
    }, {}))
  return result;
}