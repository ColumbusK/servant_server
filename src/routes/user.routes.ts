import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { generateCode } from "../utils/user";
import { redisHelpers } from "../libs/redis";

import { sendMailCode } from "../services/mailService";
import { createUser, verifyUser } from "../controllers/user.controller";

// 定义请求参数的接口
interface IParams {
  id: string;
}

// 定义请求体的接口
interface ISendCodeBody {
  phone: string;
}

// 注册请求体接口
interface IRegisterBody {
  email: string;
  password: string;
  code: string;
}

// 登录
interface ILoginBody {
  email: string;
  password: string;
}


export async function userRoutes(app: FastifyInstance) {
  app.get('/', (request: FastifyRequest, reply: FastifyReply) => {
    return reply.send('Hello World!')
  });

  app.get('/:id', (request: FastifyRequest<{ Params: IParams }>, reply: FastifyReply) => {
    return reply.send(`Hello ${request.params.id}!`)
  });

  app.post<{ Body: IRegisterBody }>('/register', createUser);
  // 登录接口
  app.post<{ Body: ILoginBody }>('/login', verifyUser);


  // 邮箱注册发送验证码
  app.post<{ Body: { email: string } }>('/send-email-code', async (request, reply) => {
    const { email } = request.body;
    console.log(email);

    const code = generateCode();
    // 验证邮箱是否合法
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return reply.status(400).send({ message: '邮箱格式不正确' });
    }
    try {
      // 保存验证码到 Redis
      await redisHelpers.setCode(app, email, code);
      // 调用邮件服务发送验证码
      await sendMailCode(email, code);
      console.log(`发送验证码到 ${email}: ${code}`);
      return reply.status(200).send({ success: true });
    } catch (error) {
      return reply.status(500).send({ success: false, error: error });
    }
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

