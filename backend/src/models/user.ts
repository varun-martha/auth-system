import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  passwordHash?: string;
  googleId?: string;
  lastLogoutAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email"
      ]
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: false
    },
    googleId: {
      type: String,
      required: false,
      unique: true,
      sparse: true
    },
    lastLogoutAt: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);
