import re
from pypdf import PdfReader
from config import MAX_PDF_PAGES

_HEADING_PATTERNS = [
    re.compile(r"^chapter\s+\d+\b", re.IGNORECASE),
    re.compile(r"^chapter\s+[ivxlcdm]+\b", re.IGNORECASE),
    re.compile(r"^part\s+\d+\b", re.IGNORECASE),
    re.compile(r"^part\s+[ivxlcdm]+\b", re.IGNORECASE),
]


def _build_chapter_list(entries: list[tuple[str, int]], total_pages: int) -> list[dict]:
    chapters = []
    for i, (title, start) in enumerate(entries):
        end = entries[i + 1][1] - 1 if i + 1 < len(entries) else total_pages
        if end < start:
            end = start
        chapters.append({"title": title, "start_page": start, "end_page": end})
    return chapters


class PhiloParser:
    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path

    def get_page_count(self) -> int:
        try:
            reader = PdfReader(self.pdf_path)
            return len(reader.pages)
        except Exception:
            return 0

    def extract_text(self, max_pages: int = 50) -> str:
        try:
            reader = PdfReader(self.pdf_path)
            content = ""
            for i in range(min(max_pages, len(reader.pages))):
                content += reader.pages[i].extract_text()
            return content
        except Exception as e:
            return f"Error reading PDF: {str(e)}"

    def extract_page_range(self, start_page: int, end_page: int) -> str:
        """1-indexed, inclusive. Span is capped at MAX_PDF_PAGES as a safety ceiling."""
        try:
            reader = PdfReader(self.pdf_path)
            total = len(reader.pages)
            start = max(1, start_page)
            end = min(end_page, total, start + MAX_PDF_PAGES - 1)
            content = ""
            for i in range(start - 1, end):
                content += reader.pages[i].extract_text()
            return content
        except Exception as e:
            return f"Error reading PDF: {str(e)}"

    def detect_chapters_from_outline(self) -> list[dict] | None:
        """Returns None if the PDF has no outline, or too few usable entries (<2)."""
        try:
            reader = PdfReader(self.pdf_path)
            total = len(reader.pages)
            outline = reader.outline
            if not outline:
                return None

            flat = []

            def _flatten(items):
                for item in items:
                    if isinstance(item, list):
                        _flatten(item)
                    else:
                        flat.append(item)

            _flatten(outline)

            entries = []
            for dest in flat:
                try:
                    page_num = reader.get_destination_page_number(dest)
                    if page_num is None:
                        continue
                    title = getattr(dest, "title", None) or "Untitled"
                    entries.append((title, page_num + 1))
                except Exception:
                    continue

            entries.sort(key=lambda e: e[1])
            deduped = []
            seen_pages = set()
            for title, start in entries:
                if start in seen_pages:
                    continue
                seen_pages.add(start)
                deduped.append((title, start))

            if len(deduped) < 2:
                return None

            return _build_chapter_list(deduped, total)
        except Exception:
            return None

    def detect_chapters_heuristic(self) -> list[dict] | None:
        """Walks every page's first few lines looking for conservative chapter-heading
        patterns (e.g. "Chapter 3", "Part II"). Returns None if fewer than 2 matches."""
        try:
            reader = PdfReader(self.pdf_path)
            total = len(reader.pages)
            found = []
            for i in range(total):
                try:
                    text = reader.pages[i].extract_text() or ""
                except Exception:
                    continue
                lines = [line.strip() for line in text.splitlines() if line.strip()][:3]
                for line in lines:
                    if len(line) > 60:
                        continue
                    if any(p.match(line) for p in _HEADING_PATTERNS):
                        found.append((line, i + 1))
                        break

            if len(found) < 2:
                return None

            return _build_chapter_list(found, total)
        except Exception:
            return None
