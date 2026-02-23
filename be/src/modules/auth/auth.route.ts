import { Router } from "express";
import * as controller from "./auth.controller";
import { validateBody } from "../../middlewares/validateBody";
import { RegisterSchema, LoginSchema } from "./auth.schema";

const router = Router();

router.post("/register", validateBody(RegisterSchema), controller.register);
router.post("/login", validateBody(LoginSchema), controller.login);

export default router;
