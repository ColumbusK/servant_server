import bcrypt from 'bcrypt';

// 生成验证码函数
export function generateCode(): string {
  // 6位数的随机数，100000-999999
  return Math.floor(100000 + Math.random() * 900000).toString();
}


// 加密用户密码
export async function hashPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, 10); // 使用 bcrypt 对密码进行加密
  return hashedPassword
}


// 验证用户密码verifyPassword
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  if (!hashedPassword) return false;
  return await bcrypt.compare(plainPassword, hashedPassword);
}
