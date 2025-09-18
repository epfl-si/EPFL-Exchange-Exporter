// export default class Event{
//     constructor(startDate, endDate, eventSubject, userEmail){
//         this.debut = startDate; //.start.dateTime (calculate with .start.timeZone)
//         this.fin = endDate; //.end.dateTime (calculate with .end.timeZone)
//         this.raison = eventSubject; //.subject
//         this.email = userEmail; //.organizer.emailAddress.name
//     }
// };
export default class Event{
    constructor(startDate, endDate, eventSubject, userEmail){
        this.start = startDate; //.start.dateTime (calculate with .start.timeZone)
        this.end = endDate; //.end.dateTime (calculate with .end.timeZone)
        this.subject = eventSubject; //.subject
        this.email = userEmail; //.organizer.emailAddress.name
    }
};
export class ExportedEvent{
    constructor(data){
        this.debut = data.start;
        this.fin = data.end;
        this.raison = data.subject;
        this.email = data.email;
    }
};