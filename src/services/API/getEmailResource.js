import { parseString } from "xml2js";
import { callPostAPI } from "./getOnPremEvents";

export default async () => {
  const xmlRequestRoom = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"
  xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages">
  <soap:Header>
    <t:RequestServerVersion Version="Exchange2013" />
  </soap:Header>
  <soap:Body>
    <m:FindPeople>
      <m:IndexedPageItemView MaxEntriesReturned="1000" Offset="0" BasePoint="Beginning" />
      <m:ParentFolderId>
        <t:DistinguishedFolderId Id="directory" />
      </m:ParentFolderId>
      <m:QueryString>room</m:QueryString>
    </m:FindPeople>
  </soap:Body>
</soap:Envelope>
`;

  const xmlRequestEquipment = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"
  xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages">
  <soap:Header>
    <t:RequestServerVersion Version="Exchange2013" />
  </soap:Header>
  <soap:Body>
    <m:FindPeople>
      <m:IndexedPageItemView MaxEntriesReturned="1000" Offset="0" BasePoint="Beginning" />
      <m:ParentFolderId>
        <t:DistinguishedFolderId Id="directory" />
      </m:ParentFolderId>
      <m:QueryString>equipment</m:QueryString>
    </m:FindPeople>
  </soap:Body>
</soap:Envelope>
`;

  let data = [];

  const resRoom = await callPostAPI(xmlRequestRoom);
  const resEquipment = await callPostAPI(xmlRequestEquipment);

  for (let res of [resRoom, resEquipment]) {
    let dataTemp;
    parseString(res.data, function (err, result) {
      dataTemp = result["s:Envelope"]["s:Body"][0].FindPeopleResponse[0];
    });

    if (dataTemp.ResponseCode[0].toLowerCase() != "noerror") {
      return [];
    }

    data = data.concat(dataTemp.People[0].Persona
      .map(p => ({ display: p.DisplayName[0], address: p.EmailAddresses[0].Address[0].EmailAddress[0].toLowerCase() })));
  }
  return data;
}