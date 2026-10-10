"use client";

import { useState } from "react";
import { addToHazelTube, logHazelSearch } from "../lib/server-actions";
import { Button, Card, Input, Label, Switch, TextField } from "@heroui/react";
import { inappropriateSearchTerms } from "../lib/helpers";

type VideoResult = {
  videoId: string;
  title: string;
  thumbnail: string;
  channel: string;
  uploadDate: string; // ISO date string from YouTube
  duration: string;   // formatted like "12:34" or "1:02:45"
};





export default function YouTubeSearchAddQueue() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [isAudio, setIsAudio] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

  function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  // Search YouTube
  async function searchYouTube() {
    console.log("SEARCHQUR");
    logHazelSearch(query);

    const lowerQuery = query.toLowerCase();

    if (
      inappropriateSearchTerms.some(term =>
        new RegExp(`\\b${term}\\b`, "i").test(lowerQuery)
      )
    ) {
      setErrorMessage("Why are you searching for that??");
      return;
    }

    setErrorMessage("");

    if (!query.trim()) return;
    setLoading(true);

    try {
      // 1️⃣ SEARCH CALL
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(
          query
        )}&key=${YOUTUBE_API_KEY}`
      );

      const searchData = await searchRes.json();

      const videoIds = searchData.items
        .map((item: any) => item.id.videoId)
        .join(",");

      // 2️⃣ FETCH VIDEO DETAILS (for duration)
      const detailsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`
      );

      const detailsData = await detailsRes.json();

      // Helper to format ISO 8601 duration
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


      const videos: VideoResult[] = detailsData.items.map((item: any) => ({
        videoId: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
        channel: item.snippet.channelTitle,
        uploadDate: formatUploadDate(item.snippet.publishedAt),
        duration: formatDuration(item.contentDetails.duration)
      }));

      setResults(videos);
    } catch (err) {
      console.error("YouTube search failed", err);
    } finally {
      setLoading(false);
    }
  }

  const formatUploadDate = (isoDate: string): string => {
    const date = new Date(isoDate);

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };


  // Add video to queue
  // Add video to queue
  async function handleAdd(videoId: string, isAudio: boolean) {
    setAddingId(videoId);
    try {
      await addToHazelTube(videoId, isAudio);
      // Remove the added video from search results
      setResults((prev) => prev.filter((video) => video.videoId !== videoId));
      console.log("Added to queue and removed from search results:", videoId);
    } catch (err) {
      console.error("Failed to add to queue:", err);
    } finally {
      setAddingId(null);
    }
  }


  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl">
      <p>Search for a video. Switch the Audio Only switch if you want to only download the audio.</p>
      {/* Search input */}
      <div className="flex justify-center flex-col md:flex-row gap-2 w-full max-w-7xl">
        <TextField className="flex-1 min-w-0">
          <Label>Search YouTube</Label>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchYouTube()}
          />
        </TextField>
        <Button
          onPress={searchYouTube}
          isPending={loading}
          variant="primary"
          className="h-[56px]" // Match Input height (adjust if Input height differs)
        >
          Search
        </Button>
        <Switch.Root isSelected={isAudio} onChange={setIsAudio}>
          <Switch.Content>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            Audio Only
          </Switch.Content>
        </Switch.Root>
      </div>

      <div>
        <p className="text-xl text-red-700">{errorMessage}</p>
      </div>

      {/* Results */}
      <div className="flex flex-col gap-6">
        {results.map((video) => (
          <Card.Root key={video.videoId}>
            <Card.Content className="flex flex-row gap-4">
              <div className="relative w-[300px]">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-auto w-full rounded object-cover"
                />

                {/* Duration Overlay */}
                <div className="absolute bottom-2 right-2 z-10 backdrop-blur-sm bg-black/40 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>


              <div className="flex flex-col flex-1 w-full justify-between">

                {/* Text Container */}
                <div className="flex flex-col gap-1">
                  <p className="font-semibold line-clamp-2">
                    {decodeHtml(video.title)}
                  </p>

                  <p className="text-sm text-muted">
                    {video.channel}
                  </p>

                  <p className="text-xs text-muted">
                    {video.uploadDate}
                  </p>
                </div>

                {/* Button */}
                <Button
                  variant="primary"
                  className="max-w-xs mx-auto mt-4"
                  onPress={() => handleAdd(video.videoId, isAudio)}
                  isPending={addingId === video.videoId}
                >
                  {isAudio ? "Request This Audio" : "Request This Video"}
                </Button>

              </div>

            </Card.Content>
          </Card.Root>
        ))}
      </div>
    </div>
  );
}