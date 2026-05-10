FROM mcr.microsoft.com/playwright:v1.59.1-noble

WORKDIR /app

COPY package.json bun.lock ./

RUN curl -fsSL https://bun.sh/install | bash

ENV PATH="/root/.bun/bin:$PATH"

RUN bun install

COPY . .

CMD ["bun", "run", "src/index.ts"]