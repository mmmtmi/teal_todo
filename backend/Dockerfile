# 1. Node.jsの公式イメージを使う（バージョンはプロジェクトに合わせて）
FROM node:20

# 2. 作業ディレクトリを作って移動
WORKDIR /app

# 3. package.json と package-lock.json をコピー
COPY package*.json ./

# 4. 依存関係をインストール
RUN npm install

# 5. 全ファイルをコンテナ内にコピー
COPY . .

# 6. ビルド（TypeScript → JavaScript）
RUN npm run build

# 7. 外部に公開するポート（NestJSのデフォルト）
EXPOSE 3000

# 8. アプリを起動するコマンド
CMD ["npm", "run", "start:prod"]

COPY .env.production .env