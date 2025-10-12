import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

import mongoose from "mongoose";


const addComment = asyncHandler( async(req,res) => {
    const { content } = req.body

    if(!content ){
        throw new ApiError(401,"Add a text or something to comment")
    }

    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(401,"Failed to fetch VideoId")
    }
    
    // console.log(videoId)

    const comment = await Comment.create({
        content: content,
        video: videoId,
        owner: req.user?._id
    })

    if(!comment){
        throw new ApiError(401, "Failed to publish comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, comment, "Comment added successfully")
    )
})

const deleteComment = asyncHandler( async(req,res) => {
    const { commentId } = req.params

    if(!commentId ){
        throw new ApiError(401,"Failed to fetch commentId")
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(401, "Failed to fetch comment from database")
    }


    // ⭐ SECURITY CHECK: Yahaan code add karein
    if (comment.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Aap sirf apni hi comment delete kar sakte hain.");
    }

    try{
        await Comment.findByIdAndDelete(commentId)
    } catch{
        throw new ApiError(401, "Failed to delete your comment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Your comment has been deleted successfully")
    )
})

const editComment = asyncHandler( async(req,res) =>{
     const { commentId } = req.params

    if(!commentId ){
        throw new ApiError(401,"Failed to fetch commentId")
    }

    const comment = await Comment.findById(commentId)

    if(!comment){
        throw new ApiError(401, "Failed to fetch comment from database")
    }

    const { newComment } = req.body
    if(!newComment){
        throw new ApiError(401,"Failed to fetch newComment from req")
    }

    // ⭐ SECURITY CHECK: Yahaan code add karein
    if (comment.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Aap sirf apni hi comment delete kar sakte hain.");
    }

    const editedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content: newComment
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, editedComment, "Your Comment has been edited successfully")
    )
})

const getNumberOfLikes = asyncHandler( async(req,res)=> {
    const { commentId } = req.params

    if(!commentId){
        throw new ApiError(400, "failed to fetch commentId from params")
    }

    const likenumber = await Comment.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(commentId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "comment",
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
                video: 1,
                owner: 1,
                likeCount: 1,
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

export {
    addComment,
    deleteComment,
    editComment,
    getNumberOfLikes
}