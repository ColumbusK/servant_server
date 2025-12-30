// models/answer.model.ts
import { Schema, model } from 'mongoose';

const AnswerSchema = new Schema({
  question_id: { type: Schema.Types.ObjectId, ref: 'Question', required: true, index: true },
  year: Number,
  blanks: [String],   // 填空引导语
  hints: [String],    // 对应填空的答案提示
  logic: [String],    // 答题逻辑/思路
  example: String,    // 范文示例
  created_at: { type: String, default: () => new Date().toISOString() }
});

export const AnswerModel = model('Answer', AnswerSchema, 'ref_answers'); // 假设集合名为 answers
