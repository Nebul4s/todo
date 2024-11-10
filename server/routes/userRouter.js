import { Router } from "express";
import { pool } from "../helper/db.js";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { postRegistration, postLogin } from "../controllers/UserController.js";

const { sign } = jwt;

const router = Router();

router.post("/register", postRegistration);

router.post("/login", postLogin);

export default router;
