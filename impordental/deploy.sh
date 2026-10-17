#!/bin/bash

# Script to prepare Laravel deployment for Hostinger
echo "📦 Preparing deployment package..."

# 1. Clean up
rm -f deploy.zip

# 2. Build assets
echo "🎨 Building assets..."
npm run build

# 3. Optimize Laravel
echo "⚙️ Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 4. Create ZIP
echo "🗜️ Creating ZIP file (excluding dev files)..."
zip -r deploy.zip . -x "node_modules/*" "tests/*" ".git/*" ".env" "storage/*.key" "vendor/*"

echo "✅ deploy.zip created successfully!"
echo "🚀 Instructions for Hostinger:"
echo "1. Upload deploy.zip to your public_html or project folder via File Manager/FTP."
echo "2. Unzip the file."
echo "3. Run 'composer install --no-dev' if you have SSH access."
echo "4. Configure your .env file on the server."
echo "5. Ensure the symbolink link for storage is created: 'php artisan storage:link'"
