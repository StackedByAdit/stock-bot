FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

RUN bunx playwright install chromium

CMD ["bun", "run", "src/index.ts"]