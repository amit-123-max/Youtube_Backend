import { Router } from "express"
import { likeTweet } from "../controllers/like.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/liketweet").post(
    verifyJWT,
    likeTweet
)

export default router

