import { FastifyInstance } from "fastify";
import { getAllUnits } from "../controllers/unit.controller";

export async function unitRoutes(fastify: FastifyInstance) {
  // 获取所有单位
  fastify.get('/', getAllUnits);
}
