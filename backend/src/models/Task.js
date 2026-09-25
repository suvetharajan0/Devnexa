import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, maxlength: 1000, default: '' },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

taskSchema.index({ team: 1, status: 1 });

export const Task = mongoose.model('Task', taskSchema);