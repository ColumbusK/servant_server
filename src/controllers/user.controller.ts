const User = require('./models/User'); // CommonJS 导入
const { FastifyRequest, FastifyReply } = require('fastify'); // 导入 Fastify 类型

async function createUser(request: typeof FastifyRequest, reply: typeof FastifyReply) {
  try {
    // 示例：从请求体中获取用户数据
    const { name, email } = request.body as { name: string; email: string };

    // 创建用户
    const user = new User({ name, email });
    await user.save();

    // 返回成功响应
    reply.status(201).send({ message: 'User created successfully', user });
  } catch (err) {
    // 返回错误响应
    reply.status(500).send({ error: (err as Error).message });
  }
}

module.exports = createUser; // CommonJS 导出
