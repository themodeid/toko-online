import { Router } from "express";
import * as controller from "./kontak.controller";
import { validateBody } from "../../middlewares/validateBody";
import { kontakCreateSchema, kontakUpdateSchema } from "./kontak.schema";

const router = Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", validateBody(kontakCreateSchema), controller.create);
router.put("/:id", validateBody(kontakUpdateSchema), controller.update);
router.delete("/:id", controller.remove);

export default router;
