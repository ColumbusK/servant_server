import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "zkzkao@foxmail.com",
    pass: "dzlimhvxoidfbhgf",
  },
});


export async function sendMailCode(mail: string, code: string) {
  const mailMessage = {
    from: "zkzkao@foxmail.com",
    to: mail,
    subject: "知行面试",
    text: `您的注册验证码是 ${code}`,
    html: `<b>您的注册验证码是 ${code}</b>`,
  }
  try {
    const info = await transporter.sendMail(mailMessage);
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    console.error("Error sending mail:", err);
  }
}


