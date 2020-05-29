const User = require('../models/user-model')

require('dotenv').config()

const addUser = async (req, res, next) => {
  let existingUserEmail
  let existingUserNIC

  const {
    firstName,
    lastName,
    phoneNo,
    email,
    nic
  } = req.body

  try {
    existingUserEmail = await User.findOne({
      email: email
    })
    existingUserNIC = await User.findOne({
      nic: nic
    })
  } catch (error) {
    return next('Unexpected internal server error occurred, please try again later.')
  }

  if (existingUserEmail) {
    await res.json({
      exists: true,
      message: 'A user with the same email already exists.'
    })
    return next('A user with the same email already exists.')
  }

  if (existingUserNIC) {
    await res.json({
      exists: true,
      message: 'A user with the same NIC already exists.'
    })
    return next('A user with the same NIC already exists.')
  }

  const newUser = new User({
    firstName,
    lastName,
    phoneNo,
    email,
    nic,
    type: 'Customer'
  })

  try {
    await newUser.save()
  } catch (error) {
    return next('Unexpected internal server error occurred, please try again later.')
  }

  res.status(201).send({
    message: 'New user added successfully!'
  })
}

const updateUser = async (req, res, next) => {
  let user
  let existingUserEmail
  let existingUserNIC

  const {
    id
  } = req.params

  const {
    firstName,
    lastName,
    phoneNo,
    email,
    nic
  } = req.body

  try {
    user = await User.findById(id)
  } catch (error) {
    return next('Unexpected internal server error occurred, please try again later.')
  }

  try {
    existingUserEmail = await User.findOne({
      email: email
    })
    existingUserNIC = await User.findOne({
      nic: nic
    })
  } catch (error) {
    return next('Unexpected internal server error occurred, please try again later.')
  }

  if (existingUserEmail && email !== user.email) {
    await res.json({
      exists: true,
      message: 'A user with the same email already exists.'
    })
    return next('A user with the same email already exists.')
  }

  if (existingUserNIC && nic !== user.nic) {
    await res.json({
      exists: true,
      message: 'A user with the same NIC already exists.'
    })
    return next('A user with the same NIC already exists.')
  }

  user.firstName = firstName
  user.lastName = lastName
  user.teleNo = phoneNo
  user.email = email
  user.nic = nic

  try {
    await user.save()
  } catch (error) {
    return next('Unexpected internal server error occurred, please try again later.')
  }

  res.status(200).send({
    message: 'User updated successfully!'
  })
}

const deleteUser = async (req, res, next) => {
  let user

  const {
    id
  } = req.params

  try {
    user = await User.findById(id)
    await user.remove()
  } catch (error) {
    return next('Unexpected internal server error occurred, please try again later.')
  }

  res.status(200).send({
    message: 'User deleted successfully!'
  })
}

const getUser = async (req, res, next) => {
  let user

  const {
    id
  } = req.params

  try {
    user = await User.findById(id)
  } catch (error) {
    return next('Unexpected internal server error occurred, please try again later.')
  }

  res.status(200).send(user)
}

const getUserList = async (req, res, next) => {
  let userList

  try {
    userList = await User.find({
      type: 'Customer'
    })
  } catch (error) {
    return next('Unexpected internal server error occurred, please try again later.')
  }

  res.status(200).send(userList)
}

exports.addUser = addUser
exports.updateUser = updateUser
exports.deleteUser = deleteUser
exports.getUser = getUser
exports.getUserList = getUserList
