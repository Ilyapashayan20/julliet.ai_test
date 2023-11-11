#!/bin/bash

# Store the output of "supabase migration list" in a variable
migration_list=$(supabase migration list)

remote_migrations=$(echo "$migration_list" | awk -F '│' '/[0-9]+/ { gsub(/^[[:space:]]+|[[:space:]]+$/, "", $2); print $2 }')

# Check if the script is in dry run mode
dry_run=false
if [[ $1 == "--dry-run" ]]; then
  dry_run=true
fi

# Loop through each reverted migration ID and repair it
for migration_id in $remote_migrations; do
  if [ "$dry_run" = true ]; then
    echo "Dry run: supabase migration repair $migration_id --status reverted"
  else
    supabase migration repair "$migration_id" --status reverted
  fi
done
