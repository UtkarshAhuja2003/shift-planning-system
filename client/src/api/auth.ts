import { IUser } from "@/interfaces/IUser";
const API_URL = process.env.NODE_SERVER_URI || 'http://localhost:8080';

const loginUser = async (user: IUser): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      if (response.status !== 200) {
        throw new Error('Login failed');
      }
  
      const res = await response.json();

      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
  
      return {
        success: true,
        message: 'Login successful',
      };
  } catch (error: any) {
        return {
            success: false,
            message: error.message || 'Something went wrong'
        };
  }
};

const registerUser = async (user: IUser): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      if (response.status !== 201) {
        throw new Error('Registration failed');
      }
  
      const res = await response.json();

      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
  
      return {
        success: true,
        message: 'Registration successful',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Something went wrong',
      };
    }
  };

export {
  loginUser,
  registerUser
};
