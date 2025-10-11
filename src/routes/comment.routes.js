import { Router } from "express"
import { addComment } from "../controllers/comment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/addComment/:videoId").post(
    verifyJWT,
    addComment
)

export default router