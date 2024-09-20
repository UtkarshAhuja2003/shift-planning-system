import { WeekDaysEnum } from "../constants.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const updateEmployeeAvailability = asyncHandler(async (req, res) => {
  const user = req.user;
  const { timezone, schedule } = req.body;

  if(!timezone) {
    throw new ApiError(400, "Timezone is required");
  }
  if (!schedule || !Array.isArray(schedule) || schedule.length !== 7) {
    throw new ApiError(400, "Schedule is required and must be an array of 7 days");
  }

  for(const day of schedule) {
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
      availability: {
          timezone, 
          schedule 
      } 
    }
  );
  if(!updatedUser) {
    throw new ApiError(500, "Failed to update availability");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        "Availability updated successfully",
        { user: updatedUser }
      )
    );
});

export {
    updateEmployeeAvailability
};
