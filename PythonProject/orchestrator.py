import asyncio
from extractors.pdf_extractor import PhiloParser
from agents.metadata_agent import MetadataAgent
from agents.history_agent import HistoryAgent
from agents.exam_agent import ExamAgent
from models import ResearchPacket
from config import MAX_PDF_PAGES


class PhilosophyAnalyzer:
    def __init__(self):
        self.metadata_agent = MetadataAgent()
        self.history_agent = HistoryAgent()
        self.exam_agent = ExamAgent()

    async def analyze_paper(self, pdf_path: str) -> ResearchPacket:
        # Extract text
        parser = PhiloParser(pdf_path)
        raw_text = await asyncio.to_thread(parser.extract_text, MAX_PDF_PAGES)

        if raw_text.startswith("Error reading PDF"):
            raise Exception(raw_text)

        # Get metadata (agent #1)
        metadata = await asyncio.to_thread(self.metadata_agent.process, raw_text)

        if not isinstance(metadata, dict) or "error" in metadata:
            raise Exception(f"Metadata extraction failed: {metadata}")

        # Run remaining agents (#2, #3) in parallel
        history, exam_guide = await asyncio.gather(
            asyncio.to_thread(self.history_agent.process, metadata),
            asyncio.to_thread(self.exam_agent.process, metadata),
        )

        return ResearchPacket(
            metadata=metadata,
            historical_context=history,
            exam_study_guide=exam_guide
        )
