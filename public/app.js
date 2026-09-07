const ideasEl = document.querySelector("#ideas");
const summaryEl = document.querySelector("#summary");
const template = document.querySelector("#ideaTemplate");
const refreshButton = document.querySelector("#refresh");
const showRemoved = document.querySelector("#showRemoved");

let state = { files: [] };

refreshButton.addEventListener("click", loadIdeas);
showRemoved.addEventListener("change", render);

async function loadIdeas() {
  ideasEl.innerHTML = '<p class="empty">Loading ideas...</p>';
  const response = await fetch("/api/ideas");
  if (!response.ok) {
    ideasEl.innerHTML = '<p class="empty">Could not load idea JSON.</p>';
    return;
  }
  state = await response.json();
  render();
}

function render() {
  renderSummary();
  ideasEl.innerHTML = "";

  const videos = state.files.flatMap((file) =>
    (file.data.videos || []).map((video) => ({ file: file.name, bundle: file.data, video }))
  );

  const visible = videos.filter(({ video }) => showRemoved.checked || video.status !== "removed");

  if (visible.length === 0) {
    ideasEl.innerHTML = '<p class="empty">No visible ideas. Add JSON files under ideas/ or enable removed ideas.</p>';
    return;
  }

  for (const item of visible) {
    ideasEl.appendChild(renderCard(item));
  }
}

function renderSummary() {
  const fileCount = state.files.length;
  const allVideos = state.files.flatMap((file) => file.data.videos || []);
  const activeCount = allVideos.filter((video) => video.status !== "removed").length;
  const firstPersona = state.files[0]?.data?.persona || {};

  summaryEl.innerHTML = "";
  const items = [
    ["Files", String(fileCount)],
    ["Active Ideas", String(activeCount)],
    ["Industry", firstPersona.industry || "Not set"],
    ["Region", firstPersona.region || "Not set"]
  ];

  for (const [label, value] of items) {
    const div = document.createElement("div");
    div.className = "summary-item";
    div.innerHTML = `<strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span>`;
    summaryEl.appendChild(div);
  }
}

function renderCard({ file, bundle, video }) {
  const node = template.content.firstElementChild.cloneNode(true);
  node.classList.toggle("removed", video.status === "removed");
  node.querySelector(".meta").textContent = `${file} | ${video.format || "format unset"} | ${video.region || bundle.persona?.region || "region unset"}`;
  node.querySelector("h2").textContent = video.title || video.id;
  node.querySelector(".status").textContent = video.status || "candidate";
  node.querySelector(".angle").textContent = video.angle || "";

  const arc = node.querySelector(".arc");
  for (const key of ["hook", "setup", "turn", "payoff", "cta"]) {
    const row = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = key;
    dd.textContent = video.arc?.[key] || "";
    row.append(dt, dd);
    arc.appendChild(row);
  }

  const timeline = node.querySelector(".timeline");
  for (const beat of video.timeline || []) {
    const li = document.createElement("li");
    const assets = (beat.asset_needs || []).join(", ");
    li.innerHTML = `
      <div class="beat-time">${escapeHtml(String(beat.start))}-${escapeHtml(String(beat.end))}s: ${escapeHtml(beat.purpose || "")}</div>
      <div>${escapeHtml(beat.voiceover || "")}</div>
      <div><strong>Visual:</strong> ${escapeHtml(beat.visual || "")}</div>
      <div><strong>Text:</strong> ${escapeHtml(beat.on_screen_text || "")}</div>
      <div><strong>Assets:</strong> ${escapeHtml(assets || "none")}</div>
    `;
    timeline.appendChild(li);
  }

  const production = node.querySelector(".production");
  const prod = video.production || {};
  production.innerHTML = `
    <div><strong>Workflow:</strong> ${escapeHtml(prod.hyperframes_workflow || "")}</div>
    <div><strong>Duration:</strong> ${escapeHtml(String(prod.duration_seconds || ""))} seconds</div>
    <div><strong>Aspect:</strong> ${escapeHtml(prod.aspect_ratio || "")}</div>
    <div><strong>Style:</strong> ${escapeHtml(prod.visual_style || "")}</div>
    <div><strong>Audio:</strong> ${escapeHtml(prod.audio || "")}</div>
    <div><strong>Image searches:</strong> ${escapeHtml((prod.image_search_queries || []).join(", ") || "none")}</div>
  `;

  const remove = node.querySelector(".remove");
  remove.disabled = video.status === "removed";
  remove.textContent = video.status === "removed" ? "Removed" : "Mark Removed";
  remove.addEventListener("click", () => markRemoved(file, video.id));

  return node;
}

async function markRemoved(file, id) {
  const response = await fetch(`/api/ideas/${encodeURIComponent(file)}/${encodeURIComponent(id)}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    alert("Could not update the idea file.");
    return;
  }

  await loadIdeas();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadIdeas();

