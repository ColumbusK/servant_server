// src/routes/auth.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import UserModel from '../models/user.model';
import { verifyPassword } from '../utils/user';

export async function login(
  request: FastifyRequest<{ Body: { email: string; password: string } }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;

  // 1. 验证用户（示例）
  const user = await UserModel.findOne({ email });
  if (!user || !verifyPassword(password, user.password)) {
    return reply.status(401).send({ error: 'Invalid credentials' });
  }

  // 2. 生成 accessToken
  const accessToken = request.jwt.sign({ userId: user.id });

  // 3. 生成 refreshToken（长期有效）
  const refreshToken = request.jwt.sign(
    { userId: user.id },
    { expiresIn: '7d' } // 7 天过期
  );

  // 4. 将 refreshToken 存入 HttpOnly Cookie
  reply.setCookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only
    path: '/auth/refresh', // 仅允许 /auth/refresh 接口使用
    maxAge: 7 * 24 * 60 * 60, // 7 天
  });

  // 5. 返回 accessToken
  reply.send({ accessToken });
}


// src/routes/auth.ts
export async function refreshToken(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // 1. 从 Cookie 获取 refreshToken
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) {
      throw new Error('Missing refresh token');
    }

    // 2. 验证 refreshToken
    const decoded = request.jwt.verify<{ userId: string }>(refreshToken);

    // 3. 生成新的 accessToken
    const newAccessToken = request.jwt.sign({ userId: decoded.userId });

    // 4. 返回新 accessToken
    reply.send({ accessToken: newAccessToken });
  } catch (err) {
    reply.status(401).send({ error: 'Invalid or expired refresh token' });
  }
}

// src/routes/protected.ts
export async function protectedRoute(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // 1. 验证 accessToken（自动从 Authorization 头提取）
    await request.jwtVerify();

    // 2. 获取用户信息
    const userId = request.user.userId;
    const user = await UserModel.findById(userId);

    reply.send({ user });
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
}
