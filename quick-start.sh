#!/bin/bash

echo "🚀 Draw & Learn MVP - Quick Start Script"
echo "========================================"
echo ""

# Check if .env exists and has Supabase credentials
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "   Run: cp .env.example .env"
    echo "   Then add your Supabase credentials"
    exit 1
fi

# Check if SUPABASE_URL is set
if ! grep -q "VITE_SUPABASE_URL=http" .env; then
    echo "⚠️  Warning: Supabase URL not configured in .env"
    echo ""
    echo "📋 To set up Supabase:"
    echo "   1. Go to https://supabase.com"
    echo "   2. Create a new project"
    echo "   3. Run the SQL schema from analytics/supabase_schema.sql"
    echo "   4. Copy your URL and anon key to .env"
    echo ""
    echo "For now, the app will work with localStorage fallback."
    echo ""
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if dist exists
if [ ! -d dist ]; then
    echo "🔨 Building project for the first time..."
    npm run build
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Available commands:"
echo "   npm run dev      - Start development server"
echo "   npm run build    - Build for production"
echo "   npm run preview  - Preview production build"
echo ""
echo "📚 Quick links:"
echo "   Setup Guide:     SETUP_GUIDE.md"
echo "   Documentation:   README.md"
echo "   Compliance:      COMPLIANCE_REPORT.md"
echo ""
echo "🌐 Starting development server..."
echo ""

npm run dev
