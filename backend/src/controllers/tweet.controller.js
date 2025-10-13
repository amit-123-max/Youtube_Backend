import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

import mongoose from "mongoose";

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

const editTweet = asyncHandler( async(req,res) =>{
     const { tweetId } = req.params

    if(!tweetId ){
        throw new ApiError(401,"Failed to fetch tweetId")
    }
    console.log(tweetId)
    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(401, "Failed to fetch tweet from database")
    }

    const { newtweet } = req.body
    if(!newtweet){
        throw new ApiError(401,"Failed to fetch newtweet")
    }

    // ⭐ SECURITY CHECK: Yahaan code add karein
    if (tweet.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Aap sirf apni hi tweet delete kar sakte hain.");
    }

    const editedtweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{
                content: newtweet
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, editedtweet, "Your Tweet has been edited successfully")
    )
})

const getNumberOfLikes = asyncHandler( async(req,res)=> {
    const { tweetId } = req.params

    if(!tweetId){
        throw new ApiError(400, "failed to fetch videoId from params")
    }

    const likenumber = await Tweet.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(tweetId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "tweet",
                as: "likeby",
                pipeline: [
                    {
                        $project: {
                            likedBy: 1,
                            _id: 0,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                likeCount: {
                    $size : "$likeby"
                }
            }
        },
        {
            $project: {
                likeCount: 1,
                owner: 1,
            }
        }
    ]
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, likenumber[0], "Number of likes fetched successfully")
    )
})

export{
    postTweet,
    deleteTweet,
    editTweet,
    getNumberOfLikes
}