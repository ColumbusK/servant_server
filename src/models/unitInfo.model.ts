// models/unitInfo.model.ts
import { Schema, model } from 'mongoose';

const UnitInfoSchema = new Schema({
  unit_id: { type: Schema.Types.ObjectId, ref: 'Unit', required: true }, // 对应 units 表的 _id
  unit_name: { type: String, required: true, index: true },             // 原 province_name
  icon_url: { type: String },                                           // 从 units 表同步过来的图标
  summary: String,
  years: [Number],
  positions: [String],
  cities: [String],
  filter_options: Schema.Types.Mixed,
  sunburst_data: Schema.Types.Mixed
});

export const UnitInfoModel = model('UnitInfo', UnitInfoSchema, 'unit_info');
