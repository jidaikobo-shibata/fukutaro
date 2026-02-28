#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$ROOT_DIR/.http-server.pid"
LOG_FILE="$ROOT_DIR/.http-server.log"
PORT="${1:-8000}"

if [[ -f "$PID_FILE" ]]; then
	PID="$(cat "$PID_FILE")"
	if kill -0 "$PID" 2>/dev/null; then
		echo "HTTP server is already running on PID $PID."
		echo "Open http://localhost:$PORT/index.html"
		exit 0
	fi
	rm -f "$PID_FILE"
fi

cd "$ROOT_DIR"
nohup python3 -m http.server "$PORT" >"$LOG_FILE" 2>&1 &
PID=$!
echo "$PID" >"$PID_FILE"

echo "Started HTTP server on PID $PID"
echo "Open http://localhost:$PORT/index.html"
echo "Log: $LOG_FILE"
