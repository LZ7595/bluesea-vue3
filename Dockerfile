# 使用 Node.js 20.12.2 作为基础镜像
FROM node:20.12.2

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建项目
RUN npm run build

# 使用 Nginx 作为生产环境服务器
FROM nginx:1.21

# 复制构建好的文件到 Nginx 目录
COPY --from=0 /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]