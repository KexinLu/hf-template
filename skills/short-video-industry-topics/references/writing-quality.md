# Short-Form Writing Quality

Use this reference when generating or improving hooks, arcs, timelines, captions, CTAs, or critique notes for `ideas/*.json`.

The goal is not to promise virality. The goal is to improve the odds that a viewer finishes, saves, shares, or acts because the video makes a clear promise and pays it off quickly.

## Operating Principles

- Optimize for completion, saves, and useful action instead of raw views.
- Offer a batch of distinct hooks before choosing one. One hook is only a guess.
- Concrete beats clever: use specific nouns, numbers, roles, deadlines, stakes, and before/after contrast.
- The hook promise and payoff must match. Do not write a hook the video cannot defend.
- Keep one primary idea per video and one primary ask per CTA.
- For B2B or regulated industries, sharpness cannot come from exaggerating claims. It should come from specificity, tension, and useful operational insight.

## Hook Batch

When proposing candidates or strengthening an idea, generate 3-5 hook options across different angles. Label the angle so the user can choose strategy, not just wording.

Useful hook angles for industry videos:

- Contrarian: challenge a common assumption, but only if the payoff can defend it.
- Investigator: reveal a hidden problem in a familiar workflow or market.
- Operator: start with the checklist, failure mode, or decision rule practitioners can use.
- Fortuneteller: name a near-future shift with a concrete consequence.
- Cost/confession: quantify waste, delay, risk, or avoided effort.
- Before/after: show the operational change from old way to new way.

For each strong hook, specify three layers:

- Visual: what the first frame shows before the viewer hears anything.
- Verbal: the first spoken line, ideally short enough to land by second 2.
- Text: 3-7 words of on-screen text that sharpen the promise without merely repeating the voiceover.

Avoid first-frame logos, greetings, context setup, vague curiosity, brand-first openings, and "you won't believe" phrasing.

## Retention Spine

Shape scripts as:

```text
Hook -> Escalation -> Payoff -> CTA
```

In this repo's JSON, map that to:

- `arc.hook`: the scroll-stopping promise or stake.
- `arc.setup`: why the viewer should care now, compressed.
- `arc.turn`: the reframe, contradiction, or non-obvious mechanism.
- `arc.payoff`: the usable answer, checklist, implication, or reveal.
- `arc.cta`: one next action tied to the payoff.

The middle should escalate. Prefer "but" and "therefore" logic over "and then" sequencing. Each beat should either raise tension, add proof, make the problem more specific, or move the viewer closer to the payoff.

For a 60-second industry video, use 5-9 timeline beats. A shot, composition, or on-screen text reset every 2-4 seconds usually reads better than long static explanation.

## Common Failure Modes

Use these when critiquing drafts:

- Weak hook: the first line is setup, generic, brand-first, or too slow. Fix by starting with the strongest stake, result, contradiction, or operational failure.
- Flat middle: the video lists points without tension. Fix by reordering into problem -> consequence -> reframe -> proof -> action.
- Buried payoff: the useful part arrives too late. Fix by moving a preview of the payoff into the first third and cutting setup.
- Overpromised hook: the opening implies a result the video cannot prove. Fix by narrowing the promise.
- Multi-CTA ending: the ending asks for too many actions. Fix by choosing one action that matches the video: save a checklist, send to a peer, audit a workflow, or approve/reject a next step.

When critiquing, quote the weak line or name the timeline beat, explain why attention drops there, then rewrite it.

## Captions, On-Screen Text, and CTAs

For each expanded idea, include social-copy guidance when useful:

- Caption: first line should stand alone in a feed and contain the main keyword or tension.
- Hashtags: use a small niche set only when the platform benefits; avoid filler tags.
- Pinned comment: use it for the predictable objection, a link/resource note, or a second hook.
- On-screen text: headline plus short beat captions. Do not duplicate every voiceover word.
- CTA: one action, phrased as a useful next step rather than engagement bait.

Good B2B CTAs:

- "Save this as a pilot-readiness checklist."
- "Send this to the owner of your current rollout."
- "Audit one workflow against these four fields."
- "Use this before approving the next vendor demo."

Weak CTAs:

- "Like and follow for more."
- "Comment YES if you agree."
- "Tag someone who needs this."
- "DM me for the secret."

## Final Quality Pass

Before writing JSON, verify:

- The title, hook, first visual, and payoff all describe the same promise.
- The first timeline beat includes visual, verbal, and text layers.
- The arc sections are substantial enough to guide production, not just labels.
- Every on-screen text line is readable in a vertical video.
- Risky factual claims are in `claims_to_verify`.
- The CTA is one clear action earned by the payoff.
