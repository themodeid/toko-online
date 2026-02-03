import { Router } from "express";
import kontakRoutes from "../modules/kontak/kontak.route";
import produkRoutes from "../modules/produk/produk.route";
import registerRoutes from "../modules/login-register/register.route";

const router = Router();

router.use("/kontak", kontakRoutes);
router.use("/produk", produkRoutes);
router.use("/auth", registerRoutes);

export default router;
