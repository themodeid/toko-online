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
} from "./orders.controller";
import { validateBody } from "../../middlewares/validateBody";
import { CheckoutSchema, OrderResponseSchema } from "./orders.schema";

const router = Router();

// membuat pesanan
router.post("/", authGuard, validateBody(CheckoutSchema), controller.checkout);
// get data
router.get("/", authGuard, controller.getOrders);
router.get("/Active", authGuard, controller.getOrdersActive);

router.get("/:id", authGuard, controller.getMyOrders);
// update and delete
router.patch("/:id/cancel", authGuard, controller.cancelOrder);
router.delete("/", authGuard, controller.deleteAll);
export default router;
