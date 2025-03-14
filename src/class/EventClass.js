export default class Event{
    constructor(startDate, endDate, eventSubject, userEmail){
        this.debut = startDate; //.start.dateTime (calculate with .start.timeZone)
        this.fin = endDate; //.end.dateTime (calculate with .end.timeZone)
        this.raison = eventSubject; //.subject
        this.email = userEmail; //.organizer.emailAddress.name
    }
};