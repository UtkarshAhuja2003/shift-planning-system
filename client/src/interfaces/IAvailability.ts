export interface IAvailability {
    timezone: string;
    schedule: Array<IDayAvailability>;
}
  
export interface IDayAvailability {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}