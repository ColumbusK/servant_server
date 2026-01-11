// models/studyPlan.model.ts
import { Schema, model, Types } from 'mongoose';

const TaskSchema = new Schema({
  question_id: { type: Schema.Types.ObjectId, ref: 'Question' }, // 关联题目
  type: { type: String, enum: ['practice', 'theory', 'mock'] }, // 练习、理论、模拟
  is_completed: { type: Boolean, default: false },
  completed_at: { type: Date }
});

const StudyPlanSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  unit_name: { type: String }, // 关联你之前的 unit_name
  tasks: [TaskSchema],
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  status: {
    type: String,
    enum: ['active', 'archived', 'completed'],
    default: 'active'
  }
}, { timestamps: true });

export const StudyPlanModel = model('StudyPlan', StudyPlanSchema, 'study_plans');
