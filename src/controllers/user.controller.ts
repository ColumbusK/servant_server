import { FastifyRequest, FastifyReply } from "fastify";
import UserModel from "../models/user.model";

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  try {
    // 示例：从请求体中获取用户数据
    const { name, email } = request.body as { name: string; email: string };

    // 创建用户
    const user = new UserModel({ name, email });
    await user.save();

    // 返回成功响应
    reply.status(201).send({ message: 'User created successfully', user });
  } catch (err) {
    // 返回错误响应
    reply.status(500).send({ error: (err as Error).message });
  }
}

export async function verifyUser(request: FastifyRequest<{ Body: { phonenumber: string, password: string } }>, reply: FastifyReply) {
  try {
    const { phonenumber, password } = request.body;
    const user = await UserModel.findOne({ phonenumber });
  } catch (error) {
    console.log(error.message);
  }
}
