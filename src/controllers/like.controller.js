import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const likeTweet = asyncHandler( async(req,res) => {
    const { tweetId } = req.params

    if(!tweetId){
        throw new ApiError(401,"Failed to fetch tweetId from params")
    }

    const like = await Like.create({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    if(!like){
        throw new ApiError(401,"Failed to like the tweet")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "tweet like successfully")
    )
})

export {
    likeTweet
}