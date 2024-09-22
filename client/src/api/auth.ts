import { IUser } from "@/interfaces/IUser";
const API_URL = process.env.NODE_SERVER_URI || 'http://localhost:8080';
import Cookies from 'js-cookie';

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

      Cookies.set('accessToken', res.data.accessToken, { expires: 0.0104 }); // 15 minutes
      Cookies.set('refreshToken', res.data.refreshToken);

      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('timezone', res.data.user.timezone);

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

      Cookies.set('accessToken', res.data.accessToken, { expires: 0.0104 }); // 15 minutes
      Cookies.set('refreshToken', res.data.refreshToken); 

      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('timezone', res.data.user.timezone);
  
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

const getAccessToken = async (): Promise<{accessToken: String}> => {
  let accessToken = Cookies.get('accessToken');
  if(!accessToken) {
    try {
      let refreshToken = Cookies.get('refreshToken');
      console.log(refreshToken);
      if(!refreshToken) {
        throw new Error('No refresh token found');
      }

      const response = await fetch(`${API_URL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.status !== 200) {
        throw new Error('Failed to refresh token');
      }

      const res = await response.json();
      accessToken = res.data.accessToken;
      refreshToken = res.data.refreshToken;
      
      if (accessToken) {
        Cookies.set('accessToken', accessToken, { expires: 0.0104 });
      }
      if (refreshToken) {
        Cookies.set('refreshToken', refreshToken);
      }
    } catch (error: any) {
      console.error(error.message || 'Something went wrong');
      window.location.href = '/';
    }
  }
  return { accessToken: accessToken || '' };
}

export {
  loginUser,
  registerUser,
  getAccessToken,
};
