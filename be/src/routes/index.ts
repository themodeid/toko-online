import { Router } from "express";
import kontakRoutes from "../modules/kontak/kontak.route";
import produkRoutes from "../modules/produk/produk.route";
import registerRoutes from "../modules/login-register/register.route";
import ordersRoutes from "../modules/orders/orders.routes";
import { upload } from "../middlewares/upload";
import { authGuard } from "../middlewares/auth";
import { AppError } from "../errors/AppError";

const router = Router();

router.use("/auth", registerRoutes);
router.use("/kontak", kontakRoutes);
router.use("/produk", produkRoutes);
router.use("/orders", ordersRoutes);

router.post("/upload-avatar", authGuard, upload.single("photo"), (req, res) => {
  if (!req.file) {
    throw new AppError("File tidak ditemukan", 400);
  }

  res.json({
    message: "Upload berhasil",
    filePath: `/uploads/${req.file.filename}`,
  });
});

export default router;
