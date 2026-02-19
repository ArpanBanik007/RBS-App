import { Router } from "express";
import { verifyJWT } from "../Middlewire/auth.middlewire.js";

import {
    createTask,
    getAllTasks,
    getSingleTask,
    updateTask,
    deleteTask,
    getUserAllTasks
} from "../Controller/Task.controller.js";

const router = Router();


/*
|--------------------------------------------------------------------------
| Static Routes (ALWAYS FIRST)
|--------------------------------------------------------------------------
*/

// Create Task
router.post("/create", verifyJWT, createTask);

// Get All Tasks (Admin / Testing purpose)
router.get("/alltasks", verifyJWT, getAllTasks);

// Get Logged-in User Tasks
router.get("/mytasks", verifyJWT, getUserAllTasks);


/*
|--------------------------------------------------------------------------
| Dynamic Routes (ALWAYS LAST)
|--------------------------------------------------------------------------
*/

router.route("/:taskId")
    .get(verifyJWT, getSingleTask)
    .put(verifyJWT, updateTask)
    .delete(verifyJWT, deleteTask);

export default router;
