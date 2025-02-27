const { responseReturn } = require("../../utilities/response");
const { formidable } = require('formidable');
const { cloudinary, configureCloudinary } = require('../../utilities/cloudinaryConfig');
const networkModel = require("../../Models/NetworkModel");
const coinModel = require("../../Models/coinModel");
const participantModel = require("../../Models/ParticipantsModel");
const ContactModel = require("../../Models/ContactModel");


configureCloudinary();

class participantController {
    //create method
    //end method 

    create_client =  async (req, res) => {
       const {name,email, phone,wallet,password,amount,coin}=req.body;
       try {
         
         const alreadyExisted=await participantModel.findOne({email})

         if(!alreadyExisted){
            const clientcreated= await participantModel.create({
            name,email, phone,wallet,password,amount,coin
         })
         if(clientcreated){
             responseReturn(res, 201, { 
                clientcreated, 
                 success: 'verfying your transaction' 
              });
         }else{  responseReturn(res, 404, { 
                error: "database could'nt be created"
            });
}
           
         }else{
            responseReturn(res, 404, { 
                error: "YOU CAN ONLY PARTICIPATE ONCE"
            });
         }
        
       } catch (error) {
            responseReturn(res, 500, { 
                error: error.message || 'Internal server error' 
            });
       }


    }

    //end method

    create_contact =  async (req, res) => {
        const {email,subject,textMessage }=req.body;
        try {
            const contactcreated= await ContactModel.create({
                email,subject,textMessage
             })
             if(contactcreated){
                 responseReturn(res, 201, {  
                     success: 'message sent' 
                  });
             }else{  responseReturn(res, 404, { 
                    error: "database could'nt be created"
                });}
        } catch (error) {
            responseReturn(res, 500, { 
                error: error.message || 'Internal server error' 
            });
        }

    }


    //get method

    get_all_clients= async (req, res) => {
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
    // delete_client = async (req, res) => {
    //     const { networkName, id } = req.params;
    
    //     // Input validation
    //     if (!networkName || !id) {
    //         return responseReturn(res, 400, {
    //             error: 'Network name and ID are required'
    //         });
    //     }
    
    //     try {
    //         // Find the network document first
    //         const network = await networkModel.findById(id);
            
    //         if (!network) {
    //             return responseReturn(res, 404, {
    //                 error: 'Network not found'
    //             });
    //         }
    
    //         // Check if the network exists in coinNetworks array
    //         const networkExists = network.coinNetworks.some(
    //             net => net.networkName === networkName
    //         );
    
    //         if (!networkExists) {
    //             return responseReturn(res, 404, {
    //                 error: `Network ${networkName} not found`
    //             });
    //         }
    
    //         // Find the network to be deleted (for cleanup purposes)
    //         const networkToDelete = network.coinNetworks.find(
    //             net => net.networkName === networkName
    //         );
    
    //         // Delete associated barcode image if exists
    //         if (networkToDelete?.networkBarcodePublicId) {
    //             try {
    //                 await cloudinary.uploader.destroy(networkToDelete.networkBarcodePublicId);
    //             } catch (cloudinaryError) {
    //                 console.error('Failed to delete network barcode:', cloudinaryError);
    //                 // Continue with network deletion even if image deletion fails
    //             }
    //         }
    
    //         // Update the document using $pull operator
    //         const updatedNetwork = await networkModel.findByIdAndUpdate(
    //             id,
    //             {
    //                 $pull: {
    //                     coinNetworks: { networkName: networkName }
    //                 }
    //             },
    //             { 
    //                 new: true,  // Return updated document
    //                 runValidators: true  // Run model validations
    //             }
    //         );
    
    //         if (!updatedNetwork) {
    //             return responseReturn(res, 404, {
    //                 error: 'Failed to update network'
    //             });
    //         }
    
    //         return responseReturn(res, 200, {
    //             networks: updatedNetwork,
    //             message: `Network ${networkName} deleted successfully`
    //         });
    
    //     } catch (error) {
    //         console.error('Network deletion error:', error);
            
    //         if (error.name === 'CastError') {
    //             return responseReturn(res, 400, {
    //                 error: 'Invalid network ID format'
    //             });
    //         }
    
    //         if (error.name === 'ValidationError') {
    //             return responseReturn(res, 400, {
    //                 error: 'Invalid network data'
    //             });
    //         }
    
    //         return responseReturn(res, 500, {
    //             error: process.env.NODE_ENV === 'development' 
    //                 ? error.message 
    //                 : 'Internal server error'
    //         });
    //     }
    // };
    //network_
   
   
    get_network = async (req, res) => {
        const { coinName } = req.params;
    
        try {
            // First find the coin details
            const coinDetails = await coinModel.findOne({ coinSymbol: coinName });
    
            if (!coinDetails) {
                return responseReturn(res, 404, { 
                    error: '404 wrong page you seem lost' 
                });
            }
    
            // Aggregate to combine coin and network information
            const coinInfo = await coinModel.aggregate([
                // Match the specific coin
                {
                    $match: {
                        coinSymbol: coinName
                    }
                },
                // Keep all fields from coin model
                {
                    $project: {
                        coinName: 1,
                        coinSymbol: 1,
                        coinAddress: 1,
                        coinImg: 1,
                        rate: 1,
                        coinBarcode: 1,
                        coinImgPublicId: 1,
                        coinBarcodePublicId: 1,
                        Example: 1
                    }
                },
                // Lookup to get network details
                {
                    $lookup: {
                        from: 'networkdetails',  // Collection name for network model
                        let: { coin_id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$coinId', '$$coin_id']
                                    }
                                }
                            }
                        ],
                        as: 'networkInfo'
                    }
                },
                // Unwind the networkInfo array since we expect one network document per coin
                {
                    $unwind: {
                        path: '$networkInfo',
                        preserveNullAndEmptyArrays: true
                    }
                },
                // Combine all information into a single document
                {
                    $project: {
                        // Coin model fields
                        _id: 0,
                        coinName: 1,
                        coinSymbol: 1,
                        coinAddress: 1,
                        coinImg: 1,
                        rate: 1,
                        coinBarcode: 1,
                        Example: 1,
                        // Network model fields
                        coinNetworks: '$networkInfo.coinNetworks'
                    }
                }
            ]);
    
            if (!coinInfo || coinInfo.length === 0) {
                return responseReturn(res, 404, { 
                    error: 'No coin information found' 
                });
            }
            return responseReturn(res, 200, { 
                coinInfo: coinInfo[0],
                success: 'Coin information retrieved successfully'
            });
    
        } catch (error) {
            console.error('Get coin information error:', error);
            return responseReturn(res, 500, { 
                error: error.message || 'Internal server error' 
            });
        }
    };

     //end method
    //get_all_participants
    get_all_participants=async (req, res) => {
       
        try {
            const participants= await participantModel.find({}) .sort({ createdAt: 1 })
            .limit(15)
            .exec()
            .catch(error => {
                console.error('Error fetching contacts:', error);
                throw error;
            });
            if(participants){
                responseReturn(res, 201, {  
                    participants,
                    success: 'SUCCESS' 
                 });

            }else{
                responseReturn(res, 404, { 
                    error: "This account doesn't not exist, contact support for assistance"
                });
            }


            
        } catch (error) {
            responseReturn(res, 500, { 
                error: error.message || 'Internal server error' 
            });
        }
    }

    //delete_participant
    delete_participant = async (req, res) => {
        const { id } = req.params;
        try {
            const deleteParticipant = await participantModel.findByIdAndDelete(id)
            if (deleteParticipant) {
                responseReturn(res, 201, { 
                    success: 'participant deleted successfully , Refresh participant to see changes' 
                });
                
            } else {
                responseReturn(res, 404, { 
                    error: 'could not delete participant,, Refresh participant to see changes' 
                });
            }

            
        } catch (error) {
              responseReturn(res, 500, { 
                error: error.message || 'Internal server error' 
            });
        }
    }
    //update_participant
    update_participant= async (req, res) => {
        const { id,confirmationStatus } = req.params;
        try {
        const updatedClient=  await participantModel.findByIdAndUpdate(
            id,
            { confirmationStatus: Number(confirmationStatus) },
            { new: true }  // This returns the updated document
        );
        if (updatedClient) {
            responseReturn(res, 201, { 
                success: 'participant updated successfully , Refresh participant to see changes' 
            });
        } else {
            responseReturn(res, 404, { 
                error: 'could not update participant,, Refresh participant to see changes' 
            });
        }
            
        } catch (error) {
            responseReturn(res, 500, { 
                error: error.message || 'Internal server error' 
            });
        }
    }
   //end method
    get_participant = async (req, res) => {
        const {email}=req.params
        try {
            const accountExist= await participantModel.findOne({email})
            if(accountExist){
                responseReturn(res, 201, {  
                    accountExist,
                    success: 'SUCCESS' 
                 });

            }else{
                responseReturn(res, 404, { 
                    error: "This account doesn't not exist, contact support for assistance"
                });
            }


            
        } catch (error) {
            responseReturn(res, 500, { 
                error: error.message || 'Internal server error' 
            });
        }

    }
    //delete_contact
    delete_contact= async (req, res) => {
        const { id } = req.params;
        try {
            const deleteContact = await ContactModel.findByIdAndDelete(id)
            if (deleteContact) {
                responseReturn(res, 201, { 
                    success: 'contact deleted successfully , Refresh contact to see changes' 
                });
                
            } else {
                responseReturn(res, 404, { 
                    error: 'could not delete contact,, Refresh contact to see changes' 
                });
            }

            
        } catch (error) {
              responseReturn(res, 500, { 
                error: error.message || 'Internal server error' 
            });
        }
    }
    //end method
    get_contacts= async (req, res) => {
        try {
            const contacts = await ContactModel.find({})
                .sort({ createdAt: 1 })
                .limit(15)
                .exec()
                .catch(error => {
                    console.error('Error fetching contacts:', error);
                    throw error;
                });
            if (contacts) {
                responseReturn(res, 201,{
                    contacts,
                    message: 'contact got successfully' }
                    
                );
                
            } else {
                responseReturn(res, 404, { 
                    error: 'no contact to display' 
                });
            }
            
        } catch (error) {
            responseReturn(res, 500, { 
                error: error.message || 'Internal server error' 
            });
        }
    }

}

module.exports = new participantController();