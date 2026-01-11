import mongoose from 'mongoose';
import { ObjectId, Schema } from 'mongoose';

// 1. 调整 TypeScript 接口
interface UserT extends Document {
  username: string;
  email: string;
  password: string;
  b_id: string;
  vip: boolean;
  vip_expiration: Date;
  phone: string;
  avatar_url: string;
  discription: string;
  role: 'normal' | 'vip' | 'admin';
  // 新增字段
  selected_units: ObjectId[]; // 存储单位 ID 数组
  tags: string[];                             // 存储标签数组
  end_date: Date; // 存储面试时间，用于倒计时
  created_at: Date;
}

// 2. 调整 Mongoose Schema
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  b_id: { type: String, default: "" },
  vip: { type: Boolean, required: true, default: false },
  vip_expiration: { type: Date, default: Date.now },
  phone: { type: String, default: "" },
  avatar_url: { type: String, default: "" },
  discription: { type: String, default: "" },
  role: {
    type: String,
    trim: true,
    enum: ['normal', 'vip', 'admin'],
    default: 'normal',
    required: true,
  },
  // 新增字段：已选单位 (关联到 unit_info 集合)
  selected_units: [{
    type: Schema.Types.ObjectId,
    ref: 'UnitInfo', // 确保这里的名称与 unit_info 的 model 名一致
    default: []
  }],
  // 新增字段：标签
  tags: {
    type: [String],
    default: []
  },
  // 新增字段：面试时间（用于前端显示倒计时）
  end_date: {
    type: Date,
    default: null // 初始可以为 null，待用户设置
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
});

// 3. 建立索引优化查询
// 为标签建立多键索引，支持高效筛选特定标签的用户
userSchema.index({ tags: 1 });
// 为已选单位建立索引
userSchema.index({ selected_units: 1 });

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
