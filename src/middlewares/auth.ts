import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import jwt from 'jsonwebtoken';
import fjwt from '@fastify/jwt';

require('dotenv').config();

// 定义用户接口
interface IUser {
  userId: string;
  // 添加其他用户属性
}

// 扩展 FastifyRequest 类型
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: IUser
  }
}


// 路由验证保护
async function auth(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return reply.status(401).send({ error: 'No token provided' });
    }

    // 解码 JWT 令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as IUser;
    request.user = decoded;
    return
  } catch (err) {
    return reply.status(401).send({ error: 'Invalid token' });
  }
}

export default auth;
