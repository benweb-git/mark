const { responseReturn } = require("../../utilities/response");
const socialModel = require("../../Models/SocialModel");


class socialController {
    create_socials=async (req, res) => {
        const {
            twitter,
            discord,
            whatsapp,
            instagram,
            facebook,
            reddit
          }=req.body;

       try {
        const socialDetails = await socialModel.create({ 
            twitter,
            discord,
            whatsapp,
            instagram,
            facebook,
            reddit
        })
        if (socialDetails) {
            responseReturn(res, 201, { 
                   socialDetails,
                    message: 'social links created successfully' 
                });
        } else {
            responseReturn(res, 404, { 
                 error: 'failed to create socials' 
             });
        }
        
       } catch (error) {
        responseReturn(res, 500, { 
            error: error.message || 'Internal server error' 
        });
       }
      
    }

    update_socials=async (req, res) => { 
        const {
            twitter,
            discord,
            whatsapp,
            instagram,
            facebook,
            reddit
          }=req.body;
          const {id}=req.params;
          try {
            const updateSocialDetails = await socialModel.findByIdAndUpdate(id,{ 
                twitter,
                discord,
                whatsapp,
                instagram,
                facebook,
                reddit
            })
            if (updateSocialDetails) {
                responseReturn(res, 201, { 
                       socialDetails:updateSocialDetails,
                        message: 'social links updated successfully' 
                    });
            } else {
                responseReturn(res, 404, { 
                     error: 'failed to create socials' 
                 });
            }
            
          } catch (error) {
            responseReturn(res, 500, { 
                error: error.message || 'Internal server error' 
            });
          }
    }

    get_all_socials= async (req, res) => {
        try {
           const socialDetails= await socialModel.find({})
           if(socialDetails){
                responseReturn(res, 201, { 
                            socialDetails:socialDetails[0], 
                                message: 'All socials details got successfully' 
                            });
           }else{
            responseReturn(res, 404, { 
                error: 'could not find any social details' 
            });
           }     
        } catch (error) {
            responseReturn(res, 500, { 
                error: error.message || 'Internal server error' 
            });
        }

    }
}

module.exports = new socialController();