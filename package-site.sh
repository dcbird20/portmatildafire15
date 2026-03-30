#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")" && pwd)"
archive_path="$repo_root/portmatildafire15-site.zip"

rm -f "$archive_path"

cd "$repo_root"
zip -r "$archive_path" \
  index.html \
  README.md \
  css \
  js \
  images \
  -x 'images/.gitkeep'

printf 'Created %s\n' "$archive_path"#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$ROOT_DIR/dist"
ARCHIVE_PATH="$DIST_DIR/portmatildafire15-site.zip"

mkdir -p "$DIST_DIR"
rm -f "$ARCHIVE_PATH"

cd "$ROOT_DIR"
zip -r "$ARCHIVE_PATH" \
  index.html \
  README.md \
  css \
  js \
  images \
  -x "*.DS_Store"

echo "Created $ARCHIVE_PATH"