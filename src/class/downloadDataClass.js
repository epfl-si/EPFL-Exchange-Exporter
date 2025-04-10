export default class DownloadData{
    constructor({state="", title="", label="", value="", isExpired="", rewrite="", error="", errorName=""}){
        this.alertbox =
        {
            state: state,
            title: title,
            label: label,
            button :
            {
                value: value
            }
        };
        this.state =
        {
            isExpired: isExpired,
            rewrite: rewrite
        };
        this.error = error;
        this.errorName = errorName;
    }
};