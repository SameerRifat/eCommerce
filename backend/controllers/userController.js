const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// register user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    let myCloud; 
    // console.log(req.body.avatar !== 'undefined')
    if (req.body.avatar !== 'undefined') {
      myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale"
      });
    }
    
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return next(new ErrorHandler("Please enter name, email, and password", 400));
    }
    
    let user; // Declare a new variable for the user
    
    if (req.body.avatar !== 'undefined') {
      user = await User.create({
        name,
        email,
        password,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url
        }
      });
    } else {
      user = await User.create({
        name,
        email,
        password
      });
    }
    
    sendToken(user, 201, res);
  });

// exports.registerUser = catchAsyncErrors(async (req, res, next) => {
//     if(req.body.avatar !== 'undefined'){
//         const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//             folder: "avatars",
//             width: 150,
//             crop: "scale"
//         })
//     }
//     const { name, email, password } = req.body;
//     if (!email || !password || !name) {
//         return next(new ErrorHandler("Please enter name, email and password", 400));
//     }
//     if(req.body.avatar !== 'undefined'){
//         const user = await User.create({
//             name, email, password,
//             avatar: {
//                 public_id: myCloud.public_id,
//                 url: myCloud.secure_url
//             }
//         })
//     }
//     const user = await User.create({
//         name, email, password
//     })
//     sendToken(user, 201, res)
// })

// login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    // checking if user has given both email and password
    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res)
})

// logout user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "logged out"
    })
})

// forgot password
exports.forgtoPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    else {
        // get reset password token
        const resetToken = user.getResetPasswrodToken();
        await user.save({ validateBeforeSave: false });

        // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/reset/${resetToken}`;
        const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
        const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n if you have not requested this email then please ignore it`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Ecommerce password recovery",
                message
            })
            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email} successfully`
            })
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return next(new ErrorHandler(error.message, 500));
        }
    }
})

// reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // creating token 
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or has been expired", 400));
    }
    if (req.body.password != req.body.confirmPassword) {
        return next(new ErrorHandler("password does not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
})

// get user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})
// update user password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }
    if (req.body.newPassword != req.body.confirmPassword) {
        return next(new ErrorHandler("password does not match", 400));
    }

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
})
// update user profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    // console.log(req.body)
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    if (req.body.avatar !== 'undefined') {
        const user = await User.findById(req.user.id)
        const imageId = user.avatar.public_id
        await cloudinary.v2.uploader.destroy(imageId)
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale"
        })
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})
// get all users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
    if (!users) {
        return next(new ErrorHandler("No User found", 400));
    }
    res.status(200).json({
        success: true,
        users
    })
})
// get single user (admin)
exports.getSigleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with this id: ${req.params.id}`, 400));
    }
    res.status(200).json({
        success: true,
        user
    })
})
// update user role (admin)
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})
// delete user (admin)
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with this id: ${req.params.id}`, 400));
    }

    const imageId = user.avatar.public_id
    await cloudinary.v2.uploader.destroy(imageId)

    await user.remove();
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})