import textRefactor from "./textRefactor";
import DownloadData from "@/class/downloadDataClass";
import { ExportedEvent } from "@/class/EventClass";

import { logExport } from "./logs";

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
            state: { name: "check" },
            errorName : "DownloadSuccess"
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
    const url = `${website}/api/export?resource=${option.resource}&start=${option.start}&end=${option.end}`;
    let response = await fetch(url, {
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
        let options = {
            filename,
            extension,
            data: response.data.map(d => new ExportedEvent(d))
        }
        const file = createFile(options)
        setIsLoading(false);

        const userLog = data.authSession?.user;
        delete userLog.image;

        const optionsLog = options
        delete optionsLog.data;
        optionsLog["resource"] = option.resource;
        optionsLog["start"] = option.start;
        optionsLog["end"] = option.end;
        optionsLog["url"] = option.url;

        response["eventLength"] = response.data.length;
        delete response.data;

        const logData = {
            // user: data.authSession?.user.filter(user => !user.image),
            user: userLog,
            options: optionsLog,
            // options: options.filter(option => !option.setLoadingLabel && !option.setIsLoading && !option.website),
            response,
        };
        logExport(logData);
        return file;
    }
    else{
        setIsLoading(false);
        const options = {
            filename,
            extension,
            resource: option.resource,
            start: option.start,
            end: option.end,
            url: option.url,
        }
        const result = {
            response,
            options,
        };
        const usr = data.authSession?.user;
        delete usr.image;
        const logData = {
            user: usr,
            ...result
        };
        logExport(logData);

        const resultDownloadData = {
            state: response.status,
            error: response.error,
            errorName: response.error.code
        };
        return new DownloadData(resultDownloadData);
    }
}

export default downloadFile;