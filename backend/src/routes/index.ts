import { Router } from "express";
import kontakRoutes from "../modules/kontak/kontak.route";
import loginRoutes from "../modules/login_register/login.route";

const router = Router();

router.use("/kontak", kontakRoutes);
router.use("/", loginRoutes);

export default router;
