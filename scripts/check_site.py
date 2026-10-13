#!/usr/bin/env python3
"""Lightweight static-site checks for MousArchitect."""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import posixpath
import sys

ROOT = Path(__file__).resolve().parents[1]


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.lang = ""
        self.title = ""
        self.description = ""
        self.ids: set[str] = set()
        self.links: list[tuple[str, str, int]] = []
        self.images: list[tuple[str, str, int]] = []
        self.forms: list[tuple[str, int]] = []
        self._in_title = False
        self._title_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        line = self.getpos()[0]
        if tag == "html":
            self.lang = data.get("lang") or ""
        if "id" in data and data["id"]:
            self.ids.add(data["id"])
        if tag == "title":
            self._in_title = True
            self._title_parts = []
        elif tag == "meta" and data.get("name", "").lower() == "description":
            self.description = data.get("content") or ""
        elif tag in {"a", "link", "script"}:
            value = data.get("href") if tag in {"a", "link"} else data.get("src")
            if value:
                self.links.append((value, tag, line))
        elif tag == "img":
            self.images.append((data.get("src") or "", data.get("alt") or "__MISSING__", line))
        elif tag == "form":
            self.forms.append((data.get("action") or "", line))

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False
            self.title = "".join(self._title_parts).strip()

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self._title_parts.append(data)


def local_target(page: Path, raw: str) -> tuple[Path | None, str]:
    parsed = urlsplit(unquote(raw))
    if parsed.scheme or parsed.netloc:
        return None, parsed.fragment
    path = parsed.path
    if not path:
        target = page
    else:
        target = (page.parent / path).resolve()
    try:
        target.relative_to(ROOT.resolve())
    except ValueError:
        return None, parsed.fragment
    return target, parsed.fragment


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []
    pages: dict[Path, PageParser] = {}

    for page in sorted(ROOT.glob("*.html")):
        parser = PageParser()
        parser.feed(page.read_text(encoding="utf-8"))
        pages[page.resolve()] = parser
        label = str(page.relative_to(ROOT))
        if parser.lang.lower() != "en":
            errors.append(f"{label}: <html> must declare lang=\"en\"")
        if not parser.title:
            errors.append(f"{label}: missing non-empty <title>")
        if not parser.description:
            errors.append(f"{label}: missing meta description")
        for src, alt, line in parser.images:
            if not src:
                errors.append(f"{label}:{line}: image has no src")
            if alt == "__MISSING__":
                errors.append(f"{label}:{line}: image is missing an alt attribute")
            elif not alt:
                warnings.append(f"{label}:{line}: image has empty alt text")
        for action, line in parser.forms:
            if not action or action == "#":
                warnings.append(f"{label}:{line}: form has placeholder action={action or '#'}")

    for page, parser in pages.items():
        label = str(page.relative_to(ROOT))
        for raw, kind, line in parser.links:
            if raw.startswith(("mailto:", "tel:", "javascript:", "data:")):
                continue
            target, fragment = local_target(page, raw)
            if target is None:
                continue
            if not target.exists():
                errors.append(f"{label}:{line}: missing local {kind} target {raw}")
                continue
            if fragment:
                target_parser = pages.get(target.resolve())
                if target_parser and fragment not in target_parser.ids:
                    warnings.append(f"{label}:{line}: fragment #{fragment} not found in {target.relative_to(ROOT)}")

    print("Static site check")
    print(f"  Pages checked: {len(pages)}")
    print(f"  Errors: {len(errors)}")
    print(f"  Warnings: {len(warnings)}")
    for item in errors:
        print(f"ERROR: {item}")
    for item in warnings:
        print(f"WARNING: {item}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
