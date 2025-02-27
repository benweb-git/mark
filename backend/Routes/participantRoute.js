const participantControllers = require('../Controllers/home/participantController')
const { authMiddleware } = require('../middlewares/Authmiddleware')
const router = require('express').Router()

//participant has already been added in the server part dont include it here
router.post('/create-client',participantControllers.create_client)
router.delete('/delete-participant/:id',participantControllers.delete_participant)
router.get('/get-all-client',participantControllers.get_all_clients)
router.get('/get-client/:coinName',participantControllers.get_network)
router.get('/get-participant/:email',participantControllers.get_participant)
router.get('/get-participants',participantControllers.get_all_participants)
router.put('/update-participant/:id/:confirmationStatus',participantControllers.update_participant)


//contacts
router.post('/create-contact',participantControllers.create_contact)
router.delete('/delete-contact/:id',participantControllers.delete_contact)
router.get('/get-contacts',participantControllers.get_contacts)


module.exports = router