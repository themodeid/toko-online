import { Router } from "express";
import { authGuard } from "../../middlewares/auth";

import * as controller from "./users.controller";

const router = Router();

router.get("/getMe", authGuard, controller.getMe);
router.delete("/deleteAllUsers", controller.deleteAllUsers);
export default router;
