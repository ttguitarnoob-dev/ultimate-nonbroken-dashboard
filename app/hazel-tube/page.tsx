"use client";

import { useState } from "react";
import { addToHazelTube, logHazelSearch } from "../lib/server-actions";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Switch } from "@heroui/switch";
import { inappropriateSearchTerms } from "../lib/helpers";

type VideoResult = {
  videoId: string;
  title: string;
  thumbnail: string;
};

// const inappropriateSearchTerms = [
//   // Sexual content
//   "porn",
//   "porno",
//   "pornography",
//   "xxx",
//   "sex",
//   "sexy",
//   "nude",
//   "nudity",
//   "naked",
//   "boobs",
//   "breasts",
//   "butt",
//   "booty",
//   "penis",
//   "vagina",
//   "genitals",
//   "fetish",
//   "kinky",
//   "bdsm",
//   "hardcore",
//   "softcore",
//   "strip",
//   "stripper",
//   "stripclub",
//   "twerk",
//   "onlyfans",
//   "camgirl",
//   "cams",
//   "escort",
//   "hookup",
//   "dating",
//   "nsfw",
//   "leaked",
//   "explicit",
//   "erotic",
//   "hentai",
//   "rule34",

//   // Violence & gore
//   "gore",
//   "bloody",
//   "bloodshed",
//   "beheading",
//   "decapitation",
//   "murder",
//   "killing",
//   "execution",
//   "shooting",
//   "stabbing",
//   "torture",
//   "slaughter",
//   "massacre",
//   "fight",
//   "brawl",
//   "brutal",
//   "graphic",
//   "injury",
//   "deadbody",
//   "corpse",
//   "autopsy",
//   "war",
//   "combat",
//   "terrorist",
//   "explosion",

//   // Self-harm
//   "suicide",
//   "selfharm",
//   "cutting",
//   "overdose",
//   "hang",
//   "poison",
//   "depression",
//   "anorexia",
//   "bulimia",

//   // Drugs & substances
//   "drugs",
//   "weed",
//   "marijuana",
//   "cocaine",
//   "heroin",
//   "meth",
//   "lsd",
//   "acid",
//   "ecstasy",
//   "mdma",
//   "vape",
//   "vaping",
//   "smoking",
//   "cigarettes",
//   "alcohol",
//   "vodka",
//   "beer",
//   "whiskey",
//   "drunk",
//   "intoxicated",

//   // Crime & illegal activity
//   "shoplift",
//   "steal",
//   "hacking",
//   "hack",
//   "fraud",
//   "scam",
//   "counterfeit",
//   "piracy",
//   "weapon",
//   "gun",
//   "knife",
//   "bomb",
//   "ammo",
//   "arson",
//   "kidnap",

//   // Hate & extremism
//   "racist",
//   "nazi",
//   "kkk",
//   "extremist",
//   "supremacy",
//   "terrorism",

//   // Gambling
//   "gambling",
//   "casino",
//   "betting",
//   "lottery",
//   "slots",
//   "blackjack",
//   "roulette",
//   "poker"
// ];


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
    logHazelSearch(query)

    const lowerQuery = query.toLowerCase();

    if (
      inappropriateSearchTerms.some(term =>
        new RegExp(`\\b${term}\\b`, "i").test(lowerQuery)
      )
    ) {
      setErrorMessage("Why are you searching for that??");
      return
    }

    setErrorMessage("")



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
        <Switch isSelected={isAudio} onValueChange={setIsAudio}>
          Audio Only
        </Switch>
      </div>

      <div>
        <p className="text-xl text-red-700">{errorMessage}</p>
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
                  onPress={() => handleAdd(video.videoId, isAudio)}
                  isLoading={addingId === video.videoId}
                >
                  {isAudio ? "Request This Audio" : "Request This Video"}
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}