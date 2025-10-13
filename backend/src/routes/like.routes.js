import { Router } from "express"
import { toggleLikeTweet,
        toggleLikeVideo,
        toggleLikeComment
 } from "../controllers/like.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/liketweet/:tweetId").post(
    verifyJWT,
    toggleLikeTweet
)

router.route("/likevideo/:videoId").post(
    verifyJWT,
    toggleLikeVideo
)

router.route("/likecomment/:commentId").post(
    verifyJWT,
    toggleLikeComment
)

export default router

