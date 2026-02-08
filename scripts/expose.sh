#!/bin/bash

# BhoomiSetu Local Tunnel Exposition Script
# This helps expose your local backend to the internet for the frontend to connect.

PORT=${1:-3000}
SUBDOMAIN="bhoomisetu-api"

echo "🚀 Exposing local backend on port $PORT..."
echo "🔗 Desired URL: https://$SUBDOMAIN.loca.lt"

# Check if localtunnel is installed
if ! command -v lt &> /dev/null
then
    echo "📦 localtunnel not found, installing..."
    npm install -g localtunnel
fi

# Run localtunnel
lt --port $PORT --subdomain $SUBDOMAIN
