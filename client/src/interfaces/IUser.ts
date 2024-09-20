import { IAvailability } from "./IAvailability";

export interface IUser {
    name?: string;
    email: string;
    password: string;
    role?: "EMPLOYEE" | "ADMIN";
    availability?: IAvailability;
  }
  