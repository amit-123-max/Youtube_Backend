import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";

const toggleLikeTweet = asyncHandler( async(req,res) => {
    const { tweetId } = req.params

    if(mongoose.Types.ObjectId.isValid(tweetId) === false) {
        throw new ApiError(400, "Invalid tweetId format");
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404, "Tweet not found");
    }
    // if(!tweetId){
    //     throw new ApiError(401,"Failed to fetch tweetId from params")
    // }

    const like = {
        tweet: tweetId,
        likedBy: req.user?._id
    }

    const existingLike = await Like.findOne(like)


    let isliked
    let operation
    if(!existingLike){
        const addlike = await Like.create(like)
        if(!addlike){ throw new ApiError(401,"Failed to like this tweet")}
        isliked = true
        operation = "like successfull"
    }
    else{
        const dislike = await Like.findByIdAndDelete(existingLike._id)
        if(!dislike){
            throw new ApiError(401, "Failed to add like to Like schema")
        }
        isliked = false
        operation = "unlike successfull"
    }

    return res
    .status(200)
    .json(
        new ApiResponse(201, {isliked,tweetId} , operation)
    )
})

const toggleLikeVideo = asyncHandler( async(req,res) => {
    const { videoId } = req.params

    if(mongoose.Types.ObjectId.isValid(videoId) === false) {
        throw new ApiError(400, "Invalid videoId format");
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found");
    }

    const like = {
        video: videoId,
        likedBy: req.user?._id
    }

    const existingLike = await Like.findOne(like)


    let isliked
    let operation
    if(!existingLike){
        const addlike = await Like.create(like)
        if(!addlike){ throw new ApiError(401,"Failed to like this video")}
        isliked = true
        operation = "like successfull"
    }
    else{
        const dislike = await Like.findByIdAndDelete(existingLike._id)
        if(!dislike){
            throw new ApiError(401, "Failed to add like to Like schema")
        }
        isliked = false
        operation = "unlike successfull"
    }

    return res
    .status(200)
    .json(
        new ApiResponse(201, {isliked,videoId} , operation)
    )
})

const toggleLikeComment = asyncHandler( async(req,res) => {
    const { commentId } = req.params

    if(mongoose.Types.ObjectId.isValid(commentId) === false) {
        throw new ApiError(400, "Invalid commentId format");
    }

    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404, "Comment not found");
    }

    // if(!tweetId){
    //     throw new ApiError(401,"Failed to fetch tweetId from params")
    // }

    const like = {
        comment: commentId,
        likedBy: req.user?._id
    }

    const existingLike = await Like.findOne(like)


    let isliked
    let operation
    if(!existingLike){
        const addlike = await Like.create(like)
        if(!addlike){ throw new ApiError(401,"Failed to like this comment")}
        isliked = true
        operation = "like successfull"
    }
    else{
        const dislike = await Like.findByIdAndDelete(existingLike._id)
        if(!dislike){
            throw new ApiError(401, "Failed to add like to Like schema")
        }
        isliked = false
        operation = "unlike successfull"
    }

    return res
    .status(200)
    .json(
        new ApiResponse(201, {isliked,commentId} , operation)
    )
})

export {
    toggleLikeTweet,
    toggleLikeComment,
    toggleLikeVideo
}