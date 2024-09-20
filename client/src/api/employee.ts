import { IAvailability } from "@/interfaces/IAvailability";
const API_URL = process.env.NODE_SERVER_URI || 'http://localhost:8080';

const updateEmployeeAvailability = async (availability: IAvailability): Promise<{success: boolean, message: String}> => {
    try {
        const accessToken = localStorage.getItem('accessToken');
    
        const response = await fetch(`${API_URL}/employee/availability`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(availability),
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

export {
    updateEmployeeAvailability
}