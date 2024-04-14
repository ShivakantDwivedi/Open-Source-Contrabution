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
    try {
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

      //  console.log('Local Video path file ' , localvideoFile);
        
    
        if(!localvideoFile)
        {
            throw new Error ('Video file is not fetched by multer ')
        }
        

         const localthumbnail = req.files?.thumbnail[0]?.path
        
        // const localthumbnail = req.files && req.files.thumbnail ? req.files.thumbnail[0]?.path

       // console.log('Local thumbnail path file ' , localthumbnail);

        if(!localthumbnail)
        {
            throw new Error ('Thumbnail is not fetched by multer ')
        }
        

       const videoFilecloudinary = await uploadOnCloudinary(localvideoFile)
     
        console.log('Video file on cloudinary is',videoFilecloudinary.url);

        // console.log('Duration time of video file on cloudinary is' , videoFilecloudinary.duration);
    
        if(!videoFilecloudinary)
        {
            throw new Error('Video file is not uploded on cloudinary')
        }

        const videoFileduration = videoFilecloudinary.duration

        if(!videoFileduration)
        {
            throw new Error ('Video file duration is not found')
        }

        console.log('Video file duration is' , videoFileduration);
    
         const thumbnailCloudinary = await uploadOnCloudinary(localthumbnail)

         console.log('Cloudinary thumbnail is ' , thumbnailCloudinary.url);


        if(!thumbnailCloudinary)
        {
            throw new Error('Thumbnail is not uploded on cloudinary')
        }
    
        const video  = await Video.create({

            title,
            description,
            videoFile: videoFilecloudinary.url,
            thumbnail: thumbnailCloudinary.url,
            duration: videoFileduration

            })
        
        if(!video)
        {
            throw new Error('Video is not uploded  into database sucessfully')
        }
    
    
        return res.status(200).json({
            data:video,
            message:'Video Published Sucessfully'
        })
    } catch (error) {
        console.log('Error occur which are' , error)
    }

})




const getVideoById = asyncHandler(async (req, res) => {
    
    const { title } = req.body;

    const getdatafromVideoId = await Video.findOne({title})

    return res.status(200).json({
        data: getdatafromVideoId,
        message: "Information is updated in the database"
    })
})

// const getVideoById = asyncHandler(async(req, res) => {
    
    
//     const {videoId}  = req.params

//     const {title}  = req.body


//     if (typeof videoId !== 'string') {
//         throw new Error('Invalid videoId');
//     }

//     const updateValue = await Video.aggregate ([
//         {
//             $match:{
//                 title
//             },
//         },

//             {
//                 $addFields:{
//                     newId : mongoose.Types.ObjectId(videoId.toString())
//                 }
//             } 
//     ]);
    // return res.status(200).json({
    //     data:updateValue,
    //     message:"Information all are updated very sucessfully"
    // })


// })


// const updateVideo = asyncHandler(async (req, res) => {
//    // const { videoId } = req.params
//     //TODO: update video details like title, description, thumbnail
//     //const {updatetitle , updatedescription } = req.body

//     try {
//         const {title} = req.body
    
//         // find method return array and findOne return object
//         const video = await Video.findOne({title})

//         console.log('Document find is' , video);
    
//         if(!video)
//         {
//             throw new Error('Title is not matched')
//         }
    
//         const updatevideoFile = req.files?.videoFile[0]?.path

//         console.log('UpdatedVide File is ' , updatevideoFile);
    
//         if(!updatevideoFile)
//         {
//             throw new Error ('Local file path for video is not found')
//         }
    
//         const uplodevideoCloudinary = await uploadOnCloudinary(updatevideoFile)
    
//         console.log('Cloudinary video path is ' , uplodevideoCloudinary.url);
    
//         if(!uplodevideoCloudinary)
//         {
//             throw new Error ('Video is not uploded on cloudinary')
//         }
        
//         const updatedthumbnail = req.files?.thumbnail[0]?.path
    
//         if(!updatedthumbnail)
//         {
//             throw new Error('Local file path for thumbnail is not found')
//         }
    
//         const uplodethumbnailCloudinary = await uploadOnCloudinary(updatedthumbnail)
    
//         console.log('Cloudinary thumbnail path is ' , uplodethumbnailCloudinary.url);
    
//         if(!uplodethumbnailCloudinary)
//         {
//             throw new Error ('Thumbnail is not uploded on cloudinary')
//         }

//          const updatedDatabase = await Video.findByIdAndUpdate(
//              video._id,
//              {
//                  $set:{
//                     videoFile:uplodevideoCloudinary.url,
//                     thumbnail:uplodethumbnailCloudinary.url   
//                  }
//              },
//              {
//                  new :true
//              }
//          );
    
//          console.log('Updated Database' , updatedDatabase);
    
//          return res.status(200).json({
//             data:updatedDatabase,
//             message : 'Information are updated Sucessfully'
//         })
    
//     } catch (error) {
//         console.log('Error occurs in catch block'  , error)
//     }
   

    
// })



const updateVideo = asyncHandler(async (req, res) => {
    try {
        const { title } = req.body;

        // Find the video by title
        const video = await Video.findOne({ title });

        console.log('Title fetched by database is ' , video);

        if (!video) {
            throw new Error('Video with the given title not found');
        }

        console.log('Before local');
        // Upload videoFile to Cloudinary
        const updatevideoFile = req.files?.videoFile[0]?.path;

        console.log('After local');
        if (!updatevideoFile) {
            throw new Error('Local file path for video is not found');
        }

        const uplodevideoCloudinary = await uploadOnCloudinary(updatevideoFile);
        // if (!uplodevideoCloudinary || !uplodevideoCloudinary.url) {
        //     throw new Error('Video is not uploaded on cloudinary');
        // }

        console.log('Cloudinary video path is', uplodevideoCloudinary.url);

        // Upload thumbnail to Cloudinary
        const updatedthumbnail = req.files?.thumbnail[0]?.path;
        if (!updatedthumbnail) {
            throw new Error('Local file path for thumbnail is not found');
        }

        const uplodethumbnailCloudinary = await uploadOnCloudinary(updatedthumbnail);
        // if (!uplodethumbnailCloudinary || !uplodethumbnailCloudinary.url) {
        //     throw new Error('Thumbnail is not uploaded on cloudinary');
        // }

        console.log('Cloudinary thumbnail path is', uplodethumbnailCloudinary.url);

        // Update video details in the database
        const updatedDatabase = await Video.findByIdAndUpdate(
            video._id,
            {
                $set: {
                    videoFile: uplodevideoCloudinary.url,
                    thumbnail: uplodethumbnailCloudinary.url
                }
            },
            {
                new: true
            }
        );

        if (!updatedDatabase) {
            throw new Error('Failed to update video details in the database');
        }

        console.log('Updated Database:', updatedDatabase);

        return res.status(200).json({
            data: updatedDatabase,
            message: 'Information updated successfully'
        });

    } catch (error) {
        console.error('Error updating video:', error);
        return res.status(500).json({
            message: 'Error updating video',
            error: error.message
        });
    }
});

const deleteVideo = asyncHandler(async (req, res) => {
    //const { videoId } = req.params
    //TODO: delete video

    const {title} = req.body

    if(!title)
    {
        throw new Error('Title is not fetched by req.body')
    }

    const findTitle = await Video.findOne({title})

    console.log('Datbase value' , findTitle);

    if(!findTitle)
    {
        throw new Error('Title information is not find through database')
    }

    const deleteVideo = await Video.findByIdAndDelete(
        findTitle._id,
        {
            $unset:{
                videoFile: 1,
                thumbnail:1
            }
        },
        {
            new :true
        }
    )

    if(!deleteVideo)
    {
        throw new Error('Video is not deleted Sucessfully')
    }

    return res.status(200).json(
        {
            data:deleteVideo,
            message:'Video Deleted Sucessfull'
        }
    )

     
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
