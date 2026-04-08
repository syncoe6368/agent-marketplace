#!/usr/bin/env python3
"""
Skill Package Linter for Agent Marketplace
Validates skill packages for completeness, correctness, and marketplace readiness.

Usage:
    python skill_package_linter.py [--fix] [package_dir ...]
    
    If no package_dir given, lints all packages in ../skill-packages/
    --fix: Auto-generate missing files where possible (icon.svg placeholder, skill.json from template)
"""

import json
import os
import sys
import argparse
from pathlib import Path
from dataclasses import dataclass, field

# Colors for terminal output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"

# Required fields in skill.json
REQUIRED_FIELDS = ["name", "version", "description", "category", "pricingModel", "author"]

# Recommended fields for marketplace listing quality
RECOMMENDED_FIELDS = [
    "longDescription", "tags", "features", "icon", "entrypoint", 
    "license", "homepage", "repository"
]

# Valid pricing models
VALID_PRICING_MODELS = ["free", "freemium", "paid", "subscription", "pay-per-use"]

# Valid categories
VALID_CATEGORIES = [
    "automation", "marketing", "security", "finance", "trading", 
    "content", "customer-support", "productivity", "developer-tools",
    "data-analysis", "research", "translation", "entertainment"
]


@dataclass
class LintResult:
    package: str
    errors: list = field(default_factory=list)
    warnings: list = field(default_factory=list)
    info: list = field(default_factory=list)
    score: int = 0  # 0-100 marketplace readiness
    fixes_applied: list = field(default_factory=list)

    @property
    def passed(self):
        return len(self.errors) == 0


def check_skill_json(pkg_path: Path, fix: bool = False) -> LintResult:
    """Validate skill.json existence and content."""
    result = LintResult(package=pkg_path.name)
    skill_json_path = pkg_path / "skill.json"
    
    if not skill_json_path.exists():
        if fix:
            # Try to generate from template
            template_path = pkg_path.parent / "_template" / "skill.json"
            if template_path.exists():
                template = json.loads(template_path.read_text())
                template["name"] = pkg_path.name.replace("-", " ").title()
                template["description"] = f"Agent skill package: {pkg_path.name}"
                skill_json_path.write_text(json.dumps(template, indent=2) + "\n")
                result.fixes_applied.append("Generated skill.json from template")
                result.info.append("✨ Auto-generated skill.json from template")
            else:
                result.errors.append("Missing skill.json and no template found")
        else:
            result.errors.append("Missing skill.json — required for marketplace listing")
        return result
    
    try:
        data = json.loads(skill_json_path.read_text())
    except json.JSONDecodeError as e:
        result.errors.append(f"skill.json has invalid JSON: {e}")
        return result
    
    # Check required fields
    for field_name in REQUIRED_FIELDS:
        if field_name not in data or not data[field_name]:
            result.errors.append(f"skill.json missing required field: '{field_name}'")
    
    # Check recommended fields
    for field_name in RECOMMENDED_FIELDS:
        if field_name not in data or not data[field_name]:
            result.warnings.append(f"skill.json missing recommended field: '{field_name}' — improves listing quality")
    
    # Validate pricing model
    pricing = data.get("pricingModel", "")
    if pricing and pricing not in VALID_PRICING_MODELS:
        result.errors.append(f"Invalid pricingModel '{pricing}' — must be one of: {VALID_PRICING_MODELS}")
    
    # Validate description length
    desc = data.get("description", "")
    if len(desc) > 200:
        result.warnings.append(f"Description too long ({len(desc)} chars) — max 200 for card display")
    elif len(desc) < 20:
        result.warnings.append(f"Description too short ({len(desc)} chars) — aim for 50-150 chars for best card display")
    
    # Validate category
    category = data.get("category", "")
    if category and category not in VALID_CATEGORIES:
        result.warnings.append(f"Category '{category}' not in standard list — may hurt discovery: {VALID_CATEGORIES}")
    
    # Check tags
    tags = data.get("tags", [])
    if not tags:
        result.warnings.append("No tags defined — tags improve searchability")
    elif len(tags) < 3:
        result.warnings.append(f"Only {len(tags)} tags — recommend 5-10 for best discoverability")
    
    # Check features
    features = data.get("features", [])
    if not features:
        result.warnings.append("No features listed — features sell the package")
    elif len(features) < 3:
        result.warnings.append(f"Only {len(features)} features — add more to improve conversion")
    
    # Validate paid pricing has price
    if pricing in ("paid", "subscription", "freemium") and not data.get("price"):
        result.warnings.append(f"Pricing model is '{pricing}' but no 'price' field set")
    
    return result


def check_skill_md(pkg_path: Path) -> LintResult:
    """Validate SKILL.md existence and quality."""
    result = LintResult(package=pkg_path.name)
    skill_md_path = pkg_path / "SKILL.md"
    
    if not skill_md_path.exists():
        result.errors.append("Missing SKILL.md — required for install instructions and documentation")
        return result
    
    content = skill_md_path.read_text()
    lines = content.strip().split("\n")
    
    # Check minimum content
    if len(lines) < 10:
        result.warnings.append(f"SKILL.md is thin ({len(lines)} lines) — add more documentation for better conversions")
    
    # Check for essential sections
    essential_sections = ["Quick Start", "Usage", "Features"]
    content_lower = content.lower()
    for section in essential_sections:
        if section.lower() not in content_lower:
            result.warnings.append(f"SKILL.md missing '{section}' section — helps users get started")
    
    # Check for code examples
    if "```" not in content:
        result.warnings.append("SKILL.md has no code examples — add usage examples to improve adoption")
    
    return result


def check_icon(pkg_path: Path, fix: bool = False) -> LintResult:
    """Validate icon existence."""
    result = LintResult(package=pkg_path.name)
    
    # Check if icon is referenced in skill.json
    skill_json_path = pkg_path / "skill.json"
    icon_ref = "icon.svg"
    if skill_json_path.exists():
        try:
            data = json.loads(skill_json_path.read_text())
            icon_ref = data.get("icon", "icon.svg")
        except:
            pass
    
    icon_path = pkg_path / icon_ref
    if not icon_path.exists():
        # Try common alternatives
        for alt in ["icon.svg", "icon.png", "icon.jpg"]:
            if (pkg_path / alt).exists():
                result.info.append(f"Icon found as '{alt}' but skill.json references '{icon_ref}'")
                return result
        
        if fix:
            # Generate a placeholder SVG
            placeholder = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="12" fill="#6366f1"/>
  <text x="32" y="40" text-anchor="middle" fill="white" font-size="28" font-family="system-ui">{pkg_path.name[0].upper()}</text>
</svg>
'''
            (pkg_path / "icon.svg").write_text(placeholder)
            result.fixes_applied.append("Generated placeholder icon.svg")
            result.info.append("✨ Auto-generated placeholder icon.svg")
        else:
            result.warnings.append(f"Missing icon file '{icon_ref}' — listings with icons get 2x more clicks")
    
    return result


def check_scripts(pkg_path: Path) -> LintResult:
    """Validate scripts directory and entrypoint."""
    result = LintResult(package=pkg_path.name)
    
    # Check if entrypoint is defined and exists
    skill_json_path = pkg_path / "skill.json"
    if not skill_json_path.exists():
        return result
    
    try:
        data = json.loads(skill_json_path.read_text())
    except:
        return result
    
    entrypoint = data.get("entrypoint", "")
    if entrypoint:
        entrypoint_path = pkg_path / entrypoint
        if not entrypoint_path.exists():
            result.errors.append(f"Entrypoint '{entrypoint}' referenced in skill.json but file doesn't exist")
        elif not os.access(entrypoint_path, os.X_OK):
            result.warnings.append(f"Entrypoint '{entrypoint}' is not executable — run: chmod +x {entrypoint}")
    
    # Check scripts directory
    scripts_dir = pkg_path / "scripts"
    if scripts_dir.exists():
        scripts = list(scripts_dir.iterdir())
        if not scripts:
            result.warnings.append("scripts/ directory is empty — add at least a main.sh or main.py")
    else:
        if entrypoint:
            result.warnings.append("No scripts/ directory but entrypoint is defined — ensure script paths are correct")
    
    return result


def compute_score(results: list[LintResult]) -> int:
    """Compute marketplace readiness score (0-100)."""
    total_issues = 0
    max_issues = 0  # Maximum possible issues for normalization
    
    for r in results:
        total_issues += len(r.errors) * 10  # Errors are heavy
        total_issues += len(r.warnings) * 3   # Warnings are moderate
    
    # Score inversely proportional to issues found
    # A perfect package scores 100, each issue reduces it
    score = max(0, 100 - total_issues)
    return score


def lint_package(pkg_path: Path, fix: bool = False) -> tuple[LintResult, int]:
    """Run all checks on a single package. Returns combined result and score."""
    combined = LintResult(package=pkg_path.name)
    
    checks = [
        check_skill_json(pkg_path, fix),
        check_skill_md(pkg_path),
        check_icon(pkg_path, fix),
        check_scripts(pkg_path),
    ]
    
    for result in checks:
        combined.errors.extend(result.errors)
        combined.warnings.extend(result.warnings)
        combined.info.extend(result.info)
        combined.fixes_applied.extend(result.fixes_applied)
    
    combined.score = compute_score(checks)
    return combined


def main():
    parser = argparse.ArgumentParser(description="Lint agent marketplace skill packages")
    parser.add_argument("packages", nargs="*", help="Package directories to lint")
    parser.add_argument("--fix", action="store_true", help="Auto-fix issues where possible")
    parser.add_argument("--json", action="store_true", help="Output as JSON for CI integration")
    args = parser.parse_args()
    
    script_dir = Path(__file__).parent
    skill_packages_dir = script_dir.parent / "skill-packages"
    
    # Determine packages to lint
    if args.packages:
        pkg_paths = [Path(p) for p in args.packages]
    else:
        pkg_paths = sorted([
            p for p in skill_packages_dir.iterdir() 
            if p.is_dir() and not p.name.startswith("_")
        ])
    
    if not pkg_paths:
        print(f"{RED}No packages found in {skill_packages_dir}{RESET}")
        sys.exit(1)
    
    all_results = []
    
    if not args.json:
        print(f"\n{BLUE}🔍 Agent Marketplace — Skill Package Linter{RESET}")
        print(f"{'='*60}\n")
    
    for pkg_path in pkg_paths:
        result = lint_package(pkg_path, args.fix)
        all_results.append(result)
        
        if args.json:
            continue
        
        # Print results
        status = f"{GREEN}✓ PASS{RESET}" if result.passed else f"{RED}✗ FAIL{RESET}"
        score_color = GREEN if result.score >= 80 else YELLOW if result.score >= 50 else RED
        print(f"{BLUE}📦 {result.package}{RESET}  {status}  {score_color}Score: {result.score}/100{RESET}")
        
        for err in result.errors:
            print(f"  {RED}  ✗ {err}{RESET}")
        for warn in result.warnings:
            print(f"  {YELLOW}  ⚠ {warn}{RESET}")
        for info in result.info:
            print(f"  {BLUE}  ℹ {info}{RESET}")
        for fix in result.fixes_applied:
            print(f"  {GREEN}  🔧 {fix}{RESET}")
        print()
    
    # Summary
    passed = sum(1 for r in all_results if r.passed)
    failed = len(all_results) - passed
    avg_score = sum(r.score for r in all_results) / len(all_results) if all_results else 0
    
    if args.json:
        output = {
            "total": len(all_results),
            "passed": passed,
            "failed": failed,
            "averageScore": round(avg_score, 1),
            "packages": [
                {
                    "name": r.package,
                    "passed": r.passed,
                    "score": r.score,
                    "errors": r.errors,
                    "warnings": r.warnings,
                }
                for r in all_results
            ]
        }
        print(json.dumps(output, indent=2))
        sys.exit(0 if failed == 0 else 1)
    
    print(f"{'='*60}")
    print(f"Total: {len(all_results)} packages | {GREEN}{passed} passed{RESET} | {RED}{failed} failed{RESET} | Avg Score: {avg_score:.0f}/100")
    
    if args.fix and any(r.fixes_applied for r in all_results):
        total_fixes = sum(len(r.fixes_applied) for r in all_results)
        print(f"{GREEN}🔧 Applied {total_fixes} auto-fixes — re-run linter to verify{RESET}")
    
    sys.exit(0 if failed == 0 else 1)


if __name__ == "__main__":
    main()
