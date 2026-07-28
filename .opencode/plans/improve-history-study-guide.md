# Plan: Improve Historical Context & Study Guide

## Goal
Ground both sections in source text, return structured JSON instead of plain strings, and build rich UI components.

---

## Step 1 — `server/models.py`: Add structured models

Replace `historical_context: str` and `exam_study_guide: str` with:

```python
class HistoricalSection(BaseModel):
    title: str
    content: str
    source_quotes: List[str]

class HistoricalContext(BaseModel):
    sections: List[HistoricalSection]
    timeline: Optional[List[Dict[str, str]]] = None

class ConceptGuide(BaseModel):
    concept: str
    definition: str
    stakes: str
    exam_trap: str
    source_quotes: List[str]

class StudyGuide(BaseModel):
    concepts: List[ConceptGuide]
```

Update `AnalysisResult` and `ResearchPacket` to use `HistoricalContext | None` and `StudyGuide | None`.

---

## Step 2 — `server/config.py`: Rewrite prompts for JSON + source text

### New `HISTORY_PROMPT_TEMPLATE`

Replace with a prompt that:
- Includes `{text}` (first 5000 chars of source)
- Includes `{work}`, `{author}`, `{period}`, `{location}` from metadata
- Requests JSON output with sections array and optional timeline
- Instructs the LLM to quote from the provided text

```text
You are a historian specializing in intellectual and political history.

A student is reading "{work}" by {author} ({period}) from {location}.

Below is an excerpt from the text to ground your analysis in the author's actual writing:

---BEGIN EXCERPT---
{text}
---END EXCERPT---

Return ONLY valid JSON with this structure:
{
  "sections": [
    {
      "title": "Political & Social Context",
      "content": "concise analysis with specific examples",
      "source_quotes": ["relevant quote from excerpt above"]
    },
    {
      "title": "Intellectual Debates",
      "content": "what problems or debates the author was responding to",
      "source_quotes": ["relevant quote"]
    },
    {
      "title": "Significance",
      "content": "why this work was revolutionary, controversial, or significant",
      "source_quotes": ["relevant quote"]
    },
    {
      "title": "Key Historical Events",
      "content": "events that shaped the author's thinking",
      "source_quotes": ["relevant quote"]
    }
  ],
  "timeline": [
    { "date": "Year", "event": "Description" }
  ]
}

Be concise, cite specific passages from the excerpt, and explain why this context matters for understanding the work.
```

### New `EXAM_PROMPT_TEMPLATE`

Replace with a prompt that:
- Includes `{text}` (first 5000 chars of source)
- Includes `{work}`, `{author}`, `{concepts}`
- Requests JSON output with concepts array

```text
You are a Philosophy Professor preparing students for exams.

Based on {work} by {author}, create a study guide for these core concepts:
{concepts}

Below is an excerpt from the text to ground your explanations:

---BEGIN EXCERPT---
{text}
---END EXCERPT---

Return ONLY valid JSON with this structure:
{
  "concepts": [
    {
      "concept": "Concept Name",
      "definition": "One clear sentence defining this concept as it appears in {work}",
      "stakes": "Why this matters philosophically — what problem does it solve?",
      "exam_trap": "What do students commonly misunderstand?",
      "source_quotes": ["direct quote from excerpt supporting this concept"]
    }
  ]
}

Make each concept accessible to undergraduates studying for a midterm. Ensure every concept includes at least one source quote from the excerpt.
```

---

## Step 3 — `server/agents/history_agent.py`: Accept raw_text, return dict

```python
from agents.base_agent import BaseAgent
from config import HISTORY_PROMPT_TEMPLATE, HISTORY_CONTEXT_TEMP
import json


class HistoryAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=HISTORY_CONTEXT_TEMP)

    def process(self, metadata: dict, raw_text: str = "") -> dict:
        author = metadata.get("author", "Unknown")
        work = metadata.get("work", "Unknown")
        location = metadata.get("location", "Unknown")
        period = metadata.get("period", "Unknown")

        prompt = HISTORY_PROMPT_TEMPLATE.format(
            work=work,
            author=author,
            period=period,
            location=location,
            text=raw_text[:5000] if raw_text else "No source text available."
        )
        result = self.call_llm(
            system_prompt="You are a historian specializing in intellectual and political history. Return only valid JSON.",
            user_prompt=prompt,
            json_mode=True
        )
        try:
            return json.loads(result)
        except (json.JSONDecodeError, TypeError):
            return {
                "sections": [
                    {"title": "Analysis", "content": result, "source_quotes": []}
                ]
            }
```

---

## Step 4 — `server/agents/exam_agent.py`: Accept raw_text, return dict

```python
from agents.base_agent import BaseAgent
from config import EXAM_PROMPT_TEMPLATE, EXAM_GUIDE_TEMP
import json


class ExamAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=EXAM_GUIDE_TEMP)

    def process(self, metadata: dict, raw_text: str = "") -> dict:
        author = metadata.get("author", "Unknown")
        work = metadata.get("work", "Unknown")
        concepts = ", ".join(metadata.get("core_concepts", []))

        prompt = EXAM_PROMPT_TEMPLATE.format(
            work=work,
            author=author,
            concepts=concepts,
            text=raw_text[:5000] if raw_text else "No source text available."
        )
        result = self.call_llm(
            system_prompt="You are a helpful Philosophy Professor. Return only valid JSON.",
            user_prompt=prompt,
            json_mode=True
        )
        try:
            return json.loads(result)
        except (json.JSONDecodeError, TypeError):
            return {
                "concepts": [
                    {
                        "concept": metadata.get("core_concepts", ["Unknown"])[0],
                        "definition": result,
                        "stakes": "",
                        "exam_trap": "",
                        "source_quotes": []
                    }
                ]
            }
```

---

## Step 5 — `server/orchestrator.py`: Pass raw_text, add error handling

Change the `asyncio.gather` call from:
```python
history, exam_guide, argument = await asyncio.gather(
    asyncio.to_thread(self.history_agent.process, metadata),
    asyncio.to_thread(self.exam_agent.process, metadata),
    asyncio.to_thread(self.argument_agent.process, raw_text[:8000]),
)
```

To:
```python
async def safe_call(agent_fn, *args, fallback):
    try:
        result = await asyncio.to_thread(agent_fn, *args)
        if result is None or (isinstance(result, str) and result.startswith("Agent Error")):
            return fallback
        return result
    except Exception:
        return fallback

history_raw, exam_raw, argument = await asyncio.gather(
    safe_call(self.history_agent.process, metadata, raw_text,
              fallback={"sections": [{"title": "Unavailable", "content": "Historical context could not be generated.", "source_quotes": []}]}),
    safe_call(self.exam_agent.process, metadata, raw_text,
              fallback={"concepts": []}),
    asyncio.to_thread(self.argument_agent.process, raw_text[:8000]),
)
```

Then construct `HistoricalContext` and `StudyGuide` from the returned dicts:

```python
from models import HistoricalContext, HistoricalSection, StudyGuide, ConceptGuide

history_ctx = HistoricalContext(
    sections=[HistoricalSection(**s) for s in history_raw.get("sections", [])],
    timeline=history_raw.get("timeline")
) if isinstance(history_raw, dict) else None

study_guide = StudyGuide(
    concepts=[ConceptGuide(**c) for c in exam_raw.get("concepts", [])]
) if isinstance(exam_raw, dict) else None
```

---

## Step 6 — `client/src/types/api.ts`: New interfaces

Add before `AnalysisResult`:

```typescript
export interface HistoricalSection {
  title: string;
  content: string;
  source_quotes: string[];
}

export interface HistoricalContext {
  sections: HistoricalSection[];
  timeline?: { date: string; event: string }[];
}

export interface ConceptGuide {
  concept: string;
  definition: string;
  stakes: string;
  exam_trap: string;
  source_quotes: string[];
}

export interface StudyGuide {
  concepts: ConceptGuide[];
}
```

Update `AnalysisResult`:
```typescript
export interface AnalysisResult {
  metadata: PhilosophyMetadata;
  historical_context: HistoricalContext | null;
  exam_study_guide: StudyGuide | null;
  argument: ArgumentAnalysis;
}
```

---

## Step 7 — New `client/src/components/HistoryTab.tsx`

Rich component that:
- Renders each `section` as a card with a heading
- Shows `content` in readable prose
- Displays `source_quotes` as blockquotes with a quote icon
- Renders a `timeline` as a vertical timeline list if present
- Handles `null`/empty gracefully with a fallback message

```tsx
import { HistoricalContext } from '../types/api';
import { motion } from 'framer-motion';

interface HistoryTabProps {
  data: HistoricalContext | null;
}

export default function HistoryTab({ data }: HistoryTabProps) {
  if (!data || !data.sections || data.sections.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic py-8 text-center">
        Historical context could not be generated.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.sections.map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-white dark:bg-maroon-800/40 border border-gray-200 dark:border-maroon-700/50 rounded-lg p-5"
        >
          <h3 className="text-lg font-semibold text-maroon-700 dark:text-gold-500 mb-2">
            {section.title}
          </h3>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed mb-3">
            {section.content}
          </p>
          {section.source_quotes.length > 0 && (
            <div className="space-y-2">
              {section.source_quotes.map((q, j) => (
                <blockquote
                  key={j}
                  className="border-l-4 border-gold-500 pl-4 italic text-gray-600 dark:text-gray-300 text-sm"
                >
                  "{q}"
                </blockquote>
              ))}
            </div>
          )}
        </motion.div>
      ))}

      {data.timeline && data.timeline.length > 0 && (
        <div className="bg-white dark:bg-maroon-800/40 border border-gray-200 dark:border-maroon-700/50 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-maroon-700 dark:text-gold-500 mb-3">
            Timeline
          </h3>
          <div className="space-y-3">
            {data.timeline.map((item, i) => (
              <div key={i} className="flex gap-3">
                <span className="font-mono text-sm text-gold-600 dark:text-gold-400 min-w-[80px]">
                  {item.date}
                </span>
                <span className="text-gray-700 dark:text-gray-200">
                  {item.event}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Step 8 — New `client/src/components/StudyGuideTab.tsx`

Rich component that:
- Renders each concept as a card with concept name as heading
- Shows definition, stakes, exam_trap in a clear layout
- Displays source_quotes as blockquotes
- Handles empty/null state

```tsx
import { motion } from 'framer-motion';
import { StudyGuide } from '../types/api';

interface StudyGuideTabProps {
  data: StudyGuide | null;
}

export default function StudyGuideTab({ data }: StudyGuideTabProps) {
  if (!data || !data.concepts || data.concepts.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 italic py-8 text-center">
        Study guide could not be generated.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.concepts.map((item, i) => (
        <motion.div
          key={item.concept}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-white dark:bg-maroon-800/40 border border-gray-200 dark:border-maroon-700/50 rounded-lg p-5"
        >
          <h3 className="text-lg font-semibold text-maroon-700 dark:text-gold-500 mb-3">
            {item.concept}
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Definition
              </span>
              <p className="text-gray-700 dark:text-gray-200">
                {item.definition}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Philosophical Stakes
              </span>
              <p className="text-gray-700 dark:text-gray-200">
                {item.stakes}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-red-500 dark:text-red-400">
                Exam Trap
              </span>
              <p className="text-gray-700 dark:text-gray-200">
                {item.exam_trap}
              </p>
            </div>

            {item.source_quotes.length > 0 && (
              <div className="space-y-1 mt-3">
                {item.source_quotes.map((q, j) => (
                  <blockquote
                    key={j}
                    className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-300 text-sm"
                  >
                    "{q}"
                  </blockquote>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
```

---

## Step 9 — `client/src/components/Results.tsx`: Wire new components

Replace the two raw `<div>` tabs:

```tsx
import HistoryTab from './HistoryTab';
import StudyGuideTab from './StudyGuideTab';
```

Change the history tab:
```tsx
{
  id: 'history',
  label: 'Historical Context',
  content: <HistoryTab data={result.historical_context} />,
}
```

Change the study guide tab:
```tsx
{
  id: 'guide',
  label: 'Study Guide',
  content: <StudyGuideTab data={result.exam_study_guide} />,
}
```

Keep the export tab as-is (JSON serialization handles nested objects naturally; markdown export may need updating to iterate over sections/concepts).

---

## Step 10 — Update markdown export in `Results.tsx`

Replace the Historical Context and Study Guide sections in `exportAsMarkdown`:

```typescript
## Historical Context
${(() => {
  const hc = result.historical_context;
  if (!hc) return 'Not available.';
  return hc.sections.map(s =>
    `### ${s.title}\n${s.content}\n${s.source_quotes.map(q => `> "${q}"`).join('\n')}`
  ).join('\n\n');
})()}

## Study Guide
${(() => {
  const sg = result.exam_study_guide;
  if (!sg) return 'Not available.';
  return sg.concepts.map(c =>
    `### ${c.concept}\n- **Definition**: ${c.definition}\n- **Stakes**: ${c.stakes}\n- **Exam Trap**: ${c.exam_trap}\n${c.source_quotes.map(q => `> "${q}"`).join('\n')}`
  ).join('\n\n');
})()}
```

---

## Files Modified

| File | Change |
|---|---|
| `server/models.py` | Add `HistoricalSection`, `HistoricalContext`, `ConceptGuide`, `StudyGuide`; update `AnalysisResult`/`ResearchPacket` |
| `server/config.py` | Rewrite `HISTORY_PROMPT_TEMPLATE` and `EXAM_PROMPT_TEMPLATE` to request JSON + include `{text}` |
| `server/agents/history_agent.py` | Accept `raw_text` param, use `json_mode=True`, parse and return dict |
| `server/agents/exam_agent.py` | Accept `raw_text` param, use `json_mode=True`, parse and return dict |
| `server/orchestrator.py` | Pass `raw_text` to both agents, wrap calls with `safe_call` error handling, construct model instances |
| `client/src/types/api.ts` | Add `HistoricalSection`, `HistoricalContext`, `ConceptGuide`, `StudyGuide` interfaces |
| `client/src/components/HistoryTab.tsx` | **New** — rich component with section cards, blockquotes, timeline |
| `client/src/components/StudyGuideTab.tsx` | **New** — rich component with concept cards, definition/stakes/trap, blockquotes |
| `client/src/components/Results.tsx` | Use new components, update markdown export |
