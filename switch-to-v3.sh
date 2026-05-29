#!/bin/bash
# Roll the live site forward to V3 (full redesign).
# V3 = git commit f50804c9 "V3: redesign — hero, work, about, AI nav, metric shine" (deployed 2026-05-28).
# This re-promotes the V3 deployment to production. No rebuild, takes seconds.

set -e

V3_URL="https://midhun-portfolio-light-2026-8mqvswp62-midhun2k14-4167s-projects.vercel.app"

echo "Switching production to V3: $V3_URL"
vercel promote "$V3_URL"
echo ""
echo "Done. midhunkrishnakumar.info is now serving V3."
echo "To switch back to V2, run: ./switch-to-v2.sh"
