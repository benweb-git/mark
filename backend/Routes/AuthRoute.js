const authControllers = require('../Controllers/AuthController')
const { authMiddleware } = require('../middlewares/Authmiddleware')
const router = require('express').Router()

router.post('/admin/admin-login',authControllers.admin_login)
router.post('/admin/admin-register',authControllers.admin_register)
router.get('/admin/get-details' ,authMiddleware,authControllers.getUser)
//delete_admin_account
router.delete('/admin/delete-admin/:id',authMiddleware,authControllers.delete_admin_account)
router.get('/admin/get-all-admin/:role',authControllers.get_all_admin)
//get_all_admin
// //logout
router.get('/logout' ,authControllers.logout)


module.exports = router