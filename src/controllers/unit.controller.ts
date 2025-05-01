import { FastifyRequest, FastifyReply } from "fastify";
import UnitModel from "../models/unit.model";

// 获取所有单位
export async function getAllUnits(request: FastifyRequest, reply: FastifyReply) {
  try {
    const units = await UnitModel.find(); // 查询所有单位
    reply.send(units);
  } catch (error) {
    reply.status(500).send({ error: "获取单位列表失败" });
  }
}
