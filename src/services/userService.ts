import UserModel from '../models/user.model';

/**
 * 生成随机用户名
 * 格式：用户XXXXX (X为数字或小写字母)
 */
function generateRandomUsername(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '用户';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 生成唯一用户名
 * 如果生成的用户名已存在，会重试最多10次
 */
export async function generateUniqueUsername(): Promise<string> {
  const maxAttempts = 10;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const username = generateRandomUsername();
    // 检查用户名是否已存在
    const existingUser = await UserModel.findOne({ username });

    if (!existingUser) {
      return username;
    }

    attempts++;
  }

  // 如果多次尝试都失败，使用时间戳作为后缀
  const timestamp = Date.now().toString().slice(-5);
  return `用户${timestamp}`;
}


/**
 * 检查邮箱是否已经被注册
 * @param email 待检查的邮箱地址
 * @returns true 如果邮箱未被注册，false 如果邮箱已被注册
 * @throws 如果数据库查询出错
 */
export async function isEmailUnique(email: string): Promise<boolean> {
  try {
    const existingUser = await UserModel.findOne({ email });
    return !existingUser;
  } catch (error) {
    // 记录错误并重新抛出
    console.error('检查邮箱唯一性时出错:', error);
    throw new Error('检查邮箱唯一性时发生错误');
  }
}

/**
 * 检查邮箱格式是否合法
 * @param email 待检查的邮箱地址
 * @returns true 如果邮箱格式合法，false 如果邮箱格式不合法
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
