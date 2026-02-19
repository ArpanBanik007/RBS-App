import { User } from "../Models/User.models.js";
import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { uploadOnCloudinary } from "../Utils/cloudinary.js";



const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}






// Register User


 const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, phone, password ,username } = req.body;

    if (
        [fullName, email, phone, password,username].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
      email
    });

    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }

    let avatarLocalPath, coverImageLocalPath;
    
    if (req.files) {
        avatarLocalPath = req.files?.avatar?.[0]?.path;
        coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    }

    const avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : null;
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    const user = await User.create({
        fullName,
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || "",
        email,
        username,
        password,
       phone
    });

    // Generate access and refresh tokens
    
    const { accessToken, refreshToken } =await generateAccessAndRefereshTokens(user._id);

    // Save refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    // Remove password & refreshToken from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res
        .status(201)
        .cookie("accessToken", accessToken,
             { httpOnly: true, 
                secure: false,
                  sameSite: "lax", 
            })
        .cookie("refreshToken", refreshToken, 
            { httpOnly: true,
    secure: false,
    sameSite: "lax",})
        .json(
            new ApiResponse(201, 
                { user: createdUser, accessToken, refreshToken },
                "User registered successfully"
            )
        );
});



const loginUser = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body; 

    if (!identifier || !password) {
        throw new ApiError(400, "Username or Email and Password are required");
    }

    const user = await User.findOne({
        $or: [{ username: identifier }, { email: identifier }],
    });


//console.log("Searching for:", identifier);


    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Validate password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // Generate Tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens (user._id);

   // console.log("Generated Tokens:", { accessToken, refreshToken });


    // Exclude password and refreshToken from response

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Cookie options
    const options = {
        httpOnly: true,
        secure: true, // Set to `true` in production with HTTPS
        sameSite: "Strict",
    };

    // Send response with cookies
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});



const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const getAllUsers = asyncHandler(async (req, res) => {
console.log("REQ USER:", req.user);
    // Check if requester is admin
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admins only.");
    }

    // Fetch all users (exclude sensitive fields)
    const users = await User.find()
        .select("-password -refreshToken")
        .sort({ createdAt: -1 });

    if (!users || users.length === 0) {
        throw new ApiError(404, "No users found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            users,
            "All users fetched successfully"
        )
    );

});

// const getSingleUser = asyncHandler(async (req, res) => {

//     const { userId } = req.params;

//     // If not admin, user can only access their own profile
//     if (req.user.role !== "admin" && req.user.userId !== userId) {
//         throw new ApiError(403, "You are not authorized to view this profile");
//     }

//     const user = await User.findById(userId)
//         .select("fullName username email avatar");

//     if (!user) {
//         throw new ApiError(404, "User not found");
//     }

//     return res.status(200).json(
//         new ApiResponse(
//             200,
//             user,
//             "User details fetched successfully"
//         )
//     );
// });

const getCurrentUser = asyncHandler(async (req, res) => {
 
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "User not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

const deleteUserByAdmin = asyncHandler(async (req, res) => {
    console.log("REQ USER:", req.user);

    // 🔐 Only Admin Allowed
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admins only.");
    }

    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    // ❌ Admin cannot delete himself (optional safety)
    if (req.user._id.toString() === userId) {
        throw new ApiError(400, "Admin cannot delete own account");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await user.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "User deleted successfully by admin"
        )
    );
});




export{
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
//getSingleUser,
    getCurrentUser,
    deleteUserByAdmin,
    


}