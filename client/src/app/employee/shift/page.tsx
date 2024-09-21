"use client";
import { useEffect, useState } from 'react';
import { IShift } from '@/interfaces/IShift';
import { getEmployeeShifts } from '@/api/employee';
import { getAccessToken } from '@/api/auth';

const EmployeeShiftsPage = () => {
  const [shifts, setShifts] = useState<IShift[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
    const fetchShifts = async () => {
      const res = await getEmployeeShifts();

      if (res.success) {
        setShifts(res.shifts);
      } else {
        console.error(res.message);
        alert('Failed to get shifts');
      }

      setLoading(false);
    };

    fetchShifts();
  }, []);

  if (loading) {
    return <p>Loading shifts...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Assigned Shifts</h1>

      {shifts.length === 0 ? (
        <p>No shifts assigned.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-400 p-2">Day</th>
              <th className="border border-gray-400 p-2">Shift Time (Employee TZ)</th>
              <th className="border border-gray-400 p-2">Shift Time (Admin TZ)</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift._id}>
                <td className="border border-gray-400 p-2">{shift.dayOfWeek}</td>
                <td className="border border-gray-400 p-2">
                  {`${shift.employeeTimezone.startTime} - ${shift.employeeTimezone.endTime}`}
                </td>
                <td className="border border-gray-400 p-2">
                  {`${shift.adminTimezone.startTime} - ${shift.adminTimezone.endTime}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeShiftsPage;
