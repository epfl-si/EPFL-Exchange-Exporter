import Event from "@/class/EventClass";
import textRefactor from "./textRefactor";
import { changeUTC, changeFormat } from "./dateRefactor";
import DownloadData from "@/class/downloadDataClass";

import axios from "axios";

let noData = "no data"
let muchData = "too much data"

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

const createDownload = (fileData, fileName, fileType, isBackend=false) =>{
    const blob = new Blob([fileData], { type: "text/plain" });
    if (isBackend){
        return blob;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${fileName}.${fileType}`;
    link.href = url;
    link.click();
    return blob;
}

const createFile = (params) => {
    const { filename, extension, isBackend, data } = params;
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
    if (isBackend){
        return createDownload(fileData, fileName, fileType, isBackend);
    }

    createDownload(fileData, fileName, fileType);
    return new DownloadData(
        {
            state : "check",
            label : "Téléchargement réussi",
            errorName : "DownloadSuccess",
            rewrite : true
        });
}

const downloadFile = async(data) =>{

    let {authSession, filename, extension, startDate, endDate, userSearch, setLoadingLabel, setIsLoading, isBackend, website} = data;

    startDate = startDate ? new Date(new Date(startDate).setHours(1)).toISOString() : new Date(new Date(new Date(Date.now()).setDate(0)).setHours(1)).toISOString();
    endDate = endDate ? new Date(new Date(endDate).setHours(23)).toISOString() : new Date(new Date(new Date(Date.now()).setDate(27)).setHours(1)).toISOString();

    let respDataTrue = await fetch(`https://graph.microsoft.com/v1.0/users/${userSearch || authSession.user.email}/calendarView?startDateTime=${startDate}&endDateTime=${endDate}&count=true&top=1&select=id`, {
        method: 'get',
        headers: new Headers({
            'Authorization': `Bearer ${authSession.accessToken}`
        })
    }).then((r) => {return r.json()});

    if (!respDataTrue?.error){

        if (respDataTrue["@odata.count"] <= 0 || respDataTrue["@odata.count"] > 1000){
            let err = manageError(respDataTrue["@odata.count"] <= 0 ? noData : `${muchData},${respDataTrue["@odata.count"]}`, setIsLoading);
            return new DownloadData(
                {
                    state : err.data.state,
                    label : err.data.label,
                    isExpired : err.isExpired,
                    rewrite : false,
                    error : err.error,
                    errorName : err.errorName
                });
        }
        if (!isBackend){
            setLoadingLabel({label: "loaderNbData", nb: respDataTrue["@odata.count"]});
        }
        let request = `https://graph.microsoft.com/v1.0/users/${userSearch || authSession.user.email}/calendarView?startDateTime=${startDate}&endDateTime=${endDate}&select=subject,organizer,start,end&top=1000`; //authSession.user?.email temp, after, need to change for room

        let response = await fetch(request, {
            method: 'get',
            headers: new Headers({
                'Authorization': `Bearer ${authSession.accessToken}`
            })
        }).then((r) => {return r.json()});

        if (!response?.error){

            let data = response.value
            .sort((d1, d2)=> new Date(d2.start.dateTime) - new Date(d1.start.dateTime))
            .map(d =>(new Event(changeFormat(changeUTC(d.start.dateTime, 1)), changeFormat(changeUTC(d.end.dateTime, 1)), d.subject || "sujet privé", d.organizer?.emailAddress.address || "email privé")));

            let options = {
                filename: filename,
                extension: extension,
                isBackend: isBackend,
                data: data
            }
            return createFile(options);
        }
        else{
            let err = manageError(response.error.message, setIsLoading);
            return new DownloadData(
                {
                    state : err.data.state,
                    label : err.data.label,
                    isExpired : err.isExpired,
                    rewrite : false,
                    error : err.error,
                    errorName : err.errorName
                });
        }
    }
    else{
        let err = manageError(respDataTrue.error.message, setIsLoading);
        if (err.errorName == "errUserDisabled") {
            console.log(`${website}/api/exportOnPrem?room=${userSearch}&start=${startDate}&end=${endDate}`);
            console.log(`${website}/api/exportOnPrem?room=${userSearch}&start=${startDate}&end=${endDate}`);
            console.log(`${website}/api/exportOnPrem?room=${userSearch}&start=${startDate}&end=${endDate}`);
            console.log(`${website}/api/exportOnPrem?room=${userSearch}&start=${startDate}&end=${endDate}`);
            console.log(`${website}/api/exportOnPrem?room=${userSearch}&start=${startDate}&end=${endDate}`);
            console.log(`${website}/api/exportOnPrem?room=${userSearch}&start=${startDate}&end=${endDate}`);
            console.log(`${website}/api/exportOnPrem?room=${userSearch}&start=${startDate}&end=${endDate}`);
            console.log(`${website}/api/exportOnPrem?room=${userSearch}&start=${startDate}&end=${endDate}`);
            console.log(`${website}/api/exportOnPrem?room=${userSearch}&start=${startDate}&end=${endDate}`);
            console.log(`${website}/api/exportOnPrem?room=${userSearch}&start=${startDate}&end=${endDate}`);
            const response = await axios.get(
                `${website}/api/exportOnPrem?room=${userSearch}&start=${startDate}&end=${endDate}`
            );
            console.log(response);
            console.log(response?.data);
            console.log(response?.data?.items);
            if (!response?.data?.error) {
                let options = {
                    filename: filename,
                    extension: extension,
                    isBackend: isBackend,
                    data: response.data.items
                }
                return createFile(options);
            }
            else {
                err = manageError(response?.data?.error, setIsLoading);
                return new DownloadData(
                    {
                        state : err.data.state,
                        label : err.data.label,
                        isExpired : err.isExpired,
                        rewrite : false,
                        error : err.error,
                        errorName : err.errorName
                    });
            }
        }
        return new DownloadData(
            {
                state : err.data.state,
                label : err.data.label,
                isExpired : err.isExpired,
                rewrite : false,
                error : err.error,
                errorName : err.errorName
            });
    }
}

const manageError = (error, setIsLoading) =>{

    let state = "";
    let title = "";
    let label = "";
    let value = "";

    let errorName = "";

    let isExpired = false;


    if (textRefactor(error).includes("date") && textRefactor(error).includes("maximum")){
        state = "info";
        label = "Dates incorrectes. La période entre la date de début et la date fin est trop élevé.";
        errorName = "errPeriodTooHigh"
    }
    else if (textRefactor(error).includes("date") && textRefactor(error).includes("earlier")){
        state = "info";
        label = "Dates incorrectes. La date de fin précède la date de début.";
        errorName = "errPeriodEndBeforeStart"
    }
    else if (textRefactor(error).includes("date")){
        state = "info";
        label = "Dates incorrectes.";
        errorName = "errPeriodInvalid"
    }
    else if (textRefactor(error).includes("object") && textRefactor(error).includes("not found") && textRefactor(error).includes("store")){
        state = "info";
        label = "Utilisateur incorrect ou calendrier de l'utilisateur inacessible.";
        errorName = "errUserUnavailable"
    }
    else if (textRefactor(error).includes("mailbox") && textRefactor(error).includes("inactive") && textRefactor(error).includes("hosted on-premise")){
        state = "info";
        label = "Utilisateur incorrect, son adresse n'est pas une adresse active.";
        errorName = "errUserDisabled"
    }
    else if (textRefactor(error).includes("user") && textRefactor(error).includes("is invalid")){
        state = "info";
        label = `L'utilisateur n'existe pas.`;
        errorName = "errNoUser"
    }
    else if (textRefactor(error).includes(noData)){
        state = "info";
        label = `Aucune données n'existent dans la période fournie.`;
        errorName = "errNoData"
    }
    else if (textRefactor(error).includes(muchData)){
        state = "info";
        label = `Il y a trop de données dans la période fournie. Le maximum autorisé est 1000, ${error.split(',')[1]} sont présentes dans la période donnée.`;
        errorName = "errTooMuchData"
    }
    else{
        state = "warning";
        label = "Jeton d'accès expiré. Rafraîchissez la page ou reconnectez-vous.";
        errorName = "errTokenExpired"
        isExpired = true;
    }
    setIsLoading(false);
    return {
        isExpired : isExpired,
        error: error,
        errorName: errorName,
        data : {
            state : state,
            title : title,
            label : label,
            value : value
        }
    };
}

export default downloadFile;