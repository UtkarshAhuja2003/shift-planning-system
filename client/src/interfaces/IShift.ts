export interface IShift {
  _id: string;
  date: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  employee: string;
  admin?: string | null;
  adminTimezone: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  };
  employeeTimezone: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  };
}
