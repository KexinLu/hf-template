# Codex Video Topic Studio

A starter repository for building a Codex-assisted short-video workflow:

- set up macOS, Codex, HyperFrames, and the hosted HyperFrames MCP connector;
- create an industry persona for topic ideation;
- research hot topics by industry and region;
- generate one-minute video idea JSON with arcs, shot plans, and HyperFrames handoff notes;
- view, remove, and inspect ideas in a local HTML dashboard.

## Recommended Shape

Use both a runbook and npm scripts.

The runbook is the source of truth for setup and operating procedure. The npm scripts provide repeatable local commands for validation, idea browsing, and HyperFrames handoff. Keeping the app dependency-free makes the repo easy to clone and run on a new Mac.

## Quick Start

```bash
npm run serve
```

Open the printed local URL. The viewer reads JSON from `ideas/`.

To validate idea files:

```bash
npm run validate
```

## Repository Layout

```text
docs/
  RUNBOOK.md                  Setup and operating guide
skills/
  short-video-industry-topics/
    SKILL.md                  Codex skill for persona-led topic ideation
    agents/openai.yaml        Skill UI metadata
    references/video-json.md  JSON contract and examples
ideas/
  sample-b2b-ai-healthcare.json
personas/
  industry-persona.example.json
public/
  index.html
  styles.css
  app.js
scripts/
  serve-ideas.mjs
  validate-ideas.mjs
schemas/
  video-ideas.schema.json
```

## Main Workflow

1. Follow [docs/RUNBOOK.md](docs/RUNBOOK.md) to set up the Mac.
2. Install or expose `skills/short-video-industry-topics` to Codex.
3. Ask Codex to use the skill to create or update `personas/industry-persona.json`.
4. Let Codex research current industry topics for the persona's region.
5. Pick one or more topic candidates.
6. Codex writes JSON files under `ideas/`.
7. Run `npm run serve` to review the ideas in HTML.
8. Ask Codex to remove, expand, merge, or edit ideas. Codex patches the JSON and the viewer reloads it.
9. For a selected idea, ask Codex to use the HyperFrames skills or MCP connector to produce the editable video project or hosted render.

## HyperFrames Handoff

For local editable videos, this repo expects HyperFrames project folders to live under `hyperframes-projects/`, which is ignored by Git. The idea JSON includes `production.hyperframes_workflow`, `timeline`, and `asset_needs` fields so Codex can convert an approved concept into many shots and then into a HyperFrames composition.

For hosted MCP rendering, keep connector IDs, composition IDs, and render URLs in your private notes or issue tracker unless they are safe to commit.

