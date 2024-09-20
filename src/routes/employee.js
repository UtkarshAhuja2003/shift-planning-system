import { Router } from "express";
import { verifyJWT, verifyPermission } from '../middleware/auth.js';
import { UserRolesEnum } from "../constants.js";
import {
    updateEmployeeAvailability
} from "../controllers/employee.js";

const router = Router();

router
    .route("/availability")
    .put(verifyJWT, verifyPermission([UserRolesEnum.EMPLOYEE]), updateEmployeeAvailability);

export default router;
