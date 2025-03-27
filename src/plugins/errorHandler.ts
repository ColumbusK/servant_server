// plugins/errorHandler.ts
import { FastifyInstance } from 'fastify';

export function setupErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    reply.status(error.statusCode || 500).send({
      success: false,
      message: error.message || '服务器错误'
    });
  });
}
