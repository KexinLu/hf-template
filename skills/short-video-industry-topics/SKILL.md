---
name: short-video-industry-topics
description: Brainstorm one-minute short-video topics for a specific industry and region, including interactive industry persona setup, fresh online trend research, candidate selection, JSON video arcs, and edits to this repo's ideas/*.json files for HyperFrames handoff.
metadata:
  short-description: Industry-aware short-video ideation and JSON arcs
---

# Short Video Industry Topics

Help the user turn an industry profile into current, region-aware one-minute video ideas that can be reviewed in HTML and handed to HyperFrames.

## Working Files

- Persona: `personas/industry-persona.json`
- Persona example: `personas/industry-persona.example.json`
- Idea bundles: `ideas/*.json`
- JSON contract: read `references/video-json.md` before writing or substantially editing idea files.
- Writing quality: read `references/writing-quality.md` before generating hooks, arcs, captions, CTAs, or critique rewrites.
- Viewer: `npm run serve`
- Validation: `npm run validate`

## Persona Setup

Load `personas/industry-persona.json` first. If it does not exist or lacks decision-critical fields, interview the user briefly before researching.

Gather only what affects topic quality:

- industry and sub-niche;
- region and language;
- target audience and buying context;
- offer, product, or point of view;
- channel priorities;
- tone, taboo claims, compliance constraints, and competitors to avoid;
- preferred sources or blocked sources.

Write the finished profile to `personas/industry-persona.json` unless the user asks to keep it temporary.

## Research

Search online for recent hot topics in the persona's industry and region before proposing candidates. Prefer primary or high-signal sources such as regulators, public companies, trade publications, reputable local media, industry reports, search trend surfaces, and relevant community discussions.

For each candidate, keep a compact evidence trail:

- source title, publisher, URL, and publication date when available;
- why the source matters;
- what claim or tension the video can safely use;
- unresolved claims that need verification before publishing.

If web access is unavailable, ask the user for source links or mark the output as `needs_research` rather than inventing freshness.

## Candidate Interaction

Propose multiple candidates before expanding. For each candidate show:

- title;
- one-sentence angle;
- 3-5 distinct hook options using different angles;
- likely format;
- why now;
- target viewer;
- evidence notes;
- risk or claim to verify.

Ask the user to pick one or more candidates. Accept natural-language choices such as "1 and 3", "all except the second", "make 4 more like number 2", or "combine 2 and 5".

## Video Formats

Pick the format that fits the topic, not a fixed template:

- myth bust;
- news peg explainer;
- operator checklist;
- founder POV;
- customer mistake;
- before/after transformation;
- data story;
- contrarian take;
- teardown;
- mini case study;
- prediction with caveats;
- tactical how-to.

## Arc Requirements

Each selected video should fit about 60 seconds and include:

- hook: first 1-4 seconds, concrete and specific;
- setup: why the viewer should care now;
- turn: the insight, contradiction, or reframing;
- payoff: practical implication;
- CTA: one clear next action.

Before finalizing the arc, run a writing-quality pass from `references/writing-quality.md`: test whether the hook has visual, verbal, and on-screen text layers; whether the middle escalates instead of listing; whether the payoff resolves the hook's promise; and whether the CTA asks for one action only.

Use many shots in the timeline. A typical one-minute idea should have 5-9 timeline beats with `start` and `end` seconds, voiceover, visual direction, on-screen text, and asset needs.

## HyperFrames Handoff

Every expanded idea must include production notes that help Codex or the HyperFrames skills build the video:

- target aspect ratio, usually `9:16`;
- duration in seconds;
- recommended HyperFrames workflow such as `/faceless-explainer`, `/product-launch-video`, `/motion-graphics`, or `/general-video`;
- visual style;
- voice, music, sound, and caption direction;
- asset needs and image search queries;
- warnings about fragile or private sources.

Prefer stable local assets copied into the HyperFrames project before render. If online images are needed, search for appropriately licensed sources, record the source URL, and avoid private or temporary URLs.

## Editing Existing Ideas

When the user asks to remove, expand, merge, rewrite, or retarget an idea, patch the relevant file under `ideas/` directly.

- For removal, set `status` to `removed` unless the user asks for deletion.
- For expansion, preserve the original `id` and improve hook options, the arc, timeline, production notes, social copy, and verification list.
- For writing critique, name the exact beat that loses attention, identify the failure mode, and rewrite the weak lines instead of giving abstract advice.
- For region, audience, or tone changes, update both the top-level persona summary and affected videos.
- After edits, run `npm run validate` when available.

Keep final responses short: list the file path changed, candidate IDs, and any verification gap that remains.
