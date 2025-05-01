export default (headersReq, requiredParams) => {
    for (let param of requiredParams){
      if (!headersReq.has(param)){
        return {
          state: "error",
          value: {
            error: `Missing following argument : ${param}`
          }
        };
      }
    }
  return {
    state: "success"
  };
}