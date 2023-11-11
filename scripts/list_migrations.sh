#!/bin/bash

# Store the output of "supabase migration list" in a variable
migration_list=$(supabase migration list)

# Parse the remote migration IDs from the migration list
remote_migrations=$(echo "$migration_list" | awk -F '│' '/[0-9]+/ { gsub(/^[[:space:]]+|[[:space:]]+$/, "", $2); print $2 }')

# Echo all remote migration IDs
for migration_id in $remote_migrations; do
    echo "$migration_id"
done

