import mongoose from "mongoose";

mongoose.set("strictQuery", true);

export * from "./friendship.model.js";
export * from "./group.model.js";
export * from "./expense.model.js";
export * from "./expense-split.model.js";
export { mongoose };
