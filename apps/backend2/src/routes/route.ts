import { Router } from "express";
import {  Router as ExpressRouter } from "express";
const router: ExpressRouter = Router();
import pairing_algo from "../controllers/pairing_algo";
router.route("/generate_next_round").post(pairing_algo)

export default router;