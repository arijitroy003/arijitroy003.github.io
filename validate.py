#!/usr/bin/env python3
"""
Simple validation script for the portfolio website
"""

import os
import re
from pathlib import Path

def validate_html(file_path):
    """Validate HTML file for basic structure and common issues"""
    errors = []
    warnings = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check basic HTML structure
    if not re.search(r'<!DOCTYPE html>', content, re.IGNORECASE):
        errors.append("Missing DOCTYPE declaration")
    
    if not re.search(r'<html[^>]*>', content, re.IGNORECASE):
        errors.append("Missing HTML opening tag")
    
    if not re.search(r'</html>', content, re.IGNORECASE):
        errors.append("Missing HTML closing tag")
    
    if not re.search(r'<head[^>]*>.*</head>', content, re.IGNORECASE | re.DOTALL):
        errors.append("Missing or malformed HEAD section")
    
    if not re.search(r'<body[^>]*>.*</body>', content, re.IGNORECASE | re.DOTALL):
        errors.append("Missing or malformed BODY section")
    
    # Check for title
    if not re.search(r'<title[^>]*>.*</title>', content, re.IGNORECASE | re.DOTALL):
        warnings.append("Missing page title")
    
    # Check for meta charset
    if not re.search(r'<meta[^>]*charset[^>]*>', content, re.IGNORECASE):
        warnings.append("Missing charset meta tag")
    
    # Check for viewport meta
    if not re.search(r'<meta[^>]*viewport[^>]*>', content, re.IGNORECASE):
        warnings.append("Missing viewport meta tag")
    
    # Check for unclosed tags (simplified check)
    tags_to_check = ['div', 'section', 'header', 'main', 'footer', 'nav', 'h1', 'h2', 'h3', 'p', 'a']
    for tag in tags_to_check:
        opening_tags = len(re.findall(f'<{tag}[^>]*>', content, re.IGNORECASE))
        closing_tags = len(re.findall(f'</{tag}>', content, re.IGNORECASE))
        if opening_tags != closing_tags:
            warnings.append(f"Potential unclosed {tag} tags: {opening_tags} opening, {closing_tags} closing")
    
    # Check for external resources
    css_links = re.findall(r'<link[^>]*href=["\']([^"\']*\.css)["\'][^>]*>', content, re.IGNORECASE)
    js_links = re.findall(r'<script[^>]*src=["\']([^"\']*\.js)["\'][^>]*>', content, re.IGNORECASE)
    
    return errors, warnings, css_links, js_links

def validate_css(file_path):
    """Basic CSS validation"""
    errors = []
    warnings = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for unclosed braces
    open_braces = content.count('{')
    close_braces = content.count('}')
    if open_braces != close_braces:
        errors.append(f"Unmatched braces: {open_braces} opening, {close_braces} closing")
    
    # Check for missing semicolons (simplified)
    lines = content.split('\n')
    for i, line in enumerate(lines, 1):
        line = line.strip()
        if ':' in line and not line.endswith((';', '{', '}')) and not line.startswith(('/*', '*', '//')):
            warnings.append(f"Line {i}: Possible missing semicolon")
    
    return errors, warnings

def validate_js(file_path):
    """Basic JavaScript validation"""
    errors = []
    warnings = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check for unmatched parentheses
    open_parens = content.count('(')
    close_parens = content.count(')')
    if open_parens != close_parens:
        errors.append(f"Unmatched parentheses: {open_parens} opening, {close_parens} closing")
    
    # Check for unmatched braces
    open_braces = content.count('{')
    close_braces = content.count('}')
    if open_braces != close_braces:
        errors.append(f"Unmatched braces: {open_braces} opening, {close_braces} closing")
    
    # Check for unmatched brackets
    open_brackets = content.count('[')
    close_brackets = content.count(']')
    if open_brackets != close_brackets:
        errors.append(f"Unmatched brackets: {open_brackets} opening, {close_brackets} closing")
    
    return errors, warnings

def main():
    """Main validation function"""
    print("🔍 Validating Portfolio Website...")
    print("=" * 50)
    
    base_dir = Path(__file__).parent
    
    # Validate HTML
    html_file = base_dir / 'index.html'
    if html_file.exists():
        print("\n📄 Validating HTML...")
        errors, warnings, css_links, js_links = validate_html(html_file)
        
        if errors:
            print("❌ HTML Errors:")
            for error in errors:
                print(f"  - {error}")
        else:
            print("✅ No HTML errors found")
        
        if warnings:
            print("⚠️  HTML Warnings:")
            for warning in warnings:
                print(f"  - {warning}")
        
        # Check if referenced files exist
        print("\n🔗 Checking external resources...")
        for css_file in css_links:
            css_path = base_dir / css_file
            if css_path.exists():
                print(f"✅ CSS file found: {css_file}")
            else:
                print(f"❌ CSS file missing: {css_file}")
        
        for js_file in js_links:
            js_path = base_dir / js_file
            if js_path.exists():
                print(f"✅ JS file found: {js_file}")
            else:
                print(f"❌ JS file missing: {js_file}")
    
    # Validate CSS
    css_file = base_dir / 'styles.css'
    if css_file.exists():
        print("\n🎨 Validating CSS...")
        errors, warnings = validate_css(css_file)
        
        if errors:
            print("❌ CSS Errors:")
            for error in errors:
                print(f"  - {error}")
        else:
            print("✅ No CSS errors found")
        
        if warnings:
            print("⚠️  CSS Warnings:")
            for warning in warnings[:5]:  # Limit warnings
                print(f"  - {warning}")
            if len(warnings) > 5:
                print(f"  ... and {len(warnings) - 5} more warnings")
    
    # Validate JavaScript
    js_file = base_dir / 'script.js'
    if js_file.exists():
        print("\n⚡ Validating JavaScript...")
        errors, warnings = validate_js(js_file)
        
        if errors:
            print("❌ JavaScript Errors:")
            for error in errors:
                print(f"  - {error}")
        else:
            print("✅ No JavaScript errors found")
        
        if warnings:
            print("⚠️  JavaScript Warnings:")
            for warning in warnings:
                print(f"  - {warning}")
    
    print("\n" + "=" * 50)
    print("🎉 Validation complete!")
    print("\nTo test the website locally, run:")
    print("python3 -m http.server 8000")
    print("Then open http://localhost:8000 in your browser")

if __name__ == "__main__":
    main()