FROM oven/bun:1

WORKDIR /app

COPY api/package.json api/bun.lock ./api/

WORKDIR /app/api
RUN bun install

WORKDIR /app
COPY . .

WORKDIR /app/api

RUN bunx prisma generate

EXPOSE 3000

CMD ["bun", "src/index.ts"]