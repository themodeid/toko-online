import { Router } from "express";
import { authGuard } from "../../middlewares/auth";

import * as controller from "./users.controller";

import { getMe } from "./users.controller";

const router = Router();

router.get("/getMe", authGuard, controller.getMe);
export default router;
