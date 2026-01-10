import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
dotenv.config({
  path: "./.env",
});

connectDB()
.then(() => {
  app.listen(process.env.PORT || 8738, (req, res) => {
    console.log(`app is listning on portm ${process.env.PORT}`);
  });
})
.catch((error) => {
  throw new Error(500,"got error while connecting to database", error)
});

