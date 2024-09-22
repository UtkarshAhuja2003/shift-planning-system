import { IAvailability } from "@/interfaces/IAvailability";
import { IUser } from "@/interfaces/IUser";
import { IShift } from "@/interfaces/IShift";
import { getAccessToken } from "./auth";
const API_URL = process.env.NODE_SERVER_URI || 'http://localhost:8080';

const getEmployeeAvailability = async (employeeID: any): Promise<{success: boolean, message: String, availability: IAvailability[]}> => {
    try {
        const accessToken = (await getAccessToken()).accessToken;
    
        const response = await fetch(`${API_URL}/admin/availability/${employeeID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
    
        if (response.status !== 200) {
          throw new Error('Failed to get availability');
        }
    
        const res = await response.json();
        const availability = res.data.availability.availability;
    
        return {
            success: true,
            message: 'Availability retrieved successfully',
            availability,
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Something went wrong',
            availability: [],
        };
    }
};

const getAllEmployees = async () => {
    try {
        const accessToken = (await getAccessToken()).accessToken;
    
        const response = await fetch(`${API_URL}/admin/employees`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
    
        if (response.status !== 200) {
          throw new Error('Failed to get employees');
        }
    
        const res = await response.json();
        const employees = res.data.employees;
    
        return {
            success: true,
            message: 'Employees retrieved successfully',
            employees,
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Something went wrong',
            employees: [],
        };
    }
};

const createShift = async (shift: IShift): Promise<{success: boolean, message: String, shift: IShift}> => {
    try {
        const accessToken = (await getAccessToken()).accessToken;
        console.log(shift);
    
        const response = await fetch(`${API_URL}/admin/shifts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(shift),
        });
    
        if (response.status !== 200) {
          throw new Error('Failed to create shift');
        }
    
        return {
            success: true,
            message: 'Shift created successfully',
            shift,
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Something went wrong',
            shift: {} as IShift,
        };
    }
};

const getAvailableEmployees = async (shift: IShift): Promise<{success: boolean, message: String, employees: IUser[]}> => {
    try {
        const accessToken = (await getAccessToken()).accessToken;
    
        const response = await fetch(`${API_URL}/admin/available-employees`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(shift),
        });
    
        if (response.status !== 200) {
          throw new Error('Failed to get available employees');
        }
    
        const res = await response.json();
        const employees = res.availableEmployees;
    
        return {
            success: true,
            message: 'Employees retrieved successfully',
            employees,
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Something went wrong',
            employees: [],
        };
    }
};

export {
    getEmployeeAvailability,
    getAllEmployees,
    createShift,
    getAvailableEmployees,
}