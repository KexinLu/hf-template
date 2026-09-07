# Runbook: Codex + HyperFrames Short Video Workflow on macOS

This runbook sets up a Mac so a Codex user can research short-video topics, create one-minute video arcs, review them in HTML, and hand selected scripts to HyperFrames for editing and rendering.

## 1. Install Required macOS Tools

### Base Tools

Install Xcode Command Line Tools:

```bash
xcode-select --install
```

Install Homebrew if needed:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Install runtime tools:

```bash
brew install node ffmpeg git jq
```

HyperFrames currently documents Node.js 22+ and FFmpeg as local requirements. This repository uses React, Mantine, and Vite for its viewer, so run `npm install` before building or serving the dashboard.

Verify:

```bash
node --version
npm --version
ffmpeg -version
git --version
jq --version
```

### Codex

Use the current Codex installation path for your ChatGPT plan or workspace. After installing or updating Codex, open this repository as the working folder so Codex can read and edit the persona, idea JSON, and HyperFrames projects.

OpenAI's current Codex materials describe Codex as the coding agent surface for understanding codebases, building, testing, and automating repeatable workflows. The included skill follows the standard Codex skill shape: a folder with `SKILL.md`, optional metadata, and references.

### HyperFrames Local Skills and CLI

From this repository:

```bash
npx hyperframes skills update
```

The HyperFrames documentation also supports the interactive skills picker:

```bash
npx skills add heygen-com/hyperframes
```

Choose the core HyperFrames skills when prompted. Restart or reopen Codex in this folder after installing skills.

Create a local editable HyperFrames project when you are ready to turn an approved idea into a video:

```bash
mkdir -p hyperframes-projects
cd hyperframes-projects
npx hyperframes init my-first-video
cd my-first-video
npx hyperframes preview
```

Render locally from inside the HyperFrames project:

```bash
npx hyperframes render
```

Use local HyperFrames when you want project files, source editing, Studio, precise debugging, or local rendering.

### HyperFrames Hosted MCP Connector

HyperFrames also provides a hosted MCP connector. Use this path when you want creation and rendering through a connected chat product and HeyGen account rather than a local project folder.

Production MCP endpoint:

```text
https://mcp.heygen.com/mcp/hyperframes/
```

General setup:

1. Confirm your chat host and workspace plan allow custom MCP connectors or apps.
2. Add the HyperFrames MCP endpoint above as a custom connector/app.
3. Complete the HeyGen authorization flow.
4. Start a new chat, enable the connector, and ask it to create or render a video.
5. Save any composition ID, render ID, and output URL returned by the connector.

Hosted MCP output, plan availability, UI wording, and credits can change. Check the current HyperFrames and host documentation before relying on a repeated production workflow.

## 2. Set Up This Workspace

Clone this repository:

```bash
git clone <repo-url> codex-video-topic-studio
cd codex-video-topic-studio
```

Create your private persona from the example:

```bash
cp personas/industry-persona.example.json personas/industry-persona.json
```

Edit `personas/industry-persona.json`, or ask Codex:

```text
Use the short-video-industry-topics skill. Interview me and create my industry persona for this repo.
```

Start the local idea viewer:

```bash
npm install
npm run start
```

For frontend development, keep the API/static server running with `npm run serve` and start the Vite dev UI in another shell with `npm run dev`.

Validate ideas:

```bash
npm run validate
```

Recommended workspace convention:

```text
personas/industry-persona.json      Private profile for this channel or client
ideas/*.json                        Topic candidates and one-minute arcs
research-notes/                     Optional pasted sources or source summaries
hyperframes-projects/               Local generated video projects, ignored by Git
exports/                            Rendered review files, ignored by Git
```

## 3. Install or Use the Included Codex Skill

This repo includes:

```text
skills/short-video-industry-topics/
```

Use it directly by asking Codex from this repo:

```text
Use the short-video-industry-topics skill to brainstorm one-minute video topics for my persona.
```

If your Codex setup requires skills under your Codex home directory, copy or symlink the skill folder:

```bash
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
ln -s "$PWD/skills/short-video-industry-topics" "${CODEX_HOME:-$HOME/.codex}/skills/short-video-industry-topics"
```

Restart Codex after adding a new skill directory if your client does not pick it up live.

## 4. Brainstorm, Pick, and Produce JSON

Ask Codex:

```text
Use the short-video-industry-topics skill.
My industry persona is in personas/industry-persona.json.
Search for hot topics in my industry and region, propose candidates, and ask me which ones to expand.
```

Expected interaction:

1. Codex loads the persona.
2. If the persona is missing key fields, Codex asks a short set of profile questions.
3. Codex searches recent online sources for hot topics in the industry and region.
4. Codex proposes multiple topic candidates with evidence and a format recommendation.
5. You pick one or more.
6. Codex writes or updates `ideas/<slug>.json` using `schemas/video-ideas.schema.json`.
7. Run `npm run serve` to review.

## 5. Review Ideas in HTML

Start:

```bash
npm run serve
```

The viewer shows:

- persona summary;
- research sources;
- topic cards;
- hook, arc, timeline, production notes, and asset needs;
- remove buttons for local pruning.

Browser removals write back to the JSON file. You can also ask Codex:

```text
Remove the topic about remote patient monitoring from the idea JSON.
```

```text
Expand the GLP-1 supply chain topic into a stronger one-minute arc with more shots.
```

```text
Make the hook more founder-led and less news-anchor-like.
```

After edits:

```bash
npm run validate
```

## 6. Turn a Selected Idea Into a HyperFrames Video

Local editable route:

```text
Use /hyperframes with the selected idea in ideas/<file>.json.
Create a 60-second vertical video with many shots.
Use the JSON timeline as the first pass, fetch or generate needed assets, copy stable media into the project, preview it locally, and tell me the project folder.
```

Hosted MCP route:

```text
Use the HyperFrames MCP connector.
Create a 60-second vertical video from the selected idea JSON.
Return a preview, then render an MP4 after I approve the direction.
```

For assets:

- prefer user-provided product, brand, and footage assets when available;
- when fetching online images, use licensed or clearly attributable sources;
- copy required media into the HyperFrames project before final render;
- record source URLs and license notes in the idea JSON or project notes;
- run `npx hyperframes check` before rendering when the local project includes external media.

## 7. Sources Checked While Creating This Runbook

- HyperFrames hosted MCP guide: https://hyperframes.mintlify.app/guides/mcp
- HyperFrames quickstart: https://hyperframes.mintlify.app/quickstart
- HyperFrames local requirements and skills README: https://github.com/heygen-com/hyperframes
- HyperFrames media guidance: https://hyperframes.mintlify.app/guides/video-components
- HyperFrames audio and captions guidance: https://hyperframes.mintlify.app/guides/voice-and-audio
- OpenAI Codex use cases and skills workflow reference: https://learn.chatgpt.com/use-cases
