"use client";
import { useEffect, useState } from 'react';
import { getEmployeeAvailability, getAllEmployees, createShift } from '@/api/admin';
import { getEmployeeShifts } from '@/api/employee';
import { IAvailability } from '@/interfaces/IAvailability';
import { IShift } from '@/interfaces/IShift';
import { IUser } from '@/interfaces/IUser';
import { getAccessToken } from '@/api/auth';

const ViewEmployeeAvailability = () => {
  const [employees, setEmployees] = useState<IUser[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [availability, setAvailability] = useState<IAvailability[] | null>(null);
  const [dayOfWeek, setDayOfWeek] = useState<string>('');
  const [shiftStartTime, setShiftStartTime] = useState<Date | null>(null);
  const [shiftEndTime, setShiftEndTime] = useState<Date | null>(null);

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

  const handleTimeChange = (timeString: string, setTime: React.Dispatch<React.SetStateAction<Date | null>>) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    setTime(date);
  };

  const handleCreateShift = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dayOfWeek || !shiftStartTime || !shiftEndTime || !selectedEmployee) {
      alert('Please fill in all fields.');
      return;
    }

    // Check if employee is available for the selected day
    const selectedDayAvailability = availability?.find(a => a.dayOfWeek === dayOfWeek);
    if (!selectedDayAvailability) {
      alert('Employee is not available on the selected day.');
      return;
    }

    // Helper function to convert "HH:MM" format to a Date object using the current date
    const timeStringToDate = (timeString: string): Date => {
      const [hours, minutes] = timeString.split(':').map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(0); // To avoid any second-based discrepancies
      return date;
    };

    const employeeStartTime = timeStringToDate(selectedDayAvailability.startTime);
    const employeeEndTime = timeStringToDate(selectedDayAvailability.endTime);

    // Ensure shift times are within employee availability
    if (shiftStartTime < employeeStartTime || shiftEndTime > employeeEndTime) {
      alert('Shift times are outside employee\'s available hours.');
      return;
    }

    // Create shift data
    const shiftData: IShift = {
      dayOfWeek: dayOfWeek,
      startTime: shiftStartTime?.toISOString() || '',
      endTime: shiftEndTime?.toISOString() || '',
      employeeId: selectedEmployee,
    };

    // Create the shift
    const res = await createShift(shiftData);
    if (res.success) {
      alert('Shift created successfully');
      setDayOfWeek('');
      setShiftStartTime(null);
      setShiftEndTime(null);
      setSelectedEmployee('');
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
          <option key={employee._id} value={employee._id}>
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
                <th className="border border-gray-300 p-2">Availability</th>
              </tr>
            </thead>
            <tbody>
            {availability.map((day) => (
                  <tr key={day.dayOfWeek}>
                    <td className="border border-gray-300 p-2">{day.dayOfWeek}</td>
                    <td className="border border-gray-300 p-2">{day.startTime} - {day.endTime}</td>
                  </tr>
                ))
            }
            </tbody>
          </table>

          <h2 className="text-xl mb-2">Create Shift</h2>
          <form onSubmit={handleCreateShift} className="mb-4">
            <div className="mb-2">
              <label htmlFor="Day" className="block mb-1">Day:</label>
              <select
                id="dayOfWeek"
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="border p-2 w-full"
                required
              >
                <option value="">-- Select a Day --</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="startTime" className="block mb-1">Start Time:</label>
              <input
                type="time"
                id="startTime"
                onChange={(e) => handleTimeChange(e.target.value, setShiftStartTime)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="endTime" className="block mb-1">End Time:</label>
              <input
                type="time"
                id="endTime"
                onChange={(e) => handleTimeChange(e.target.value, setShiftEndTime)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="shift-employee" className="block mb-1">Select Employee:</label>
              <select
                id="shift-employee"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="border p-2 w-full"
                required
              >
                <option value="">-- Select an Employee --</option>
                {
                  employees && employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name}
                    </option>
                  ))
                }
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
