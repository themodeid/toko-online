import { Router } from "express";
import kontakRoutes from "../modules/kontak/kontak.route";
import produkRoutes from "../modules/produk/produk.route";
import registerRoutes from "../modules/login-register/register.route";
import { upload } from "../middlewares/upload";

const router = Router();

router.use("/kontak", kontakRoutes);
router.use("/produk", produkRoutes);
router.use("/auth", registerRoutes);
router.post(
  "/upload-avatar",
  upload.single("photo"), // "photo" HARUS sama dengan name di frontend
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: "File tidak ditemukan",
      });
    }

    res.json({
      message: "Upload berhasil",
      filePath: `/uploads/${req.file.filename}`,
    });
  },
);

export default router;
