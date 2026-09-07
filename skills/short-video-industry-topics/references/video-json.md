# Video Idea JSON Contract

Use `schemas/video-ideas.schema.json` as the repository-level contract. The validator checks the same practical requirements without external dependencies.

## Bundle Shape

Each `ideas/*.json` file is a bundle:

```json
{
  "version": "1.0",
  "generated_at": "2026-09-06T00:00:00-07:00",
  "persona": {
    "name": "Profile name",
    "industry": "Industry",
    "region": "Region",
    "audience": "Audience"
  },
  "research": {
    "summary": "Compact synthesis of why these topics are timely.",
    "queries": ["query used"],
    "sources": [
      {
        "title": "Source title",
        "url": "https://example.com",
        "published_at": "2026-09-01",
        "publisher": "Publisher",
        "why_it_matters": "Why this source supports an idea."
      }
    ]
  },
  "videos": []
}
```

## Video Shape

Each item in `videos` should include:

- `id`: lowercase slug stable across edits;
- `status`: `candidate`, `selected`, `removed`, `expanded`, `draft`, or `approved`;
- `title`: viewer-facing title;
- `format`: short-video format such as `myth bust` or `operator checklist`;
- `angle`: the core argument;
- `hook_options`: optional batch of alternative hooks with angle, verbal line, visual hook, on-screen text, and rationale;
- `why_now`: current news, tension, deadline, seasonal reason, or market shift;
- `target_viewer`: who should care;
- `arc`: `hook`, `setup`, `turn`, `payoff`, `cta`;
- `timeline`: 5-9 beats for a normal 60-second video;
- `production`: HyperFrames workflow and media direction;
- `social_copy`: optional caption, hashtags, pinned comment, and CTA notes;
- `claims_to_verify`: factual claims that need checking before publishing.

Optional hook option shape:

```json
{
  "angle": "contrarian",
  "verbal": "Most failed AI pilots do not die because the model was bad.",
  "visual": "Abandoned pilot cards collapse into an operations board.",
  "on_screen_text": "The pilot was not the product.",
  "rationale": "Starts with a defensible contradiction and previews the workflow payoff."
}
```

Timeline beats use seconds:

```json
{
  "start": 0,
  "end": 5,
  "purpose": "Hook",
  "voiceover": "The line spoken in this beat.",
  "visual": "Shot or motion direction.",
  "on_screen_text": "Short readable text.",
  "asset_needs": ["local product screenshot", "licensed city image"]
}
```

## Quality Bar

- Make the hook concrete, not generic.
- Generate multiple hook options before committing to the final hook.
- Specify the first-frame visual, spoken hook, and on-screen text for the opening beat.
- Make the arc sections substantive enough to guide production decisions.
- Escalate the middle beats instead of listing facts.
- Make the payoff resolve the hook's promise.
- Use one CTA tied to the payoff.
- Prefer one clear claim per video.
- Do not overfill on-screen text.
- Put risky facts in `claims_to_verify`.
- Include source URLs for all freshness-sensitive topics.
- Ensure the timeline reaches approximately `production.duration_seconds`.
- Keep asset needs actionable for HyperFrames.
