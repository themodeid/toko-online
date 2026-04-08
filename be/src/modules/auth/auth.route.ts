import { Router } from "express";
import * as controller from "./auth.controller";
import { validateBody } from "../../middlewares/validateBody";
import { RegisterSchema, LoginSchema } from "./auth.schema";

const router = Router();

// Register routes
router.post("/register", validateBody(RegisterSchema), controller.registerUser);
router.post("/registerUser", validateBody(RegisterSchema), controller.registerUser);
router.post("/registerAdmin", validateBody(RegisterSchema), controller.registerAdmin);
router.post("/login", validateBody(LoginSchema), controller.login);
router.post("/logout", controller.logout);
export default router;
