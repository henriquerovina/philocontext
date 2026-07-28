import asyncio
import os
from extractors.pdf_extractor import PhiloParser
from extractors.image_extractor import ImageParser
from agents.metadata_agent import MetadataAgent
from agents.history_agent import HistoryAgent
from agents.exam_agent import ExamAgent
from agents.argument_agent import ArgumentAgent
from models import ResearchPacket
from config import MAX_PDF_PAGES


class PhilosophyAnalyzer:
    def __init__(self):
        self.metadata_agent = MetadataAgent()
        self.history_agent = HistoryAgent()
        self.exam_agent = ExamAgent()
        self.argument_agent = ArgumentAgent()

    async def analyze_paper(self, file_path: str, extension: str = None) -> ResearchPacket:
        ext = extension or os.path.splitext(file_path)[1].lower()
        if ext in (".png", ".jpg", ".jpeg", ".webp"):
            parser = ImageParser(file_path)
        else:
            parser = PhiloParser(file_path)

        raw_text = await asyncio.to_thread(parser.extract_text, MAX_PDF_PAGES)

        if raw_text.startswith("Error reading"):
            raise Exception(raw_text)

        # Get metadata (agent #1)
        metadata = await asyncio.to_thread(self.metadata_agent.process, raw_text)

        if not isinstance(metadata, dict) or "error" in metadata:
            raise Exception(f"Metadata extraction failed: {metadata}")

        # Run remaining agents in parallel (history + exam get metadata, argument gets raw_text)
        history, exam_guide, argument = await asyncio.gather(
            asyncio.to_thread(self.history_agent.process, metadata),
            asyncio.to_thread(self.exam_agent.process, metadata),
            asyncio.to_thread(self.argument_agent.process, raw_text[:8000]),
        )

        return ResearchPacket(
            metadata=metadata,
            historical_context=history,
            exam_study_guide=exam_guide,
            argument=argument
        )
