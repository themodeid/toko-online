import { Router } from "express";
import { authGuard } from "../../middlewares/auth";
import { roleGuard } from "../../middlewares/roleGuard";
import * as controller from "./orders.controller";
import {
  checkout,
  getOrders,
  deleteAll,
  cancelOrder,
  getMyOrders,
  getOrdersActive,
  getMyOrdersActive,
} from "./orders.controller";
import { validateBody } from "../../middlewares/validateBody";
import { CheckoutSchema, OrderResponseSchema } from "./orders.schema";

const router = Router();

// membuat pesanan
router.post("/", authGuard, validateBody(CheckoutSchema), controller.checkout);
// ambil semua orderan
router.get("/", authGuard, controller.getOrders);
// ambil semua orderan yang active
router.get("/Active", authGuard, controller.getOrdersActive);
// mengambil my orderan yang aktive
router.get("MyActive", authGuard, controller.getMyOrdersActive);
router.get("/:id", authGuard, controller.getMyOrders);
// update and delete
router.patch("/:id/cancel", authGuard, controller.cancelOrder);
router.delete("/", authGuard, controller.deleteAll);
export default router;
