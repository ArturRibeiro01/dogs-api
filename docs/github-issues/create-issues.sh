#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ISSUES_DIR="$ROOT_DIR/docs/github-issues"

labels=(
  "bug"
  "feature"
  "tech-debt"
  "testing"
  "ci"
  "documentation"
  "security"
  "database"
  "api"
  "priority-high"
  "priority-medium"
  "priority-low"
)

for label in "${labels[@]}"; do
  gh label create "$label" --force >/dev/null
done

issue_files=(
  "01-bootstrap-nestjs-api.md"
  "02-quality-tooling.md"
  "03-docs-and-codex-notes.md"
  "04-ci-validate.md"
  "05-config-env-validation.md"
  "06-prisma-supabase.md"
  "07-health-swagger.md"
  "08-error-response-contract.md"
  "09-auth-users.md"
  "10-breeds-seed.md"
  "11-dogs-memberships.md"
  "12-posts-media-feed.md"
  "13-http-collection.md"
)

for issue_file in "${issue_files[@]}"; do
  full_path="$ISSUES_DIR/$issue_file"

  if [[ ! -f "$full_path" ]]; then
    echo "Issue file not found: $full_path" >&2
    exit 1
  fi

  title="$(head -n 1 "$full_path" | sed 's/^# //')"
  labels_for_issue="feature,api"

  case "$issue_file" in
    01-*|02-*|03-*|04-*|05-*|06-*|07-*|08-*)
      labels_for_issue="$labels_for_issue,priority-high"
      ;;
    09-*|10-*|11-*|12-*)
      labels_for_issue="$labels_for_issue,priority-medium"
      ;;
    *)
      labels_for_issue="$labels_for_issue,priority-low"
      ;;
  esac

  case "$issue_file" in
    03-*)
      labels_for_issue="$labels_for_issue,documentation"
      ;;
    04-*)
      labels_for_issue="$labels_for_issue,ci"
      ;;
    05-*|08-*)
      labels_for_issue="$labels_for_issue,security"
      ;;
    06-*|10-*)
      labels_for_issue="$labels_for_issue,database"
      ;;
    02-*)
      labels_for_issue="$labels_for_issue,tech-debt"
      ;;
    13-*)
      labels_for_issue="$labels_for_issue,documentation"
      ;;
  esac

  gh issue create \
    --title "$title" \
    --body-file "$full_path" \
    --label "$labels_for_issue"
done
