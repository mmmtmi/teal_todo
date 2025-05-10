# 開発用にNodeイメージでビルド
FROM node:18 AS builder

WORKDIR /app

# 依存ファイルコピー
COPY package*.json ./

# インストール
RUN npm install

# 残りのファイルもコピー
COPY . .

# 本番用にビルド（Viteの場合は dist/ に出力）
RUN npm run build

# ───────────────────────
# 本番用イメージ（nginx）
FROM nginx:alpine

# ビルド成果物をNginxに配置
COPY --from=builder /app/dist /usr/share/nginx/html

# ポート解放（デフォルト80）
EXPOSE 80

# envファイルをコピー
COPY .env.production .env.production

FROM nginx:alpine

COPY ./dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf