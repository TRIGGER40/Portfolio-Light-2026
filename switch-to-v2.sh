#!/bin/bash
# Roll the live site back to V2 (pre-V3-redesign baseline).
# V2 = git commit 633f7216 "Snapshot: pre-experiment baseline" (deployed 2026-05-27).
# This re-promotes the V2 deployment to production. No rebuild, takes seconds.

set -e

V2_URL="https://midhun-portfolio-light-2026-2fbasvima-midhun2k14-4167s-projects.vercel.app"

echo "Switching production to V2: $V2_URL"
vercel promote "$V2_URL"
echo ""
echo "Done. midhunkrishnakumar.info is now serving V2."
echo "To switch back to V3, run: ./switch-to-v3.sh"
