"use client";
import { useEffect, useState } from "react";
import { updateEmployeeAvailability } from "@/api/employee";
import { IAvailability } from "@/interfaces/IAvailability";
import { getAccessToken } from "@/api/auth";

const initialAvailability: IAvailability[] = [
  { dayOfWeek: "Monday", startTime: "", endTime: "" },
  { dayOfWeek: "Tuesday", startTime: "", endTime: "" },
  { dayOfWeek: "Wednesday", startTime: "", endTime: "" },
  { dayOfWeek: "Thursday", startTime: "", endTime: "" },
  { dayOfWeek: "Friday", startTime: "", endTime: "" },
  { dayOfWeek: "Saturday", startTime: "", endTime: "" },
  { dayOfWeek: "Sunday", startTime: "", endTime: "" },
];

const AvailabilityPage = () => {
  const [availability, setAvailability] = useState<IAvailability[]>(initialAvailability);
  const timezone = localStorage.getItem("timezone");

  useEffect(() => {
    const fetchAccessToken = async () => {
      const accessToken = (await getAccessToken()).accessToken;
      if (!accessToken) {
        window.location.href = "/";
      }
    };

    fetchAccessToken();
  }, []);

  const handleInputChange = (index: number, field: keyof IAvailability, value: string) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index][field] = value;
    setAvailability(updatedAvailability);
  };

  const getDurationInMinutes = (startTime: string, endTime: string): number => {
    const start = new Date(`2024-09-21T${startTime}:00`);
    let end = new Date(`2024-09-21T${endTime}:00`);

    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    return (end.getTime() - start.getTime()) / (1000 * 60);
  };

  const validateAvailability = (): string | null => {
    for (const day of availability) {
      const { startTime, endTime } = day;

      if (!startTime || !endTime) {
        return `Please enter both start and end time for ${day.dayOfWeek}`;
      }

      const duration = getDurationInMinutes(startTime, endTime);
      if (duration < 240) {
        return `${day.dayOfWeek} must have at least 4 hours of availability`;
      }

      if (duration <= 0) {
        return `${day.dayOfWeek} start time must be before end time`;
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateAvailability();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const res = await updateEmployeeAvailability(availability);
      if (!res.success) {
        console.error(res.message);
        alert("Failed to update availability");
      } else {
        alert("Availability updated successfully");
      }
    } catch (error: any) {
      console.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Availability Creation</h1>

      <h2>Timezone: {timezone}</h2>

      <form onSubmit={handleSubmit}>
        {availability.map((day, index) => (
          <div key={index} className="mb-4">
            <h2 className="font-semibold">{day.dayOfWeek}</h2>
            <div className="flex space-x-2">
              <input
                type="time"
                className="border p-2"
                value={day.startTime}
                onChange={(e) => handleInputChange(index, "startTime", e.target.value)}
              />
              <input
                type="time"
                className="border p-2"
                value={day.endTime}
                onChange={(e) => handleInputChange(index, "endTime", e.target.value)}
              />
            </div>
          </div>
        ))}

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 mt-4">
          Submit
        </button>
      </form>

      <h2 className="text-xl mt-8">Availability Table</h2>
      <table className="table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            {availability.map((day, index) => (
              <th key={index} className="border border-gray-400 p-2">
                {day.dayOfWeek}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {availability.map((day, index) => (
              <td key={index} className="border border-gray-400 p-2">
                {day.startTime && day.endTime
                  ? `${day.startTime} - ${day.endTime}`
                  : "Not Set"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AvailabilityPage;
