import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { generateCode } from "../utils/user";
import { redisHelpers } from "../libs/redis";

// 定义请求参数的接口
interface IParams {
  id: string;
}

// 定义请求体的接口
interface ISendCodeBody {
  phone: string;
}

export async function userRoutes(app: FastifyInstance) {
  app.get('/', (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send('Hello World!')
  });

  app.get('/:id', (request: FastifyRequest<{ Params: IParams }>, reply: FastifyReply) => {
    return reply.send(`Hello ${request.params.id}!`)
  });

  // 发送验证码
  app.post<{ Body: ISendCodeBody }>('/send-code', async (request, reply) => {
    const { phone } = request.body;
    const code = generateCode();

    // 验证手机号是否合法
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return reply.status(400).send({ message: '手机号格式不正确' });
    }

    try {
      // 保存验证码到 Redis
      await redisHelpers.setCode(app, phone, code);
      // 调用短信服务发送验证码
      // await sendSMS(phone, code); // 示例代码，请根据您的短信服务实现此函数
      console.log(`发送验证码到 ${phone}: ${code}`);
      return reply.status(200).send({ success: true });
    } catch (error) {
      return reply.status(500).send({ success: false });
    }
  });
}

