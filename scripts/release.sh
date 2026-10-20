#!/usr/bin/env bash
# Foto Macera — sürüm hazırlama betiği.
#   scripts/release.sh web            → web sitesini derler (dist/)
#   scripts/release.sh android        → imzalı Android paketi (AAB) üretir → releases/
#   scripts/release.sh android --bump → önce versionCode'u 1 artırır
#   scripts/release.sh all            → ikisi birden
# Yayına ALMAZ. Web yayını: main dalına push (GitHub Actions) — sadece onaydan sonra.
# Play Store yüklemesi: releases/ içindeki .aab dosyası Play Console'a elle yüklenir.
set -euo pipefail
cd "$(dirname "$0")/.."

TARGET="${1:-all}"
BUMP="${2:-}"
GRADLE_FILE="android/app/build.gradle"
export JAVA_HOME="${JAVA_HOME:-/opt/homebrew/opt/openjdk@21}"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/android-sdk}"

build_web() {
  echo "▶ Web derleniyor…"
  BASE_URL=/foto-macera/ npx vite build
}

build_android() {
  if [[ ! -f android/keystore.properties ]]; then
    echo "✖ android/keystore.properties yok — imza bilgileri olmadan paket üretilemez." >&2
    exit 1
  fi
  if [[ "$BUMP" == "--bump" ]]; then
    local cur next
    cur=$(grep -E '^\s*versionCode [0-9]+' "$GRADLE_FILE" | grep -oE '[0-9]+')
    next=$((cur + 1))
    sed -i '' -E "s/versionCode ${cur}/versionCode ${next}/" "$GRADLE_FILE"
    echo "▶ versionCode ${cur} → ${next}"
  fi
  echo "▶ Telefon sürümü derleniyor…"
  CAP=1 npx vite build
  npx cap sync android
  (cd android && ./gradlew bundleRelease --no-daemon -q)
  local code name out
  code=$(grep -E '^\s*versionCode [0-9]+' "$GRADLE_FILE" | grep -oE '[0-9]+')
  name=$(grep -E '^\s*versionName ' "$GRADLE_FILE" | grep -oE '"[^"]+"' | tr -d '"')
  mkdir -p releases
  out="releases/foto-macera-v${name}-${code}.aab"
  cp android/app/build/outputs/bundle/release/app-release.aab "$out"
  echo "✔ Hazır: $out"
}

case "$TARGET" in
  web) build_web ;;
  android) build_android ;;
  all) build_web; build_android ;;
  *) echo "Kullanım: scripts/release.sh [web|android|all] [--bump]"; exit 1 ;;
esac
