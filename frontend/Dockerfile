# 使用 Node.js 官方映像檔
FROM node:18

WORKDIR /app

# 複製 package.json
COPY package.json yarn.lock* package-lock.json* ./

# 執行安裝 (在容器內執行，無主機權限問題)
RUN npm install

# 複製其餘原始碼
COPY . .

EXPOSE 3000

CMD ["npm", "start"]