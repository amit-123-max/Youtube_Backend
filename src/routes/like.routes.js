import { Router } from "express"
import { likeTweet,
        likeVideo,
        likeComment
 } from "../controllers/like.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/liketweet/:tweetId").post(
    verifyJWT,
    likeTweet
)

router.route("/likevideo/:videoId").post(
    verifyJWT,
    likeVideo
)

router.route("/likecomment/:commentId").post(
    verifyJWT,
    likeComment
)

export default router

