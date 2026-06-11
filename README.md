# Puearillの主页

二次元毛玻璃风格的个人主页，基于 Node.js + Express 构建。

## 功能

- 个人主页 SPA：项目展示、文章、照片墙、音乐播放器、说说（微博客）
- GitHub OAuth 登录评论系统
- 毛玻璃特效、暗色/亮色模式切换
- 独立管理后台（admin 子域名）：内容 CRUD、网易云音乐解析、图片上传

## 技术栈

- **后端**：Node.js + Express
- **前端**：原生 HTML/CSS/JS（无框架）
- **数据库**：JSON 文件存储（零依赖）
- **部署**：Nginx 反向代理

## 本地运行

```bash
# 1. 克隆项目
git clone https://github.com/你的用户名/你的仓库名.git
cd 你的仓库名

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的配置

# 4. 启动
npm start
```

访问 `http://localhost:3000` 查看主页，`http://localhost:3000/admin-login.html` 进入管理后台。

## 生产部署

1. 在服务器上克隆项目，配置 `.env`
2. 使用 Nginx 反向代理到 `localhost:3000`
3. 配置 `puearill.top` 和 `admin.puearill.top` 两个域名指向服务器
4. 使用 pm2 或 systemd 守护进程

## 项目结构

```
├── app.js              # Express 入口
├── database.js         # JSON 数据库模块
├── routes/
│   ├── api.js          # 公开 API
│   └── admin.js        # 管理后台 API
├── public/             # 前端静态文件
│   ├── index.html      # 主页 SPA
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   ├── app.js          # 前端 JS
│   └── style.css
└── data/               # JSON 数据库（首次运行自动创建）
```

## License

MIT
