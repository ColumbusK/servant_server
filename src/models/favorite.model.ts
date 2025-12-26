// models/favorite.model.ts
import { Schema, model } from 'mongoose';

const FavoriteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, index: true }, // 用户ID
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true }, // 题目ID
  createdAt: { type: Date, default: Date.now }
});

// 建立复合唯一索引，防止重复收藏
FavoriteSchema.index({ userId: 1, questionId: 1 }, { unique: true });

const FavoriteModel = model('Favorite', FavoriteSchema);

export default FavoriteModel;
