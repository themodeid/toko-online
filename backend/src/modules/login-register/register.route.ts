import { Router } from "express";
import * as controller from "./register.controller";
import { validateBody } from "../../middlewares/validateBody";
import { registerSchema } from "./register.schema";

const router = Router();

router.post("/register", validateBody(registerSchema), controller.register);

export default router;
