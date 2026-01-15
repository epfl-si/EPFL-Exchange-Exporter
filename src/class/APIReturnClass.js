import docs from "/public/json/docs.json"

// infoKeywordList = [];
// warningKeywordList = [];

export default class {
  constructor(data, header){
    if (data.error) {
      // this.status = infoKeywordList.includes(data.error.code) ? "info" : warningKeywordList.includes(data.error.code) ? "warning" : "info";
      console.log(data.error)
      this.status = docs.errors.filter(x => x.code == data.error.code)[0].status;
      this.error = {
        ...data.error,
        url: `${header.get('X-Forwarded-Proto')}://${header.get('host')}/docs/api/errors#${data.error.code}`,
      }
    }
    else {
      this.status = {
        code: 200,
        name: "success"
      };
      this.data = data.data;
    }
  }
};