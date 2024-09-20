import { IAvailability } from "@/interfaces/IAvailability";
const API_URL = process.env.NODE_SERVER_URI || 'http://localhost:8080';

const getEmployeesAvailability = async (): Promise<{success: boolean, message: String, availability: IAvailability[]}> => {
    try {
        const accessToken = localStorage.getItem('accessToken');
    
        const response = await fetch(`${API_URL}/admin/availability`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
    
        if (response.status !== 200) {
          throw new Error('Failed to get availability');
        }
    
        const availability = await response.json();
    
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
}

export {
    getEmployeesAvailability
}