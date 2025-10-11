import { Router } from "express"
import { addComment,
        deleteComment
 } from "../controllers/comment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/addComment/:videoId").post(
    verifyJWT,
    addComment
)

router.route("/deleteComment/:commentId").delete(
    verifyJWT,
    deleteComment
)

export default router