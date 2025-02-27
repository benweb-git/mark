const { responseReturn } = require("../../utilities/response");
const { formidable } = require('formidable');
const { cloudinary, configureCloudinary } = require('../../utilities/cloudinaryConfig');
const networkModel = require("../../Models/NetworkModel");
const coinModel = require("../../Models/coinModel");



configureCloudinary();

class networkController {
     //end method
    //create method


    //end method 

    create_network = async (req, res) => {
        const form = formidable({
            multiples: true,
            maxFileSize: 50 * 1024 * 1024,
            keepExtensions: true
        });
    
        try {
            const [fields, files] = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) reject(err);
                    resolve([fields, files]);
                });
            });
    
            const { networkId } = req.params;
            const { networkName, networkAddress } = fields;
    
            // Find existing record
            const previousDetails = await networkModel.findById(networkId);
            const coinDetails = await coinModel.findById(previousDetails.coinId);
            
            if (!previousDetails) {
                return responseReturn(res, 404, { error: 'network details not found' });
            }
    
            // Check if network already exists in coinNetworks array
            const alreadyExists = previousDetails.coinNetworks.some(
                n => n.networkName === networkName[0].toUpperCase()
            );
            
            if (alreadyExists) {
                return responseReturn(res, 400, { 
                    error: `Token network ${networkName[0].toUpperCase()} already exists, delete and recreate` 
                });
            }
    
            // Prepare new network data
            const newNetworkData = {
                networkName: networkName[0].toUpperCase(),
                networkAddress: networkAddress[0].toUpperCase(),
                networkBarcode: fields.networkBarcode?.[0]?.startsWith('http') 
                    ? fields.networkBarcode[0] 
                    : undefined,
                coinImg: coinDetails?.coinImg
            };
    
            // Handle new file uploads
            if (files.networkBarcode) {
                const uploadOptions = {
                    folder: 'network',
                    chunk_size: 6000000,
                    timeout: 60000,
                    resource_type: 'auto'
                };
    
                let networkBarcodeResult;
    
                try {
                    if (files.networkBarcode[0]) {
                        networkBarcodeResult = await cloudinary.uploader.upload(
                            files.networkBarcode[0].filepath,
                            {
                                ...uploadOptions,
                                resource_type: 'image'
                            }
                        );
                        
                        newNetworkData.networkBarcode = networkBarcodeResult.secure_url;
                        newNetworkData.networkBarcodePublicId = networkBarcodeResult.public_id;
                    }
                } catch (uploadError) {
                    if (networkBarcodeResult) {
                        await cloudinary.uploader.destroy(networkBarcodeResult.public_id);
                    }
                    throw uploadError;
                }
            }
    
            // Update database by pushing new network to coinNetworks array
            const updateDetails = await networkModel.findByIdAndUpdate(
                networkId,
                { 
                    $push: { coinNetworks: newNetworkData }
                },
                { new: true }
            );
    
            return responseReturn(res, 200, { 
                success: true,
                networks: updateDetails,
                message: 'network token created successfully' 
            });
    
        } catch (error) {
            console.error('Update token Error:', error);
    
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
                error: 'An error occurred while updating coin details',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    };
    //end method
    //get method

    get_all_networks= async (req, res) => {
        try {
           const networks= await networkModel.find({})
           if(networks){
                responseReturn(res, 201, { 
                              networks, 
                                message: 'All  coin network gotton sucessfully' 
                            });
           }else{
            responseReturn(res, 404, { 
                error: 'could not find any coins details' 
            });
           }     
        } catch (error) {
            responseReturn(res, 500, { 
                error: error.message || 'Internal server error' 
            });
        }

    }

    //end method
    //delete method
    delete_network = async (req, res) => {
        const { networkName, id } = req.params;
    
        // Input validation
        if (!networkName || !id) {
            return responseReturn(res, 400, {
                error: 'Network name and ID are required'
            });
        }
    
        try {
            // Find the network document first
            const network = await networkModel.findById(id);
            
            if (!network) {
                return responseReturn(res, 404, {
                    error: 'Network not found'
                });
            }
    
            // Check if the network exists in coinNetworks array
            const networkExists = network.coinNetworks.some(
                net => net.networkName === networkName
            );
    
            if (!networkExists) {
                return responseReturn(res, 404, {
                    error: `Network ${networkName} not found`
                });
            }
    
            // Find the network to be deleted (for cleanup purposes)
            const networkToDelete = network.coinNetworks.find(
                net => net.networkName === networkName
            );
    
            // Delete associated barcode image if exists
            if (networkToDelete?.networkBarcodePublicId) {
                try {
                    await cloudinary.uploader.destroy(networkToDelete.networkBarcodePublicId);
                } catch (cloudinaryError) {
                    console.error('Failed to delete network barcode:', cloudinaryError);
                    // Continue with network deletion even if image deletion fails
                }
            }
    
            // Update the document using $pull operator
            const updatedNetwork = await networkModel.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        coinNetworks: { networkName: networkName }
                    }
                },
                { 
                    new: true,  // Return updated document
                    runValidators: true  // Run model validations
                }
            );
    
            if (!updatedNetwork) {
                return responseReturn(res, 404, {
                    error: 'Failed to update network'
                });
            }
    
            return responseReturn(res, 200, {
                networks: updatedNetwork,
                message: `Network ${networkName} deleted successfully`
            });
    
        } catch (error) {
            console.error('Network deletion error:', error);
            
            if (error.name === 'CastError') {
                return responseReturn(res, 400, {
                    error: 'Invalid network ID format'
                });
            }
    
            if (error.name === 'ValidationError') {
                return responseReturn(res, 400, {
                    error: 'Invalid network data'
                });
            }
    
            return responseReturn(res, 500, {
                error: process.env.NODE_ENV === 'development' 
                    ? error.message 
                    : 'Internal server error'
            });
        }
    };
    //network_coin
    get_network=async (req, res) => {
        const {id}=req.params
        try {
           const coin= await coinModel.findById(id)
           if(coin){
                responseReturn(res, 201, { 
                            coin, 
                                message: 'coin gotten successfully'
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

    //  get_client_network = async (req, res) => {
    //     const { coinName } = req.params;
    
    //     try {
    //         // First find the coin details
    //         const coinDetails = await coinModel.findOne({ coinSymbol: coinName });
    
    //         if (!coinDetails) {
    //             return responseReturn(res, 404, { 
    //                 error: '404 wrong page you seem lost' 
    //             });
    //         }
    
    //         // Aggregate to get coin with its networks
    //         const aggregatedData = await coinModel.aggregate([
    //             // Match the specific coin
    //             {
    //                 $match: {
    //                     coinSymbol: coinName
    //                 }
    //             },
    //             // Lookup networks from networkModel
    //             {
    //                 $lookup: {
    //                     from: 'networkdetails', // Collection name for networkModel
    //                     localField: '_id',
    //                     foreignField: 'coinId',
    //                     as: 'networks'
    //                 }
    //             },
    //             // Unwind the networks array (if you want to work with individual network documents)
    //             {
    //                 $unwind: {
    //                     path: '$networks',
    //                     preserveNullAndEmptyArrays: true // Keep coins even if they have no networks
    //                 }
    //             },
    //             // Reshape the data structure
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     coinName: 1,
    //                     coinSymbol: 1,
    //                     coinImg: 1,
    //                     networks: {
    //                         _id: '$networks._id',
    //                         coinNetworks: '$networks.coinNetworks',
    //                         coinSymbol: '$networks.coinSymbol'
    //                     }
    //                 }
    //             },
    //             // Group back to get arrays of networks per coin
    //             {
    //                 $group: {
    //                     _id: '$_id',
    //                     coinName: { $first: '$coinName' },
    //                     coinSymbol: { $first: '$coinSymbol' },
    //                     coinImg: { $first: '$coinImg' },
    //                     networks: {
    //                         $push: {
    //                             $cond: [
    //                                 { $eq: ['$networks._id', null] },
    //                                 null,
    //                                 '$networks'
    //                             ]
    //                         }
    //                     }
    //                 }
    //             },
    //             // Clean up null values from networks array
    //             {
    //                 $project: {
    //                     _id: 1,
    //                     coinName: 1,
    //                     coinSymbol: 1,
    //                     coinImg: 1,
    //                     networks: {
    //                         $filter: {
    //                             input: '$networks',
    //                             as: 'network',
    //                             cond: { $ne: ['$$network', null] }
    //                         }
    //                     }
    //                 }
    //             }
    //         ]);
    
    //         if (!aggregatedData || aggregatedData.length === 0) {
    //             return responseReturn(res, 404, { 
    //                 error: 'No coin details found' 
    //             });
    //         }
    
    //         return responseReturn(res, 200, { 
    //             coin: aggregatedData[0],
    //             message: 'Coin details retrieved successfully'
    //         });
    
    //     } catch (error) {
    //         console.error('Get network error:', error);
    //         return responseReturn(res, 500, { 
    //             error: error.message || 'Internal server error' 
    //         });
    //     }
    // };


}

module.exports = new networkController();