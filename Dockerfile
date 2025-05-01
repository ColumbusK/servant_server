# 使用官方 Node.js LTS 版本作为基础镜像
FROM node:18

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package.json package-lock.json ./

# 安装依赖
RUN npm install

# 复制项目文件到容器中
COPY . .

# 编译 TypeScript 文件
RUN npm run build

# 暴露应用运行的端口
EXPOSE 3000

# 设置环境变量（可选，根据需要调整）
ENV NODE_ENV=production

# 启动应用
CMD ["npm", "start"]
