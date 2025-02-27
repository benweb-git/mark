const { responseReturn } = require("../../utilities/response");
const { formidable } = require('formidable');
const { cloudinary, configureCloudinary } = require('../../utilities/cloudinaryConfig');
const homeModel = require("../../Models/HomeModel");
const socialModel = require("../../Models/SocialModel");
const coinModel=require("../../Models/coinModel");

configureCloudinary();

class homeController {
    create_home_info = async (req, res) => {
        const form = formidable();
        let imageResult, videoResult;

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return responseReturn(res, 500, { error: 'Error parsing form data' });
            }

            try {
                const { name, logo } = fields;
                
                // Validation
                if (!name || !logo || !files.image || !files.video) {
                    return responseReturn(res, 400, { error: 'All fields are required' });
                }

                // Increased timeout and parallel uploads
                const uploadOptions = {
                    folder: 'homeDetails',
                    chunk_size: 6000000, // 6MB chunks for video
                    timeout: 30000 // 30 seconds timeout
                };

                // Upload image and video in parallel
                [imageResult, videoResult] = await Promise.all([
                    cloudinary.uploader.upload(files.image[0].filepath, {
                        ...uploadOptions,
                        resource_type: 'image'
                    }),
                    cloudinary.uploader.upload(files.video[0].filepath, {
                        ...uploadOptions,
                        resource_type: 'video'
                    })
                ]);

                // Create database entry
                const homeDetails = await homeModel.create({
                    celebName: name[0],
                    celebImage: imageResult.secure_url,
                    celebImagePublicId: imageResult.public_id,
                    celebVideo: videoResult.secure_url,
                    celebVideoPublicId: videoResult.public_id,
                    logo: logo[0]
                });

                responseReturn(res, 201, { 
                    homeDetails, 
                    message: 'Home details added successfully' 
                });

            } catch (error) {
                console.error('Cloudinary Upload Error:', error);
                
                // Cleanup any successful uploads
                const cleanup = [];
                if (imageResult) cleanup.push(cloudinary.uploader.destroy(imageResult.public_id));
                if (videoResult) cleanup.push(cloudinary.uploader.destroy(videoResult.public_id));
                await Promise.all(cleanup);

                // Specific timeout error handling
                if (error.name === 'TimeoutError') {
                    return responseReturn(res, 408, { 
                        error: 'Upload timed out. Try smaller files or better network connection' 
                    });
                }

                responseReturn(res, 500, { 
                    error: error.message || 'Internal server error' 
                });
            }
        });
    };




   update_home_info = async (req, res) => {
        // Initialize formidable with options
        const form = formidable({
            multiples: true,
            maxFileSize: 50 * 1024 * 1024, // 50MB max file size
            keepExtensions: true
        });
    
        try {
            // Convert form.parse to Promise
            const [fields, files] = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) reject(err);
                    resolve([fields, files]);
                });
            });
    
            const { id } = req.params;
            const { name, logo } = fields;
    
            // Validation
            if (!id) {
                return responseReturn(res, 400, { error: 'ID parameter is required' });
            }
    
            if (!name?.[0] || !logo?.[0]) {
                return responseReturn(res, 400, { error: 'Name and logo are required' });
            }
    
            if (!files.image?.[0] || !files.video?.[0]) {
                return responseReturn(res, 400, { error: 'Image and video files are required' });
            }
    
            // Validate file types
            const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
            const allowedVideoTypes = ['video/mp4', 'video/webm'];
    
            if (!allowedImageTypes.includes(files.image[0].mimetype)) {
                return responseReturn(res, 400, { 
                    error: 'Invalid image type. Allowed types: JPEG, PNG, WebP' 
                });
            }
    
            if (!allowedVideoTypes.includes(files.video[0].mimetype)) {
                return responseReturn(res, 400, { 
                    error: 'Invalid video type. Allowed types: MP4, WebM' 
                });
            }
    
            // Find existing record first to ensure it exists
            const previousDetails = await homeModel.findById(id);
            if (!previousDetails) {
                return responseReturn(res, 404, { error: 'Home details not found' });
            }
    
            // Configure Cloudinary upload options
            const uploadOptions = {
                folder: 'homeDetails',
                chunk_size: 6000000, // 6MB chunks for video
                timeout: 60000, // 60 seconds timeout
                resource_type: 'auto' // Let Cloudinary detect resource type
            };
    
            let imageResult, videoResult;
    
            try {
                // Upload image and video in parallel
                [imageResult, videoResult] = await Promise.all([
                    cloudinary.uploader.upload(files.image[0].filepath, {
                        ...uploadOptions,
                        resource_type: 'image'
                    }),
                    cloudinary.uploader.upload(files.video[0].filepath, {
                        ...uploadOptions,
                        resource_type: 'video'
                    })
                ]);
    
                // Update database
                const updateDetails = await homeModel.findByIdAndUpdate(
                    id,
                    {
                        celebName: name[0],
                        celebImage: imageResult.secure_url,
                        celebImagePublicId: imageResult.public_id,
                        celebVideo: videoResult.secure_url,
                        celebVideoPublicId: videoResult.public_id,
                        logo: logo[0]
                    },
                    { new: true } // Return updated document
                );
    
                // Delete old files only after successful update
                await Promise.all([
                    cloudinary.uploader.destroy(previousDetails.celebImagePublicId),
                    cloudinary.uploader.destroy(previousDetails.celebVideoPublicId, { resource_type: 'video' })
                ]);
    
                return responseReturn(res, 200, { 
                    success: true,
                    data: updateDetails,
                    message: 'Home details updated successfully' 
                });
    
            } catch (uploadError) {
                // Cleanup any successful uploads on error
                const cleanup = [];
                if (imageResult) {
                    cleanup.push(cloudinary.uploader.destroy(imageResult.public_id));
                }
                if (videoResult) {
                    cleanup.push(cloudinary.uploader.destroy(videoResult.public_id, { resource_type: 'video' }));
                }
                
                if (cleanup.length > 0) {
                    await Promise.all(cleanup);
                }
    
                throw uploadError; // Re-throw to be caught by outer try-catch
            }
    
        } catch (error) {
            console.error('Update Home Info Error:', error);
    
            if (error.http_code === 400) {
                return responseReturn(res, 400, { 
                    error: 'Invalid file format or corrupt file' 
                });
            }
    
            if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
                return responseReturn(res, 408, { 
                    error: 'Upload timed out. Please try with smaller files or check your network connection' 
                });
            }
    
            return responseReturn(res, 500, { 
                error: 'An error occurred while updating home details',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    };
    
   

    get_home_info= async (req, res) => {

      
        try {
           const homeDetails= await homeModel.find({})
           if(homeDetails){
                responseReturn(res, 201, { 
                                homeDetails:homeDetails[0], 
                                message: 'All Home details gotten successfully' 
                            });
           }else{
            responseReturn(res, 404, { 
                error: 'could not find any home details' 
            });
           }     
        } catch (error) {
            responseReturn(res, 500, { 
                error: error.message || 'Internal server error' 
            });
        }

    }
    //end method
    get_general_info= async (req, res) => {
       
        try {
           const homeDetails= await homeModel.find({}) 
           const socialDetails= await socialModel.find({})
           const coinDetails= await coinModel.find({})
           if(homeDetails){
             const genData={
                homeDetails:homeDetails[0],
                socialDetails:socialDetails[0],
                coinDetails:coinDetails
             }
                responseReturn(res, 201, { 
                    homeDetails:genData, 
                    message: 'All Home details gotten successfully' 
                });
           }else{
            responseReturn(res, 404, { 
                error: 'could not find any home details' 
            });
           }     
        } catch (error) {
            responseReturn(res, 500, { 
                error: error.message || 'Internal server error' 
            });
        }

    }

}

module.exports = new homeController();