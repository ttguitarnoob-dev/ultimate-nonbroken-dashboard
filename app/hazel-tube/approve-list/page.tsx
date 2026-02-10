"use client";

import { downloadHazelTube, getHazelTube, removeFromHazelTube } from "@/app/lib/server-actions";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { useEffect, useState } from "react";

type VideoData = {
  videoId: string;
  title: string;
  thumbnail: string;
};

export default function VideoQueuePlaylist() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [audios, setAudios] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(false);
  const APIKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;


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
        const queues = await getHazelTube();
        if (!queues) return;

        const fetchYouTubeData = async (ids: string[]) => {
          if (!ids.length) return [];

          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${ids.join(
              ","
            )}&key=${APIKey}`
          );
          const data = await res.json();

          return data.items.map((item: any) => ({
            videoId: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
          })) as VideoData[];
        };

        const [videoResults, audioResults] = await Promise.all([
          fetchYouTubeData(queues.video?.videoIds ?? []),
          fetchYouTubeData(queues.audio?.videoIds ?? []),
        ]);

        setVideos(videoResults);
        setAudios(audioResults);
      } catch (err) {
        console.error("Failed to fetch queue:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchQueue();
  }, []);


  // Download Hazeltube
  async function callHazelTubeDownload(videoId: string, isAudio: boolean) {
    const downloadURL = `https://www.youtube.com/watch?v=${videoId}`
    await downloadHazelTube(downloadURL, isAudio)
    handleRemove(videoId, isAudio)
  }

  // Open video on YouTube
  function openVideo(videoId: string) {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  }

  // Remove video instantly from UI and DB
  async function handleRemove(videoId: string, isAudio: boolean) {
    // Optimistically update UI
    const setQueue = isAudio ? setAudios : setVideos;

    setQueue((prev) => prev.filter((v) => v.videoId !== videoId));


    // Update DB in background
    try {
      await removeFromHazelTube(videoId, isAudio);
    } catch (err) {
      console.error("Failed to remove video from queue:", err);
      // Optionally: revert UI change if DB call fails
      // setVideos(await fetchUpdatedVideos());
    }
  }

  if (loading) return <p>Loading videos...</p>;
  if (videos.length === 0 && audios.length === 0) {
    return <p>No videos in queue.</p>;
  }


  return (
    <>
    {audios.length > 0 && (
      <div className="flex flex-col gap-4 w-full max-w-4xl mb-10">
        <h2 className="text-5xl">Audios</h2>
        {audios.map((video) => (
          <Card className="backdrop-blur-lg bg-black/20 dark:bg-white/5" key={video.videoId}>
            <CardBody className="flex flex-col gap-4">
              {/* Thumbnail at the top */}
              <Image
                src={video.thumbnail}
                alt={video.title}
                width={500}
                radius="sm"
                className="self-center" // optional: center the image horizontally
              />

              {/* Content stacked vertically */}
              <div className="flex flex-col flex-1">
                {/* Title at the top */}
                <p className="font-semibold mb-2">{decodeHtml(video.title)}</p>

                {/* Buttons stay horizontal at the bottom */}
                <div className="flex gap-2 justify-end mt-auto">
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
                    onPress={() => callHazelTubeDownload(video.videoId, true)}
                  >
                    Approve
                  </Button>

                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => handleRemove(video.videoId, true)}
                  >
                    Deny
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      <Divider className="mb-10" />
      </div>
  
)}

{videos.length > 0 && (
      <div className="flex flex-col gap-4 w-full max-w-4xl">
        <h2 className="text-5xl">Videos</h2>
        {videos.map((video) => (
          <Card className="backdrop-blur-lg bg-black/20 dark:bg-white/5" key={video.videoId}>
            <CardBody className="flex flex-col gap-4">
              {/* Thumbnail at the top */}
              <Image
                src={video.thumbnail}
                alt={video.title}
                width={500}
                radius="sm"
                className="self-center" // optional: center the image horizontally
              />

              {/* Content stacked vertically */}
              <div className="flex flex-col flex-1">
                {/* Title at the top */}
                <p className="font-semibold mb-2">{decodeHtml(video.title)}</p>

                {/* Buttons stay horizontal at the bottom */}
                <div className="flex gap-2 justify-end mt-auto">
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
                    onPress={() => callHazelTubeDownload(video.videoId, false)}
                  >
                    Approve
                  </Button>

                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => handleRemove(video.videoId, false)}
                  >
                    Deny
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
  
)}




    </>

  );
}