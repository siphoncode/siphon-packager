#!/bin/bash

choice=$1

CWD="$( dirname "${BASH_SOURCE[0]}" )"
NUM_WORKERS=2
MEMORY_PER_WORKER=512 # GC size

# Use pm2 to daemonize the packager
if [ "$choice" = "start" ]; then
  echo "Starting the packager daemon"
  "$CWD"/server/node_modules/.bin/pm2 start "$CWD"/server/index.js -i $NUM_WORKERS --node-args="--max-old-space-size=$MEMORY_PER_WORKER"
elif [ "$choice" = "stop" ]; then
  echo "Stopping the packger daemon"
  "$CWD"/server/node_modules/.bin/pm2 stop "$CWD"/server/index.js
elif [ "$choice" = "restart" ]; then
  echo "Restarting the packager daemon"
  "$CWD"/server/node_modules/.bin/pm2 restart "$CWD"/server/index.js -i $NUM_WORKERS --node-args="--max-old-space-size=$MEMORY_PER_WORKER"
elif [ "$choice" = "logs" ]; then
  "$CWD"/server/node_modules/.bin/pm2 logs index
else
  echo "Commands: start, stop, logs"
fi
