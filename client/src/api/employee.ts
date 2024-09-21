import { IAvailability } from "@/interfaces/IAvailability";
import { IShift } from "@/interfaces/IShift";
import { getAccessToken } from "./auth";
const API_URL = process.env.NODE_SERVER_URI || 'http://localhost:8080';

const updateEmployeeAvailability = async (availability: IAvailability[]): Promise<{success: boolean, message: String}> => {
    try {
        const accessToken = (await getAccessToken()).accessToken;
    
        const response = await fetch(`${API_URL}/employee/availability`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({availability}),
        });
    
        if (response.status !== 200) {
          throw new Error('Failed to update availability');
        }
    
        return {
            success: true,
            message: 'Availability updated successfully',
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Something went wrong',
        };
    }
};

const getEmployeeShifts = async (): Promise<{success: boolean, message: String, shifts: IShift[]}> => {
    try {
        const accessToken = (await getAccessToken()).accessToken;
    
        const response = await fetch(`${API_URL}/employee/shifts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
    
        if (response.status !== 200) {
          throw new Error('Failed to get shifts');
        }
    
        const res = await response.json();
        const shifts = res.data.shifts;
        console.log(shifts);
    
        return {
            success: true,
            message: 'Shifts retrieved successfully',
            shifts,
        }
    } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Something went wrong',
            shifts: [],
        };
    }
}

export {
    updateEmployeeAvailability,
    getEmployeeShifts,
}