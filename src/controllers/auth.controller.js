const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { message } = require("prompt-async");
async function registerUserController(req, res) {
  try {
    const { firstName, lastName, userName, email, password } = req.body;
    if (!firstName || !lastName || !userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const IsUser = await userModel.findOne({
      $or: [
        {
          userName: userName,
        },
        {
          email: email,
        },
      ],
    });
    if (IsUser) {
      return res.status(409).json({
        message: "User already Exits,Please provide unique email and username",
      });
    }
    const hashPass = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      email: email,
      password: hashPass,
    });
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY
    );
    res.cookie("token", token);
    return res.status(201).json({
      message: "User registered Successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error, Please try again later" });
  }
}

async function loginUserController(req, res) {
    const {userInfo,password} = req.body
    try {
        if(!userInfo || !password){
            return res.status(400).json({
                message:"Please filled the required details"
            })
        }
        const isUser = await userModel.findOne({
            $or:[
                {
                   userName:userInfo 
                },
                {
                    email:userInfo
                }
            ]
        })
        if(!isUser){
            return res.status(401).json({
                message:"Unauthorized access, user not found"
            })
        }
        const isPass = await bcrypt.compare(password,isUser.password)
        if(!isPass){
            return res.status(401).json({
                message:"Unauthorized access, invalid password"
            })
        }
        const token = await jwt.sign({
            id:isUser._id
        },process.env.JWT_SECRET_KEY)
        res.cookie("token",token)
        return res.status(200).json({
            message:"User logged in successfully"
        })
    } catch (error) {
        console.error(error)
        res.status(501).json({
            message:"Internal Server error , Please try again later"
        })
    }
}



module.exports = {
  registerUserController,
  loginUserController,
 
};
