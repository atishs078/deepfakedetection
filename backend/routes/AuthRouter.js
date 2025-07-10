const express = require('express')
const router = express.Router()
const userModel = require('../model/Authentication')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const jwt_secret = process.env.JWT_SECRET
const verifyJWT = require('../middelware/verifyJWT')
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ msg: "All Fields Are Required" })
        }
        if (username.length <= 3) {
            return res.status(200).json({ msg: "username Should be greater than 3 character" })
        }
        const checkEmail = await userModel.findOne({ email })
        if (checkEmail) {
            return res.status(200).json({ msg: "User Already Present try Login Using your credentials" })
        }
        const hashedpassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            username, email, password: hashedpassword
        })
        await user.save()
        const token = jwt.sign({
            id: user._id
        },
            jwt_secret,
            { expiresIn: '7d' }
        )
        return res.status(200).json({
            message: "User Added Successfully",
            user,
            token
        })

    } catch (error) {
        return res.status(500).json({ msg: "Internal Error Ocurred while SignUp" })
    }
})
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(200).json({ msg: "All Fields are required" })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ msg: "User Not Found" })
        }
        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return res.status(400).json({ msg: "Invalid Credential" })
        }
        const token = jwt.sign({
            id: user._id
        },
            jwt_secret,
            { expiresIn: '7d' }
        )
        return res.status(200).json({
            message: "Login Succesfull",
            token,
            user,
            success: true
        })
    } catch (error) {
        return res.status(500).json({ msg: "Internal Server Error While Login" })
    }

})

router.post('/getDetails', verifyJWT, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password -__v')
        if (!user) {
            return res.status(400).json({ message: "User Not Found" })
        }
        return res.status(200).json({
            message: "User Found",
            user
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }

}

)
module.exports = router