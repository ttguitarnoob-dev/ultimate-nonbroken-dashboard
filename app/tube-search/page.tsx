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
  channel: string;
  uploadDate: string;
  duration: string;
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

  const formatUploadDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match?.[1] || "0");
    const minutes = parseInt(match?.[2] || "0");
    const seconds = parseInt(match?.[3] || "0");

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  async function searchYouTube() {
    if (!query.trim()) return;

    setLoading(true);

    try {
      // 1️⃣ Search
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(
          query
        )}&key=${YOUTUBE_API_KEY}`
      );

      const searchData = await searchRes.json();

      const videoIds = searchData.items
        .map((item: any) => item.id.videoId)
        .join(",");

      // 2️⃣ Fetch details (duration + channel + published date)
      const detailsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`
      );

      const detailsData = await detailsRes.json();

      const videos: YouTubeVideo[] = detailsData.items.map((item: any) => ({
        videoId: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channel: item.snippet.channelTitle,
        uploadDate: formatUploadDate(item.snippet.publishedAt),
        duration: formatDuration(item.contentDetails.duration),
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

    console.log("Add to playlist:", {
      videoUrl,
      resolution,
    });

    downloadMyVid(videoUrl, resolution);
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
          className="h-[56px]"
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

              {/* Thumbnail with Duration Overlay */}
              <div className="relative w-full">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={500}
                  radius="sm"
                  className="self-center w-full"
                />

                <div className="absolute bottom-2 right-2 z-10 backdrop-blur-sm bg-black/40 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>

              {/* Content stacked vertically */}
              <div className="flex flex-col flex-1">

                {/* Title */}
                <p className="font-semibold line-clamp-2">
                  {decodeHtml(video.title)}
                </p>

                {/* Channel */}
                <p className="text-sm text-default-600 mt-1">
                  {video.channel}
                </p>

                {/* Upload Date */}
                <p className="text-xs text-default-400 mb-3">
                  {video.uploadDate}
                </p>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-2 sm:items-end sm:justify-end mt-auto">
                  <Select
                    label="Resolution"
                    labelPlacement="outside"
                    selectedKeys={[resolutionMap[video.videoId]]}
                    className="w-full sm:max-w-xs"
                    classNames={{ trigger: "h-[44px]" }}
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