import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // 单位名称是必填字段
  },
  exam_type: {
    type: String,
    required: true, // 考试类型是必填字段
  },
  years: {
    type: String, // 年份，可以为空
  },
  counts: {
    type: Number, // 题目数量
  },
  description: {
    type: String, // 描述信息
  },
  icon_url: {
    type: String, // 图标 URL
  },
});

const UnitModel = mongoose.model('Unit', unitSchema, 'units');

export default UnitModel;
