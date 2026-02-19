import { User } from "../Models/User.models.js";
import { Task } from "../Models/Task.models.js";
import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";




const createTask = asyncHandler(async (req, res) => {

    const { title, description } = req.body;

    if (!title) {
        throw new ApiError(400, "Title is required");
    }

    if (!req.user?._id) {
        throw new ApiError(401, "User not authenticated properly");
    }

    const task = await Task.create({
        title,
        description,
        createdBy: req.user._id   // 🔥 Correct field
    });

    return res.status(201).json(
        new ApiResponse(201, task, "Task created successfully")
    );
});


 const getUserAllTasks = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    const tasks = await Task.find({ createdBy: userId })
        .populate("createdBy", "email")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, tasks, "User tasks fetched successfully")
    );
});

const getUsersAllTasks = asyncHandler(async (req, res) => {

    if (req.user.role === "admin") {
        throw new ApiError(403, "Admin cannot access this route");
    }

    const tasks = await Task.find({ createdBy: req.user.userId })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, tasks, "User tasks fetched successfully")
    );
});


const getAllTasks = asyncHandler(async (req, res) => {

    let tasks;

    if (req.user.role === "admin") {
        tasks = await Task.find()
            .populate("createdBy", "username email")
            .sort({ createdAt: -1 });
    } else {
        tasks = await Task.find({ createdBy: req.user.userId })
            .sort({ createdAt: -1 });
    }

    return res.status(200).json(
        new ApiResponse(200, tasks, "Tasks fetched successfully")
    );
});



const getSingleTask = asyncHandler(async (req, res) => {

    const { taskId } = req.params;

    const task = await Task.findById(taskId)
        .populate("createdBy", "username email");

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // If user → must be owner
    if (
        req.user.role !== "admin" &&
        task.createdBy._id.toString() !== req.user.userId
    ) {
        throw new ApiError(403, "Not authorized to view this task");
    }

    return res.status(200).json(
        new ApiResponse(200, task, "Task fetched successfully")
    );
});


const updateTask = asyncHandler(async (req, res) => {
 const userId = req.user?._id.toString();
    const { taskId } = req.params;
    const { title, description,  } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Only owner or admin
    if (
        req.user.role !== "admin" &&
        task.createdBy.toString() !== userId
    ) {
        throw new ApiError(403, "Not authorized to update this task");
    }

    if (title) task.title = title;
    if (description) task.description = description;

    await task.save();

    return res.status(200).json(
        new ApiResponse(200, task, "Task updated successfully")
    );
});


const deleteTask = asyncHandler(async (req, res) => {
  const userId = req.user?._id.toString();
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Only owner or admin
  if (
    req.user.role !== "admin" &&
    task.createdBy.toString() !== userId
  ) {
    throw new ApiError(403, "Not authorized to delete this task");
  }

  await task.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, null, "Task deleted successfully")
  );
});



export{
    createTask,
    getAllTasks,
    getSingleTask,
    updateTask,
    deleteTask,
    getUserAllTasks,
    
}