import { NextResponse } from "next/server";
import { auth } from "@/auth";
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
    // ["m:ResolutionSet"][0]
    // ["t:Resolution"][0]
    // ["t:Mailbox"][0]
    // ["t:EmailAddress"][0]
  });

  return address;
}

const getAddressFromId = async(id) => {
  const emailIdRequest = id
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

  return address["m:ResolutionSet"][0]
  ["t:Resolution"][0]
  ["t:Mailbox"][0]
  ["t:EmailAddress"][0];
}

export async function GET(request) {

  const headersReq = request.nextUrl.searchParams;

  const requiredParams = ["room", "start", "end"]

  for (let param of requiredParams){
    if (!headersReq.has(param)){
      return NextResponse.json({
        error: `Missing following argument : ${param}`
      });
    }
  }

  const isoStart = (new Date(headersReq.get("start"))).toISOString();
  const isoEnd = (new Date((new Date(headersReq.get("end"))).setUTCHours(23, 59, 59, 999))).toISOString();


//   <m:ItemShape>
//   <t:BaseShape>AllProperties</t:BaseShape>
//   </m:ItemShape>

  //OR

//   <m:ItemShape>
//   <t:BaseShape>IdOnly</t:BaseShape>
//   <t:AdditionalProperties>
//     <t:FieldURI FieldURI="item:Subject" />
//     <t:FieldURI FieldURI="calendar:Start" />
//     <t:FieldURI FieldURI="calendar:End" />
//     <t:FieldURI FieldURI="calendar:Organizer" />
//   </t:AdditionalProperties>
// </m:ItemShape>
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
              <t:EmailAddress>${headersReq.get("room")}</t:EmailAddress>
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

    let items = data["m:RootFolder"][0]["t:Items"][0]["t:CalendarItem"];

    const filter = ["subject", "start", "end", "organizer"]

    items = items
      .map((item) => Object.keys(item)
        .filter((x) => { return filter.includes(x.replace("t:", "").toLowerCase()) })
        .reduce((obj, key) => {
          obj[key.replace("t:", "").toLowerCase()] = item[key][0];
          return obj;
        }, {}))


    items = items.map((item) => {
      item["organizer"] = item["organizer"]["t:Mailbox"][0]["t:EmailAddress"][0];
      return item;
    })

    let addressesIdObject = items.map((item) => item.organizer);
    addressesIdObject = addressesIdObject.filter((item, index) => addressesIdObject.indexOf(item) === index);

    addressesIdObject = await Object.fromEntries(
      await Promise.all(Object.entries(addressesIdObject).map(async([key, value]) => [value, await getAddressFromId(value)])
      ));

    items.map((item) => item.organizer = addressesIdObject[item.organizer])

    items = items.map((item) => new Event(item.start, item.end, item.subject, item.organizer))

    return NextResponse.json({ items: items });

  } catch (error) {
    console.error('Error making EWS request:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      exactError: error.toString()
    })
  }
}