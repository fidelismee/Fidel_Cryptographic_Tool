#!/bin/bash

# Start nginx in the background
nginx

# Change to backend directory and start Flask application
cd /app/backend
python app.py
