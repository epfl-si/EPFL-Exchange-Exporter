import textRefactor from "./textRefactor";
import DownloadData from "@/class/downloadDataClass";
import { ExportedEvent } from "@/class/EventClass";

const getCSV = (data)=>{

    let lineArray = [];
    let result = "";

    let first = true;
    for (let d of data){
        if (first){
        lineArray.push(Object.keys(d));
        first = !first;
        }
        lineArray.push(Object.values(d));
    }

    for (let line of lineArray){
        result += `${line.join(',')}\n`
    }
    return result;
}

const createDownload = (fileData, fileName, fileType) =>{
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${fileName}.${fileType}`;
    link.href = url;
    link.click();
    return blob;
}

const createFile = (params) => {
    const { filename, extension, data } = params;
    let fileName = filename || "data";
    let fileType = extension || "csv";

    let fileData = "";

    switch(fileType){
        case "csv":
            fileData = getCSV(data);
            break;
        case "json":
            fileData = JSON.stringify(data, null, 2);
            break;
        default:
            fileData = `file extension "${fileType}" doesn't recognize.`
            break;
    }

    createDownload(fileData, fileName, fileType);
    return new DownloadData(
        {
            state : "check",
            errorName : "DownloadSuccess",
            rewrite : true
        });
}

const downloadFile = async(data) =>{

    let { authSession, filename, extension, startDate, endDate, userSearch, setIsLoading, website } = data;

    const option = {
        resource: userSearch,
        start: startDate,
        end: endDate,
        session: authSession
    }
    // const response = await getEvents(option);
    let response = await fetch(`${website}/api/export?resource=${option.resource}&start=${option.start}&end=${option.end}`, {
        method: 'GET',
        headers: new Headers({
            'Authorization': `Bearer ${option.session.accessToken}`
        })
    }).then((r) => { return r.json() });

    if (response?.data?.length == 0) {
        response = {
            error: { code: "errUserNoData", message: "No data during provided period." }
        }
    }

    if (!response?.error) {
        console.log(response.data)
        let options = {
            filename: filename,
            extension: extension,
            data: response.data.map(d => new ExportedEvent(d))
        }
        console.log(data.data)
        return createFile(options);
    }
    else{
        setIsLoading(false);
        return new DownloadData(
            {
                state : response.status,
                error : response.error,
                errorName : response.error.code,
                rewrite : false
            });
    }
}

export default downloadFile;