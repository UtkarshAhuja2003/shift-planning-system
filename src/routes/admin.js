import { Router } from "express";
import { verifyJWT, verifyPermission } from '../middleware/auth.js';
import { UserRolesEnum } from "../constants.js";
import {
    getEmployeesAvailability
} from "../controllers/admin.js";

const router = Router();

router
    .route("/availability")
    .get(verifyJWT, verifyPermission([UserRolesEnum.ADMIN]), getEmployeesAvailability);

export default router;
