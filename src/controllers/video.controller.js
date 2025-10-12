import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";  
import mongoose from "mongoose";
import {v2 as cloudinary} from "cloudinary"



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
        // await deleteOnCloudinary(videoFileUpload.public_id, "video");
        await cloudinary.uploader.destroy(videoFileUpload.public_id,{ resource_type: "video" });
        throw new ApiError(500, "Thumbnail Cloudinary pe upload nahi ho payi. (Thumbnail Upload Failed)");
    }

    const { title, description } = req.body

    if(!title){
        throw new ApiError(400, "Video Title is required")
    }

    const video = await Video.create({
        videoFile: videoFileUpload.url,
        thumbnail: thumbnailUpload.url, 
        videoFilePublicId: videoFileUpload.public_id,
        thumbnailPublicId: thumbnailUpload.public_id,
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

const deleteVideo = asyncHandler( async(req,res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400, "Video Id not found")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(400, "videoFile not found")
    }

    // const videoFile = video.videoFile
    // const thumbnail = video.thumbnail

    // function getPublicIdFromUrl(url) {
    // const parts = url.split('/');
    // const lastPart = parts[parts.length - 1]; // cvtliygyzjyo1zdqmn7u.jpg
    // return lastPart.split('.')[0]; // cvtliygyzjyo1zdqmn7u
    // }

    // function getPublicIdFromUrl(url) {
    // const parts = url.split('/');
    // const uploadIndex = parts.indexOf('upload');
    // return parts.slice(uploadIndex + 1).join('/').split('.')[0];
    // }


    // const videoFile_Id = getPublicIdFromUrl(videoFile)
    // const thumbnail_Id = getPublicIdFromUrl(thumbnail)

    const videoFile_Id = video.videoFilePublicId
    const thumbnail_Id = video.thumbnailPublicId

    // ⭐ SECURITY CHECK: Yahaan code add karein
    if (video.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Aap sirf apni hi videos delete kar sakte hain.");
    }

    try{
    // await deleteOnCloudinary(videoFile_Id,"video")
    await cloudinary.uploader.destroy(videoFile_Id,{ resource_type: "video" });
    }
    catch {
        throw new ApiError(500, "Failed to delete videoFile")
    }

    try{
    // await deleteOnCloudinary(thumbnail_Id,"image")
    await cloudinary.uploader.destroy(thumbnail_Id,{ resource_type: "image" });
    }
    catch {
        throw new ApiError(500, "Failed to delete thumbnail")
    }

    try{
    await Video.findByIdAndDelete(videoId);
    }
    catch {
        throw new ApiError(400, "Failed to delete video from database")
    }
    console.log("video deleted")
    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )
})

const updateVideoDetails = asyncHandler( async(req,res) => {
    const { title, description } = req.body

    if(!title && !description){
        throw new ApiError(4000, "For update-> title or description atleast one field is required")
    }

    const { videoId } = req.params

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400, "Video not found")
    }

    // ⭐ SECURITY CHECK: Yahaan code add karein
    if (video.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Aap sirf apni hi videos update kar sakte hain.");
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: title,
                description,
            }
        },
        {
            new: true
        }
    )

    return res.status(200).json(
            new ApiResponse(200, updatedVideo, "Video details have been changed successfully" )
    )
})

const updatethumbnail = asyncHandler( async(req,res) => {
    const { videoId } = req.params
    const new_thumbnail = req.file?.path

    if(!videoId){
        throw new ApiError(400, "Failed to find VideoId")
    }

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(400, "Video not found")
    }

    // ⭐ SECURITY CHECK: Yahaan code add karein
    if (video.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Aap sirf apni hi videos update kar sakte hain.");
    }

    try{
        await cloudinary.uploader.destroy(video.thumbnailPublicId,{ resource_type: "image" });
    }
    catch{
        throw new ApiError(401, "Failed to delete prev thumbnail from cloudinary")
    }

    const uploadThumbnail = await uploadOnCloudinary(new_thumbnail)
    if(!uploadThumbnail){
        throw new ApiError(401, "failed to upload new thumbnail on cloudinary")
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                thumbnail: uploadThumbnail.url
            }
        },
        {
            new: true
        }
    )
    return res.status(200)
    .json(
        new ApiResponse(200, updatedVideo, "Video thumbnail has been changed successfully")
    )

})

const getNumberOfLikes = asyncHandler( async(req,res)=> {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400, "failed to fetch videoId from params")
    }

    const likenumber = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
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
                _id: 0,
                videoFile: 0,
                videoFilePublicId: 0,
                thumbnail: 0,
                thumbnailPublicId: 0,
                title: 0,
                description: 0,
                duration: 0,
                views: 0,
                isPublished: 0,
                owner: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0
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
    uploadVideo,
    deleteVideo,
    updateVideoDetails,
    updatethumbnail,
    getNumberOfLikes
}

