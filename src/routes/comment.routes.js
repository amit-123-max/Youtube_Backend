import { Router } from "express"
import { addComment,
        deleteComment,
        editComment,
        getNumberOfLikes
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

router.route("/editComment/:commentId").patch(
    verifyJWT,
    editComment
)

router.route("/likecount/:commentId").get(
    verifyJWT,
    getNumberOfLikes
)

export default router