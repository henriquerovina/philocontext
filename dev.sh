#!/usr/bin/env bash
set -e

server_python=python3
if [ -x server/.venv/bin/python ]; then
  server_python=.venv/bin/python
fi

(cd server && "$server_python" -m uvicorn api:app --reload) &
server_pid=$!
trap 'kill "$server_pid"' EXIT INT TERM

cd client
npm run dev
