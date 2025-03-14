import Event from "@/class/EventClass";
import textRefactor from "./textRefactor";
import { changeUTC, changeFormat } from "./dateRefactor";
import DownloadState from "@/class/downloadStateClass";

let noData = "no data"

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
}

const downloadFile = async(data) =>{

    let {authSession, filename, extension, startDate, endDate, userSearch, setLoadingLabel, setIsLoading} = data;

    console.log(new Date(new Date(startDate).setHours(1)).getUTCDate());
    console.log(new Date(new Date(endDate).setHours(23)).getUTCDate());

    startDate = startDate ? new Date(new Date(startDate).setHours(1)).toISOString() : new Date(new Date(new Date(Date.now()).setDate(0)).setHours(1)).toISOString();
    endDate = endDate ? new Date(new Date(endDate).setHours(23)).toISOString() : new Date(new Date(new Date(Date.now()).setDate(27)).setHours(1)).toISOString();

    let respDataTrue = await fetch(`https://graph.microsoft.com/v1.0/users/${userSearch || authSession.user.email}/calendarView?startDateTime=${startDate}&endDateTime=${endDate}&count=true&top=1&select=id`, {
        method: 'get',
        headers: new Headers({
            'Authorization': `Bearer ${authSession.accessToken}`
        })
    }).then((r) => {return r.json()});


    if (!respDataTrue?.error){
        // setLoadingLabel("Création du fichier, veuillez patienter");

        if (respDataTrue["@odata.count"] <= 0){
            return new DownloadState(manageError(noData, setIsLoading), false);
        }
        setLoadingLabel(`Exportation des ${respDataTrue["@odata.count"]} évènements, veuillez patienter`);
        let request = `https://graph.microsoft.com/v1.0/users/${userSearch || authSession.user.email}/calendarView?startDateTime=${startDate}&endDateTime=${endDate}&select=subject,organizer,start,end&top=1000`; //authSession.user?.email temp, after, need to change for room

        let response = await fetch(request, {
            method: 'get',
            headers: new Headers({
                'Authorization': `Bearer ${authSession.accessToken}`
            })
        }).then((r) => {return r.json()});

        console.log(request)
        console.log(response)

        if (!response?.error){

            let data = response.value
            .sort((d1, d2)=> new Date(d2.start.dateTime) - new Date(d1.start.dateTime))
            .map(d =>(new Event(changeFormat(changeUTC(d.start.dateTime, 1)), changeFormat(changeUTC(d.end.dateTime, 1)), d.subject || "sujet privé", d.organizer?.emailAddress.address || "email privé")));

            let fileName = filename || "data";
            let fileType = extension || "csv";

            let fileData = "";

            switch(fileType){
                case "csv":
                    fileData = getCSV(data);
                    console.log(fileData);
                    break;
                case "json":
                    fileData = JSON.stringify(data, null, 2);
                    break;
                default:
                    fileData = `file extension "${fileType}" doesn't recognize.`
                    break;
            }

            createDownload(fileData, fileName, fileType);
            return new DownloadState(false, true);
        }
        else{
            return new DownloadState(manageError(response.error.message, setIsLoading), false);
        }
    }
    else{
        return new DownloadState(manageError(respDataTrue.error.message, setIsLoading), false);
    }
}

const manageError = (error, setIsLoading) =>{
    if (textRefactor(error).includes("date") && textRefactor(error).includes("maximum")){
        alert("Dates incorrectes. La période entre la date de début et la date fin est trop élevé.");
    }
    else if (textRefactor(error).includes("date") && textRefactor(error).includes("earlier")){
        alert("Dates incorrectes. La date de fin précède la date de début.");
    }
    else if (textRefactor(error).includes("date")){
        alert("Dates incorrectes.");
    }
    else if (textRefactor(error).includes("object") && textRefactor(error).includes("not found") && textRefactor(error).includes("store")){
        alert("Utilisateur incorrect ou calendrier de l'utilisateur inacessible");
    }
    else if (textRefactor(error).includes("user") && textRefactor(error).includes("is invalid")){
        alert(`L'utilisateur n'existe pas.`);
    }
    else if (textRefactor(error).includes(noData)){
        alert(`Aucune données n'existent dans la période fournie.`);
    }
    else{
        alert("Jeton d'accès expiré. Vous allez être déconnecté.");
        return true;
    }
    setIsLoading(false);
    return false;
}

export default downloadFile;