import { Router } from "express";
import { uploadVideo,
        deleteVideo,
        updateVideoDetails,
        updatethumbnail,
        getNumberOfLikes,
        getAllVideos
 } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; 
import { upload } from "../middlewares/multer.middleware.js";


const router = Router()

router.route("/uploadVideo").post(verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1 
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    uploadVideo
)

router.route("/delete/:videoId").delete(verifyJWT,
    deleteVideo)

router.route("/update/:videoId").patch(verifyJWT,
    updateVideoDetails
)

router.route("/updatethumbnail/:videoId").patch(verifyJWT,
    upload.single("thumbnail"),
    updatethumbnail
)

router.route("/likecount/:videoId").get(
    verifyJWT,
    getNumberOfLikes
)

router.route("/").get(getAllVideos)

export default router