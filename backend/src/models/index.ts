import mongoose from "mongoose";

mongoose.set("strictQuery", true);

export * from "./friendship.model.js";
export { mongoose };
