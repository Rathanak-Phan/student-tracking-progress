import express from "express";
import cors from "cors";
import router from "./routes.js";
import swaggerUi from "swagger-ui-express"
import path from "path";
import { fileURLToPath } from "url";
import swaggerSpec from "../docs/swagger.js";
import { errorHandler, notFound } from "../shared/middleware/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json()); 

app.get("/", (req, res) => {
  res.send("Server is running");
});

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Handle legacy static file paths by redirecting/rewriting them to correct subdirectories
app.use("/uploads", (req, res, next) => {
  if (req.url.startsWith("/avatar-")) {
    req.url = "/avatars" + req.url;
  } else if (req.url.startsWith("/cover-")) {
    req.url = "/covers" + req.url;
  } else if (req.url.startsWith("/material-")) {
    req.url = "/materials" + req.url;
  } else if (req.url.startsWith("/submission-")) {
    req.url = "/submissions" + req.url;
  } else if (req.url.startsWith("/message-")) {
    req.url = "/messages" + req.url;
  }
  next();
});

// Serve uploads correctly
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../../uploads"))
);

app.use("/api", router);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;