export interface Usuario {
    id: number,
    nombres: string;
    apellidos: string;
    email: string;
    celular: string;
}

export interface Project {
    id: number,
    creator: Usuario,
    title: string,
    description: string,
    status: string,
    startDate: Date,
    startHour: string,
    endDate: Date,
    endHour: string,
    location: string,
    contact: string,
    alarmCode: string,
    notes: string,
    additionalInformation: string,
    hoursPerProject: number,
    hourWage: number,
}