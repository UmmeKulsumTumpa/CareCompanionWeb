import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";
import errorMiddleware from "./middlewares/error.middleware";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use(errorMiddleware);

export default app;
