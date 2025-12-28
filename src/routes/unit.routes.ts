import { FastifyInstance } from "fastify";
import { getAllUnits, getUnitDetail } from "../controllers/unit.controller";

export async function unitRoutes(fastify: FastifyInstance) {
  // 获取所有单位
  fastify.get('/', getAllUnits);

  // routes/unit.routes.ts
  fastify.get('/detail/:name', getUnitDetail);
  // 请求示例: GET /api/v1/units/detail/铁路公安
}
