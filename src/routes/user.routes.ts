import { FastifyInstance } from "fastify"


export async function userRoutes(app: FastifyInstance) {
  app.get('/', (req: any, res: any) => {
    res.send('Hello World!')
  });
  app.get('/:id', (req: any, res: any) => {
    res.send(`Hello ${req.params.id}!`)
  });
}
