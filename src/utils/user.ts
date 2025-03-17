

// 生成验证码函数
export function generateCode(): string {
  // 6位数的随机数，100000-999999
  return Math.floor(100000 + Math.random() * 900000).toString();
}
