import { FastifyInstance } from "fastify";
import { findQuestion, createQuestion } from "../controllers/question.controller";

export async function questionRoutes(app: FastifyInstance) {
  app.get('/', (request, reply) => {
    reply.send('Hello World!');
  });

  app.get('/:id', findQuestion); // 使用修正后的函数名

  app.post('/', createQuestion);
  // app.put('/:id', updateQuestion);
}
