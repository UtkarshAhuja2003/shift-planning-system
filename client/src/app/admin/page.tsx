"use client";
import { useEffect, useState } from 'react';
import { getEmployeeAvailability, getAllEmployees, createShift } from '@/api/admin';
import { IAvailability } from '@/interfaces/IAvailability';
import { IShift } from '@/interfaces/IShift';
import { IUser } from '@/interfaces/IUser';
import { getAccessToken } from '@/api/auth';

const ViewEmployeeAvailability = () => {
  const [employees, setEmployees] = useState<IUser[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [availability, setAvailability] = useState<IAvailability[] | null>(null);
  const [dayOfWeek, setDayOfWeek] = useState<string>('');
  const [shiftStartTime, setShiftStartTime] = useState<string>('');
  const [shiftEndTime, setShiftEndTime] = useState<string>('');
  const [availableEmployees, setAvailableEmployees] = useState<IUser[]>([]);
  const [selectedShiftEmployee, setSelectedShiftEmployee] = useState<string>('');

  useEffect(() => {
    const fetchAccessToken = async () => {
      const accessToken = (await getAccessToken()).accessToken;
      if (!accessToken) {
        window.location.href = "/";
      }
    };

    fetchAccessToken();
  }, []);

  useEffect(() => {
    const getEmployees = async () => {
      const res = await getAllEmployees();
      setEmployees(res.employees);
    };
    getEmployees();
  }, []);

  const handleEmployeeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const employeeId = e.target.value;
    setSelectedEmployee(employeeId);

    if (employeeId) {
      const res = await getEmployeeAvailability(employeeId);
      setAvailability(res.availability);
    } else {
      setAvailability(null);
    }
  };

  const handleCreateShift = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dayOfWeek || !shiftStartTime || !shiftEndTime || !selectedShiftEmployee) {
      alert('Please fill in all fields.');
      return;
    }

    const shiftData: IShift = {
      dayOfWeek: dayOfWeek,
      startTime: shiftStartTime,
      endTime: shiftEndTime,
      employeeId: selectedShiftEmployee,
    };

    const res = await createShift(shiftData);
    if (res.success) {
      alert('Shift created successfully');
      setDayOfWeek('');
      setShiftStartTime('');
      setShiftEndTime('');
      setSelectedShiftEmployee('');
    } else {
      alert('Failed to create shift');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">View Employee Availability</h1>

      <label htmlFor="employee-select" className="block mb-2">
        Select Employee:
      </label>
      <select
        id="employee-select"
        value={selectedEmployee}
        onChange={handleEmployeeChange}
        className="border p-2 mb-4"
      >
        <option value="">-- Select an Employee --</option>
        {employees && employees.map((employee) => (
          <option key={employee.email} value={employee.name}>
            {employee.name}
          </option>
        ))}
      </select>

      {availability && (
        <>
          <h2 className="text-xl mb-2">Availability</h2>
          <table className="table-auto border border-gray-300 mb-4">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Day</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Availability</th>
              </tr>
            </thead>
            <tbody>
            {availability.map((day) => (
                  <tr key={day.dayOfWeek}>
                    <td className="border border-gray-300 p-2">{day.dayOfWeek}</td>
                    <td className="border border-gray-300 p-2">{new Date().toLocaleDateString()}</td>
                  </tr>
                ))
            }
            </tbody>
          </table>

          <h2 className="text-xl mb-2">Create Shift</h2>
          <form onSubmit={handleCreateShift} className="mb-4">
            <div className="mb-2">
              <label htmlFor="date" className="block mb-1">Date:</label>
              <input
                type="text"
                id="dayOfWeek"
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="startTime" className="block mb-1">Start Time:</label>
              <input
                type="time"
                id="startTime"
                value={shiftStartTime}
                onChange={(e) => setShiftStartTime(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="endTime" className="block mb-1">End Time:</label>
              <input
                type="time"
                id="endTime"
                value={shiftEndTime}
                onChange={(e) => setShiftEndTime(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="shift-employee" className="block mb-1">Select Employee:</label>
              <select
                id="shift-employee"
                value={selectedShiftEmployee}
                onChange={(e) => setSelectedShiftEmployee(e.target.value)}
                className="border p-2 w-full"
                required
              >
                <option value="">-- Select an Employee --</option>
                {/* {
                  employees && employees.map((employee) => (
                    <option key={employee.email} value={employee.name}>
                      {employee.name}
                    </option>
                  ))
                } */}
              </select>
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2">Create Shift</button>
          </form>
        </>
      )}
    </div>
  );
};

export default ViewEmployeeAvailability;
