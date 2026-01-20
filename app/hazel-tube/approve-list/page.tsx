"use client";

import { downloadHazelTube, getHazelTube, removeFromHazelTube } from "@/app/lib/server-actions";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { useEffect, useState } from "react";

type VideoData = {
  videoId: string;
  title: string;
  thumbnail: string;
};

export default function VideoQueuePlaylist() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(false);
  const APIKey = "POOASS";

  function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  // Fetch queue from DB and YouTube metadata
  useEffect(() => {
    async function fetchQueue() {
      setLoading(true);
      try {
        const queue = await getHazelTube();
        if (queue?.videoIds?.length) {
          // Fetch YouTube metadata
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${queue.videoIds.join(
              ","
            )}&key=${APIKey}`
          );
          const data = await res.json();
          const fetched: VideoData[] = data.items.map((item: any) => ({
            videoId: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
          }));
          setVideos(fetched);
        }
      } catch (err) {
        console.error("Failed to fetch queue:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchQueue();
  }, []);

  // Download Hazeltube
  async function callHazelTubeDownload(videoId: string) {
    const downloadURL = `https://www.youtube.com/watch?v=${videoId}`
    await downloadHazelTube(downloadURL)
    handleRemove(videoId)
  }

  // Open video on YouTube
  function openVideo(videoId: string) {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  }

  // Remove video instantly from UI and DB
  async function handleRemove(videoId: string) {
    // Optimistically update UI
    setVideos((prev) => prev.filter((v) => v.videoId !== videoId));

    // Update DB in background
    try {
      await removeFromHazelTube(videoId);
    } catch (err) {
      console.error("Failed to remove video from queue:", err);
      // Optionally: revert UI change if DB call fails
      // setVideos(await fetchUpdatedVideos());
    }
  }

  if (loading) return <p>Loading videos...</p>;
  if (videos.length === 0) return <p>No videos in queue.</p>;

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl">
      {videos.map((video) => (
        <Card key={video.videoId}>
          <CardBody className="flex flex-row gap-4">
            <Image
              src={video.thumbnail}
              alt={video.title}
              width={300}
              radius="sm"
            />
            <div className="flex flex-col flex-1 justify-between w-full">
              {/* Title at the top */}
              <p className="font-semibold">{decodeHtml(video.title)}</p>

              {/* Buttons at the bottom */}
              <div className="flex gap-2 justify-end">
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() => openVideo(video.videoId)}
                >
                  Open on YouTube
                </Button>

                <Button
                  color="success"
                  variant="flat"
                  onPress={() => callHazelTubeDownload(video.videoId)}
                >
                  Approve
                </Button>

                <Button
                  color="danger"
                  variant="flat"
                  onPress={() => handleRemove(video.videoId)}
                >
                  Deny
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}