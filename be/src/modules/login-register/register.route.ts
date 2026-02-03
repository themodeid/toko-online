import { Router } from "express";
import * as controller from "./register.controller";
import { validateBody } from "../../middlewares/validateBody";
import { registerSchema, loginSchema } from "./register.schema";

const router = Router();

router.post("/register", validateBody(registerSchema), controller.register);
router.post("/login", validateBody(loginSchema), controller.login);

export default router;
