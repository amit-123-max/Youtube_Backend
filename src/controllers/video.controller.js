import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";   



const uploadVideo = asyncHandler( async (req,res) => {
    const videoFile = req.files?.videoFile?.[0]?.path
    const thumbnail = req.files?.thumbnail?.[0]?.path

    if(!videoFile || !thumbnail){
        throw new ApiError(400,"videoFile and thumbnail both are required")
    }

    const videoFileUpload = await uploadOnCloudinary(videoFile)
    const thumbnailUpload = await uploadOnCloudinary(thumbnail)

    if(!videoFileUpload || !thumbnailUpload){
        throw new ApiError(400, "Failed to upload videoFile or thumbnail on Cloudinary")
    }

    const { title, description } = req.body

    if(!title){
        throw new ApiError(400, "Video Title is required")
    }

    const video = await Video.create({
        videoFile: videoFileUpload.url,
        thumbnail: thumbnailUpload.url, 
        title: title,
        isPublished: true,
        description: description,
        owner: req.user._id,
        duration: videoFileUpload.duration || 0,
    })

    if(!video){
        throw new ApiError(500, "Something went wrong while uploading the video")
    }

    return res.status(201).json(
        new ApiResponse(200, video, "Video uploaded successfully")
    )
})

export {
    uploadVideo
}

