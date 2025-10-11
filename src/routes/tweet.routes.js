import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { postTweet,
        deleteTweet
 } from "../controllers/tweet.controller.js";


const router = Router()


router.route("/postTweet").post(
    verifyJWT,
    postTweet
)

router.route("/deleteTweet/:tweetid").delete(
    verifyJWT,
    deleteTweet
)

export default router