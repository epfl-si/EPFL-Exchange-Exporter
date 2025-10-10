export default class DownloadData{
    constructor({state="", title="", label="", value="", isExpired="", error="", errorName=""}){
        this.alertbox =
        {
            status: state,
            title: title,
            label: label,
            button :
            {
                value: value
            }
        };
        this.status =
        {
            ...state,
            isExpired: isExpired
        };
        this.error = error;
        this.errorName = errorName;
    }
};