'use client'
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card"
import { Select, SelectItem } from "@heroui/select"
import { Image} from "@heroui/image"
import { useState } from "react";


type YouTubeVideo = {
  videoId: string;
  title: string;
  thumbnail: string;
};

const RESOLUTIONS = ["480", "720", "1080", "4k"];

export default function YouTubeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [resolutionMap, setResolutionMap] = useState<Record<string, string>>({});

  const YOUTUBE_API_KEY = "POOHOLE";

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

  function handleAddToPlaylist(videoId: string) {
    const resolution = resolutionMap[videoId];
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // 🔧 Stub for now
    console.log("Add to playlist:", {
      videoUrl,
      resolution,
    });
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl">
      {/* Search */}
      <div className="flex gap-2 w-full">
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
        >
          Search
        </Button>
      </div>

      {/* Results */}
      <div className="flex flex-col gap-4">
        {results.map((video) => (
          <Card key={video.videoId}>
            <CardBody className="flex flex-row gap-4">
              <Image
                src={video.thumbnail}
                alt={video.title}
                width={160}
                radius="sm"
              />

              <div className="flex flex-col gap-2 flex-1">
                <p className="font-semibold">{video.title}</p>

                <Select
                  label="Resolution"
                  selectedKeys={[resolutionMap[video.videoId]]}
                  className="max-w-xs"
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
                  className="max-w-xs"
                  onPress={() => handleAddToPlaylist(video.videoId)}
                >
                  Add to playlist
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
    
  );
}

