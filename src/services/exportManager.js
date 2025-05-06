import textRefactor from "./textRefactor";
import DownloadData from "@/class/downloadDataClass";

import axios from "axios";

import getEvents from "./API/getEvents";

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
            label : "Téléchargement réussi",
            errorName : "DownloadSuccess",
            rewrite : true
        });
}

const downloadFile = async(data) =>{

    let { authSession, filename, extension, startDate, endDate, userSearch, setLoadingLabel, setIsLoading, isFrontend, website } = data;

    const option = {
        room: userSearch,
        start: startDate,
        end: endDate,
        session: authSession,
        setLoadingLabel: setLoadingLabel,
        isFrontend: isFrontend
    }
    // const response = await getEvents(option);
    const response = await await fetch(`${website}/api/export?room=${option.room}&start=${option.start}&end=${option.end}`, {
        method: 'get',
        headers: new Headers({
            'Authorization': `Bearer ${option.session.accessToken}`
        })
    }).then((r) => { return r.json() });

    if (!isFrontend) {
        return response;
    }

    console.log(response);
    if (!response?.error) {
        console.log(response.data);
        let options = {
            filename: filename,
            extension: extension,
            data: response.data
        }
        return createFile(options);
    }
    else{
        let err = manageError(response?.error, setIsLoading);
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

export const manageError = (error, setIsLoading) =>{

    let state = "";
    let title = "";
    let label = "";
    let value = "";

    let errorName = "";

    let isExpired = false;


    if (textRefactor(error.code).includes("date") && textRefactor(error.code).includes("maximum")){
        state = "info";
        label = "Dates incorrectes. La période entre la date de début et la date fin est trop élevé.";
        errorName = "errPeriodTooHigh"
    }
    else if (textRefactor(error.code).includes("date") && textRefactor(error.code).includes("earlier")){
        state = "info";
        label = "Dates incorrectes. La date de fin précède la date de début.";
        errorName = "errPeriodEndBeforeStart"
    }
    else if (textRefactor(error.code).includes("date")){
        state = "info";
        label = "Dates incorrectes.";
        errorName = "errPeriodInvalid"
    }
    else if (textRefactor(error.code).includes("object") && textRefactor(error.code).includes("not found") && textRefactor(error.code).includes("store")){
        state = "info";
        label = "Utilisateur incorrect ou calendrier de l'utilisateur inacessible.";
        errorName = "errUserUnavailable"
    }
    else if (textRefactor(error.code).includes("mailbox") && textRefactor(error.code).includes("inactive") && textRefactor(error.code).includes("hosted on-premise")){
        state = "info";
        label = "Utilisateur incorrect, son adresse n'est pas une adresse active.";
        errorName = "errUserDisabled"
    }
    else if (textRefactor(error.code).includes("user") && textRefactor(error.code).includes("is invalid")){
        state = "info";
        label = `L'utilisateur n'existe pas.`;
        errorName = "errNoUser"
    }
    else if (textRefactor(error.code).includes(noData)){
        state = "info";
        label = `Aucune données n'existent dans la période fournie.`;
        errorName = "errNoData"
    }
    else if (textRefactor(error.code).includes(muchData)){
        state = "info";
        label = `Il y a trop de données dans la période fournie. Le maximum autorisé est 1000, ${error.message.split(',')[1]} sont présentes dans la période donnée.`;
        errorName = "errTooMuchData"
    }
    else if (error.code == "errUserAccessMissing"){
        state = "info";
        label = `Il y a trop de données dans la période fournie. Le maximum autorisé est 1000, ${error.message.split(',')[1]} sont présentes dans la période donnée.`;
        errorName = "errTooMuchData"
    }
    else{
        state = "warning";
        label = "Jeton d'accès expiré. Rafraîchissez la page ou reconnectez-vous.";
        errorName = "errTokenExpired"
        isExpired = true;
    }
    setIsLoading(false);
    console.log(
        {
            isExpired: isExpired,
            error: error.message,
            errorName: error.code,
            data: {
                state: state,
                title: title,
                label: label,
                value: value
            }
        }
    );
    return {
        isExpired : isExpired,
        error: error.message,
        errorName: error.code,
        data : {
            state : state,
            title : title,
            label : label,
            value : value
        }
    };
}

export default downloadFile;