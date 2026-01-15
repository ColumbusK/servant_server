import nodemailer from "nodemailer";




// 1. 定义账号列表
const mailConfigs = [
  {
    user: "zkzkao@foxmail.com",
    pass: "dzlimhvxoidfbhgf",
  },
  {
    user: "845265098@qq.com",
    pass: "fzxmdsrrqgmlbaja",
  },
  // 可以继续添加更多账号
];

// 2. 初始化多个 Transporters
const transporters = mailConfigs.map(config =>
  nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 465,
    secure: true,
    auth: config,
  })
);

let currentIndex = 0; // 当前使用的账号索引

export async function sendMailCode(mail: string, code: string) {
  const htmlContent = `
    <div style="background-color: #f4f7f9; padding: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <tr>
          <td style="padding: 40px 20px; text-align: center; background-color: #007bff;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">知行面试</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #333333; line-height: 1.5;">您好！</p>
            <p style="font-size: 16px; color: #333333; line-height: 1.5;">感谢您使用知行面试。您的注册验证码如下，请在 10 分钟内完成验证：</p>
            <div style="margin: 30px 0; text-align: center;">
              <span style="display: inline-block; padding: 15px 30px; font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; border: 2px dashed #007bff; border-radius: 4px; background-color: #f0f7ff;">
                ${code}
              </span>
            </div>
            <p style="font-size: 14px; color: #666666; line-height: 1.5;">如果您没有请求此代码，请忽略此邮件。为了您的账号安全，请勿将验证码泄露给他人。</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; text-align: center; background-color: #f8f9fa; color: #999999; font-size: 12px;">
            © 2026 知行面试 - 助你上岸<br>
            此邮件由系统自动发出，请勿直接回复。
          </td>
        </tr>
      </table>
    </div>
  `;

  const mailMessage = {
    subject: `【知行面试】${code} 是您的注册验证码`,
    text: `您的注册验证码是 ${code}，请在10分钟内使用。`,
    html: htmlContent,
  };

  // 尝试次数等于账号总数
  for (let i = 0; i < transporters.length; i++) {
    // 轮询逻辑：(当前索引 + 尝试次数) % 总数
    const index = (currentIndex + i) % transporters.length;
    const transporter = transporters[index];
    const fromUser = mailConfigs[index].user;

    try {
      const info = await transporter.sendMail({
        ...mailMessage,
        from: fromUser,
        to: mail,
      });

      console.log(`[Success] 账号 ${fromUser} 发送成功: ${info.messageId}`);

      // 成功后，下次从下一个账号开始，实现负载均衡
      currentIndex = (index + 1) % transporters.length;
      return { ok: true };

    } catch (err) {
      console.error(`[Error] 账号 ${fromUser} 发送失败，尝试切换...`, err);
      // 如果是最后一个账号也失败了，则抛出异常
      if (i === transporters.length - 1) {
        throw new Error("所有邮件账号均不可用");
      }
    }
  }
}
