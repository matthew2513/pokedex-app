import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import indexRoute from "./routes/index.js";

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
