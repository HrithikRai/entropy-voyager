# Base image with Node.js
FROM node:18-bullseye

# Install required dependencies for Electron
RUN apt-get update && apt-get install -y \
    libgtk-3-0 \
    libnss3 \
    libxss1 \
    libasound2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libxshmfence1 \
    libatk-bridge2.0-0 \
    libxinerama1 \
    libxext6 \
    libgl1 \
    libglu1-mesa \
    mesa-utils \
    libgl1-mesa-dri \
    && apt-get clean

# Set working directory
WORKDIR /app

# Copy everything into the container
COPY . .

# Install project dependencies
RUN npm install

# Environment variables to make Electron work in Docker
ENV DISPLAY=host.docker.internal:0.0
ENV LIBGL_ALWAYS_SOFTWARE=1
ENV ELECTRON_ENABLE_LOGGING=true
ENV ELECTRON_DISABLE_GPU=true
ENV NO_AT_BRIDGE=1

# Start the Electron app with GPU disabled and sandbox off
CMD ["npx", "electron", ".", "--no-sandbox", "--disable-gpu"]
