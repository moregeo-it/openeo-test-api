#!/bin/bash
set -euo pipefail

# create user from environment variables
if [ -n "${USERNAME:-}" ] && [ -n "${PASSWORD:-}" ]; then
    echo "Creating user $USERNAME"
    node src/adduser.js "$USERNAME" "$PASSWORD"
else
    echo "No user created, missing USERNAME or PASSWORD environment variable"
fi

npm start
