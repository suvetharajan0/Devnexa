import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    avatar: { type: String, default: '' },
    bio: { type: String, maxlength: 500, default: '' },
    skills: [{ type: String, trim: true }],
    role: {
      type: String,
      enum: ['developer', 'admin'],
      default: 'developer',
    },
    notificationPreferences: {
      applications: { type: Boolean, default: true },
      tasks: { type: Boolean, default: true },
    },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
  },
  { timestamps: true }
);

// Runs automatically right before .save() / .create() — scrambles the password
userSchema.pre('save', async function hashPassword() {  
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Instance method: usable as `user.comparePassword('typedPassword')`
userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);