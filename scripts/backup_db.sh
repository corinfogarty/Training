#!/bin/bash

# Set backup directory
BACKUP_DIR="/Users/corinfogarty/Desktop/Dev Playground/Training/backups"
BACKUP_NAME="training_hub_$(date +%Y%m%d_%H%M%S).sql"

# Create backup directory if it doesnt exist
mkdir -p "$BACKUP_DIR"

# Create backup
pg_dump training_hub > "$BACKUP_DIR/$BACKUP_NAME"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "training_hub_*.sql" -mtime +7 -delete
