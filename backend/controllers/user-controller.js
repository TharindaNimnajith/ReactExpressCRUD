const nodemailer = require('nodemailer')

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

  let generatedPassword = generatePassword()

  const newUser = new User({
    firstName,
    lastName,
    phoneNo,
    email,
    nic,
    password: generatedPassword,
    type: 'Customer'
  })

  try {
    await newUser.save()
  } catch (error) {
    return next('Unexpected internal server error occurred, please try again later.')
  }

  await sendEmail(email, generatedPassword)

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

const getAdminEmail = async () => {
  let admin

  try {
    admin = await User.findOne({
      type: 'Administrator'
    })
  } catch (error) {
    return next('Unexpected internal server error occurred, please try again later.')
  }

  return admin.email;
}

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'it18149654@gmail.com',
    pass: process.env.PASSWORD
  }
})

const sendEmail = async (email, password) => {
  let adminEmail = getAdminEmail()

  let info = {
    from: adminEmail,
    to: email,
    subject: 'Added as a User',
    text:
      `Congratulations!
      You have been assigned as a Store Manager.
      Now you can manage product related operations as a store manager in the Online Fashion Store.
      Please find your login credentials below.
      LOGIN CREDENTIALS
      Email: ${email}
      Password: ${password}
      Thank you!
      This is an auto-generated email.
      If this has been sent by mistake, please delete this without sharing this.
      All rights reserved.`,
    html:
      `<!--suppress HtmlDeprecatedAttribute -->
      <div style="margin: 0; padding: 0; background-color: #f2f2f2; font-family: arial, serif;">
      <table style="margin: 0 auto; background: white; max-width: 500px; padding-bottom: 0; border-top: 5px solid #588dde; border-bottom: 5px solid #588dde; width: 100%;">
      <tr style="background: rgb(237, 243, 255); padding-left: 20px; padding-right: 20px;">
      <td>
      <table align="left" style="width: 100%;">
      <tr>
      <td style="padding: 10px;">
      <h1 style="text-align: center; color: #1a1a72;">Congratulations!</h1>
      <h2 style="margin-top:25px; margin-bottom: 0; color: #4db0c4; font-weight: 400; font-size: medium;">You have been added as a User.</h2>
      <h2 style="margin-top:20px; margin-bottom: 0; color: #4db0c4; font-weight: 400; font-size: medium;">Now you can book railway tickets online using the Railway Ticket Booking App.</h2>
      <h2 style="margin-top:20px; margin-bottom: 10px; color: #4db0c4; font-weight: 400; font-size: medium;">Please find your login credentials below.</h2>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      <tr style="background: rgb(237, 243, 255); padding-left: 20px; padding-right: 20px;">
      <td>
      <table align="left" style="width: 100%;">
      <tr>
      <td style="padding: 10px;">
      <h4 style="margin-top:20px; margin-bottom: 8px; color: #145a7a; font-weight: 400; text-align: center; font-size: 16px;"><b>LOGIN CREDENTIALS</b></h4>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      <tr style="background: rgb(237, 243, 255); padding-left: 20px; padding-right: 20px;">
      <td>
      <table align="left" style="width: 50%;">
      <tr>
      <td align="left" valign="top" style="padding: 10px;">
      <h6 style="font-size: 14px; margin-top: 0; margin-bottom: 0; color: #29353c; font-weight: 400;">E-mail</h6>
      <h6 style="font-size: 14px; margin-top: 20px; margin-bottom: 0; color: #29353c; font-weight: 400;">Password</h6>
      </td>
      </tr>
      </table>
      <table align="left" style="width: 50%;">
      <tr>
      <td align="right" valign="top" style="padding: 10px;">
      <h6 style="font-size: 14px; margin-top: 0; margin-bottom: 0; color: #588dde; font-weight: 400;">${email}</h6>
      <h6 style="font-size: 14px; margin-top: 20px; margin-bottom: 0; color: #588dde; font-weight: 400;">${password}</h6>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      <tr style="background: rgb(237, 243, 255); padding-left: 20px; padding-right: 20px;">
      <td>`
  }

  // noinspection JSCheckFunctionSignatures
  transporter.sendMail(info, (error, data) => {
    if (error) {
      console.log(error)
      console.log('Email sending failed! Please try again.')
    } else {
      console.log(data)
      console.log('An email is sent successfully to ' + email + '.')
    }
  })
}

function generatePassword() {
  let length = 5
  let randomPassword = ''
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let charactersLength = characters.length

  for (let i = 0; i < length; i++)
    randomPassword += characters.charAt(Math.floor(Math.random() * charactersLength))

  return randomPassword
}

exports.addUser = addUser
exports.updateUser = updateUser
exports.deleteUser = deleteUser
exports.getUser = getUser
exports.getUserList = getUserList
