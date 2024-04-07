import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    // find title and description of video by body
    // validate it 
    // get video file path from req.file 
    // uplode to cloudinary and fetch the duration from there

    if(!title )
    {
        throw new Error('Title is not found')
    }

    if(!description)
    {
        throw new Error('Description is not found')
    }
    
    const localvideoFile = req.files?.videoFile[0]?.path
    //console.log(req.files.videoFile)
    //console.log('Request files' , req.files)

    if(!localvideoFile)
    {
        throw new Error ('Video file is not fetched by multer ')
    }

    const localthumbnail = req.files?.thumbnail[0]?.path
   // console.log('local Path ' , localthumbnail)
    if(!localthumbnail)
    {
        throw new Error ('Thumbnail is not fetched by multer ')
    }
    console.log('Local  Path is' ,localvideoFile )
   // const videoFileTocloudinary =await uploadOnCloudinary(localvideoFile)
   const videoFilecloudinary = await uploadOnCloudinary(localvideoFile)
  // const thumbnailCloudinary = await uploadOnCloudinary(localthumbnail)

    //console.log(videoFilecloudinary);

    if(!videoFilecloudinary)
    {
        throw new Error('Video file is not uploded on cloudinary')
    }

     const thumbnailCloudinary = await uploadOnCloudinary(localthumbnail)

    if(!thumbnailCloudinary)
    {
        throw new Error('Thumbnail is not uploded on cloudinary')
    }

    const video = await Video.create({
        title,
        description,
        videoFile:videoFilecloudinary,
        thumbnail:thumbnailCloudinary,
    })

    if(!video)
    {
        throw new Error('Video is not uploded  into database sucessfully')
    }


    return res.status(200).json({
        data:video,
        message:'Video Published Sucessfully'
    })



})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
   
    const videodb = await Video.findById(_id)

    if(videoId == videodb.videoFile)
    {
        return res.status(200).json({
            data:videoId,
            message:'Video Id find sucessfully'
        })
    }

    
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {updatetitle , updatedescription } = req.body
    
    const updatedthumbnail = req.file?.thumbnail?.path

    const updatedDatabase = await Video.findByIdAndUpdate(
        _id,
        {
            $set:{
                title:updatetitle,
                description:updatedescription
            }
        },
        {
            new :true
        }
    )

    return res.status(200).json({
        data:updatedDatabase,
        message : 'Information are updated Sucessfully'
    })
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
     
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export  {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
