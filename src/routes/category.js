import express from "express";
import {
  add,
  deleteCategory,
  get,
  getAll,
  update,
} from "../controllers/category";
import { checkPermission } from "../middlewares/checkPermission.";
const router = express.Router();
router.get("/categorys", getAll);
router.get("/categorys/:id", get);
router.post("/categorys", add);
router.put("/categorys/:id", update);
router.delete("/categorys/:id", deleteCategory);

export default router;
