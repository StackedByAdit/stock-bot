FROM mcr.microsoft.com/playwright:v1.59.1-noble

WORKDIR /app

# Install unzip + curl
RUN apt-get update && apt-get install -y unzip curl

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
ENV PATH="/root/.bun/bin:$PATH"

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Start bot
CMD ["bun", "run", "src/index.ts"]