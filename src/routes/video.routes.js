import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

// router
//     .route("/")
//     .get(getAllVideos)
    // .post(
    //     upload.fields([
    //         {
    //             name: "videoFile",
    //             maxCount: 1,
    //         },
    //         {
    //             name: "thumbnail",
    //             maxCount: 1,
    //         },
            
    //     ]),
    //     publishAVideo
    // );


    router.route('/publishAVideo').post(upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
        
    ]),
    publishAVideo)

    router.route('/videoId').get(getVideoById)

    router.route('/updateVideo').post(upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
        
    ]),
    updateVideo)

    router.route('/deleteVideo').post(deleteVideo)
                                    
    router.route("/videoId").patch(getVideoById)
    
    router.route("/videoId").patch(getVideoById)

    router.route('/updateVideo').patch(updateVideo)

    router.route("/deleteVideo").patch(deleteVideo)
 
// router
//     .route("/:videoId")
//     .get(getVideoById)
//     .delete(deleteVideo)
//     .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router