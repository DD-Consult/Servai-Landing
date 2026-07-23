#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# Build & Deploy to S3
#
# Usage:
#   ./deploy-s3.sh <s3-bucket-name> [aws-profile] [aws-region]
#
# Examples:
#   ./deploy-s3.sh my-website-bucket
#   ./deploy-s3.sh my-website-bucket my-aws-profile us-east-1
#
# Prerequisites:
#   - AWS CLI v2 installed and configured
#   - Node.js 20+ and yarn installed
#   - Appropriate AWS permissions for s3:PutObject, s3:DeleteObject, s3:ListBucket
#     and (optionally) cloudfront:CreateInvalidation
###############################################################################

BUCKET_NAME="${1:?Usage: ./deploy-s3.sh <s3-bucket-name> [aws-profile] [aws-region]}"
AWS_PROFILE="${2:-}"
AWS_REGION="${3:-ap-southeast-2}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$SCRIPT_DIR/build"

# Build AWS CLI flags as an array (safe from word-splitting)
AWS_FLAGS=(--region "$AWS_REGION")
if [ -n "$AWS_PROFILE" ]; then
  AWS_FLAGS+=(--profile "$AWS_PROFILE")
fi

echo "==> Installing dependencies..."
cd "$SCRIPT_DIR"
yarn install --frozen-lockfile

echo "==> Building production bundle..."
CI=false yarn build

if [ ! -d "$BUILD_DIR" ]; then
  echo "ERROR: Build directory not found at $BUILD_DIR"
  exit 1
fi

echo "==> Syncing build to s3://$BUCKET_NAME ..."

# Upload hashed static assets with long cache headers
aws s3 sync "$BUILD_DIR/static" "s3://$BUCKET_NAME/static" \
  "${AWS_FLAGS[@]}" \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --content-encoding "identity"

# Upload everything else with a short cache (HTML, manifest, etc.)
aws s3 sync "$BUILD_DIR" "s3://$BUCKET_NAME" \
  "${AWS_FLAGS[@]}" \
  --delete \
  --cache-control "public, max-age=60, s-maxage=300" \
  --exclude "static/*"

echo "==> Deploy complete: s3://$BUCKET_NAME"

# Optional: invalidate CloudFront cache if CLOUDFRONT_DISTRIBUTION_ID is set
if [ -n "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]; then
  echo "==> Invalidating CloudFront distribution $CLOUDFRONT_DISTRIBUTION_ID ..."
  aws cloudfront create-invalidation \
    "${AWS_FLAGS[@]}" \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*"
  echo "==> CloudFront invalidation submitted."
fi

echo "Done!"
