import { Router } from "express";
import * as controller from "./login.controller"
import { validateBody } from "../../middlewares/validateBody"
import { loginSchema, registerSchema } from "./login.schema"

const router = Router()

router.post("/login", validateBody(loginSchema), controller.login)
router.post("/register", validateBody(registerSchema), controller.register)

export default router;
