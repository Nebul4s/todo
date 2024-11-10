import { Router } from "express";
import { pool } from "../helper/db.js";
import { emptyOrRows } from "../helper/utils.js";
import { auth } from "../helper/auth.js";
import {
  deleteATask,
  getTasks,
  postTask,
} from "../controllers/TaskController.js";

const router = Router();

router.get("/", getTasks);

router.post("/create", auth, postTask);

router.delete("/delete/:id", auth, deleteATask);

export default router;
