import { Subscription } from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const toggleSubscribe = asyncHandler( async(req,res) => {
    const { channelId } = req.params

    if(mongoose.Types.ObjectId.isValid(channelId) === false) {
        throw new ApiError(400, "Invalid channelId format");
    }

    const channel = await User.findById(channelId)
    if(!channel){
        throw new ApiError(404, "Tweet not found");
    }
    // if(!tweetId){
    //     throw new ApiError(401,"Failed to fetch tweetId from params")
    // }

    const ifsubs = {
        subscriber: req.user?._id,
        channel: channelId
    }

    const existingChannel = await Subscription.findOne(ifsubs)


    let issubscribed
    let operation
    if(!existingChannel){
        const subscribed = await Subscription.create(ifsubs)
        if(!subscribed){ throw new ApiError(401,"Failed to subscribe the channel")}
        issubscribed = true
        operation = "channel Subscribed!!!"
    }
    else{
        const unSubscribe = await Subscription.findByIdAndDelete(existingChannel._id)
        if(!unSubscribe){
            throw new ApiError(401, "Failed to add like to Like schema")
        }
        issubscribed = false
        operation = "failed to subscribe"
    }

    return res
    .status(200)
    .json(
        new ApiResponse(201, {issubscribed,channelId} , operation)
    )
})

export{
    toggleSubscribe
}