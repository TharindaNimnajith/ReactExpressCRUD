const express = require('express')
const router = express.Router()

const UserController = require('../controllers/user-controller')

router.post('/user', UserController.addUser)
router.put('/user/:id', UserController.updateUser)
router.delete('/user/:id', UserController.deleteUser)
router.get('/user/:id', UserController.getUser)
router.get('/user', UserController.getUserList)

module.exports = router
