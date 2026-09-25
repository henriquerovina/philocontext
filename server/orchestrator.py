import asyncio
import os
from extractors.pdf_extractor import PhiloParser
from extractors.image_extractor import ImageParser
from agents.metadata_agent import MetadataAgent
from agents.history_agent import HistoryAgent
from agents.exam_agent import ExamAgent
from agents.argument_agent import ArgumentAgent
from agents.identify_agent import IdentifyAgent
from agents.topic_agent import TopicAgent
from models import ResearchPacket, HistoricalContext, HistoricalSection, StudyGuide, ConceptGuide, TopicView, Objection, PhilosopherQuote, ChapterInfo, ChapterDetectionResult
from config import MAX_PDF_PAGES


class PhilosophyAnalyzer:
    def __init__(self):
        self.metadata_agent = MetadataAgent()
        self.history_agent = HistoryAgent()
        self.exam_agent = ExamAgent()
        self.argument_agent = ArgumentAgent()
        self.identify_agent = IdentifyAgent()
        self.topic_agent = TopicAgent()

    async def identify_paper(self, description: str) -> dict:
        identification = await asyncio.to_thread(self.identify_agent.process, description)
        return identification

    async def detect_chapters(self, file_path: str) -> ChapterDetectionResult:
        parser = PhiloParser(file_path)
        total_pages = await asyncio.to_thread(parser.get_page_count)

        if total_pages <= MAX_PDF_PAGES:
            return ChapterDetectionResult(chapters=[], total_pages=total_pages, source="none", show_picker=False)

        chapters_raw = await asyncio.to_thread(parser.detect_chapters_from_outline)
        source = "outline"
        if not chapters_raw:
            chapters_raw = await asyncio.to_thread(parser.detect_chapters_heuristic)
            source = "heuristic"
        if not chapters_raw:
            return ChapterDetectionResult(chapters=[], total_pages=total_pages, source="none", show_picker=False)

        chapters = [ChapterInfo(**c) for c in chapters_raw]
        return ChapterDetectionResult(chapters=chapters, total_pages=total_pages, source=source, show_picker=True)

    async def get_topic_view(self, philosopher: str, topic: str) -> TopicView:
        fallback = {
            "explanation": "",
            "objections": [],
            "quotes": [],
            "quote_recognition_hint": "",
        }

        async def safe_call(agent_fn, *args, fallback):
            try:
                result = await asyncio.to_thread(agent_fn, *args)
                if result is None or (isinstance(result, dict) and not result):
                    return fallback
                if isinstance(result, str) and result.startswith("Agent Error"):
                    return fallback
                return result
            except Exception:
                return fallback

        raw = await safe_call(self.topic_agent.process, philosopher, topic, fallback=fallback)

        try:
            objections = [Objection(**o) for o in raw.get("objections", [])]
        except Exception:
            objections = []

        try:
            quotes = [PhilosopherQuote(**q) for q in raw.get("quotes", [])]
        except Exception:
            quotes = []

        return TopicView(
            philosopher=philosopher,
            topic=topic,
            explanation=raw.get("explanation") or f"No information could be generated for {philosopher} on this topic.",
            objections=objections,
            quotes=quotes,
            quote_recognition_hint=raw.get("quote_recognition_hint") or "",
            disclaimer="This content is AI-generated and not verified against primary sources. Quotes, attributions, and objections may be inaccurate — confirm with a primary text or scholarly source before citing.",
        )

    async def analyze_identified_paper(self, author: str, work: str, period: str) -> ResearchPacket:
        synthetic_text = await asyncio.to_thread(
            self.identify_agent.generate_synthetic_text, author, work, period
        )

        if synthetic_text.startswith("Error generating"):
            raise Exception(f"Failed to generate analysis content for '{work}' by {author}.")

        metadata = await asyncio.to_thread(self.metadata_agent.process, synthetic_text)

        if not isinstance(metadata, dict) or "error" in metadata:
            metadata = {
                "author": author,
                "work": work,
                "period": period,
                "location": "Unknown",
                "core_concepts": []
            }

        async def safe_call(agent_fn, *args, fallback):
            try:
                result = await asyncio.to_thread(agent_fn, *args)
                if result is None or (isinstance(result, dict) and not result):
                    return fallback
                if isinstance(result, str) and result.startswith("Agent Error"):
                    return fallback
                return result
            except Exception:
                return fallback

        history_fallback = {
            "sections": [
                {"title": "Unavailable", "content": "Historical context could not be generated.", "source_quotes": []}
            ]
        }
        exam_fallback = {"concepts": []}

        history_raw, exam_raw, argument = await asyncio.gather(
            safe_call(self.history_agent.process, metadata, synthetic_text, fallback=history_fallback),
            safe_call(self.exam_agent.process, metadata, synthetic_text, fallback=exam_fallback),
            asyncio.to_thread(self.argument_agent.process, synthetic_text[:8000]),
        )

        try:
            history_ctx = HistoricalContext(
                sections=[HistoricalSection(**s) for s in history_raw.get("sections", [])],
                timeline=history_raw.get("timeline")
            ) if isinstance(history_raw, dict) else None
        except Exception:
            history_ctx = HistoricalContext(
                sections=[HistoricalSection(title="Historical Overview", content=str(history_raw), source_quotes=[])],
                timeline=None
            )

        try:
            study_guide = StudyGuide(
                concepts=[ConceptGuide(**c) for c in exam_raw.get("concepts", [])]
            ) if isinstance(exam_raw, dict) else None
        except Exception:
            study_guide = StudyGuide(concepts=[])

        return ResearchPacket(
            metadata=metadata,
            historical_context=history_ctx,
            exam_study_guide=study_guide,
            argument=argument,
            raw_text=synthetic_text
        )

    async def analyze_paper(
        self,
        file_path: str,
        extension: str | None = None,
        start_page: int | None = None,
        end_page: int | None = None,
    ) -> ResearchPacket:
        ext = extension or os.path.splitext(file_path)[1].lower()
        is_pdf = ext not in (".png", ".jpg", ".jpeg", ".webp")
        parser = PhiloParser(file_path) if is_pdf else ImageParser(file_path)

        total_pages = None
        pages_analyzed = None
        truncated = False

        if is_pdf:
            total_pages = await asyncio.to_thread(parser.get_page_count)
            if start_page is not None and end_page is not None:
                raw_text = await asyncio.to_thread(parser.extract_page_range, start_page, end_page)
                pages_analyzed = f"{start_page}-{end_page}"
            else:
                raw_text = await asyncio.to_thread(parser.extract_text, MAX_PDF_PAGES)
                analyzed_end = min(MAX_PDF_PAGES, total_pages) if total_pages else MAX_PDF_PAGES
                pages_analyzed = f"1-{analyzed_end}"
                truncated = bool(total_pages and total_pages > MAX_PDF_PAGES)
        else:
            raw_text = await asyncio.to_thread(parser.extract_text, MAX_PDF_PAGES)

        if raw_text.startswith("Error reading"):
            raise Exception(raw_text)

        # Get metadata (agent #1)
        metadata = await asyncio.to_thread(self.metadata_agent.process, raw_text)

        if not isinstance(metadata, dict) or "error" in metadata:
            raise Exception(f"Metadata extraction failed: {metadata}")

        # Safe wrapper for history/exam agents
        async def safe_call(agent_fn, *args, fallback):
            try:
                result = await asyncio.to_thread(agent_fn, *args)
                if result is None or (isinstance(result, dict) and not result):
                    return fallback
                if isinstance(result, str) and result.startswith("Agent Error"):
                    return fallback
                return result
            except Exception:
                return fallback

        history_fallback = {
            "sections": [
                {"title": "Unavailable", "content": "Historical context could not be generated.", "source_quotes": []}
            ]
        }
        exam_fallback = {"concepts": []}

        # Run remaining agents in parallel — history + exam now grounded in raw_text
        history_raw, exam_raw, argument = await asyncio.gather(
            safe_call(self.history_agent.process, metadata, raw_text, fallback=history_fallback),
            safe_call(self.exam_agent.process, metadata, raw_text, fallback=exam_fallback),
            asyncio.to_thread(self.argument_agent.process, raw_text[:8000]),
        )

        # Construct Pydantic models from raw dicts
        try:
            history_ctx = HistoricalContext(
                sections=[HistoricalSection(**s) for s in history_raw.get("sections", [])],
                timeline=history_raw.get("timeline")
            ) if isinstance(history_raw, dict) else None
        except Exception:
            history_ctx = HistoricalContext(
                sections=[HistoricalSection(title="Historical Overview", content=str(history_raw), source_quotes=[])],
                timeline=None
            )

        try:
            study_guide = StudyGuide(
                concepts=[ConceptGuide(**c) for c in exam_raw.get("concepts", [])]
            ) if isinstance(exam_raw, dict) else None
        except Exception:
            study_guide = StudyGuide(concepts=[])

        return ResearchPacket(
            metadata=metadata,
            historical_context=history_ctx,
            exam_study_guide=study_guide,
            argument=argument,
            raw_text=raw_text,
            total_pages=total_pages,
            pages_analyzed=pages_analyzed,
            truncated=truncated,
        )
