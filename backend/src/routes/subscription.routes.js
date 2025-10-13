import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    toggleSubscribe
 } from "../controllers/subscription.controller.js";

 const router = Router()

 router.route("/subscribe/:channelId").post(
    verifyJWT,
    toggleSubscribe
 )

 export default router