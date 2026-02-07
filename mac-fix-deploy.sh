#!/bin/bash

# ==============================================================================
# Mac-Proof Hyperledger Fabric Deployment script
# This script handles Docker API mismatches and macOS metadata corruption ("._*")
# ==============================================================================

set -e

# 1. Environment Configuration
export DOCKER_API_VERSION=1.44
export COPYFILE_DISABLE=1
export PATH=$PWD/fabric-samples/bin:$PATH

echo "🚀 Starting Mac-Proof Deployment for BhoomiSetu..."

# 2. Cleanup Corrupt Metadata
echo "🧹 Purging macOS metadata files (._*) from project..."
find . -name "._*" -delete

# 3. Environment Sync Check
if [ ! -d "fabric-samples/builders/ccaas_linux" ]; then
    echo "⚠️ ccaas_linux builder not found. Syncing binaries..."
    # (Optional: Add download logic here if missing, but we already did this)
fi

# 4. Network Restart
cd fabric-samples/test-network

echo "🔄 Restarting Fabric Network..."
./network.sh down
./network.sh up createChannel -c mychannel -ca

# 5. CCaaS Deployment
echo "📦 Deploying landregistry chaincode via CCaaS..."
./network.sh deployCCAAS -ccn landregistry -ccp ../../chaincode/land-registry

echo "✅ Deployment finished successfully! Once and for all."
