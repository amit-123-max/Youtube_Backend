import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const postTweet = asyncHandler( async(req,res) => {
    const { content } = req.body

    if(!content){
        throw new ApiError(401, "Enter some thing to post")
    }

    const tweet = await Tweet.create({
        content: content,
        owner: req.user?._id
    })

    if(!tweet){
        throw new ApiError(401, "Failed to create tweet")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, tweet, "Tweet successfully posted")
    )
})

const deleteTweet = asyncHandler( async(req,res) => {
    const { tweetid } = req.params

    const tweet = await Tweet.findById(tweetid)
    if(!tweet){
        throw new ApiError(401, "can not fetch tweet from database")
    }

    if (tweet.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Aap sirf apni hi tweet delete kar sakte hain.");
    }

    try{
        await Tweet.findByIdAndDelete(tweet)
    }
    catch{
        throw new ApiError(201,"Failed to delete tweet from database")
    }


    return res.status(200)
    .json(
        new ApiResponse(200, {} , "Tweet successfully deleted")
    )
})

export{
    postTweet,
    deleteTweet
}