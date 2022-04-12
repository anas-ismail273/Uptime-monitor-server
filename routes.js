import express from "express";

import verifyToken from "./middlewares/jwt-auth.js";
import { signUp, login, verify } from "./controllers/authController.js";
import {
  getCheck,
  getAllChecks,
  createCheck,
  updateCheck,
  deleteCheck,
} from "./controllers/checkController.js";
import { getReport, getReportsByTags } from "./controllers/reportController.js";

const router = express.Router();

// auth
router.post("/auth/signup", signUp);
router.post("/auth/login", login);
router.post("/auth/verify", verify);

// checks
router.get("/checks", verifyToken, getAllChecks);
router.post("/checks", verifyToken, createCheck);
router.get("/checks/:id", verifyToken, getCheck);
router.put("/checks/:id", verifyToken, updateCheck);
router.delete("/checks/:id", verifyToken, deleteCheck);

// reports
router.get("/reports/:checkId", verifyToken, getReport);
router.post("/reports/tags", verifyToken, getReportsByTags);

export default router;
