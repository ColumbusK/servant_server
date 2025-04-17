const mongoose = require('mongoose');


interface UserT extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  created_at: Date;
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, },
  email: { type: String, required: true, unique: true, },
  password: { type: String, required: true, },
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
  created_at: {
    type: Date,
    default: Date.now,
  }
})

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
