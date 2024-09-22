import { IAvailability } from "./IAvailability";

export interface IUser {
    _id?: string;
    name?: string;
    email?: string;
    password?: string;
    role?: "EMPLOYEE" | "ADMIN";
    availability?: IAvailability;
    timezone?: string;
  }
  