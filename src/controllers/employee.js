import { WeekDaysEnum } from "../constants.js";
import User from "../models/User.js";
import Shift from "../models/Shift.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const updateEmployeeAvailability = asyncHandler(async (req, res) => {
  const user = req.user;
  const { availability } = req.body;

  if (!availability || !Array.isArray(availability) || availability.length !== 7) {
    throw new ApiError(400, "Availability is required and must be an array of 7 days");
  }

  for(const day of availability) {
    const { dayOfWeek, startTime, endTime } = day;
    if (!dayOfWeek || !Object.values(WeekDaysEnum).includes(dayOfWeek)) {
      throw new ApiError(400, "Invalid day of the week");
    }
    if (!startTime || !endTime) {
      throw new ApiError(400, "Start time and end time are required");
    }
    if (new Date(startTime) >= new Date(endTime)) {
      throw new ApiError(400, "Start time must be before end time");
    }

    const durationInMs = new Date(endTime) - new Date(startTime);
    if (durationInMs < 4 * 60 * 60 * 1000) {
      throw new ApiError(400, "Duration must be atleast 4 hours");
    }
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    { 
      availability
    }
  );
  if(!updatedUser) {
    throw new ApiError(500, "Failed to update availability");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Availability updated successfully",
        { user: updatedUser }
      )
    );
});

const getEmployeeShifts = asyncHandler(async (req, res) => {
  const employeeId = req.user._id;

  const employee = await User.findById(employeeId);
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }
  const employeeTimezone = employee.timezone;

  const assignedShifts = await Shift.find({ employee: employeeId }).populate('admin');

  const shiftsWithConvertedTimes = assignedShifts.map(shift => {
    const adminTimezone = shift.timezone || 'UTC'; 

    const startTimeAdminTZ = new Date(shift.startTime).toLocaleTimeString('en-US', { 
      timeZone: adminTimezone, 
      hour: 'numeric', 
      minute: 'numeric' 
    });
    const endTimeAdminTZ = new Date(shift.endTime).toLocaleTimeString('en-US', { 
      timeZone: adminTimezone, 
      hour: 'numeric', 
      minute: 'numeric' 
    });
    const dayOfWeekAdminTZ = new Date(shift.startTime).toLocaleDateString('en-US', { 
      weekday: 'long', 
      timeZone: adminTimezone 
    });
    
    const startTimeEmployeeTZ = new Date(shift.startTime).toLocaleTimeString('en-US', { 
      timeZone: employeeTimezone, 
      hour: 'numeric', 
      minute: 'numeric' 
    });
    const endTimeEmployeeTZ = new Date(shift.endTime).toLocaleTimeString('en-US', { 
      timeZone: employeeTimezone, 
      hour: 'numeric', 
      minute: 'numeric' 
    });
    const dayOfWeekEmployeeTZ = new Date(shift.startTime).toLocaleDateString('en-US', { 
      weekday: 'long', 
      timeZone: employeeTimezone 
    });
    
    return {
      ...shift._doc,
      adminTimezone: {
        dayOfWeek: dayOfWeekAdminTZ,
        startTime: startTimeAdminTZ,
        endTime: endTimeAdminTZ
      },
      employeeTimezone: {
        dayOfWeek: dayOfWeekEmployeeTZ,
        startTime: startTimeEmployeeTZ,
        endTime: endTimeEmployeeTZ
      }
    };
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Shifts fetched successfully", { shifts: shiftsWithConvertedTimes })
    );
});



export {
    updateEmployeeAvailability,
    getEmployeeShifts
};
