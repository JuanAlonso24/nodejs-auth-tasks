import mongoose, { Schema, Document } from "mongoose";
export interface ITask extends Document {
  title: string;
  description?: string;
  completed: boolean;
  owner: mongoose.Types.ObjectId;
  file?: string;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    file: { type: String },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
