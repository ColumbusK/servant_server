import { FastifyRequest, FastifyReply } from "fastify";
import UnitModel from "../models/unit.model";
import { UnitInfoModel } from "../models/unitInfo.model";

// 获取所有单位
export async function getAllUnits(request: FastifyRequest, reply: FastifyReply) {
  try {
    const units = await UnitModel.find(); // 查询所有单位
    reply.send(units);
  } catch (error) {
    reply.status(500).send({ error: "获取单位列表失败" });
  }
}


export async function getUnitDetail(
  request: FastifyRequest<{ Params: { name: string } }>,
  reply: FastifyReply
) {
  try {
    const { name } = request.params;
    const unitName = decodeURIComponent(name);

    // 查询 unit_info 表
    const data = await UnitInfoModel.findOne({ unit_name: unitName });

    if (!data) {
      return reply.status(404).send({ ok: false, message: '未找到该单位详情' });
    }

    reply.send(data);
  } catch (err) {
    reply.status(500).send({ ok: false, error: (err as Error).message });
  }
}
