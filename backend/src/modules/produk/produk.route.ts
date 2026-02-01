import { Router } from "express";
import * as controller from "./produk.controller"
import { validateBody } from "../../middlewares/validateBody"
import { produkSchema, updateProdukSchema } from "./produk.schema"
import { protect, restrictTo } from "../../middlewares/auth.middleware"

const router = Router()

// Semua user bisa melihat produk
router.get("/", controller.getAllProduk)
router.get("/:id", controller.getProdukById)

// Hanya owner yang bisa create, update, delete produk
router.post("/", protect, restrictTo("owner"), validateBody(produkSchema), controller.createProduk)
router.put("/:id", protect, restrictTo("owner"), validateBody(updateProdukSchema), controller.updateProduk)
router.delete("/:id", protect, restrictTo("owner"), controller.deleteProduk)

export default router;
