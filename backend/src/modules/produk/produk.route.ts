import { Router } from "express";
import * as controller from "./produk.controller";
import { validateBody } from "../../middlewares/validateBody";
import { produkSchema, updateProdukSchema } from "./produk.schema";

const router = Router();

// Public
router.get("/", controller.getAllProduk);
router.get("/:id", controller.getProdukById);

// Semua user login bisa CRUD
router.post("/", validateBody(produkSchema), controller.createProduk);

router.patch("/:id", validateBody(updateProdukSchema), controller.updateProduk);

router.delete("/:id", controller.deleteProduk);

export default router;
