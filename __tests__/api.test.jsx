test("API returns missing params", async () => {

  let data = await callAPI(`http://localhost:3001/api/export`);
  expect(data).toHaveProperty("error", "Missing following argument : room");

  const params = [
    {
      name: "room",
      value: "abc@a.ch"
    },
    {
      name: "start",
      value: "aaa"
    },
    {
      name: "end",
      value: "bbb"
    }
  ];

  for (let argIndex in params) {
    argIndex = parseInt(argIndex);
    const paramsFormat = params.map((x) => `${x.name}=${x.value}`)
    const data = await callAPI(`http://localhost:3001/api/export?${paramsFormat.slice(0, argIndex + 1).join('&')}`)
    const paramsFormatReturned = params.map((x) => x.name)
    if (argIndex + 1 < params.length) {
      expect(data).toHaveProperty("error", `Missing following argument : ${paramsFormatReturned[argIndex + 1]}`)
    }
    else {
      expect(data).toHaveProperty("error", {"code": "ConnexionFailed", "message": "Credentials error, please connecting you to your account."})
    }
  }
})

const callAPI = async(request) => {
  const response = await fetch(request, {
    method: "GET"
  });
  const data = await response.json()

  return data;
}