import mongoose, { Document, Schema, Model } from "mongoose";

export interface ICase extends Document {
  title: string;
  description: string;
  clientId: mongoose.Types.ObjectId;
  assignedLawyerId?: mongoose.Types.ObjectId;
  documents: string[];
  status: "open" | "in_progress" | "info_requested" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const caseSchema = new Schema<ICase>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedLawyerId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    documents: [{ type: String }],
    status: {
      type: String,
      enum: ["open", "in_progress", "info_requested", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

const Case: Model<ICase> = mongoose.models.Case || mongoose.model<ICase>("Case", caseSchema);

export default Case;
