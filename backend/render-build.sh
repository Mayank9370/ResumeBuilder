#!/usr/bin/env bash
# Render build script - installs dependencies + Chrome for Puppeteer

set -e

echo "📦 Installing Node.js dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🗄️ Running database migrations..."
npx prisma migrate deploy

echo "🌐 Installing Google Chrome for Puppeteer..."
apt-get update -qq && apt-get install -y -qq wget gnupg ca-certificates > /dev/null 2>&1
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/google-archive-keyring.gpg arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
apt-get update -qq && apt-get install -y -qq google-chrome-stable > /dev/null 2>&1

echo "✅ Build complete! Chrome installed at: $(which google-chrome-stable)"
