"use client";

import { useState } from "react";
import { addToHazelTube } from "../lib/server-actions";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";

type VideoResult = {
  videoId: string;
  title: string;
  thumbnail: string;
};

export default function YouTubeSearchAddQueue() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  const YOUTUBE_API_KEY = "pooass"

  function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  // Search YouTube
  async function searchYouTube() {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(
          query
        )}&key=${YOUTUBE_API_KEY}`
      );

      const data = await res.json();

      const videos: VideoResult[] = data.items.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
      }));

      setResults(videos);
    } catch (err) {
      console.error("YouTube search failed", err);
    } finally {
      setLoading(false);
    }
  }

  // Add video to queue
  async function handleAdd(videoId: string) {
    setAddingId(videoId);
    try {
      await addToHazelTube(videoId);
      // Optional: you could show a toast/feedback
      console.log("Added to queue:", videoId);
    } catch (err) {
      console.error("Failed to add to queue:", err);
    } finally {
      setAddingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl">
  {/* Search input */}
  <div className="flex justify-center gap-2 w-full max-w-7xl">
    <Input
      label="Search YouTube"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && searchYouTube()}
      className="flex-1 min-w-0"
    />
    <Button
      onPress={searchYouTube}
      isLoading={loading}
      color="primary"
      className="h-[56px]" // Match Input height (adjust if Input height differs)
    >
      Search
    </Button>
  </div>

  {/* Results */}
  <div className="flex flex-col gap-6">
    {results.map((video) => (
      <Card key={video.videoId}>
        <CardBody className="flex flex-row gap-4">
          <Image
            src={video.thumbnail}
            alt={video.title}
            width={300}
            radius="sm"
          />

          <div className="flex flex-col flex-1 justify-between w-full">
            <p className="font-semibold">{decodeHtml(video.title)}</p>

            <Button
              color="success"
              variant="flat"
              className="max-w-xs mx-auto"
              onPress={() => handleAdd(video.videoId)}
              isLoading={addingId === video.videoId}
            >
              Request This Video
            </Button>
          </div>
        </CardBody>
      </Card>
    ))}
  </div>
</div>
  );
}