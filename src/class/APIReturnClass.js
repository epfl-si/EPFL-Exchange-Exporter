export default class{
  constructor(data, header){
    if (data.error) {
      this.status = "fail";
      this.error = {
        ...data.error,
        url: `${header.get('X-Forwarded-Proto')}://${header.get('host')}/docs/api/errors#${data.error.code}`,
      }
    }
    else {
      this.status = "success";
      this.data = data.data;
    }
  }
};