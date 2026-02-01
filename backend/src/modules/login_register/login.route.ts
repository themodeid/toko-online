import { Router } from "express";
import * as controller from "./login.controller"
import { validateBody } from "../../middlewares/validateBody"
import { loginSchema, registerSchema, updateUserSchema } from "./login.schema"
import { protect, restrictTo } from "../../middlewares/auth.middleware"

const router = Router()

router.post("/login", validateBody(loginSchema), controller.login)
router.post("/register", validateBody(registerSchema), controller.register)
router.put("/:id", protect, restrictTo("owner"), validateBody(updateUserSchema), controller.updateUser)
export default router;
