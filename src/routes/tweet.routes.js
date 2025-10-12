import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { postTweet,
        deleteTweet,
        editTweet,
        getNumberOfLikes
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

router.route("/updateTweet/:tweetId").patch(
    verifyJWT,
    editTweet
)

router.route("/likecount/:tweetId").get(
    verifyJWT,
    getNumberOfLikes
)

export default router