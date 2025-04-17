import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from 'bcrypt';
import { omit } from 'lodash';

import UserModel from "../models/user.model";
import { redisHelpers } from "../libs/redis";
import { generateUniqueUsername } from "../services/userService";
import { hashPassword, verifyPassword } from "../utils/user";
import { generateToken } from "../utils/auth";
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



export async function createUser(request: FastifyRequest<{ Body: IRegisterBody }>, reply: FastifyReply) {
  const { email, password, code } = request.body;

  // 1. 验证邮箱格式
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw request.server.httpErrors.badRequest("邮箱格式不正确");
  }
  // 2. 验证码校验
  const savedCode = await redisHelpers.getCode(request.server, email);
  if (!savedCode) {
    throw request.server.httpErrors.badRequest("验证码已过期");
  }
  else if (savedCode !== code) {
    throw request.server.httpErrors.badRequest("验证码错误");
  }

  // 3. 检查邮箱是否已注册
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return reply.status(400).send({ message: '该邮箱已注册' });
  }

  // 4. 创建新用户
  const [hashedPassword, username] = await Promise.all([
    hashPassword(password),
    generateUniqueUsername()
  ]);

  const newUser = new UserModel({
    username: username,
    email,
    password: hashedPassword // 保存加密后的密码
  });

  await newUser.save();
  // 获取用户数据，排除 _id 和 password
  const userData = omit(newUser.toObject(), ['_id', 'password']);
  // 5. 删除验证码
  await redisHelpers.delCode(request.server, email);
  // 6. 生成 JWT token
  const token = await generateToken(reply, newUser._id)

  return reply.status(201).send({
    success: true,
    message: '注册成功',
    accessToken: token,
    user: userData
  });
}

export async function verifyUser(request: FastifyRequest<{ Body: ILoginBody }>, reply: FastifyReply) {
  const { email, password } = request.body;
  const user = await UserModel.findOne({ email });
  console.log(user);


  if (!user) {
    throw new Error("用户不存在！");
  }

  const isMatch = await verifyPassword(password, user.password);
  if (!isMatch) {
    throw new Error("密码错误！");
  }
  const token = await generateToken(reply, user._id);

  return reply.status(200).send({
    success: true,
    message: "登陆成功",
    accessToken: token, user: { username: user.username, email: user.email },
  })
}
