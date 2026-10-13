#!/usr/bin/env bash
# Manage feature worktrees without Claude Code.
# Uses the same layout as `claude --worktree <name>`: .claude/worktrees/<name>.
#
#   npm run wt -- new <name> [base]   create worktree on branch feature/<name> (base: origin/main)
#   npm run wt -- list                list worktrees
#   npm run wt -- rm <name>           remove worktree (keeps the branch)
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
dir_for() { echo "$root/.claude/worktrees/$1"; }

case "${1:-}" in
  new)
    name="${2:?usage: worktree.sh new <name> [base]}"
    base="${3:-origin/main}"
    dir="$(dir_for "$name")"
    git -C "$root" fetch origin main --quiet || true
    git -C "$root" worktree add -b "feature/$name" "$dir" "$base"
    # Copy gitignored files listed in .worktreeinclude (e.g. .env).
    if [[ -f "$root/.worktreeinclude" ]]; then
      while IFS= read -r f; do
        [[ -z "$f" || "$f" == \#* ]] && continue
        [[ -e "$root/$f" ]] && cp -r "$root/$f" "$dir/$f"
      done < "$root/.worktreeinclude"
    fi
    (cd "$dir" && npm ci --silent)
    echo "Ready: cd $dir && claude"
    ;;
  list)
    git -C "$root" worktree list
    ;;
  rm)
    name="${2:?usage: worktree.sh rm <name>}"
    git -C "$root" worktree remove "$(dir_for "$name")"
    echo "Removed worktree. Branch feature/$name kept; delete with: git branch -d feature/$name"
    ;;
  *)
    sed -n '2,8p' "$0"
    exit 1
    ;;
esac
