import { useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Alert,
  AppShell,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Drawer,
  Group,
  Loader,
  Paper,
  ScrollArea,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip
} from "@mantine/core";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileJson,
  Film,
  ListFilter,
  RefreshCw,
  Search,
  Sparkles,
  Trash2
} from "lucide-react";

const arcKeys = ["hook", "setup", "turn", "payoff", "cta"];

export default function App() {
  const [data, setData] = useState({ files: [] });
  const [status, setStatus] = useState("active");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState("");
  const [error, setError] = useState("");

  async function loadIdeas() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ideas");
      if (!response.ok) {
        throw new Error("Could not load idea JSON.");
      }
      const nextData = await response.json();
      setData(nextData);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIdeas();
  }, []);

  const ideas = useMemo(
    () =>
      data.files.flatMap((file) =>
        (file.data.videos || []).map((video) => ({
          file: file.name,
          bundle: file.data,
          video
        }))
      ),
    [data.files]
  );

  const metrics = useMemo(() => {
    const active = ideas.filter(({ video }) => video.status !== "removed");
    const removed = ideas.length - active.length;
    const sources = data.files.reduce(
      (count, file) => count + (file.data.research?.sources?.length || 0),
      0
    );
    const totalSeconds = active.reduce(
      (sum, { video }) => sum + (video.production?.duration_seconds || 0),
      0
    );

    return {
      files: data.files.length,
      active: active.length,
      removed,
      sources,
      totalSeconds
    };
  }, [data.files, ideas]);

  const firstPersona = data.files[0]?.data?.persona || {};
  const filteredIdeas = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return ideas.filter(({ file, bundle, video }) => {
      if (status === "active" && video.status === "removed") return false;
      if (status === "removed" && video.status !== "removed") return false;

      if (!needle) return true;

      return [
        file,
        bundle.persona?.industry,
        bundle.persona?.region,
        video.id,
        video.title,
        video.format,
        video.angle,
        video.arc?.hook,
        video.production?.hyperframes_workflow
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle));
    });
  }, [ideas, query, status]);

  async function markRemoved(item) {
    setRemovingId(item.video.id);
    setError("");

    try {
      const response = await fetch(
        `/api/ideas/${encodeURIComponent(item.file)}/${encodeURIComponent(item.video.id)}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Could not update the idea file.");
      }
      await loadIdeas();
      if (selected?.video.id === item.video.id && selected?.file === item.file) {
        setSelected(null);
      }
    } catch (removeError) {
      setError(removeError.message);
    } finally {
      setRemovingId("");
    }
  }

  return (
    <AppShell
      header={{ height: 72 }}
      navbar={{ width: 280, breakpoint: "md", collapsed: { mobile: true } }}
      padding={0}
    >
      <AppShell.Header className="app-header">
        <Group h="100%" px={{ base: "md", sm: "xl" }} justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon size={42} radius="md" color="teal" variant="light">
              <Film size={22} />
            </ThemeIcon>
            <Box>
              <Text size="xs" fw={800} tt="uppercase" c="dimmed">
                Codex Video Topic Studio
              </Text>
              <Title order={1} className="header-title">
                Idea Review
              </Title>
            </Box>
          </Group>

          <Tooltip label="Refresh ideas">
            <ActionIcon
              aria-label="Refresh ideas"
              variant="filled"
              color="teal"
              size="lg"
              onClick={loadIdeas}
              loading={loading}
            >
              <RefreshCw size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar className="sidebar">
        <Stack gap="lg" p="lg">
          <Box>
            <Text size="xs" fw={800} tt="uppercase" c="dimmed">
              Persona
            </Text>
            <Title order={2} className="sidebar-title">
              {firstPersona.name || "No persona loaded"}
            </Title>
            <Text size="sm" c="dimmed" mt={6}>
              {[firstPersona.industry, firstPersona.region, firstPersona.audience]
                .filter(Boolean)
                .join(" / ") || "Add persona data to an idea JSON file."}
            </Text>
          </Box>

          <Divider />

          <Stack gap="xs">
            <SidebarStat icon={<FileJson size={17} />} label="Idea files" value={metrics.files} />
            <SidebarStat icon={<CheckCircle2 size={17} />} label="Active ideas" value={metrics.active} />
            <SidebarStat icon={<Clock3 size={17} />} label="Active runtime" value={`${metrics.totalSeconds}s`} />
            <SidebarStat icon={<Sparkles size={17} />} label="Research sources" value={metrics.sources} />
          </Stack>

          <Paper className="workflow-note" p="md">
            <Text size="xs" fw={800} tt="uppercase">
              Workflow
            </Text>
            <Text size="sm" mt={8}>
              Review candidates, inspect arcs and timeline beats, then mark weak ideas removed before
              HyperFrames handoff.
            </Text>
          </Paper>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main className="main">
        <Stack gap="xl" p={{ base: "md", sm: "xl" }}>
          <Paper className="toolbar" p="md">
            <Group justify="space-between" align="end" gap="md">
              <Box>
                <Text size="xs" fw={800} tt="uppercase" c="dimmed">
                  Workspace
                </Text>
                <Title order={2} className="page-title">
                  {metrics.active} active video {metrics.active === 1 ? "idea" : "ideas"}
                </Title>
              </Box>

              <Group gap="sm" className="controls">
                <SegmentedControl
                  aria-label="Filter ideas by status"
                  value={status}
                  onChange={setStatus}
                  data={[
                    { value: "active", label: "Active" },
                    { value: "all", label: "All" },
                    { value: "removed", label: "Removed" }
                  ]}
                />
                <TextInput
                  aria-label="Search ideas"
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  leftSection={<Search size={16} />}
                  placeholder="Search title, hook, format"
                />
              </Group>
            </Group>
          </Paper>

          {error ? (
            <Alert color="red" icon={<AlertCircle size={18} />} title="Viewer error">
              {error}
            </Alert>
          ) : null}

          {loading ? (
            <Paper className="empty-state" p="xl">
              <Loader color="teal" />
              <Text fw={700}>Loading ideas</Text>
            </Paper>
          ) : filteredIdeas.length === 0 ? (
            <Paper className="empty-state" p="xl">
              <ListFilter size={28} />
              <Text fw={700}>No ideas match this view</Text>
              <Text size="sm" c="dimmed">
                Change the status filter, clear search, or add JSON files under ideas/.
              </Text>
            </Paper>
          ) : (
            <SimpleGrid cols={{ base: 1, lg: 2, xl: 3 }} spacing="lg">
              {filteredIdeas.map((item) => (
                <IdeaCard
                  key={`${item.file}:${item.video.id}`}
                  item={item}
                  onOpen={() => setSelected(item)}
                  onRemove={() => markRemoved(item)}
                  removing={removingId === item.video.id}
                />
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </AppShell.Main>

      <IdeaDrawer item={selected} onClose={() => setSelected(null)} onRemove={markRemoved} removingId={removingId} />
    </AppShell>
  );
}

function SidebarStat({ icon, label, value }) {
  return (
    <Group justify="space-between" className="sidebar-stat" wrap="nowrap">
      <Group gap="sm" wrap="nowrap">
        <ThemeIcon variant="light" color="teal" size="sm">
          {icon}
        </ThemeIcon>
        <Text size="sm" c="dimmed">
          {label}
        </Text>
      </Group>
      <Text fw={800}>{value}</Text>
    </Group>
  );
}

function IdeaCard({ item, onOpen, onRemove, removing }) {
  const { file, bundle, video } = item;
  const isRemoved = video.status === "removed";
  const duration = video.production?.duration_seconds;
  const timelineCount = video.timeline?.length || 0;

  return (
    <Card className="idea-card" data-removed={isRemoved || undefined} shadow="sm" padding="lg">
      <Stack gap="md" h="100%">
        <Group justify="space-between" align="flex-start" gap="md" wrap="nowrap">
          <Box className="card-title-wrap">
            <Text size="xs" fw={800} tt="uppercase" c="dimmed">
              {file}
            </Text>
            <Title order={3} className="card-title">
              {video.title || video.id}
            </Title>
          </Box>
          <StatusBadge status={video.status} />
        </Group>

        <Group gap="xs">
          <Badge variant="light" color="cyan">
            {video.format || "Format unset"}
          </Badge>
          <Badge variant="light" color="yellow">
            {video.region || bundle.persona?.region || "Region unset"}
          </Badge>
          {duration ? (
            <Badge variant="outline" color="gray">
              {duration}s
            </Badge>
          ) : null}
        </Group>

        <Text className="angle" size="sm">
          {video.angle || "No angle written yet."}
        </Text>

        <Paper className="hook-panel" p="md">
          <Text size="xs" fw={800} tt="uppercase" c="teal.8">
            Hook
          </Text>
          <Text size="sm" mt={6}>
            {video.arc?.hook || "No hook written yet."}
          </Text>
        </Paper>

        <Group gap="xs" mt="auto">
          <Badge color="teal" variant="dot">
            {timelineCount} beats
          </Badge>
          <Badge color="gray" variant="dot">
            {video.production?.hyperframes_workflow || "No workflow"}
          </Badge>
        </Group>

        <Group justify="space-between" pt="xs">
          <Button variant="light" color="teal" onClick={onOpen}>
            Inspect
          </Button>
          <Tooltip label={isRemoved ? "Already removed" : "Mark idea removed"}>
            <ActionIcon
              aria-label={isRemoved ? "Idea already removed" : "Mark idea removed"}
              variant="subtle"
              color="red"
              size="lg"
              disabled={isRemoved}
              loading={removing}
              onClick={onRemove}
            >
              <Trash2 size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Stack>
    </Card>
  );
}

function StatusBadge({ status = "candidate" }) {
  const color = status === "removed" ? "red" : status === "approved" ? "green" : "teal";

  return (
    <Badge color={color} variant={status === "removed" ? "light" : "filled"}>
      {status}
    </Badge>
  );
}

function IdeaDrawer({ item, onClose, onRemove, removingId }) {
  const video = item?.video;
  const bundle = item?.bundle;
  const production = video?.production || {};
  const socialCopy = video?.social_copy || {};
  const isRemoved = video?.status === "removed";

  return (
    <Drawer
      opened={Boolean(item)}
      onClose={onClose}
      position="right"
      size="min(760px, 100vw)"
      title={
        <Box>
          <Text size="xs" fw={800} tt="uppercase" c="dimmed">
            {item?.file}
          </Text>
          <Title order={2} className="drawer-title">
            {video?.title || "Idea detail"}
          </Title>
        </Box>
      }
    >
      {item ? (
        <Stack gap="lg">
          <Group gap="xs">
            <StatusBadge status={video.status} />
            <Badge variant="light" color="cyan">
              {video.format || "Format unset"}
            </Badge>
            {video.hook_options?.length ? (
              <Badge variant="light" color="grape">
                {video.hook_options.length} hook options
              </Badge>
            ) : null}
            <Badge variant="light" color="yellow">
              {video.region || bundle.persona?.region || "Region unset"}
            </Badge>
          </Group>

          <Text c="dimmed">{video.angle}</Text>

          <Tabs defaultValue="arc" keepMounted={false}>
            <Tabs.List>
              <Tabs.Tab value="arc">Arc</Tabs.Tab>
              <Tabs.Tab value="hooks">Hooks</Tabs.Tab>
              <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
              <Tabs.Tab value="production">Production</Tabs.Tab>
              <Tabs.Tab value="social">Social</Tabs.Tab>
              <Tabs.Tab value="research">Research</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="arc" pt="md">
              <Stack gap="sm">
                {arcKeys.map((key) => (
                  <Paper key={key} className="detail-row" p="md">
                    <Text size="xs" fw={800} tt="uppercase" c="orange.8">
                      {key}
                    </Text>
                    <Text mt={4}>{video.arc?.[key] || "Not set"}</Text>
                  </Paper>
                ))}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="hooks" pt="md">
              <Stack gap="sm">
                {(video.hook_options || []).length > 0 ? (
                  video.hook_options.map((hook, index) => (
                    <Paper key={`${hook.angle}-${index}`} className="detail-row" p="md">
                      <Group justify="space-between" gap="sm">
                        <Badge color="grape" variant="light">
                          {hook.angle}
                        </Badge>
                        <Text size="xs" fw={800} c="dimmed">
                          Option {index + 1}
                        </Text>
                      </Group>
                      <Text mt="sm" fw={700}>
                        {hook.verbal}
                      </Text>
                      <Divider my="sm" />
                      <Text size="sm">
                        <strong>Visual:</strong> {hook.visual}
                      </Text>
                      <Text size="sm" mt={4}>
                        <strong>Text:</strong> {hook.on_screen_text}
                      </Text>
                      {hook.rationale ? (
                        <Text size="sm" mt={4} c="dimmed">
                          <strong>Why:</strong> {hook.rationale}
                        </Text>
                      ) : null}
                    </Paper>
                  ))
                ) : (
                  <Paper className="empty-state" p="xl">
                    <Text fw={700}>No hook options in this idea</Text>
                  </Paper>
                )}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="timeline" pt="md">
              <Stack gap="sm">
                {(video.timeline || []).map((beat, index) => (
                  <Paper key={`${beat.start}-${beat.end}-${index}`} className="timeline-row" p="md">
                    <Group justify="space-between" gap="sm">
                      <Badge color="teal" variant="light">
                        {beat.start}-{beat.end}s
                      </Badge>
                      <Text size="sm" fw={800}>
                        {beat.purpose}
                      </Text>
                    </Group>
                    <Text mt="sm">{beat.voiceover}</Text>
                    <Divider my="sm" />
                    <Text size="sm">
                      <strong>Visual:</strong> {beat.visual}
                    </Text>
                    <Text size="sm" mt={4}>
                      <strong>Text:</strong> {beat.on_screen_text}
                    </Text>
                    <Text size="sm" mt={4} c="dimmed">
                      <strong>Assets:</strong> {(beat.asset_needs || []).join(", ") || "none"}
                    </Text>
                  </Paper>
                ))}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="production" pt="md">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                <InfoTile label="Workflow" value={production.hyperframes_workflow} />
                <InfoTile label="Duration" value={`${production.duration_seconds || "Unset"} seconds`} />
                <InfoTile label="Aspect ratio" value={production.aspect_ratio} />
                <InfoTile label="Audio" value={production.audio} />
              </SimpleGrid>
              <Paper className="detail-row" p="md" mt="sm">
                <Text size="xs" fw={800} tt="uppercase" c="dimmed">
                  Visual style
                </Text>
                <Text mt={4}>{production.visual_style || "Not set"}</Text>
              </Paper>
              <Paper className="detail-row" p="md" mt="sm">
                <Text size="xs" fw={800} tt="uppercase" c="dimmed">
                  Image searches
                </Text>
                <Text mt={4}>{(production.image_search_queries || []).join(", ") || "None"}</Text>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="social" pt="md">
              <Stack gap="sm">
                <Paper className="detail-row" p="md">
                  <Text size="xs" fw={800} tt="uppercase" c="dimmed">
                    Caption
                  </Text>
                  <Text mt={4}>{socialCopy.caption || "No caption guidance."}</Text>
                </Paper>
                <Paper className="detail-row" p="md">
                  <Text size="xs" fw={800} tt="uppercase" c="dimmed">
                    Hashtags
                  </Text>
                  <Group gap="xs" mt="sm">
                    {(socialCopy.hashtags || []).length > 0 ? (
                      socialCopy.hashtags.map((tag) => (
                        <Badge key={tag} color="teal" variant="light">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <Text c="dimmed">None</Text>
                    )}
                  </Group>
                </Paper>
                <Paper className="detail-row" p="md">
                  <Text size="xs" fw={800} tt="uppercase" c="dimmed">
                    Pinned comment
                  </Text>
                  <Text mt={4}>{socialCopy.pinned_comment || "No pinned comment guidance."}</Text>
                </Paper>
                <Paper className="detail-row" p="md">
                  <Text size="xs" fw={800} tt="uppercase" c="dimmed">
                    CTA note
                  </Text>
                  <Text mt={4}>{socialCopy.cta_note || "No CTA note."}</Text>
                </Paper>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="research" pt="md">
              <Stack gap="sm">
                <Paper className="detail-row" p="md">
                  <Text size="xs" fw={800} tt="uppercase" c="dimmed">
                    Summary
                  </Text>
                  <Text mt={4}>{bundle.research?.summary || "No research summary."}</Text>
                </Paper>
                {(bundle.research?.sources || []).map((source) => (
                  <Paper key={`${source.title}-${source.url}`} className="detail-row" p="md">
                    <Text fw={800}>{source.title}</Text>
                    <Text size="sm" c="dimmed">
                      {[source.publisher, source.published_at].filter(Boolean).join(" / ")}
                    </Text>
                    <Text size="sm" mt={6}>
                      {source.why_it_matters}
                    </Text>
                    {source.url ? (
                      <Text component="a" href={source.url} target="_blank" rel="noreferrer" size="sm" mt={6} display="block">
                        {source.url}
                      </Text>
                    ) : null}
                  </Paper>
                ))}
              </Stack>
            </Tabs.Panel>
          </Tabs>

          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Close
            </Button>
            <Button
              color="red"
              leftSection={<Trash2 size={16} />}
              disabled={isRemoved}
              loading={removingId === video.id}
              onClick={() => onRemove(item)}
            >
              {isRemoved ? "Removed" : "Mark Removed"}
            </Button>
          </Group>
        </Stack>
      ) : null}
    </Drawer>
  );
}

function InfoTile({ label, value }) {
  return (
    <Paper className="info-tile" p="md">
      <Text size="xs" fw={800} tt="uppercase" c="dimmed">
        {label}
      </Text>
      <Text fw={700} mt={4}>
        {value || "Not set"}
      </Text>
    </Paper>
  );
}
