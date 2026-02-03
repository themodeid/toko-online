import { Router } from "express";
import * as controller from "./produk.controller";
import { validateBody } from "../../middlewares/validateBody";
import { produkSchema, updateProdukSchema } from "./produk.schema";
import { authGuard } from "../../middlewares/auth";
import { roleGuard } from "../../middlewares/roleGuard";

const router = Router();

// Public / user login
router.get("/", authGuard, controller.getAllProduk);
router.get("/:id", authGuard, controller.getProdukById);

// Admin only
router.post(
  "/",
  authGuard,
  roleGuard("admin"),
  validateBody(produkSchema),
  controller.createProduk,
);

router.patch(
  "/:id",
  authGuard,
  roleGuard("admin"),
  validateBody(updateProdukSchema),
  controller.updateProduk,
);

router.delete("/:id", authGuard, roleGuard("admin"), controller.deleteProduk);

export default router;
