const networkControllers = require('../Controllers/home/networkController')
const { authMiddleware } = require('../middlewares/Authmiddleware')
const router = require('express').Router()

//network has already been added in the server part dont include it here
router.post('/create-network/:networkId',networkControllers.create_network)
router.delete('/delete-network-detail/:networkName/:id',networkControllers.delete_network)
router.get('/get-all-networks',networkControllers.get_all_networks)
router.get('/get-network/:id',networkControllers.get_network)


module.exports = router