import mongoose, { Schema, Document, model } from "mongoose";

interface User extends Document {
    name: string;
    email: string;
    profile: string | null;
    university: string | null;
    targetedCompanys: string[];
    achivements: string[];
    lastStrick: Date[] | null;
    createdAt: Date;
    updatedAt: Date;
}
//   "First Problem Solved","7 Day Streak","HR Master","Quant Pro","100 Problems","Interview Ready"

const userSchema = new mongoose.Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profile: { type: String, required: false },
    university: { type: String, required: false },
    targetedCompanys: { type: [String], required: false },
    achivements: { type: [String], required: false },
    lastStrick: { type: Date, required: false },
}, {
    timestamps: true
});

const UserModel = mongoose.models.users || model<User>("users", userSchema);

export default UserModel;