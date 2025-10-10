import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";   



const uploadVideo = asyncHandler( async (req,res) => {
    const videoFile = req.files?.videoFile?.[0]?.path
    const thumbnail = req.files?.thumbnail?.[0]?.path

    // if(!videoFile || !thumbnail){
    //     throw new ApiError(400,"videoFile and thumbnail both are required")
    // }

    if (!videoFile) {
        // Agar Thumbnail local path available hai, toh use delete karo
        if (thumbnail) {
            fs.unlinkSync(thumbnail);
        }
        throw new ApiError(400, "Video file upload karna zaruri hai.");
    }
    
    // Case 2: Agar Thumbnail file missing hai
    if (!thumbnail) {
        // Video file local path available hai, toh use delete karo
        if (videoFile) {
            fs.unlinkSync(videoFile);
        }
        throw new ApiError(400, "Thumbnail file upload karna zaruri hai.");
    }

    // const videoFileUpload = await uploadOnCloudinary(videoFile)
    // const thumbnailUpload = await uploadOnCloudinary(thumbnail)

    // if(!videoFileUpload || !thumbnailUpload){   
    //     throw new ApiError(400, "Failed to upload videoFile or thumbnail on Cloudinary")
    // }

    const videoFileUpload = await uploadOnCloudinary(videoFile); 
    if (!videoFileUpload) {
        // Agar yahi fail ho gaya toh thumbnail upload karna hi nahi hai.
        throw new ApiError(500, "Video Cloudinary pe upload nahi ho payi. (Video Upload Failed)");
    }
    
    // 2. Thumbnail upload (only if video is successful)
    const thumbnailUpload = await uploadOnCloudinary(thumbnail); 

    if (!thumbnailUpload) {
        // 2a. Thumbnail fail hui, toh abhi-abhi upload hui video file ko delete karo (Cloudinary se)
        await deleteOnCloudinary(videoFileUpload.public_id, "video");
        throw new ApiError(500, "Thumbnail Cloudinary pe upload nahi ho payi. (Thumbnail Upload Failed)");
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

