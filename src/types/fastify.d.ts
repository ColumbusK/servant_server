import '@fastify/jwt';

declare module 'fastify' {
  interface FastifyRequest {
    jwt: {
      sign: (payload: object, options?: object) => string;
      verify: <T>(token: string) => T;
    };
  }
}
