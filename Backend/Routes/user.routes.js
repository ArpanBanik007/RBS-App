import { Router } from "express";
import { verifyJWT } from "../Middlewire/auth.middlewire.js";
import { upload } from "../Middlewire/multer.middlewire.js";

import {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    getCurrentUser,
    deleteUserByAdmin
} from "../Controller/User.controller.js";

const router = Router();


// ==========================
// 🔐 AUTH ROUTES
// ==========================

// Register
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);

// Login
router.route("/login").post(loginUser);

// Logout
router.route("/logout").post(verifyJWT, logoutUser);


// ==========================
// 👥 USER MANAGEMENT ROUTES
// ==========================

// Get all users (Admin only)
router.route("/all-users").get(
    verifyJWT,
    getAllUsers
);

// Get single user (Admin or Self)
// router.route("/:userId").get(
//     verifyJWT,
//     getSingleUser
// );


router.route("/currentUser").get(verifyJWT,getCurrentUser)

router.route("/delete/:userId").delete(
    verifyJWT,
    deleteUserByAdmin
);


export default router;
