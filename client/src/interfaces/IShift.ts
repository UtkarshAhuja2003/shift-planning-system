export interface IShift {
  _id?: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  employeeId: string;
  adminId?: string | null;
  adminTimezone?: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  };
  employeeTimezone?: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  };
}
