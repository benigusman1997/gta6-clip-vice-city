// Entry program for make.fun bounty gta6-clipper-01 ("Clip GTA 6 for the most YouTube views").
// Node 22, standard library only, no network.
// Validates VIDEO.json (the public YouTube address of the entered clip) and writes
// /output/VIDEO.json + /output/manifest.json describing the entry.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const repoDir = new URL(".", import.meta.url).pathname;
const outDir = process.argv[2] ?? "/output";

function fail(message: string): never {
  console.error(`clipper entry: ${message}`);
  process.exit(1);
}

const videoPath = join(repoDir, "VIDEO.json");
if (!existsSync(videoPath)) fail("VIDEO.json is missing from the repository root.");
const video = JSON.parse(readFileSync(videoPath, "utf8")) as { url?: unknown };
if (typeof video.url !== "string" || !video.url.startsWith("https://")) {
  fail("VIDEO.json must name the clip's https YouTube address, e.g. {\"url\": \"https://www.youtube.com/shorts/<id>\"}.");
}
if (video.url.includes("REPLACE_WITH_VIDEO_ID")) {
  fail("VIDEO.json still holds the placeholder URL — upload the clip to YouTube and write its real address first.");
}
const youtubePattern = /^https:\/\/(www\.youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\/)/;
if (!youtubePattern.test(video.url)) {
  fail(`VIDEO.json URL does not look like a YouTube video address: ${video.url}`);
}

const manifest = {
  competition: "gta6-clipper-01",
  title: "GTA 6 Is Coming — Welcome Back to Vice City (May 26, 2026)",
  video_url: video.url,
  clip: {
    file: "gta6-clip-vertical.mp4 (delivered with the entry; source footage: Rockstar's official Grand Theft Auto VI Trailer 2)",
    format: "1080x1920 vertical, H.264/AAC, 30 fps",
    duration_seconds: 40.6,
    source: "https://www.youtube.com/watch?v=VQRLujxTm3c",
    pitch: "On-screen English text throughout + 7s make.fun end card (THIS CLIP WAS CUT BY AI / GET PAID TO MAKE CLIPS LIKE THIS / make.fun / $500 BOUNTY)",
  },
  description_line:
    "Made by my AI agent for a $500 bounty on make.fun, where you can earn money making clips with AI: https://make.fun/bounty/gta6-clipper-01",
  play_code: "makefun-falconer-inlet-spire",
  channel: "YouTube channel on Google account benbenabcdf@gmail.com (NOT WildFact Lab, by the entrant's choice)",
  generated_at: new Date().toISOString(),
};

mkdirSync(outDir, { recursive: true });
copyFileSync(videoPath, join(outDir, "VIDEO.json"));
writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`clipper entry: wrote ${join(outDir, "VIDEO.json")} and ${join(outDir, "manifest.json")}`);
console.log(`clipper entry: video ${video.url}`);
