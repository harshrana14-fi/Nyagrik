import mongoose, { Schema, Document, model, models } from 'mongoose';

export type UserRole = 'client' | 'lawyer' | 'intern';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  barReg?: string;
  specialization?: string;
  university?: string;
  createdAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['client', 'lawyer', 'intern'], required: true },

    // Role-specific fields
    barReg: { type: String },
    specialization: { type: String },
    university: { type: String },
  },
  {
    timestamps: true,
  }
);

// Avoid model overwrite issue in Next.js hot reload
const User = models.User || model<IUser>('User', UserSchema);
export default User;
