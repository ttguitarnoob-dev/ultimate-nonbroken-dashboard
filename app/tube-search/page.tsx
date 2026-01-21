'use client'
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card"
import { Select, SelectItem } from "@heroui/select"
import { Image} from "@heroui/image"
import { useState } from "react";
import { downloadMyVid } from "../lib/server-actions";


type YouTubeVideo = {
  videoId: string;
  title: string;
  thumbnail: string;
};

const RESOLUTIONS = ["480", "720", "1080", "2160"];


export default function YouTubeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [resolutionMap, setResolutionMap] = useState<Record<string, string>>({});

  const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

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

      const videos: YouTubeVideo[] = data.items.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
      }));

      setResults(videos);

      const defaults: Record<string, string> = {};
      videos.forEach((v) => (defaults[v.videoId] = "720"));
      setResolutionMap(defaults);
    } catch (err) {
      console.error("YouTube search failed", err);
    } finally {
      setLoading(false);
    }
  }

  function handleDownload(videoId: string) {
    const resolution = resolutionMap[videoId];
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // 🔧 Stub for now
    console.log("Add to playlist:", {
      videoUrl,
      resolution,
    });
    downloadMyVid(videoUrl, resolution)
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
  {/* Search */}
  <div className="flex w-full items-end gap-2">
    <Input
      label="Search YouTube"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && searchYouTube()}
      className="flex-1"
    />
    <Button
      color="primary"
      onPress={searchYouTube}
      isLoading={loading}
      className="h-[56px]" // matches NextUI input height
    >
      Searchy
    </Button>
  </div>

        {/* Results */}
  <div className="flex flex-col gap-4">
    {results.map((video) => (
      <Card
      key={video.videoId}
      className="backdrop-blur-lg bg-black/20 dark:bg-white/5"
    >
      <CardBody className="flex flex-col gap-4">
        {/* Thumbnail at the top */}
        <Image
          src={video.thumbnail}
          alt={video.title}
          width={500}
          radius="sm"
          className="self-center w-full"
        />
    
        {/* Content stacked vertically */}
        <div className="flex flex-col flex-1">
          {/* Title at the top */}
          <p className="font-semibold mb-3">
            {decodeHtml(video.title)}
          </p>
    
          {/* Controls pinned to bottom */}
          <div className="flex flex-col sm:flex-row gap-2 sm:items-end sm:justify-end mt-auto">
  <Select
    label="Resolution"
    labelPlacement="outside"
    selectedKeys={[resolutionMap[video.videoId]]}
    className="w-full sm:max-w-xs"
    classNames={{
      trigger: "h-[44px]",
    }}
    onSelectionChange={(keys) =>
      setResolutionMap((prev) => ({
        ...prev,
        [video.videoId]: Array.from(keys)[0] as string,
      }))
    }
  >
    {RESOLUTIONS.map((res) => (
      <SelectItem key={res}>{res}</SelectItem>
    ))}
  </Select>

  <Button
    color="success"
    variant="flat"
    className="h-[44px] w-full sm:w-auto"
    onPress={() => handleDownload(video.videoId)}
  >
    Add to playlist
  </Button>
</div>
        </div>
      </CardBody>
    </Card>
    ))}
  </div>
</div>
    
  );
}

