#!/usr/bin/env python3
"""
Portfolio website validator — runs in CI to gate deployments.
Exits non-zero on any error so the GitHub Actions pipeline fails.
"""

import os
import re
import sys
import json
from pathlib import Path
from collections import Counter


# ── Helpers ──────────────────────────────────────────────

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


def strip_strings_and_comments_js(content):
    """Remove JS string literals and comments to avoid false bracket matches."""
    result = []
    i = 0
    n = len(content)
    while i < n:
        # Single-line comment
        if content[i:i+2] == '//' and (i == 0 or content[i-1] != '\\'):
            while i < n and content[i] != '\n':
                i += 1
            continue
        # Multi-line comment
        if content[i:i+2] == '/*':
            i += 2
            while i < n - 1 and content[i:i+2] != '*/':
                i += 1
            i += 2
            continue
        # Template literal
        if content[i] == '`':
            i += 1
            while i < n and content[i] != '`':
                if content[i] == '\\':
                    i += 1
                i += 1
            i += 1
            continue
        # String literals
        if content[i] in ('"', "'"):
            quote = content[i]
            i += 1
            while i < n and content[i] != quote:
                if content[i] == '\\':
                    i += 1
                i += 1
            i += 1
            continue
        # Regex literals — skip for simplicity, they rarely affect bracket balance
        result.append(content[i])
        i += 1
    return ''.join(result)


def strip_css_comments(content):
    """Remove CSS comments."""
    return re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)


# ── HTML Validation ──────────────────────────────────────

def validate_html(file_path):
    errors = []
    warnings = []
    content = read_file(file_path)

    # Basic structure
    if not re.search(r'<!DOCTYPE html>', content, re.IGNORECASE):
        errors.append("Missing DOCTYPE declaration")
    if not re.search(r'<html[^>]*>', content, re.IGNORECASE):
        errors.append("Missing <html> tag")
    if not re.search(r'</html>', content, re.IGNORECASE):
        errors.append("Missing </html> tag")
    if not re.search(r'<head[^>]*>.*</head>', content, re.IGNORECASE | re.DOTALL):
        errors.append("Missing or malformed <head> section")
    if not re.search(r'<body[^>]*>.*</body>', content, re.IGNORECASE | re.DOTALL):
        errors.append("Missing or malformed <body> section")
    if not re.search(r'<title[^>]*>.+</title>', content, re.IGNORECASE | re.DOTALL):
        warnings.append("Missing or empty <title>")
    if not re.search(r'<meta[^>]*charset[^>]*>', content, re.IGNORECASE):
        warnings.append("Missing charset meta tag")
    if not re.search(r'<meta[^>]*viewport[^>]*>', content, re.IGNORECASE):
        warnings.append("Missing viewport meta tag")
    if not re.search(r'<html[^>]*lang=', content, re.IGNORECASE):
        warnings.append("Missing lang attribute on <html>")

    # Tag balance
    tags_to_check = ['div', 'section', 'nav', 'ul', 'ol', 'table', 'form',
                     'header', 'main', 'footer', 'article', 'aside', 'details']
    for tag in tags_to_check:
        opening = len(re.findall(rf'<{tag}[\s>]', content, re.IGNORECASE))
        closing = len(re.findall(rf'</{tag}>', content, re.IGNORECASE))
        if opening != closing:
            errors.append(f"Unmatched <{tag}>: {opening} opening vs {closing} closing")

    # Extract references
    css_links = re.findall(r'<link[^>]*href=["\']([^"\']*\.css)["\'][^>]*>', content, re.IGNORECASE)
    js_links = re.findall(r'<script[^>]*src=["\']([^"\']*\.js)["\'][^>]*>', content, re.IGNORECASE)

    return errors, warnings, css_links, js_links


# ── Duplicate ID Check ───────────────────────────────────

def check_duplicate_ids(file_path):
    content = read_file(file_path)
    errors = []
    ids = re.findall(r'\bid=["\']([^"\']+)["\']', content)
    counts = Counter(ids)
    for id_val, count in counts.items():
        if count > 1:
            errors.append(f'Duplicate id="{id_val}" appears {count} times')
    return errors


# ── Cross-Reference: HTML IDs ↔ JS getElementById ────────

def cross_reference_ids(html_path, js_files):
    html_content = read_file(html_path)
    html_ids = set(re.findall(r'\bid=["\']([^"\']+)["\']', html_content))

    # IDs that JS creates dynamically at runtime
    dynamic_ids = {'typing-indicator'}

    warnings = []
    for js_path in js_files:
        js_content = read_file(js_path)
        # getElementById('xxx') and getElementById("xxx")
        referenced_ids = re.findall(r'getElementById\(["\']([^"\']+)["\']\)', js_content)
        for ref_id in referenced_ids:
            if ref_id not in html_ids and ref_id not in dynamic_ids:
                warnings.append(f'{js_path.name}: getElementById("{ref_id}") — id not found in HTML')

    return warnings


# ── Cross-Reference: onclick handlers ↔ JS function defs ─

def cross_reference_handlers(html_path, js_files):
    html_content = read_file(html_path)
    warnings = []

    # Extract all onclick/onkeypress/onmouseover/onmouseout handler function names
    handler_calls = re.findall(
        r'(?:onclick|onkeypress|onmouseover|onmouseout|onchange)=["\'](\w+)\s*\(',
        html_content
    )
    handler_names = set(handler_calls)

    # Inline expressions that are not function calls (e.g. "event.stopPropagation()")
    # and built-in style assignments — skip those
    skip = {'event', 'this'}
    handler_names -= skip

    # Collect all top-level function definitions across JS files
    all_functions = set()
    for js_path in js_files:
        js_content = read_file(js_path)
        # function foo(  |  const foo = (  |  var foo = function  |  window.foo =
        all_functions.update(re.findall(r'\bfunction\s+(\w+)\s*\(', js_content))
        all_functions.update(re.findall(r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\(', js_content))
        all_functions.update(re.findall(r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?function', js_content))
        all_functions.update(re.findall(r'window\.(\w+)\s*=', js_content))
        # IIFE-exposed public methods (e.g. blogEngine.open) won't be caught as
        # top-level, but they are called via the object name, which won't match
        # a bare handler_name anyway, so that's fine.

    for handler in handler_names:
        if handler not in all_functions:
            warnings.append(f'onclick handler "{handler}()" not defined in any JS file')

    return warnings


# ── CSS Validation ───────────────────────────────────────

def validate_css(file_path):
    errors = []
    warnings = []
    content = read_file(file_path)
    stripped = strip_css_comments(content)

    # Brace balance
    if stripped.count('{') != stripped.count('}'):
        errors.append(f"Unmatched braces: {stripped.count('{')} opening vs {stripped.count('}')} closing")

    # Semicolon check — only inside declaration blocks, skip @-rules, selectors, etc.
    in_block = 0
    lines = stripped.split('\n')
    for i, line in enumerate(lines, 1):
        raw = line.strip()
        if not raw or raw.startswith('/*') or raw.startswith('*') or raw.startswith('//'):
            continue
        in_block += raw.count('{') - raw.count('}')
        if in_block <= 0:
            continue
        # Inside a declaration block — check for property: value lines missing ;
        # Skip lines that are just { or } or @-rules or selector continuations
        if raw in ('{', '}') or raw.startswith('@') or raw.startswith('/*'):
            continue
        if raw.endswith((',', '{', '}', ';')):
            continue
        # Must contain a colon to be a property declaration
        if ':' not in raw:
            continue
        # Avoid pseudo-selectors (e.g. ".foo:hover {") and media queries
        if '{' in raw or re.match(r'^[^{]*:[a-z-]+[\s({]', raw):
            continue
        warnings.append(f"Line {i}: Possible missing semicolon: {raw[:60]}")

    return errors, warnings


# ── JavaScript Validation ────────────────────────────────

def validate_js(file_path):
    errors = []
    content = read_file(file_path)
    stripped = strip_strings_and_comments_js(content)

    pairs = [('(', ')'), ('{', '}'), ('[', ']')]
    for open_ch, close_ch in pairs:
        o = stripped.count(open_ch)
        c = stripped.count(close_ch)
        if o != c:
            errors.append(f"Unmatched '{open_ch}'/'{close_ch}': {o} opening vs {c} closing")

    return errors


# ── Asset & Link Validation ──────────────────────────────

def check_local_assets(html_path, base_dir):
    content = read_file(html_path)
    errors = []

    # src= and href= pointing to local files (not http/https/mailto/#/javascript:)
    refs = re.findall(r'(?:src|href)=["\']([^"\'#]+)["\']', content)
    for ref in refs:
        if re.match(r'^(https?://|mailto:|javascript:|data:)', ref):
            continue
        path = base_dir / ref
        if not path.exists():
            errors.append(f"Missing local asset: {ref}")

    return errors


def check_blog_manifest(base_dir):
    errors = []
    manifest_path = base_dir / 'blog' / 'manifest.json'
    if not manifest_path.exists():
        return errors  # blog manifest is optional

    try:
        with open(manifest_path, 'r') as f:
            filenames = json.load(f)
        for name in filenames:
            article_path = base_dir / 'blog' / name
            if not article_path.exists():
                errors.append(f"Blog manifest references missing file: blog/{name}")
    except (json.JSONDecodeError, TypeError) as e:
        errors.append(f"Blog manifest.json is invalid JSON: {e}")

    return errors


# ── Accessibility Checks ─────────────────────────────────

def check_accessibility(html_path):
    content = read_file(html_path)
    warnings = []

    # Images without alt attribute
    imgs = re.findall(r'<img\b([^>]*)>', content, re.IGNORECASE)
    for i, attrs in enumerate(imgs, 1):
        if 'alt=' not in attrs.lower():
            warnings.append(f"<img> #{i} missing alt attribute")

    # Links with no text content and no aria-label
    empty_links = re.findall(r'<a\b([^>]*)>\s*</a>', content, re.IGNORECASE)
    for attrs in empty_links:
        if 'aria-label' not in attrs.lower():
            warnings.append("Empty <a> tag with no text and no aria-label")

    # Form inputs without associated labels or aria-label (except buttons/hidden)
    inputs = re.finditer(
        r'<input\b([^>]*)>',
        content, re.IGNORECASE
    )
    all_labels = re.findall(r'<label[^>]*for=["\']([^"\']+)["\']', content, re.IGNORECASE)
    label_fors = set(all_labels)

    for match in inputs:
        attrs = match.group(1)
        type_match = re.search(r'type=["\'](\w+)["\']', attrs, re.IGNORECASE)
        input_type = type_match.group(1).lower() if type_match else 'text'
        if input_type in ('button', 'submit', 'hidden', 'reset'):
            continue
        id_match = re.search(r'id=["\']([^"\']+)["\']', attrs, re.IGNORECASE)
        input_id = id_match.group(1) if id_match else None
        has_label = input_id and input_id in label_fors
        has_aria = 'aria-label' in attrs.lower() or 'placeholder' in attrs.lower()
        if not has_label and not has_aria:
            warnings.append(f"<input> (id={input_id or 'none'}) has no <label>, aria-label, or placeholder")

    return warnings


# ── Main ─────────────────────────────────────────────────

def main():
    print("Validating Portfolio Website...")
    print("=" * 50)

    base_dir = Path(__file__).parent
    total_errors = 0
    total_warnings = 0

    # ─ HTML ─
    html_file = base_dir / 'index.html'
    if not html_file.exists():
        print("\nERROR: index.html not found!")
        sys.exit(1)

    print("\n[HTML] Validating index.html...")
    errors, warnings, css_links, js_links = validate_html(html_file)
    total_errors += len(errors)
    total_warnings += len(warnings)
    for e in errors:
        print(f"  ERROR: {e}")
    for w in warnings:
        print(f"  WARN:  {w}")
    if not errors and not warnings:
        print("  OK — no issues")

    # ─ Duplicate IDs ─
    print("\n[HTML] Checking for duplicate IDs...")
    dup_errors = check_duplicate_ids(html_file)
    total_errors += len(dup_errors)
    for e in dup_errors:
        print(f"  ERROR: {e}")
    if not dup_errors:
        print("  OK — all IDs unique")

    # ─ Referenced files exist ─
    print("\n[ASSETS] Checking referenced resources...")
    for css_file in css_links:
        css_path = base_dir / css_file
        if css_path.exists():
            print(f"  OK   CSS: {css_file}")
        else:
            print(f"  ERROR Missing CSS: {css_file}")
            total_errors += 1

    js_paths = []
    for js_file in js_links:
        js_path = base_dir / js_file
        if js_path.exists():
            print(f"  OK   JS:  {js_file}")
            js_paths.append(js_path)
        else:
            print(f"  ERROR Missing JS:  {js_file}")
            total_errors += 1

    # ─ Local asset references ─
    print("\n[ASSETS] Checking local asset references...")
    asset_errors = check_local_assets(html_file, base_dir)
    total_errors += len(asset_errors)
    for e in asset_errors:
        print(f"  ERROR: {e}")
    if not asset_errors:
        print("  OK — all local references resolve")

    # ─ Blog manifest ─
    print("\n[BLOG] Checking blog manifest...")
    blog_errors = check_blog_manifest(base_dir)
    total_errors += len(blog_errors)
    for e in blog_errors:
        print(f"  ERROR: {e}")
    if not blog_errors:
        print("  OK — blog manifest valid")

    # ─ CSS ─
    for css_file in css_links:
        css_path = base_dir / css_file
        if not css_path.exists():
            continue
        print(f"\n[CSS] Validating {css_file}...")
        errors, warnings = validate_css(css_path)
        total_errors += len(errors)
        total_warnings += len(warnings)
        for e in errors:
            print(f"  ERROR: {e}")
        for w in warnings[:5]:
            print(f"  WARN:  {w}")
        if len(warnings) > 5:
            print(f"  ... and {len(warnings) - 5} more warnings")
        if not errors and not warnings:
            print("  OK — no issues")

    # ─ JavaScript (all files, skip vendor/minified) ─
    for js_path in js_paths:
        if js_path.name.endswith('.min.js') or 'lib/' in str(js_path.relative_to(base_dir)):
            print(f"\n[JS] Skipping {js_path.relative_to(base_dir)} (vendor/minified)")
            continue
        print(f"\n[JS] Validating {js_path.name}...")
        errors = validate_js(js_path)
        total_errors += len(errors)
        for e in errors:
            print(f"  ERROR: {e}")
        if not errors:
            print("  OK — brackets balanced")

    # ─ Cross-references (skip vendor files) ─
    own_js = [p for p in js_paths
              if not p.name.endswith('.min.js')
              and 'lib/' not in str(p.relative_to(base_dir))]

    print("\n[XREF] Cross-referencing HTML IDs with JS getElementById calls...")
    xref_warnings = cross_reference_ids(html_file, own_js)
    total_warnings += len(xref_warnings)
    for w in xref_warnings:
        print(f"  WARN:  {w}")
    if not xref_warnings:
        print("  OK — all referenced IDs exist in HTML")

    print("\n[XREF] Cross-referencing onclick handlers with JS function definitions...")
    handler_warnings = cross_reference_handlers(html_file, own_js)
    total_warnings += len(handler_warnings)
    for w in handler_warnings:
        print(f"  WARN:  {w}")
    if not handler_warnings:
        print("  OK — all handlers defined")

    # ─ Accessibility ─
    print("\n[A11Y] Checking basic accessibility...")
    a11y_warnings = check_accessibility(html_file)
    total_warnings += len(a11y_warnings)
    for w in a11y_warnings:
        print(f"  WARN:  {w}")
    if not a11y_warnings:
        print("  OK — basic checks pass")

    # ─ Summary ─
    print("\n" + "=" * 50)
    print(f"Results: {total_errors} error(s), {total_warnings} warning(s)")

    if total_errors > 0:
        print("\nValidation FAILED — fix errors before deploying.")
        sys.exit(1)
    else:
        print("\nValidation PASSED.")
        if total_warnings > 0:
            print("(Warnings are non-blocking but should be reviewed.)")
        print("\nTo test locally: python3 -m http.server 8000")


if __name__ == "__main__":
    main()
