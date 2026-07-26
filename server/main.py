"""CLI for testing the analysis pipeline without the API server.

Usage: python main.py <path_to_pdf>
"""
import sys
import json
import asyncio
from orchestrator import PhilosophyAnalyzer


async def run(pdf_path: str):
    analyzer = PhilosophyAnalyzer()
    print(f"[*] Analyzing: {pdf_path}")
    result = await analyzer.analyze_paper(pdf_path)

    print("\n[METADATA]")
    print(json.dumps(result.metadata, indent=2))
    print("\n" + "=" * 50)
    print("[HISTORICAL CONTEXT]")
    print("=" * 50)
    print(result.historical_context)
    print("\n" + "=" * 50)
    print("[EXAM STUDY GUIDE]")
    print("=" * 50)
    print(result.exam_study_guide)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python main.py <path_to_pdf>")
        sys.exit(1)
    asyncio.run(run(sys.argv[1]))
