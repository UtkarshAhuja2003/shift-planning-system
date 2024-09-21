"use client";
import { useState, useEffect } from 'react';
import { loginUser, registerUser } from '@/api/auth';
import { IUser } from '@/interfaces/IUser';

const MainPage = () => {
  const [authMode, setAuthMode] = useState<'Login' | 'Register'>('Login');
  const [userData, setUserData] = useState<IUser>({
    email: '',
    password: '',
    name: '',
    role: 'EMPLOYEE',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [timezones, setTimezones] = useState<string[]>([]);

  useEffect(() => {
    const availableTimezones = Intl.supportedValuesOf('timeZone');
    setTimezones(availableTimezones);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'Login') {
      const res = await loginUser(userData);
      if (!res.success) {
        alert('Invalid credentials');
        console.error(res.message);
      } else {
        alert('Login successful');
        window.location.href = userData.role === 'EMPLOYEE' ? '/employee' : '/admin';
      }
    } else if (authMode === 'Register') {
      const res = await registerUser(userData);
      if (!res.success) {
        alert('Registration failed');
        console.error(res.message);
      } else {
        alert('Registration successful');
        window.location.href = userData.role === 'EMPLOYEE' ? '/employee' : '/admin';
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl mb-6">{authMode}</h1>

      <form onSubmit={handleSubmit} className="w-[40%] p-4 bg-white rounded shadow-md">
        {authMode === 'Register' && (
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Enter your name"
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
            placeholder="Enter your password"
            required
          />
        </div>

        {authMode === 'Register' && (
          <div className="mb-4">
            <label htmlFor="role" className="block mb-2">Role</label>
            <select
              id="role"
              name="role"
              value={userData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        )}

        {authMode === 'Register' && (
          <div className="mb-4">
            <label htmlFor="timezone" className="block mb-2">Timezone</label>
            <select
              id="timezone"
              name="timezone"
              value={userData.timezone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
            >
              {timezones.map((timezone) => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setAuthMode(authMode === 'Login' ? 'Register' : 'Login')}
            className="text-blue-500"
          >
            {authMode === 'Register' ? 'Switch to Login' : 'Switch to Register'}
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {authMode === 'Register' ? 'Register' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MainPage;
