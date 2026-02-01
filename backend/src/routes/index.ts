import { Router } from "express";
import kontakRoutes from "../modules/kontak/kontak.route";
import produkRoutes from "../modules/produk/produk.route";

const router = Router();

router.use("/kontak", kontakRoutes);
router.use("/produk", produkRoutes);

export default router;
