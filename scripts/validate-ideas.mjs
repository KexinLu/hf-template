import { readFile } from "node:fs/promises";

const files = process.argv.slice(2).filter((file) => !file.includes("*"));

if (files.length === 0) {
  console.error("No idea JSON files found. Pass files such as ideas/*.json.");
  process.exit(1);
}

let failures = 0;

for (const file of files) {
  try {
    const data = JSON.parse(await readFile(file, "utf8"));
    validateBundle(data, file);
    console.log(`ok ${file}`);
  } catch (error) {
    failures += 1;
    console.error(`fail ${file}: ${error.message}`);
  }
}

if (failures > 0) {
  process.exit(1);
}

function validateBundle(data, file) {
  requiredObject(data, "bundle", file);
  requiredString(data.version, "version", file);
  requiredObject(data.persona, "persona", file);
  requiredString(data.persona.industry, "persona.industry", file);
  requiredString(data.persona.region, "persona.region", file);
  requiredObject(data.research, "research", file);
  requiredString(data.research.summary, "research.summary", file);
  requiredArray(data.research.queries, "research.queries", file);
  requiredArray(data.research.sources, "research.sources", file);
  requiredArray(data.videos, "videos", file);

  for (const [index, video] of data.videos.entries()) {
    const prefix = `videos[${index}]`;
    requiredString(video.id, `${prefix}.id`, file);
    requiredString(video.status, `${prefix}.status`, file);
    requiredString(video.title, `${prefix}.title`, file);
    requiredString(video.format, `${prefix}.format`, file);
    requiredString(video.angle, `${prefix}.angle`, file);

    if (video.hook_options !== undefined) {
      requiredArray(video.hook_options, `${prefix}.hook_options`, file);
      for (const [hookIndex, hook] of video.hook_options.entries()) {
        const hookPrefix = `${prefix}.hook_options[${hookIndex}]`;
        requiredString(hook.angle, `${hookPrefix}.angle`, file);
        requiredString(hook.verbal, `${hookPrefix}.verbal`, file);
        requiredString(hook.visual, `${hookPrefix}.visual`, file);
        requiredString(hook.on_screen_text, `${hookPrefix}.on_screen_text`, file);
      }
    }

    requiredObject(video.arc, `${prefix}.arc`, file);

    for (const key of ["hook", "setup", "turn", "payoff", "cta"]) {
      requiredString(video.arc[key], `${prefix}.arc.${key}`, file);
    }

    requiredArray(video.timeline, `${prefix}.timeline`, file);
    if (video.timeline.length < 3) {
      throw new Error(`${file} ${prefix}.timeline must contain at least 3 beats`);
    }

    let lastEnd = -1;
    for (const [beatIndex, beat] of video.timeline.entries()) {
      const beatPrefix = `${prefix}.timeline[${beatIndex}]`;
      requiredNumber(beat.start, `${beatPrefix}.start`, file);
      requiredNumber(beat.end, `${beatPrefix}.end`, file);
      if (beat.end <= beat.start) {
        throw new Error(`${file} ${beatPrefix}.end must be greater than start`);
      }
      if (beat.start < lastEnd) {
        throw new Error(`${file} ${beatPrefix}.start overlaps the previous beat`);
      }
      lastEnd = beat.end;
      requiredString(beat.purpose, `${beatPrefix}.purpose`, file);
      requiredString(beat.voiceover, `${beatPrefix}.voiceover`, file);
      requiredString(beat.visual, `${beatPrefix}.visual`, file);
      requiredString(beat.on_screen_text, `${beatPrefix}.on_screen_text`, file);
      requiredArray(beat.asset_needs, `${beatPrefix}.asset_needs`, file);
    }

    requiredObject(video.production, `${prefix}.production`, file);
    requiredString(video.production.aspect_ratio, `${prefix}.production.aspect_ratio`, file);
    requiredNumber(video.production.duration_seconds, `${prefix}.production.duration_seconds`, file);
    requiredString(video.production.hyperframes_workflow, `${prefix}.production.hyperframes_workflow`, file);
    requiredString(video.production.visual_style, `${prefix}.production.visual_style`, file);
    requiredString(video.production.audio, `${prefix}.production.audio`, file);

    if (video.social_copy !== undefined) {
      requiredObject(video.social_copy, `${prefix}.social_copy`, file);
      if (video.social_copy.caption !== undefined) {
        requiredString(video.social_copy.caption, `${prefix}.social_copy.caption`, file);
      }
      if (video.social_copy.hashtags !== undefined) {
        requiredArray(video.social_copy.hashtags, `${prefix}.social_copy.hashtags`, file);
      }
      if (video.social_copy.pinned_comment !== undefined) {
        requiredString(video.social_copy.pinned_comment, `${prefix}.social_copy.pinned_comment`, file);
      }
      if (video.social_copy.cta_note !== undefined) {
        requiredString(video.social_copy.cta_note, `${prefix}.social_copy.cta_note`, file);
      }
    }
  }
}

function requiredObject(value, name, file) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${file} ${name} must be an object`);
  }
}

function requiredArray(value, name, file) {
  if (!Array.isArray(value)) {
    throw new Error(`${file} ${name} must be an array`);
  }
}

function requiredString(value, name, file) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${file} ${name} must be a non-empty string`);
  }
}

function requiredNumber(value, name, file) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${file} ${name} must be a number`);
  }
}
