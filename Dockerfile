FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

RUN bunx playwright install --with-deps chromium

CMD ["bun", "run", "src/index.ts"]