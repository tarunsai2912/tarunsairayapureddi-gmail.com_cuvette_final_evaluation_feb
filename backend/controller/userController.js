const User = require('../model/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const userRegister = async (req, res, next) => {
    try{
        const {name, email, password, confirmPassword} = req.body
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({msg: "User Already Exists"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })
        await newUser.save()
        return res.status(200).json(newUser)
    }
    catch(err){
        return next(err)
    }
}

const userLogin = async (req, res, next) => {
    const {email, password} = req.body
    try{
        const user = await User.findOne({email})
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(400).json({msg: 'Email/Password is Incorrect'})
        }
        const user_Id = user._id
        const name = user.name
        const token = jwt.sign({user_Id: user._id}, process.env.JWT_SECRET)
        return res.status(200).json({msg: 'User got LoggedIn', token, user_Id, name})
    }
    catch(err){
        return next(err)
    }
}

const getUserEmails = async (req, res, next) => {
    try{
        const user = await User.findById(req.user_Id)
        if(!user) {
            return res.status(400).json({msg: 'User Not Found'})
        }
        const users = await User.find({email: {$ne: user.email}}, {email: 1, name: 1})
        const userDetails = users.map((each) => [each.email, each.name])
        const userEmails = users.map((each) => each.email)
        const boardEmails = user.boardToUser
        return res.status(200).json({userDetails, userEmails, boardEmails}) 
    }
    catch(err){
        return next(err)
    }
}

const getUserById = async (req, res, next) => {
    const {userId} = req.params
    try{
        const user = await User.findById(userId)
        if(!user) {
            return res.status(400).json({msg: 'User Not Found'})
        }

        const lowCount = user.lowCount
        const midCount = user.midCount
        const highCount = user.highCount
        const dueDateCount = user.dueDateCount

        return res.status(200).json({msg: 'User Found', lowCount, midCount, highCount, dueDateCount})
    }
    catch(err){
        return next(err)
    }
}

const updateUser = async (req, res, next) => {
    try{
        const {userId} = req.params
        const {name, email, oldPassword, newPassword} = req.body
        const user = await User.findById(userId)
        if(!user) {
            return res.status(400).json({msg: 'User Not Found'})
        }
        else if(name && !email && !oldPassword && !newPassword){
            const existUser = await User.findOne({name})
            if(existUser){
                return res.status(400).json({msg: 'Name should be different!'})
            }
            user.name = name
        }
        else if(email && !name && !oldPassword && !newPassword){
            const existUser = await User.findOne({email})
            if(existUser){
                return res.status(400).json({msg: 'Email already taken!'})
            }
            user.email = email
        }
        else if(oldPassword && newPassword && !email && !name){
            if(oldPassword === newPassword){
                return res.status(400).json({msg: 'New Password should be different!'})
            }
            if(!(await bcrypt.compare(oldPassword, user.password))){
                return res.status(400).json({msg: 'Old password is incorrect!'})
            }
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword, salt)
            user.password = hashedPassword
        }
        else if((oldPassword && !newPassword && !email && !name) || (!oldPassword && newPassword && !email && !name)){
            return res.status(400).json({msg: 'Give both old and new passwords!'})
        }
        else{
            return res.status(400).json({msg: 'Only one field can be updated at a time!'})
        } 
        const updatedUser = await user.save()
        const userName = updatedUser.name 
        return res.status(200).json({msg: 'User Updated Successfully', userName})
    }
    catch(err){
        return next(err)
    }
}

module.exports = {userRegister, userLogin, getUserEmails, getUserById, updateUser}