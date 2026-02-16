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
  getOrdersItems,
  getOrdersActiveWithItems,
} from "./orders.controller";
import { validateBody } from "../../middlewares/validateBody";
import { CheckoutSchema, OrderResponseSchema } from "./orders.schema";

const router = Router();

// membuat pesanan
router.post("/", authGuard, validateBody(CheckoutSchema), controller.checkout);
// ambil semua orderan
router.get("/", authGuard, controller.getOrders);
// mengambil semua orderan active beserta pesanannya
router.get("/ActiveItems", authGuard, controller.getOrdersActiveWithItems);
// ambil semua orderan yang active
router.get("/Active", authGuard, controller.getOrdersActive);
// mengambil my orderan yang aktive
router.get("/MyActive", authGuard, controller.getMyOrdersActive);
// mengambil items dari orderan
router.get("/:id/items", authGuard, controller.getOrdersItems);
router.get("/:id", authGuard, controller.getMyOrders);
// update and delete
router.patch("/:id/cancel", authGuard, controller.cancelOrder);
router.delete("/", authGuard, controller.deleteAll);
export default router;
