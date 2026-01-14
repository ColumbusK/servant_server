import { Schema, model } from 'mongoose';

const UserAnswerSchema = new Schema({
  // 使用 snake_case 命名
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  question_id: { type: Schema.Types.ObjectId, ref: 'Question', required: true, index: true },
  answer_content: { type: String, required: true },
  word_count: { type: Number },
  duration_seconds: { type: Number }, // 答题耗时
  created_at: { type: Date, default: Date.now }
});

// 索引优化
UserAnswerSchema.index({ user_id: 1, question_id: 1 });

export const UserAnswerModel = model('UserAnswer', UserAnswerSchema, 'user_answers');
