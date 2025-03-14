export default class DownloadData{
    constructor({state="", title="", label="", value="", isExpired="", rewrite="", error=""}){
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
            rewrite: rewrite,
            error: error
        };
    }
};