#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="$ROOT/scripts/blender/create_seed_pod.py"
OUT="$ROOT/public/models/01_seed.glb"

if command -v blender >/dev/null 2>&1; then
  BLENDER=(blender)
elif [[ -x "/Applications/Blender.app/Contents/MacOS/Blender" ]]; then
  BLENDER=("/Applications/Blender.app/Contents/MacOS/Blender")
else
  echo "Blender not found. Install Blender or open the project in Blender and run:"
  echo "  $SCRIPT"
  exit 1
fi

mkdir -p "$ROOT/public/models"
"${BLENDER[@]}" --background --python "$SCRIPT"

if [[ -f "$OUT" ]]; then
  echo "✓ Seed exported: $OUT"
  ls -lh "$OUT"
else
  echo "Export failed — $OUT not found"
  exit 1
fi
