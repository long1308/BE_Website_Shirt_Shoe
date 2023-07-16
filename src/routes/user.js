import express from "express";
import {
    signin, signup, getAll, remove, update, get
} from "../controllers/user";
import { checkPermission } from "../middlewares/checkPermission.";

const router = express.Router();
router.get("/user", getAll);
router.get("/user/:id", get);
router.delete("/user/:id",  remove);
router.put("/user/:id", update);
router.post("/signup", signup);

router.post("/signin", signin);
export default router;