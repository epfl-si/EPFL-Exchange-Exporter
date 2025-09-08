const dayjs = require('dayjs')
const customParseFormat = require("dayjs/plugin/customParseFormat");

require('dotenv').config({ path: '.env.local' })

dayjs.extend(customParseFormat);

const baseUrl = process.env.CYPRESS_BASE_URL
const exportEndpoint = `${baseUrl}/api/export`

const formatDate = "YYYY-MM-DD";

const params = [
  {
    name: "ressource",
    value: process.env.JEST_RESSOURCE
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

const callAPI = async(request, method, header) => {
  const response = await fetch(request, {
    method: method,
    ...header
  });
  const data = await response.json()
  return data;
}

const checkMissingArgs = async (method) => {

  for (let argIndex in params) {
    argIndex = parseInt(argIndex);
    test(`check required arguments : "${params[argIndex].name}"`, async () => {
      const paramsFormat = params.map((x) => `${x.name}=${x.value}`)
      const data = await callAPI(`${exportEndpoint}?${paramsFormat.slice(0, argIndex + 1).join('&')}`, method)
      if (argIndex + 1 < params.length) {
        expect(data).toHaveProperty("error.code", "errMissingArgs")
      }
      else {
        expect(data).toHaveProperty("error.code", "ConnexionFailed")
      }
    })
  }
}

const checkWrongArg = (pms, method, header) => {
  let concerned = pms.filter(element => !params.includes(element))[0];
  test(`${concerned.name} : ${concerned.value} ${concerned.name == "start" || concerned.name == "end" ? `[${dayjs(concerned.value, formatDate, true).isValid()} data]` : ""}`, async () => {
    const paramsFormat = pms.map((x) => `${x.name}=${x.value}`)
    const data = header ? await callAPI(`${exportEndpoint}?${paramsFormat.join('&')}`, method, header) : await callAPI(`${exportEndpoint}?${paramsFormat.join('&')}`, method)
    if (pms.filter((x) => x.value == "2025-11-01").length > 0) {
    }
    if (data.error?.code == "WrongArguments" || data.error?.code == "errUserAccessMissing") {
      switch (data.error?.code) {
        case "errUserAccessMissing":
          expect(data).toHaveProperty("error.message", "EndDate is earlier than StartDate")
          break;
        default:
          expect(data).toHaveProperty("error.code", "WrongArguments")
      }
    }
    else {
      //Check if result is an array
      expect(Array.isArray(data.data)).toBe(true);

      //Check if this array is not empty
      expect(data.data).not.toHaveLength(0);
    }
  })
}

const checkWrongArgs = async (method, header = false) => {
  let pms = params
  for (let param of params) {
    switch (param.name) {
      case "ressource":
        pms = pms.map((x) => x.name == param.name ? { name: x.name, value: "isfose@example.com" } : x)
        checkWrongArg(pms, method, header)
        break;
      case "start":
      case "end":
        let testingDates = ["opefsk", "aaaa-bb-cc", "2025-00-00", "2025-13-12", "2025-02-31", "01-11-2024", "2025-11-01"]
        for (let date of testingDates) {
          let pms = params
          pms = pms.map((x) => x.name == param.name ? { name: x.name, value: date } : x)
          checkWrongArg(pms, method, header)
        }
        break;
      default:
        break;
    }
  }
}

describe("API GET", () => {
  describe("Missing Args with real data", () => {
    checkMissingArgs("GET")
  });

  describe("Wrong data",() => {
    //Waiting forauthentication tests
  })
});

describe("API POST", () => {

  //Create credentials header
  const wrongHeader = {
    headers: {
      authorization: `Bearer ewfefi`
    }
  }

  const header = {
    headers: {
      authorization: `Bearer ${process.env.TESTS_GRAPH_TOKEN}`
    }
  }

  describe("Missing Args with real data", () => {
    checkMissingArgs("POST")
  });

  describe("Test Args", () => {
    checkWrongArgs("POST", header);
  })

  describe("Token Tests", () => {
    test(`check required headers (random token)`, async () => {
      //Check with random credentials
      let data = await callAPI(`${exportEndpoint}?${params.map((x) => `${x.name}=${x.value}`).join('&')}`, "POST", wrongHeader)
      expect(data).toHaveProperty("error.code", "InvalidAuthenticationToken")
    })

    test(`check required headers (correct token) and on-prem address`, async () => {
      //Change credentials header to add real cedentials
      header.headers.authorization = `Bearer ${process.env.TESTS_GRAPH_TOKEN}`

      //Check with real credentials
      data = await callAPI(`${exportEndpoint}?${params.map((x) => `${x.name}=${x.value}`).join('&')}`, "POST", header)

      //Check if result is an array
      expect(Array.isArray(data.data)).toBe(true);

      //Check if this array is not empty
      expect(data.data).not.toHaveLength(0);
    })

    test(`check required headers (correct token) and microsoft entra id address`, async () => {
      //Change credentials params to add microsoft entra ID address
      let localParams = params.map((x) => x.name == "ressource" ? { name: x.name, value: process.env.JEST_RESSOURCE_ENTRA } : x)

      //Check with real credentials
      data = await callAPI(`${exportEndpoint}?${localParams.map((x) => `${x.name}=${x.value}`).join('&')}`, "POST", header)

      //Check if result is an array
      expect(Array.isArray(data.data)).toBe(true);

      //Check if this array is not empty
      expect(data.data).not.toHaveLength(0);
    })
  });

  describe("On Prem request", () => {
    //Check When user doesn't exists
    test(`request : no user`, async () => {
      //Check with real credentials
      data = await callAPI(`${exportEndpoint}?ressource=skjfesofjmsef@epfl.ch&start=2000-02-07&end=2001-12-19`, "POST", header)

      //Check if get correct error
      expect(data).toHaveProperty("error.code", "ErrorInvalidUser")
    })

    //Check When no data exists
    test(`request : no data`, async () => {
      //Check with real credentials
      data = await callAPI(`${exportEndpoint}?ressource=${process.env.JEST_RESSOURCE_ENTRA}&start=2000-02-07&end=2001-12-19`, "POST", header)

      //Check if get correct error
      expect(data).toHaveProperty("error.code", "errNoData")
    })

    //Check When range too high
    test(`request : too high range`, async () => {
      //Check with real credentials
      data = await callAPI(`${exportEndpoint}?ressource=${process.env.JEST_RESSOURCE}&start=2000-02-07&end=2025-12-19`, "POST", header)

      //Check if get correct error
      expect(data).toHaveProperty("error.code", "errUserAccessMissing")
    })
  });

  describe("Entra ID request", () => {
    //Check When no data exists
    test(`request : no data`, async () => {
      //Check with real credentials
      data = await callAPI(`${exportEndpoint}?ressource=${process.env.JEST_RESSOURCE}&start=2000-02-07&end=2001-12-19`, "POST", header)

      //Check if get correct error
      expect(data).toHaveProperty("error.code", "errUserNoData")
    })

    //Check When range too high
    test(`request : too high range`, async () => {
      //Check with real credentials
      data = await callAPI(`${exportEndpoint}?ressource=${process.env.JEST_RESSOURCE_ENTRA}&start=2000-02-07&end=2025-12-19`, "POST", header)

      //Check if get correct error
      expect(data).toHaveProperty(
        "error.code", "ErrorInvalidRequest")
    })
  });
});