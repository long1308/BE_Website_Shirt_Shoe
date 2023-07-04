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
router.post("/categorys",checkPermission, add);
router.put("/categorys/:id",checkPermission, update);
router.delete("/categorys/:id",checkPermission, deleteCategory);

export default router;
