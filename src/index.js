import express, { response } from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";

import authRoute from "./routes/auth.route.js";
import apiRoute from "./API/routes/user.route.js";

import logger from "./config/logger.js";
import morgan from "morgan";

// Define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// error handler
import errorHandler from "./middlewares/error-handlers.js";

const app = express();
const port = 3000;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const morganFormat = ":method :url :status :response-time ms";

app.get("/", (req, res) => {
  //   res.send("Hello World!");
  res.send({
    name: "Hoai Nam",
    age: 20,
    major: "Fullstack Developer",
  });
});

// Logger
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// Error Handler
app.use(errorHandler);

app.use("/auth", authRoute);
app.use("/api", apiRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
