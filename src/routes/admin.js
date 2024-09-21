import { Router } from "express";
import { verifyJWT, verifyPermission } from '../middleware/auth.js';
import { UserRolesEnum } from "../constants.js";
import {
    getEmployeeAvailability,
    getAvailableEmployees,
    getAllEmployees,
    createShift
} from "../controllers/admin.js";

const router = Router();

router
    .route("/availability/:employeeID")
    .get(verifyJWT, verifyPermission([UserRolesEnum.ADMIN]), getEmployeeAvailability);

router
    .route("/employees")
    .get(verifyJWT, verifyPermission([UserRolesEnum.ADMIN]), getAllEmployees);

router
    .route("/shifts")
    .post(verifyJWT, verifyPermission([UserRolesEnum.ADMIN]), createShift);

router
    .route("/available-employees")
    .get(verifyJWT, verifyPermission([UserRolesEnum.ADMIN]), getAvailableEmployees);

export default router;
