import { UserRolesEnum, WeekDaysEnum} from "../constants.js";
import User from "../models/User.js";
import Shift from "../models/Shift.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAllEmployees = asyncHandler(async (req, res) => {
    const employees = await User.find({ role: UserRolesEnum.EMPLOYEE }).select('name _id');
    if (!employees) {
        throw new ApiError(404, "No employee found");
    }

    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            "Employees fetched successfully",
            { employees },
        )
        );
});

const getEmployeeAvailability = asyncHandler(async (req, res) => {
    const employeeID = req.params.employeeID;
    const employeeAvailibility = await User.findById(employeeID).select('availability');
    if (!employeeAvailibility) {
        throw new ApiError(404, "No employee found");
    }

    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            "Availability fetched successfully",
            { availability: employeeAvailibility },
        )
        );
});

const getAvailableEmployees = asyncHandler(async (req, res) => {
    const { dayOfWeek, startTime, endTime } = req.body;
    if (!Object.values(WeekDaysEnum).includes(dayOfWeek)) {
        throw new ApiError(400, "Invalid day of the week");
    }
    if (shiftStartTime >= shiftEndTime) {
        throw new ApiError(400, "Start time must be before end time");
    }

    const availableEmployees = await User.find({
        role: "EMPLOYEE",
        "availability": {
          $elemMatch: {
            dayOfWeek: dayOfWeek,
            startTime: { $lte: startTime.toDate() },
            endTime: { $gte: endTime.toDate() },
          }
        }
      }).select("name email availability");
    if(!availableEmployees) {
        throw new ApiError(404, "No available employees found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Available employees fetched successfully",
                { availableEmployees },
            )
        );
});

const createShift = asyncHandler(async (req, res) => {
    const { dayOfWeek, startTime, endTime, employeeId } = req.body;
    const adminId = req.user._id;

    const employee = await User.findById(employeeId);
    if (!employee) throw new ApiError(404, "Employee not found");

    const shift = new Shift({
        date,
        dayOfWeek,
        startTime,
        endTime,
        timezone,
        employee: employeeId,
        admin: adminId
    });

    await shift.save();
    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                "Shift created successfully",
                { shift },
            )
        );
});

export {
    getEmployeeAvailability,
    getAllEmployees,
    getAvailableEmployees,
    createShift
};
