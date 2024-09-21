import { Router } from "express";
import { verifyJWT, verifyPermission } from '../middleware/auth.js';
import { UserRolesEnum } from "../constants.js";
import {
    updateEmployeeAvailability,
    getEmployeeShifts
} from "../controllers/employee.js";

const router = Router();

router
    .route("/availability")
    .put(verifyJWT, verifyPermission([UserRolesEnum.EMPLOYEE]), updateEmployeeAvailability);

router
    .route("/shifts")
    .get(verifyJWT, verifyPermission([UserRolesEnum.EMPLOYEE]), getEmployeeShifts);

export default router;
