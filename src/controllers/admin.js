import { UserRolesEnum } from "../constants.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getEmployeesAvailability = asyncHandler(async (req, res) => {
    const employeesAvailability = await User.find({ role: UserRolesEnum.EMPLOYEE }).select('name email availability');
    if (!employeesAvailability) {
        throw new ApiError(404, "No employee found");
    }

    return res
        .status(201)
        .json(
        new ApiResponse(
            200,
            { availabilities: employeesAvailability },
            "Availability fetched successfully"
        )
        );
});

export {
    getEmployeesAvailability
};
