import { Router } from "express";
import kontakRoutes from "../modules/kontak/kontak.route";

const router = Router();

router.use("/kontak", kontakRoutes);

export default router;
