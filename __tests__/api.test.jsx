require('dotenv').config({ path: '.env.local' })

const baseUrl = process.env.CYPRESS_BASE_URL
const exportEndpoint = `${baseUrl}/api/export`

const params = [
  {
    name: "room",
    value: process.env.JEST_ROOM
  },
  {
    name: "start",
    value: "2025-01-16"
  },
  {
    name: "end",
    value: "2025-01-17"
  }
];

const checkMissingArgs = async (method) => {

  for (let argIndex in params) {
    argIndex = parseInt(argIndex);
    test(`check required arguments : "${params[argIndex].name}"`, async () => {
      const paramsFormat = params.map((x) => `${x.name}=${x.value}`)
      const data = await callAPI(`${exportEndpoint}?${paramsFormat.slice(0, argIndex + 1).join('&')}`, method)
      const paramsFormatReturned = params.map((x) => x.name)
      if (argIndex + 1 < params.length) {
        expect(data).toHaveProperty("error", {"code": "errMissingArgs", "message": `Missing following argument : ${paramsFormatReturned[argIndex + 1]}`})
      }
      else {
        expect(data).toHaveProperty("error", {"code": "ConnexionFailed", "message": "Credentials error, please connecting you to your account."})
      }
    })
  }
}

describe("API GET", () => {
  describe("Missing Args", () => {
    checkMissingArgs("GET")
  });

  describe("Real data", () => {
    //Code here to check if real data (email syntax, correct date...)
  })
});

describe("API POST", () => {
  describe("Missing Args", () => {
    checkMissingArgs("POST")
  });

  //Create credentials header
  const header = {
    headers: {
      authorization: `Bearer ewfefi`
    }
  }

  describe("Token Tests", () => {
    test(`check required headers (random token)`, async () => {
      //Check with random credentials
      let data = await callAPI(`${exportEndpoint}?${params.map((x) => `${x.name}=${x.value}`).join('&')}`, "POST", header)
      expect(data).toHaveProperty("error.code", "InvalidAuthenticationToken")
    })

    test(`check required headers (correct token) and on-prem address - return data`, async () => {
      //Change credentials header to add real cedentials
      header.headers.authorization = `Bearer ${process.env.TESTS_GRAPH_TOKEN}`

      //Check with real credentials
      data = await callAPI(`${exportEndpoint}?${params.map((x) => `${x.name}=${x.value}`).join('&')}`, "POST", header)

      //Check if result is an array
      expect(Array.isArray(data.data)).toBe(true);

      //Check if this array is not empty
      expect(data.data).not.toHaveLength(0);
    })

    test(`check required headers (correct token) and microsoft entra id address - return data`, async () => {
      //Change credentials params to add microsoft entra ID address
      let localParams = params.map((x) => x.name == "room" ? { name: x.name, value: process.env.JEST_ROOM_ENTRA } : x)

      //Check with real credentials
      data = await callAPI(`${exportEndpoint}?${localParams.map((x) => `${x.name}=${x.value}`).join('&')}`, "POST", header)

      //Check if result is an array
      expect(Array.isArray(data.data)).toBe(true);

      //Check if this array is not empty
      expect(data.data).not.toHaveLength(0);
    })
  });

  describe("On Prem request", () => {

  });

  describe("Entra ID request", () => {
    //Check When no data exists
    test(`request : no data`, async () => {
      //Check with real credentials
      data = await callAPI(`${exportEndpoint}?room=${process.env.JEST_ROOM_ENTRA}&start=2000-02-07&end=2001-12-19`, "POST", header)

      //Check if get correct error
      expect(data).toHaveProperty(
        "error",
        {
          code: "errNoData",
          message: "Your request can't be completed. The range between the start and end dates does not contain events."
        })
    })

    //Check When range too high
    test(`request : too high range`, async () => {
      //Check with real credentials
      data = await callAPI(`${exportEndpoint}?room=${process.env.JEST_ROOM_ENTRA}&start=2000-02-07&end=2025-12-19`, "POST", header)

      //Check if get correct error
      expect(data).toHaveProperty(
        "error",
        {
          code: "ErrorInvalidRequest",
          message: "Your request can't be completed. The range between the start and end dates is greater than the allowed range. Maximum number of days: 1825"
        })
    })
  });
});












const callAPI = async(request, method, header) => {
  const response = await fetch(request, {
    method: method,
    ...header
  });
  const data = await response.json()
  return data;
}