const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', userController.userRegister)
router.post('/login', userController.userLogin)
router.get('/get/:userId', authMiddleware, userController.getUserById)
router.patch('/update/:userId', authMiddleware, userController.updateUser)
router.get('/emails', authMiddleware, userController.getUserEmails)

module.exports = router
