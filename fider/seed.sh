#!/usr/bin/env bash
set -euo pipefail

# ── Config ───────────────────────────────────────────────────────────────────
FIDER_API_KEY="${FIDER_API_KEY:-${1:-}}"
FIDER_BASE_URL="${FIDER_BASE_URL:-http://localhost:4852}"

if [[ -z "$FIDER_API_KEY" ]]; then
  echo "Usage: FIDER_API_KEY=<key> bash seed.sh" >&2
  echo "   or: bash seed.sh <api-key>" >&2
  exit 1
fi

# ── Dependency check ─────────────────────────────────────────────────────────
if ! command -v jq &>/dev/null; then
  echo "Error: jq is required but not installed." >&2
  exit 1
fi

# ── Helpers ──────────────────────────────────────────────────────────────────
api() {
  local method="$1" path="$2"
  shift 2
  curl -sS -X "$method" \
    -H "Authorization: Bearer $FIDER_API_KEY" \
    -H "Content-Type: application/json" \
    "$FIDER_BASE_URL$path" \
    "$@"
}

# ── Connectivity check ──────────────────────────────────────────────────────
echo "Checking connectivity to $FIDER_BASE_URL ..."
if ! api GET /api/v1/tags -o /dev/null -w '' 2>/dev/null; then
  echo "Error: Cannot reach Fider at $FIDER_BASE_URL" >&2
  exit 1
fi
echo "Connected."

# ── Create tags ──────────────────────────────────────────────────────────────
declare -A TAG_SLUGS

create_tag() {
  local name="$1" color="$2"
  local response
  response=$(api POST /api/v1/tags -d "{\"name\":\"$name\",\"color\":\"$color\",\"isPublic\":true}" 2>/dev/null) || true

  local slug
  slug=$(echo "$response" | jq -r '.slug // empty' 2>/dev/null)

  if [[ -n "$slug" ]]; then
    TAG_SLUGS["$name"]="$slug"
    echo "  Created tag: $name -> $slug"
    return
  fi

  # Tag may already exist — resolve from the full list
  local all_tags
  all_tags=$(api GET /api/v1/tags 2>/dev/null)
  slug=$(echo "$all_tags" | jq -r --arg n "$name" '.[] | select(.name == $n) | .slug' 2>/dev/null)

  if [[ -n "$slug" ]]; then
    TAG_SLUGS["$name"]="$slug"
    echo "  Tag already exists: $name -> $slug"
  else
    echo "  Warning: Failed to create or find tag '$name'" >&2
  fi
}

echo ""
echo "Creating tags ..."

create_tag "Playback"      "0E8A16"
create_tag "UI/UX"         "1D76DB"
create_tag "Audio"         "9C27B0"
create_tag "Video"         "E53935"
create_tag "Playlists"     "FF9800"
create_tag "Performance"   "795548"
create_tag "Accessibility" "00BCD4"
create_tag "Plugins"       "607D8B"
create_tag "File Formats"  "CDDC39"

# ── Create posts and assign tags ─────────────────────────────────────────────
post_count=0
skipped_count=0
tag_assign_count=0

create_post() {
  local title="$1" description="$2"
  shift 2
  local tags=("$@")

  # Check if a post with the same title already exists
  local encoded_title
  encoded_title=$(jq -rn --arg t "$title" '$t | @uri')
  local existing
  existing=$(api GET "/api/v1/posts?query=$encoded_title&limit=50" 2>/dev/null) || true
  local existing_number
  existing_number=$(echo "$existing" | jq -r --arg t "$title" '[.[] | select(.title == $t)] | first | .number // empty' 2>/dev/null)

  local number
  if [[ -n "$existing_number" ]]; then
    number="$existing_number"
    echo "  Post already exists: #$number: $title"
    skipped_count=$((skipped_count + 1))
  else
    local payload
    payload=$(jq -n --arg t "$title" --arg d "$description" '{title: $t, description: $d}')

    local response
    response=$(api POST /api/v1/posts -d "$payload" 2>/dev/null) || true

    number=$(echo "$response" | jq -r '.number // empty' 2>/dev/null)

    if [[ -z "$number" ]]; then
      echo "  Error: Failed to create post '$title'" >&2
      return
    fi

    echo "  #$number: $title"
    post_count=$((post_count + 1))
  fi

  # Assign tags
  for tag_name in "${tags[@]}"; do
    local slug="${TAG_SLUGS[$tag_name]:-}"
    if [[ -z "$slug" ]]; then
      echo "    Warning: No slug for tag '$tag_name', skipping" >&2
      continue
    fi
    api POST "/api/v1/posts/$number/tags/$slug" -d '{}' >/dev/null 2>/dev/null || true
    tag_assign_count=$((tag_assign_count + 1))
  done
}

echo ""
echo "Creating posts ..."

create_post \
  "Support picture-in-picture mode for videos" \
  "It would be great to have a PiP mode so I can keep watching a video while browsing other apps or working. Most modern players support this and it's become essential for multitasking." \
  "Video" "UI/UX"

create_post \
  "Add gapless playback for music albums" \
  "When listening to live albums or concept records, the gap between tracks is really jarring. Gapless playback would make the experience so much smoother for albums that are meant to flow together." \
  "Playback" "Audio"

create_post \
  "Reduce memory usage when playing long playlists" \
  "I have playlists with 2,000+ songs and BestPlayer's memory usage balloons over time. After a few hours it starts to stutter. Would love to see some optimization for large queues." \
  "Performance" "Playlists"

create_post \
  "Add keyboard shortcuts for all major actions" \
  "I rely heavily on keyboard navigation for accessibility reasons. Having configurable shortcuts for play/pause, next/prev, volume, and seek would make BestPlayer much more usable for me." \
  "Accessibility" "UI/UX"

create_post \
  "Support FLAC and ALAC lossless audio formats" \
  "I have a large lossless music library in FLAC and ALAC. Right now I have to convert everything to MP3 which defeats the purpose. Native lossless support would be a huge win for audiophiles." \
  "File Formats" "Audio"

create_post \
  "Add a 10-band equalizer" \
  "The built-in audio settings are too basic. A proper 10-band EQ with presets and custom profiles would let me fine-tune the sound for different headphones and speakers." \
  "Audio"

create_post \
  "Dark mode support across the entire interface" \
  "Some parts of the UI already have dark backgrounds but the settings pages and dialogs are still bright white. A consistent dark mode that covers every screen would reduce eye strain, especially at night." \
  "UI/UX" "Accessibility"

create_post \
  "Add smart playlists based on listening history" \
  "I'd love auto-generated playlists like 'Most Played This Month' or 'Recently Added'. Smart playlists that update dynamically based on my listening habits would save me a lot of manual curation." \
  "Playlists"

create_post \
  "Plugin API for community extensions" \
  "A well-documented plugin API would let the community build extensions for things like scrobbling, lyrics, and custom visualizers. This would make BestPlayer infinitely more versatile without bloating the core app." \
  "Plugins"

create_post \
  "Support AV1 and VP9 video codecs" \
  "More and more content is being encoded in AV1 and VP9 for better compression. BestPlayer currently can't play these files so I have to fall back to VLC. Native support would be really appreciated." \
  "File Formats" "Video"

create_post \
  "Hardware-accelerated video decoding" \
  "Playing 4K video causes my CPU to spike to 100%. Enabling hardware-accelerated decoding via VAAPI, NVDEC, or VideoToolbox would drastically improve performance and battery life on laptops." \
  "Performance" "Video"

create_post \
  "Add subtitle support with customizable appearance" \
  "I watch a lot of foreign films and need subtitle support. Being able to adjust font size, color, and position would be essential for accessibility and personal preference." \
  "Video" "Accessibility"

create_post \
  "Drag-and-drop to reorder playlist items" \
  "Currently the only way to reorder a playlist is to remove and re-add items. Simple drag-and-drop reordering would make playlist management so much faster and more intuitive." \
  "Playlists" "UI/UX"

create_post \
  "Crossfade between tracks" \
  "Adding a configurable crossfade option (even just 2-5 seconds) would make transitions between songs much smoother, especially for party playlists where silence between tracks kills the vibe." \
  "Playback" "Audio"

create_post \
  "Speed control for audio and video playback" \
  "I often listen to podcasts at 1.5x and slow down tutorial videos to 0.75x. A playback speed control with presets from 0.5x to 2x would be incredibly useful for different content types." \
  "Playback"

create_post \
  "Visualizer plugin for audio spectrum display" \
  "A real-time audio visualizer showing the frequency spectrum or waveform would be a fun addition. Ideally it could be built as a plugin so users who don't want it aren't affected." \
  "Plugins" "Audio"

create_post \
  "Remember playback position for long files" \
  "When I close BestPlayer while watching a long video or audiobook, I lose my position and have to scrub through to find where I was. Automatic position bookmarking for files over 10 minutes would be very helpful." \
  "Playback" "Video"

create_post \
  "Support M3U and PLS playlist import/export" \
  "I have years of curated playlists in M3U format from other players. Being able to import and export M3U and PLS files would make migrating to BestPlayer painless." \
  "Playlists" "File Formats"

# ── Duplicate-ish posts (same intent, different wording) ─────────────────────

create_post \
  "Please add PiP mode" \
  "I really need a floating video window so I can keep watching while I do other stuff on my computer. Would be amazing for tutorials and streams." \
  "Video" "UI/UX"

create_post \
  "Seamless transitions between album tracks" \
  "Listening to Dark Side of the Moon and the silence between tracks completely ruins it. Can you please make tracks blend into each other without a gap? Every decent player has this." \
  "Playback" "Audio"

create_post \
  "FLAC file support please!" \
  "I'm an audiophile and all my music is in FLAC format. It's frustrating that I can't play any of it in BestPlayer. This is the only thing keeping me from switching from foobar2000." \
  "File Formats" "Audio"

create_post \
  "Consistent dark theme everywhere" \
  "Love the dark mode in the main player view but the preferences dialog and the file browser are blindingly white. Can you please make dark mode apply everywhere? My eyes hurt at 2am." \
  "UI/UX" "Accessibility"

create_post \
  "Let me control playback with keyboard" \
  "I use BestPlayer while coding and reaching for the mouse every time I want to skip a track or adjust volume is annoying. Spacebar for play/pause and arrow keys for seek would be a game changer." \
  "Accessibility" "UI/UX"

# ── Summary ──────────────────────────────────────────────────────────────────
echo ""
echo "Done! Created $post_count posts, skipped $skipped_count existing, with $tag_assign_count tag assignments."
echo "Tags: ${!TAG_SLUGS[*]}"
