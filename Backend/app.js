import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";



const app = express();



app.use(
  cors({
    origin: "https://rbs-app-three.vercel.app",
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.static("public"));
app.use(cookieParser());





import userRoutes from "./Routes/user.routes.js"
import taskRoutes from "./Routes/task.routes.js"


app.use("/api/v1/users", userRoutes); 
app.use("/api/v1/tasks", taskRoutes); 



export default app