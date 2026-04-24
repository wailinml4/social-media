import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true, unique: true },
        password: { type: String, required: true, minlength: 6 },

        profilePicture: { type: String, default: "", trim: true },
        coverPicture: { type: String, default: "", trim: true },
        bio: { type: String, default: "", trim: true, maxLength: 280 },

        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],

        verificationCode: { type: String },
        verificationCodeExpiresAt: { type: Date },
        isVerified: { type: Boolean, default: false },

        resetPasswordToken: { type: String },
        resetPasswordTokenExpiresAt: { type: Date },
    },
    { timestamps: true },
)

const User = new mongoose.model("User", userSchema)
export default User
