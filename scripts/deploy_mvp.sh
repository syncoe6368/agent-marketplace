#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# deploy_mvp.sh — Agent Marketplace MVP Deployment Automation
#
# Validates agent skill packages, builds the marketplace index, generates an
# API manifest for package distribution, and assembles a deployable static
# site structure — all from a single bash script.
#
# Usage:
#   ./scripts/deploy_mvp.sh              # Full build (validate → index → manifest → site)
#   ./scripts/deploy_mvp.sh validate     # Only validate skill packages
#   ./scripts/deploy_mvp.sh index        # Only build marketplace index
#   ./scripts/deploy_mvp.sh manifest     # Only generate API manifest
#   ./scripts/deploy_mvp.sh site         # Only assemble static site
#   ./scripts/deploy_mvp.sh clean        # Remove build artifacts
#   ./scripts/deploy_mvp.sh --help       # Show usage
#
# Requires: bash 4+, jq (optional — graceful fallback)
# ──────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Source directories
PACKAGES_DIR="$PROJECT_DIR/skill-packages"          # Agent skill packages live here
DOCS_DIR="$PROJECT_DIR/docs"                        # Generated documentation
DATA_DIR="$PROJECT_DIR/data"                        # Generated data files

# Build / output directories
BUILD_DIR="$PROJECT_DIR/.build"
SITE_DIR="$BUILD_DIR/site"
INDEX_DIR="$BUILD_DIR/index"
MANIFEST_DIR="$BUILD_DIR/manifest"

# Output files
MARKETPLACE_INDEX="$INDEX_DIR/marketplace.json"
API_MANIFEST="$MANIFEST_DIR/api-manifest.json"
CATEGORIES_INDEX="$INDEX_DIR/categories.json"
SITEMAP="$SITE_DIR/sitemap.xml"
ROBOTS="$SITE_DIR/robots.txt"

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'

log_info()    { echo -e "${BLUE}[INFO]${NC}  $1"; }
log_ok()      { echo -e "${GREEN}[OK]${NC}    $1"; }
log_warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; }
log_section() { echo -e "\n${CYAN}━━━ $1 ━━━${NC}"; }

# ── Counters ──────────────────────────────────────────────────────────────────
VALID_PKGS=0
INVALID_PKGS=0
TOTAL_PKGS=0

# ── Usage ─────────────────────────────────────────────────────────────────────
show_help() {
    cat <<'HELP'
deploy_mvp.sh — Agent Marketplace MVP Deployment Automation

USAGE:
  ./scripts/deploy_mvp.sh [command]

COMMANDS:
  (none)      Full pipeline: validate → index → manifest → site
  validate    Validate all skill packages in skill-packages/
  index       Build marketplace index + categories index
  manifest    Generate API manifest for skill package distribution
  site        Assemble deployable static site structure
  clean       Remove .build/ artifacts
  help        Show this help message

STRUCTURE:
  skill-packages/
    my-agent/
      skill.json          # Package metadata (required)
      SKILL.md            # Documentation (required)
      icon.svg            # Package icon (optional)
      scripts/            # Helper scripts (optional)
      examples/           # Usage examples (optional)
      references/         # Reference docs (optional)

skill.json schema:
  {
    "name": "string (required)",
    "slug": "string (auto-generated if missing)",
    "version": "semver string (required)",
    "description": "string (required, max 200 chars)",
    "longDescription": "string (optional)",
    "author": "string (required)",
    "license": "string (required)",
    "category": "string (required, must exist)",
    "pricingModel": "free|paid|freemium|subscription",
    "price": "number (if not free)",
    "currency": "string (default USD)",
    "tags": ["string"],
    "homepage": "url string",
    "repository": "url string",
    "apiDocs": "url string",
    "icon": "relative path to icon file",
    "features": ["string"],
    "dependencies": { "name": "version" },
    "runtime": { "node": ">=18", "python": ">=3.10" },
    "entrypoint": "string — main script/command"
  }

REQUIRES: bash 4+, jq (optional — used for pretty JSON)
HELP
}

# ── Utility Functions ─────────────────────────────────────────────────────────

# Check if jq is available; if not, use a minimal Python fallback for JSON.
has_jq() { command -v jq &>/dev/null; }

# Pretty-print JSON. Prefers jq, falls back to python3 -m json.tool.
json_pretty() {
    if has_jq; then
        jq '.' 2>/dev/null
    elif command -v python3 &>/dev/null; then
        python3 -m json.tool
    else
        cat  # Last resort — raw output
    fi
}

# Minimal JSON key extractor (no jq needed).
# Usage: json_get '{"key":"value"}' "key"
json_get() {
    local json="$1" key="$2"
    # Bash-native approach: grep + sed
    echo "$json" | grep -o "\"$key\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" \
        | head -1 | sed 's/.*:[[:space:]]*"\(.*\)"/\1/'
}

json_get_raw() {
    local json="$1" key="$2"
    echo "$json" | grep -o "\"$key\"[[:space:]]*:[[:space:]]*[^,}]*" \
        | head -1 | sed 's/.*:[[:space:]]*//'
}

# Validate a semver string (major.minor.patch)
is_semver() {
    [[ "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?(\+[a-zA-Z0-9.]+)?$ ]]
}

# Validate a URL
is_url() {
    [[ "$1" =~ ^https?:// ]]
}

# Generate a URL-safe slug from a name
slugify() {
    echo "$1" | tr '[:upper:]' '[:lower:]' \
        | sed 's/[^a-z0-9]+/-/g' \
        | sed 's/^-//;s/-$//'
}

# ── Step 1: Validate Agent Skill Packages ────────────────────────────────────

# Known categories (from Supabase seed + schema)
VALID_CATEGORIES=(
    automation
    research-analysis
    customer-support
    development
    marketing
    finance
)

validate_packages() {
    log_section "Step 1: Validating Agent Skill Packages"
    
    if [[ ! -d "$PACKAGES_DIR" ]]; then
        log_warn "No skill-packages/ directory found at $PACKAGES_DIR"
        log_info "Creating empty skill-packages/ directory with a template..."
        mkdir -p "$PACKAGES_DIR"
        create_template_package
        TOTAL_PKGS=0
        return 0
    fi
    
    # Find all subdirectories that might be packages
    local pkg_dirs=()
    while IFS= read -r -d '' dir; do
        pkg_dirs+=("$dir")
    done < <(find "$PACKAGES_DIR" -mindepth 1 -maxdepth 1 -type d -print0 | sort -z)
    
    if [[ ${#pkg_dirs[@]} -eq 0 ]]; then
        log_warn "No skill packages found in $PACKAGES_DIR"
        log_info "Creating a template package..."
        create_template_package
        TOTAL_PKGS=0
        return 0
    fi
    
    TOTAL_PKGS=${#pkg_dirs[@]}
    VALID_PKGS=0
    INVALID_PKGS=0
    
    for pkg_dir in "${pkg_dirs[@]}"; do
        local pkg_name
        pkg_name="$(basename "$pkg_dir")"
        validate_single_package "$pkg_dir" "$pkg_name" || true
    done
    
    echo ""
    log_info "Validation complete: $VALID_PKGS/$TOTAL_PKGS packages valid, $INVALID_PKGS invalid"
    
    if [[ $INVALID_PKGS -gt 0 ]]; then
        log_warn "Some packages failed validation — fix errors before deploying"
    fi
    
    return $INVALID_PKGS
}

validate_single_package() {
    local pkg_dir="$1" pkg_name="$2"
    local errors=0
    
    echo -n "  Checking $pkg_name ... "
    
    # ── Required: skill.json ──
    local skill_json="$pkg_dir/skill.json"
    if [[ ! -f "$skill_json" ]]; then
        log_error "MISSING skill.json"
        ((INVALID_PKGS++))
        return 1
    fi
    
    # ── Parse skill.json ──
    local content
    content="$(cat "$skill_json")"
    
    # Validate JSON syntax
    if ! echo "$content" | python3 -c "import json,sys; json.load(sys.stdin)" 2>/dev/null; then
        if has_jq && ! echo "$content" | jq empty 2>/dev/null; then
            log_error "INVALID JSON syntax"
            ((INVALID_PKGS++))
            return 1
        fi
    fi
    
    # ── Required fields ──
    local name version description author license category
    name="$(json_get "$content" "name")"
    version="$(json_get "$content" "version")"
    description="$(json_get "$content" "description")"
    author="$(json_get "$content" "author")"
    license="$(json_get "$content" "license")"
    category="$(json_get "$content" "category")"
    
    if [[ -z "$name" ]]; then
        log_error "MISSING 'name' field"
        ((INVALID_PKGS++)); return 1
    fi
    if [[ -z "$version" ]]; then
        log_error "MISSING 'version' field"
        ((INVALID_PKGS++)); return 1
    fi
    if ! is_semver "$version"; then
        log_error "INVALID 'version' — expected semver (e.g. 1.0.0), got '$version'"
        ((INVALID_PKGS++)); return 1
    fi
    if [[ -z "$description" ]]; then
        log_error "MISSING 'description' field"
        ((INVALID_PKGS++)); return 1
    fi
    if [[ ${#description} -gt 200 ]]; then
        log_error "'description' exceeds 200 chars (${#description})"
        ((INVALID_PKGS++)); return 1
    fi
    if [[ -z "$author" ]]; then
        log_error "MISSING 'author' field"
        ((INVALID_PKGS++)); return 1
    fi
    if [[ -z "$license" ]]; then
        log_error "MISSING 'license' field"
        ((INVALID_PKGS++)); return 1
    fi
    if [[ -z "$category" ]]; then
        log_error "MISSING 'category' field"
        ((INVALID_PKGS++)); return 1
    fi
    
    # ── Validate category ──
    local cat_valid=false
    for vc in "${VALID_CATEGORIES[@]}"; do
        if [[ "$category" == "$vc" ]]; then cat_valid=true; break; fi
    done
    if [[ "$cat_valid" == false ]]; then
        log_error "UNKNOWN category '$category' — valid: ${VALID_CATEGORIES[*]}"
        ((INVALID_PKGS++)); return 1
    fi
    
    # ── Validate pricing model ──
    local pricing_model
    pricing_model="$(json_get "$content" "pricingModel")"
    if [[ -n "$pricing_model" ]]; then
        case "$pricing_model" in
            free|paid|freemium|subscription) ;;
            *) log_error "INVALID pricingModel '$pricing_model'"
               ((INVALID_PKGS++)); return 1 ;;
        esac
    fi
    
    # ── Validate URLs (if present) ──
    local homepage repository api_docs
    homepage="$(json_get "$content" "homepage")"
    repository="$(json_get "$content" "repository")"
    api_docs="$(json_get "$content" "apiDocs")"
    
    for url_field in homepage repository api_docs; do
        local url_val
        url_val="$(json_get "$content" "$url_field")"
        if [[ -n "$url_val" && "$(is_url "$url_val" && echo yes || echo no)" == "no" ]]; then
            log_error "INVALID URL for '$url_field': $url_val"
            ((INVALID_PKGS++)); return 1
        fi
    done
    
    # ── Required: SKILL.md ──
    if [[ ! -f "$pkg_dir/SKILL.md" ]]; then
        log_error "MISSING SKILL.md"
        ((INVALID_PKGS++)); return 1
    fi
    
    # ── Validate icon (if referenced) ──
    local icon_path
    icon_path="$(json_get "$content" "icon")"
    if [[ -n "$icon_path" && ! -f "$pkg_dir/$icon_path" ]]; then
        log_warn "Referenced icon not found: $icon_path (non-fatal)"
    fi
    
    # ── Validate entrypoint (if specified) ──
    local entrypoint
    entrypoint="$(json_get "$content" "entrypoint")"
    if [[ -n "$entrypoint" && ! -f "$pkg_dir/$entrypoint" ]]; then
        log_warn "Referenced entrypoint not found: $entrypoint (non-fatal)"
    fi
    
    # ── All checks passed ──
    log_ok "$name v$version ($category)"
    ((VALID_PKGS++))
}

# Create a template skill package so developers have a reference
create_template_package() {
    local tpl_dir="$PACKAGES_DIR/_template"
    mkdir -p "$tpl_dir/scripts" "$tpl_dir/examples"
    
    cat > "$tpl_dir/skill.json" <<'TPL'
{
  "name": "my-agent-skill",
  "version": "0.1.0",
  "description": "A brief description of the agent skill (max 200 chars)",
  "longDescription": "A detailed explanation of what this agent does, how it works, and what problems it solves.",
  "author": "Your Name <email@example.com>",
  "license": "MIT",
  "category": "automation",
  "pricingModel": "free",
  "tags": ["automation", "ai", "productivity"],
  "homepage": "https://github.com/yourname/my-agent-skill",
  "repository": "https://github.com/yourname/my-agent-skill",
  "icon": "icon.svg",
  "features": [
    "Feature one — what it does",
    "Feature two — another capability"
  ],
  "runtime": {
    "node": ">=18.0.0"
  },
  "entrypoint": "scripts/main.sh"
}
TPL

    cat > "$tpl_dir/SKILL.md" <<'TPL'
# My Agent Skill

> Brief tagline for this skill.

## Overview

Describe what this agent skill does and why someone would use it.

## Features

- **Feature One** — Description
- **Feature Two** — Description

## Installation

\`\`\`bash
# Clone or download this skill package
\`\`\`

## Usage

\`\`\`bash
# Run the agent
./scripts/main.sh
\`\`\`

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `API_KEY` | Your API key | — |

## License

MIT
TPL

    # Minimal SVG icon placeholder
    cat > "$tpl_dir/icon.svg" <<'TPL'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="12" fill="#6366f1"/>
  <text x="50" y="62" text-anchor="middle" font-size="40" fill="white" font-family="sans-serif">🤖</text>
</svg>
TPL

    cat > "$tpl_dir/scripts/main.sh" <<'TPL'
#!/usr/bin/env bash
# Main entrypoint for the agent skill
set -euo pipefail
echo "Hello from my-agent-skill!"
TPL
    chmod +x "$tpl_dir/scripts/main.sh"

    log_ok "Template package created at $tpl_dir"
}

# ── Step 2: Create Marketplace Index ─────────────────────────────────────────

build_index() {
    log_section "Step 2: Building Marketplace Index"
    
    mkdir -p "$INDEX_DIR"
    
    # Delegate to Python for reliable multi-line JSON parsing.
    # Python reads all skill.json files, builds the index, and writes output.
    python3 << 'PYEOF'
import json, os, sys, re
from datetime import datetime, timezone

PACKAGES_DIR = os.environ.get("PACKAGES_DIR", "skill-packages")
INDEX_DIR = os.environ.get("INDEX_DIR", ".build/index")
PROJECT_DIR = os.environ.get("PROJECT_DIR", ".")
MARKETPLACE_INDEX = os.path.join(INDEX_DIR, "marketplace.json")
CATEGORIES_INDEX = os.path.join(INDEX_DIR, "categories.json")

os.makedirs(INDEX_DIR, exist_ok=True)

def slugify(name):
    s = name.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = s.strip('-')
    return s

agents = []
categories = {}

if os.path.isdir(PACKAGES_DIR):
    for pkg_name in sorted(os.listdir(PACKAGES_DIR)):
        if pkg_name.startswith('_'):
            continue
        pkg_dir = os.path.join(PACKAGES_DIR, pkg_name)
        if not os.path.isdir(pkg_dir):
            continue

        skill_json = os.path.join(pkg_dir, "skill.json")
        if not os.path.isfile(skill_json):
            continue

        try:
            with open(skill_json) as f:
                data = json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            print(f"  [WARN] Skipping {pkg_name}: {e}")
            continue

        name = data.get("name", "")
        version = data.get("version", "")
        if not name or not version:
            print(f"  [WARN] Skipping {pkg_name}: missing name or version")
            continue

        slug = data.get("slug") or slugify(name)
        now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        agent = {
            "id": slug,
            "name": name,
            "slug": slug,
            "version": version,
            "description": data.get("description", ""),
            "longDescription": data.get("longDescription", ""),
            "author": data.get("author", ""),
            "license": data.get("license", ""),
            "category": data.get("category", ""),
            "pricingModel": data.get("pricingModel", "free"),
            "price": data.get("price"),
            "currency": data.get("currency", "USD"),
            "tags": data.get("tags", []),
            "homepage": data.get("homepage", ""),
            "repository": data.get("repository", ""),
            "apiDocs": data.get("apiDocs", ""),
            "icon": data.get("icon", ""),
            "features": data.get("features", []),
            "entrypoint": data.get("entrypoint", ""),
            "runtime": data.get("runtime", {}),
            "packagePath": f"skill-packages/{pkg_name}",
            "createdAt": now,
            "updatedAt": now,
            "status": "active",
            "isVerified": False,
            "isFeatured": False,
        }
        agents.append(agent)

        cat = data.get("category", "")
        if cat:
            if cat not in categories:
                categories[cat] = {"slug": cat, "agentCount": 0, "agents": []}
            categories[cat]["agentCount"] += 1
            categories[cat]["agents"].append(slug)

        print(f"  [OK]    Indexed: {name} v{version}")

# Write marketplace index
now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
index = {
    "schema": "agent-marketplace/v1",
    "generatedAt": now,
    "totalAgents": len(agents),
    "totalCategories": len(categories),
    "agents": agents,
}
with open(MARKETPLACE_INDEX, "w") as f:
    json.dump(index, f, indent=2)
print(f"  [OK]    Marketplace index -> {MARKETPLACE_INDEX}")

# Write categories index
cats_output = {
    "schema": "agent-marketplace/categories/v1",
    "generatedAt": now,
    "categories": [
        {
            "name": k.replace("-", " ").title(),
            "slug": v["slug"],
            "agentCount": v["agentCount"],
            "agents": v["agents"],
        }
        for k, v in sorted(categories.items())
    ],
}
with open(CATEGORIES_INDEX, "w") as f:
    json.dump(cats_output, f, indent=2)
print(f"  [OK]    Categories index -> {CATEGORIES_INDEX}")

print(f"  [INFO]  Total: {len(agents)} agents, {len(categories)} categories")
PYEOF
}

# ── Step 3: Generate API Manifest ────────────────────────────────────────────

generate_manifest() {
    log_section "Step 3: Generating API Manifest"
    
    mkdir -p "$MANIFEST_DIR"
    
    # The manifest describes how to fetch/distribute skill packages
    # It acts as the API surface for a static CDN or simple API server
    local manifest
    manifest="$(python3 -c "
import json, os, sys

# Load marketplace index if it exists
index_path = '$MARKETPLACE_INDEX'
agents = []
total_agents = 0
if os.path.exists(index_path):
    with open(index_path) as f:
        idx = json.load(f)
        agents = idx.get('agents', [])
        total_agents = idx.get('totalAgents', len(agents))

# Build manifest
manifest = {
    'schema': 'agent-marketplace/api-manifest/v1',
    'generatedAt': '$(date -u +%Y-%m-%dT%H:%M:%SZ)',
    'marketplace': {
        'name': 'Syncoe Agent Marketplace',
        'version': '1.0.0',
        'description': 'AI Agent skill package distribution manifest',
        'baseUrl': 'https://agent-marketplace.syncoe.com',
    },
    'endpoints': {
        'index': '/api/v1/index.json',
        'categories': '/api/v1/categories.json',
        'agent': '/api/v1/agents/{slug}.json',
        'agentDownload': '/api/v1/agents/{slug}/download',
        'search': '/api/v1/search?q={query}&category={category}',
        'health': '/api/v1/health'
    },
    'packages': [],
    'statistics': {
        'totalAgents': total_agents,
        'totalCategories': len(set(a['category'] for a in agents)),
        'pricingBreakdown': {},
        'categoryBreakdown': {}
    }
}

# Build package entries for distribution
for agent in agents:
    pkg = {
        'slug': agent['slug'],
        'name': agent['name'],
        'version': agent['version'],
        'description': agent['description'],
        'author': agent['author'],
        'license': agent['license'],
        'category': agent['category'],
        'pricingModel': agent['pricingModel'],
        'price': agent.get('price'),
        'currency': agent.get('currency', 'USD'),
        'tags': agent.get('tags', []),
        'features': agent.get('features', []),
        'downloadUrl': f\"/api/v1/agents/{agent['slug']}/download\",
        'detailUrl': f\"/api/v1/agents/{agent['slug']}.json\",
        'docsUrl': f\"/skill-packages/{agent['slug']}/SKILL.md\",
        'packagePath': agent.get('packagePath', f\"skill-packages/{agent['slug']}\"),
        'sizeBytes': 0,
        'checksum': None
    }
    
    # Calculate package size
    pkg_dir = os.path.join('$PROJECT_DIR', agent.get('packagePath', ''))
    if os.path.isdir(pkg_dir):
        total_size = 0
        for root, dirs, files in os.walk(pkg_dir):
            for fname in files:
                fpath = os.path.join(root, fname)
                if os.path.isfile(fpath):
                    total_size += os.path.getsize(fpath)
        pkg['sizeBytes'] = total_size
    
    manifest['packages'].append(pkg)
    
    # Pricing breakdown
    pm = agent['pricingModel']
    manifest['statistics']['pricingBreakdown'][pm] = manifest['statistics']['pricingBreakdown'].get(pm, 0) + 1
    
    # Category breakdown
    cat = agent['category']
    manifest['statistics']['categoryBreakdown'][cat] = manifest['statistics']['categoryBreakdown'].get(cat, 0) + 1

print(json.dumps(manifest, indent=2))
" 2>/dev/null)"
    
    echo "$manifest" > "$API_MANIFEST"
    log_ok "API manifest → $API_MANIFEST"
    
    # Also copy index files into manifest dir (they serve as the API response)
    if [[ -f "$MARKETPLACE_INDEX" ]]; then
        cp "$MARKETPLACE_INDEX" "$MANIFEST_DIR/index.json"
        log_ok "API index → $MANIFEST_DIR/index.json"
    fi
    if [[ -f "$CATEGORIES_INDEX" ]]; then
        cp "$CATEGORIES_INDEX" "$MANIFEST_DIR/categories.json"
        log_ok "API categories → $MANIFEST_DIR/categories.json"
    fi
    
    # Generate per-agent detail files
    if [[ -f "$MARKETPLACE_INDEX" ]]; then
        mkdir -p "$MANIFEST_DIR/agents"
        python3 -c "
import json, os, sys
with open('$MARKETPLACE_INDEX') as f:
    idx = json.load(f)
for agent in idx.get('agents', []):
    slug = agent['slug']
    detail_path = os.path.join('$MANIFEST_DIR', 'agents', f'{slug}.json')
    with open(detail_path, 'w') as f:
        json.dump(agent, f, indent=2)
    print(f'  → agents/{slug}.json')
" 2>/dev/null
        log_ok "Per-agent detail files → $MANIFEST_DIR/agents/"
    fi
    
    # Generate health endpoint
    local health_json
    health_json="$(python3 -c "
import json
print(json.dumps({
    'status': 'ok',
    'timestamp': '$(date -u +%Y-%m-%dT%H:%M:%SZ)',
    'version': '1.0.0'
}, indent=2))
" 2>/dev/null)"
    echo "$health_json" > "$MANIFEST_DIR/health.json"
    log_ok "Health endpoint → $MANIFEST_DIR/health.json"
}

# ── Step 4: Create Deployable Static Site Structure ──────────────────────────

build_site() {
    log_section "Step 4: Assembling Static Site"
    
    mkdir -p "$SITE_DIR"
    
    # ── Copy skill-packages (the actual downloadable content) ──
    if [[ -d "$PACKAGES_DIR" ]]; then
        mkdir -p "$SITE_DIR/skill-packages"
        # Copy each package individually (skip _template)
        while IFS= read -r -d '' pkg_dir; do
            local pkg_name
            pkg_name="$(basename "$pkg_dir")"
            [[ "$pkg_name" == "_template" ]] && continue
            cp -r "$pkg_dir" "$SITE_DIR/skill-packages/$pkg_name"
        done < <(find "$PACKAGES_DIR" -mindepth 1 -maxdepth 1 -type d -print0 | sort -z)
        log_ok "Skill packages → site/skill-packages/"
    fi
    
    # ── Copy API manifest files as static API responses ──
    mkdir -p "$SITE_DIR/api/v1"
    if [[ -f "$MANIFEST_DIR/api-manifest.json" ]]; then
        cp "$MANIFEST_DIR/api-manifest.json" "$SITE_DIR/api/v1/"
    fi
    if [[ -f "$MANIFEST_DIR/index.json" ]]; then
        cp "$MANIFEST_DIR/index.json" "$SITE_DIR/api/v1/"
    fi
    if [[ -f "$MANIFEST_DIR/categories.json" ]]; then
        cp "$MANIFEST_DIR/categories.json" "$SITE_DIR/api/v1/"
    fi
    if [[ -f "$MANIFEST_DIR/health.json" ]]; then
        cp "$MANIFEST_DIR/health.json" "$SITE_DIR/api/v1/"
    fi
    # Per-agent detail files
    if [[ -d "$MANIFEST_DIR/agents" ]]; then
        cp -r "$MANIFEST_DIR/agents" "$SITE_DIR/api/v1/"
    fi
    log_ok "API endpoints → site/api/v1/"
    
    # ── Copy generated index/docs ──
    if [[ -f "$MARKETPLACE_INDEX" ]]; then
        mkdir -p "$SITE_DIR/_index"
        cp "$MARKETPLACE_INDEX" "$SITE_DIR/_index/"
        log_ok "Marketplace index → site/_index/"
    fi
    if [[ -f "$CATEGORIES_INDEX" ]]; then
        mkdir -p "$SITE_DIR/_index"
        cp "$CATEGORIES_INDEX" "$SITE_DIR/_index/"
    fi
    
    # ── Generate sitemap.xml ──
    generate_sitemap
    
    # ── Generate robots.txt ──
    cat > "$ROBOTS" <<'ROBOTS'
User-agent: *
Allow: /
Disallow: /api/v1/agents/*/download

Sitemap: /sitemap.xml
ROBOTS
    log_ok "robots.txt → site/robots.txt"
    
    # ── Generate index.html (landing page for the static site) ──
    generate_landing_page
    
    # ── Generate a README for the build ──
    cat > "$SITE_DIR/README.md" <<README
# Agent Marketplace — Static Site Build

Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)

## Directory Structure

\`\`\`
site/
├── index.html              # Landing page
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Crawler directives
├── api/v1/                 # Static API responses
│   ├── index.json          # Full agent index
│   ├── categories.json     # Category listing
│   ├── api-manifest.json   # Distribution manifest
│   ├── health.json         # Health check
│   └── agents/             # Per-agent detail JSON
├── skill-packages/         # Downloadable skill packages
│   └── <slug>/
│       ├── skill.json      # Package metadata
│       ├── SKILL.md        # Documentation
│       ├── icon.svg        # Icon
│       ├── scripts/        # Helper scripts
│       └── examples/       # Usage examples
└── _index/                 # Raw index data
\`\`\`

## Deployment

This directory can be deployed to any static hosting:
- **Vercel**: \`vercel --prod\`
- **Netlify**: Drag & drop or CLI
- **GitHub Pages**: Push to \`gh-pages\` branch
- **Cloudflare Pages**: Connect repo
- **AWS S3 + CloudFront**: Upload with \`aws s3 sync\`

## API Endpoints (Static)

All responses are pre-generated JSON files.

| Endpoint | Description |
|----------|-------------|
| \`/api/v1/index.json\` | Full marketplace index |
| \`/api/v1/categories.json\` | All categories |
| \`/api/v1/api-manifest.json\` | Distribution manifest |
| \`/api/v1/agents/{slug}.json\` | Single agent detail |
| \`/api/v1/health.json\` | Health check |

README
    log_ok "Build README → site/README.md"
    
    # ── Print summary ──
    echo ""
    log_info "Static site structure:"
    find "$SITE_DIR" -type f | sort | sed "s|$SITE_DIR|  site/|"
    
    # ── File count and size ──
    local file_count total_size
    file_count="$(find "$SITE_DIR" -type f | wc -l)"
    total_size="$(du -sh "$SITE_DIR" | cut -f1)"
    echo ""
    log_info "Build summary: $file_count files, $total_size total"
}

generate_sitemap() {
    local base_url="https://agent-marketplace.syncoe.com"
    local today
    today="$(date -u +%Y-%m-%d)"
    
    {
        echo '<?xml version="1.0" encoding="UTF-8"?>'
        echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        echo "  <url><loc>${base_url}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>"
        echo "  <url><loc>${base_url}/api/v1/index.json</loc><changefreq>daily</changefreq><priority>0.8</priority></url>"
        echo "  <url><loc>${base_url}/api/v1/categories.json</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>"
        echo "  <url><loc>${base_url}/api/v1/api-manifest.json</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>"
        
        # Add agent detail pages
        if [[ -f "$MARKETPLACE_INDEX" ]]; then
            python3 -c "
import json
with open('$MARKETPLACE_INDEX') as f:
    idx = json.load(f)
for agent in idx.get('agents', []):
    slug = agent['slug']
    print(f'  <url><loc>$base_url/api/v1/agents/{slug}.json</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>')
    print(f'  <url><loc>$base_url/skill-packages/{slug}/SKILL.md</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>')
" 2>/dev/null
        fi
        
        echo '</urlset>'
    } > "$SITEMAP"
    
    log_ok "sitemap.xml → site/sitemap.xml"
}

generate_landing_page() {
    local agent_count=0
    if [[ -f "$MARKETPLACE_INDEX" ]]; then
        agent_count="$(python3 -c "
import json
with open('$MARKETPLACE_INDEX') as f:
    print(json.load(f).get('totalAgents', 0))
" 2>/dev/null)"
    fi
    
    # Build agent cards HTML
    local agent_cards=""
    if [[ -f "$MARKETPLACE_INDEX" ]] && [[ $agent_count -gt 0 ]]; then
        agent_cards="$(python3 -c "
import json, html
with open('$MARKETPLACE_INDEX') as f:
    idx = json.load(f)
cards = []
for a in idx.get('agents', []):
    badge = f'<span class=\"badge badge-{a[\"pricingModel\"]}\">{a[\"pricingModel\"]}</span>'
    tags = ' '.join(f'<span class=\"tag\">{html.escape(t)}</span>' for t in a.get('tags', [])[:5])
    cards.append(f'''
    <div class=\"agent-card\">
        <div class=\"agent-header\">
            <h3>{html.escape(a[\"name\"])}</h3>
            {badge}
        </div>
        <p class=\"agent-desc\">{html.escape(a[\"description\"])}</p>
        <div class=\"agent-meta\">
            <span class=\"meta\">v{html.escape(a[\"version\"])}</span>
            <span class=\"meta\">by {html.escape(a[\"author\"])}</span>
            <span class=\"meta\">{html.escape(a[\"category\"])}</span>
        </div>
        <div class=\"agent-tags\">{tags}</div>
        <div class=\"agent-actions\">
            <a href=\"/api/v1/agents/{a[\"slug\"]}.json\" class=\"btn btn-primary\">View Details</a>
            <a href=\"/skill-packages/{a[\"slug\"]}/SKILL.md\" class=\"btn btn-secondary\">Documentation</a>
        </div>
    </div>''')
print('\\n'.join(cards))
" 2>/dev/null)"
    else
        agent_cards='<div class="empty-state"><p>No agent packages yet. Add skill packages to <code>skill-packages/</code> and run <code>./scripts/deploy_mvp.sh</code></p></div>'
    fi
    
    cat > "$SITE_DIR/index.html" <<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Syncoe Agent Marketplace</title>
    <meta name="description" content="Discover, browse, and deploy AI agent skills. The open marketplace for agent packages.">
    <meta property="og:title" content="Syncoe Agent Marketplace">
    <meta property="og:description" content="Discover, browse, and deploy AI agent skills.">
    <meta property="og:type" content="website">
    <link rel="sitemap" href="/sitemap.xml">
    <style>
        :root {
            --bg: #0a0a0f;
            --surface: #12121a;
            --surface-2: #1a1a26;
            --border: #2a2a3a;
            --text: #e4e4e7;
            --text-muted: #71717a;
            --primary: #6366f1;
            --primary-hover: #818cf8;
            --green: #22c55e;
            --yellow: #eab308;
            --blue: #3b82f6;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        header {
            border-bottom: 1px solid var(--border);
            padding: 1rem 0;
            position: sticky;
            top: 0;
            background: var(--bg);
            z-index: 100;
        }
        .nav { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.25rem; font-weight: 700; color: var(--primary); text-decoration: none; }
        .nav-links { display: flex; gap: 1.5rem; }
        .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; }
        .nav-links a:hover { color: var(--text); }
        .hero {
            text-align: center;
            padding: 4rem 0 3rem;
        }
        .hero h1 { font-size: 2.5rem; margin-bottom: 1rem; background: linear-gradient(135deg, var(--primary), var(--green)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { color: var(--text-muted); max-width: 600px; margin: 0 auto 2rem; font-size: 1.1rem; }
        .hero-stats { display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem; }
        .stat { text-align: center; }
        .stat-value { font-size: 1.75rem; font-weight: 700; color: var(--primary); }
        .stat-label { font-size: 0.85rem; color: var(--text-muted); }
        .section { padding: 2rem 0; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .section-header h2 { font-size: 1.5rem; }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
            gap: 1.25rem;
        }
        .agent-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.5rem;
            transition: border-color 0.2s;
        }
        .agent-card:hover { border-color: var(--primary); }
        .agent-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
        .agent-header h3 { font-size: 1.1rem; }
        .badge {
            font-size: 0.7rem;
            padding: 0.15rem 0.5rem;
            border-radius: 999px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .badge-free { background: rgba(34,197,94,0.15); color: var(--green); }
        .badge-paid { background: rgba(59,130,246,0.15); color: var(--blue); }
        .badge-freemium { background: rgba(234,179,8,0.15); color: var(--yellow); }
        .badge-subscription { background: rgba(99,102,241,0.15); color: var(--primary); }
        .agent-desc { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .agent-meta { display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem; }
        .agent-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
        .tag {
            font-size: 0.75rem;
            padding: 0.1rem 0.5rem;
            background: var(--surface-2);
            border-radius: 4px;
            color: var(--text-muted);
        }
        .agent-actions { display: flex; gap: 0.75rem; }
        .btn {
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.85rem;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s;
        }
        .btn-primary { background: var(--primary); color: white; }
        .btn-primary:hover { background: var(--primary-hover); }
        .btn-secondary { background: var(--surface-2); color: var(--text-muted); border: 1px solid var(--border); }
        .btn-secondary:hover { color: var(--text); border-color: var(--text-muted); }
        .empty-state {
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem;
            color: var(--text-muted);
        }
        .empty-state code { background: var(--surface-2); padding: 0.2rem 0.5rem; border-radius: 4px; }
        .api-section { margin-top: 2rem; }
        .api-table { width: 100%; border-collapse: collapse; }
        .api-table th, .api-table td { text-align: left; padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); }
        .api-table th { color: var(--text-muted); font-size: 0.85rem; font-weight: 500; }
        .api-table code { background: var(--surface-2); padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.85rem; }
        footer {
            border-top: 1px solid var(--border);
            padding: 2rem 0;
            margin-top: 3rem;
            text-align: center;
            color: var(--text-muted);
            font-size: 0.85rem;
        }
        @media (max-width: 768px) {
            .hero h1 { font-size: 1.75rem; }
            .grid { grid-template-columns: 1fr; }
            .hero-stats { gap: 1rem; }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <nav class="nav">
                <a href="/" class="logo">🤖 Agent Marketplace</a>
                <div class="nav-links">
                    <a href="/api/v1/index.json">API</a>
                    <a href="/api/v1/categories.json">Categories</a>
                    <a href="https://github.com/syncoe/agent-marketplace">GitHub</a>
                </div>
            </nav>
        </div>
    </header>
    
    <main class="container">
        <section class="hero">
            <h1>Syncoe Agent Marketplace</h1>
            <p>Discover, browse, and deploy AI agent skill packages. Build better agents, faster.</p>
            <div class="hero-stats">
                <div class="stat">
                    <div class="stat-value">${agent_count}</div>
                    <div class="stat-label">Agent Packages</div>
                </div>
                <div class="stat">
                    <div class="stat-value">6</div>
                    <div class="stat-label">Categories</div>
                </div>
                <div class="stat">
                    <div class="stat-value">REST</div>
                    <div class="stat-label">Static API</div>
                </div>
            </div>
        </section>
        
        <section class="section">
            <div class="section-header">
                <h2>Available Agents</h2>
            </div>
            <div class="grid">
                ${agent_cards}
            </div>
        </section>
        
        <section class="section api-section">
            <div class="section-header">
                <h2>API Endpoints</h2>
            </div>
            <table class="api-table">
                <thead>
                    <tr><th>Endpoint</th><th>Description</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>GET /api/v1/index.json</code></td><td>Full marketplace index with all agents</td></tr>
                    <tr><td><code>GET /api/v1/categories.json</code></td><td>All categories and agent counts</td></tr>
                    <tr><td><code>GET /api/v1/api-manifest.json</code></td><td>Distribution manifest for package management</td></tr>
                    <tr><td><code>GET /api/v1/agents/{slug}.json</code></td><td>Single agent detail metadata</td></tr>
                    <tr><td><code>GET /api/v1/health.json</code></td><td>Health check endpoint</td></tr>
                </tbody>
            </table>
        </section>
    </main>
    
    <footer>
        <div class="container">
            <p>&copy; $(date +%Y) Syncoe — Agent Marketplace v1.0.0</p>
        </div>
    </footer>
</body>
</html>
HTML
    log_ok "index.html → site/index.html"
}

# ── Clean ─────────────────────────────────────────────────────────────────────

clean_build() {
    log_section "Cleaning build artifacts"
    if [[ -d "$BUILD_DIR" ]]; then
        rm -rf "$BUILD_DIR"
        log_ok "Removed $BUILD_DIR"
    else
        log_info "Nothing to clean"
    fi
}

# ── Main ─────────────────────────────────────────────────────────────────────

main() {
    local command="${1:-all}"
    
    case "$command" in
        validate)
            validate_packages
            ;;
        index)
            build_index
            ;;
        manifest)
            generate_manifest
            ;;
        site)
            build_site
            ;;
        clean)
            clean_build
            ;;
        help|--help|-h)
            show_help
            ;;
        all|"")
            echo -e "\n${CYAN}╔══════════════════════════════════════════════════╗${NC}"
            echo -e "${CYAN}║   Agent Marketplace — MVP Deployment Pipeline    ║${NC}"
            echo -e "${CYAN}╚══════════════════════════════════════════════════╝${NC}"
            
            local start_time
            start_time="$(date +%s)"
            
            validate_packages
            build_index
            generate_manifest
            build_site
            
            local end_time elapsed
            end_time="$(date +%s)"
            elapsed=$(( end_time - start_time ))
            
            echo -e "\n${CYAN}╔══════════════════════════════════════════════════╗${NC}"
            echo -e "${CYAN}║          Deployment Pipeline Complete            ║${NC}"
            echo -e "${CYAN}╠══════════════════════════════════════════════════╣${NC}"
            echo -e "${CYAN}║  Packages: ${VALID_PKGS}/${TOTAL_PKGS} valid                           ║${NC}"
            echo -e "${CYAN}║  Time:     ${elapsed}s                                  ║${NC}"
            echo -e "${CYAN}║  Output:   .build/site/                         ║${NC}"
            echo -e "${CYAN}╚══════════════════════════════════════════════════╝${NC}"
            
            if [[ $INVALID_PKGS -gt 0 ]]; then
                log_warn "$INVALID_PKGS package(s) failed validation — review errors above"
                exit 1
            fi
            
            log_ok "MVP ready for deployment! 🚀"
            ;;
        *)
            log_error "Unknown command: $command"
            echo "Run './scripts/deploy_mvp.sh help' for usage"
            exit 1
            ;;
    esac
}

main "$@"
