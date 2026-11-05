#!/bin/sh
# Concatenate js/parts/*.js (in order) into js/app.js.
cd "$(dirname "$0")/.." && cat js/parts/*.js > js/app.js && node --check js/app.js && echo "built js/app.js"
