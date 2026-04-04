# Skill Package Upload API

## `POST /api/skills/upload`

Upload a new skill package or update an existing one.

### Authentication

**Required.** You must be logged in via Supabase Auth. Include session cookies.

### Request

- **Content-Type:** `multipart/form-data`
- **Max total size:** 5 MB
- **Max files per upload:** 20
- **Max individual file size:** 1 MB

### Required Files

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `skill.json` | File | ✅ | Skill manifest (JSON) |
| `SKILL.md` | File | ❌ | Skill documentation (Markdown) |
| `icon.svg` | File | ❌ | Skill icon (SVG/PNG) |
| *(other files)* | File | ❌ | Scripts, configs, etc. |

### skill.json Schema

```json
{
  "name": "string (required, max 200 chars for description)",
  "version": "string (required, semver e.g. 1.0.0)",
  "description": "string (required, max 200 chars)",
  "longDescription": "string (optional)",
  "author": "string (required)",
  "license": "string (required)",
  "category": "string (required, see valid categories below)",
  "pricingModel": "string (required: free|paid|freemium|subscription)",
  "tags": ["string"] (required, array),
  "features": ["string"] (optional, array),
  "homepage": "string (optional, URL)",
  "repository": "string (optional, URL)",
  "icon": "string (optional, default: icon.svg)",
  "runtime": { "node": ">=18.0.0" } (optional),
  "entrypoint": "string (optional)"
}
```

### Valid Categories

`automation`, `development`, `finance`, `marketing`, `research-analysis`, `customer-support`, `security`, `productivity`, `content`, `trading`, `data-analysis`, `education`, `healthcare`, `legal`, `other`

### Allowed File Extensions

`.md`, `.json`, `.js`, `.ts`, `.sh`, `.py`, `.yaml`, `.yml`, `.toml`, `.svg`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.ico`, `.txt`

### Response

#### 201 Created
```json
{
  "slug": "my-awesome-agent",
  "manifest": {
    "name": "My Awesome Agent",
    "version": "1.0.0",
    "description": "Does awesome things",
    "category": "automation",
    "pricingModel": "free",
    "tags": ["automation", "ai"]
  },
  "files": ["skill.json", "SKILL.md", "icon.svg", "scripts/main.sh"],
  "totalSize": 12345,
  "message": "Skill package 'my-awesome-agent' uploaded successfully"
}
```

#### 400 Bad Request
```json
{
  "error": "Invalid skill.json manifest",
  "details": ["Missing required field: version", "Invalid pricingModel: premium"]
}
```

#### 401 Unauthorized
```json
{ "error": "Authentication required" }
```

#### 409 Conflict
```json
{ "error": "A skill package with this name already exists from a different author" }
```

#### 413 Payload Too Large
```json
{ "error": "Upload too large. Maximum total size is 5 MB" }
```

### Example (cURL)

```bash
curl -X POST https://your-domain.com/api/skills/upload \
  -H "Cookie: your-session-cookie" \
  -F "skill.json=@./skill.json" \
  -F "SKILL.md=@./SKILL.md" \
  -F "icon.svg=@./icon.svg" \
  -F "scripts/main.sh=@./scripts/main.sh"
```

### Overwrite Behavior

- If a package with the same slug exists and was uploaded by the same user, it will be **overwritten**.
- If the package was uploaded by a different user, the upload is **rejected** (409).

### Slug Generation

The slug is auto-generated from the manifest `name` field:
- Lowercased
- Non-alphanumeric characters replaced with hyphens
- Leading/trailing hyphens removed
- Must be at least 2 characters
